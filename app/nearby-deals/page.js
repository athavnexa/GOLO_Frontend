"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Grid2x2, List, ChevronDown, Clock, Star, MapPin, Tag, Calendar, ArrowRight, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import AuthRequiredModal from "../components/AuthRequiredModal";
import { MerchantSearchCard, ProductSearchCard } from "../components/SearchCards";
import { getNearbyOffers, searchMerchants, searchProducts, unifiedSearch } from "../lib/api";

function OfferCardMedia({ imageUrl, videoUrl, title }) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoUrl) return;
    
    let timer;
    if (!showVideo) {
      timer = setTimeout(() => setShowVideo(true), 4000);
    }
    return () => clearTimeout(timer);
  }, [showVideo, videoUrl]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      {showVideo && videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onEnded={() => setShowVideo(false)}
          onError={() => setShowVideo(false)}
        />
      ) : (
        <img
          src={imageUrl || "/images/deal2.avif"}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-500"
        />
      )}
    </div>
  );
}

const OFFER_TYPES = [
  "Special",
  "Festival",
  "Limited Time",
  "Combo",
  "Clearance",
  "Flash Sale",
  "Buy One Get One (BOGO)",
  "Flat Discount",
  "Percentage Off",
  "Bundle Deal",
  "New Arrival Offer",
  "Seasonal Offer",
  "Weekend Offer",
  "Happy Hour Deal",
  "Member Exclusive",
  "First Purchase Offer",
  "Loyalty Reward",
  "Referral Offer",
  "Clear Stock Sale",
  "Free Gift Offer",
];

const SORT_OPTIONS = [
  { value: "nearest", label: "Nearest" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "discount_desc", label: "Best Discount" },
];

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function getDaysRemainingText(endDate) {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  if (Number.isNaN(end)) return null;
  const diff = end - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days <= 1 ? "1 day left" : `${days} days left`;
}

function computeBestDiscountPercent(products = [], fallback = 0) {
  const fallbackValue = toNumber(fallback, 0);
  if (fallbackValue > 0) {
    return Math.max(0, Math.round(fallbackValue));
  }

  return Math.round(
    products.reduce((best, product) => {
      const original = toNumber(product?.originalPrice, 0);
      const offer = toNumber(product?.offerPrice, 0);
      if (original <= 0 || offer < 0 || offer >= original) {
        return best;
      }
      const discount = ((original - offer) / original) * 100;
      return Math.max(best, discount);
    }, 0),
  );
}

function computeStartingPrice(products = [], fallback = 0) {
  const fallbackValue = toNumber(fallback, 0);
  if (fallbackValue > 0) {
    return fallbackValue;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return fallbackValue;
  }

  const values = products
    .map((item) => toNumber(item?.offerPrice, 0))
    .filter((price) => price > 0);

  if (!values.length) {
    return fallbackValue;
  }

  return values.reduce((sum, price) => sum + price, 0);
}

function normalizeNearbyOffer(row) {
  const selectedProducts = Array.isArray(row?.selectedProducts)
    ? row.selectedProducts
    : [];
  const displayPrice = computeStartingPrice(
    selectedProducts,
    row?.displayPrice || row?.totalPrice,
  );
  const discountPercent = computeBestDiscountPercent(
    selectedProducts,
    row?.discountPercent,
  );

  return {
    ...row,
    selectedProducts,
    displayPrice,
    discountPercent,
  };
}

function formatDistance(distanceKm) {
  if (typeof distanceKm !== "number" || Number.isNaN(distanceKm))
    return "Nearby";
  return `${distanceKm.toFixed(1)} km`;
}

function calculateDistanceKm(latitudeA, longitudeA, latitudeB, longitudeB) {
  const earthRadiusKm = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const deltaLat = toRadians(latitudeB - latitudeA);
  const deltaLng = toRadians(longitudeB - longitudeA);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function withResolvedDistance(row, latitude, longitude) {
  const existingDistance = Number(row?.distanceKm);
  if (Number.isFinite(existingDistance)) {
    return { ...row, distanceKm: existingDistance };
  }

  const merchantLatitude = Number(row?.merchant?.latitude);
  const merchantLongitude = Number(row?.merchant?.longitude);
  if (
    !Number.isFinite(merchantLatitude) ||
    !Number.isFinite(merchantLongitude)
  ) {
    return { ...row, distanceKm: null };
  }

  return {
    ...row,
    distanceKm: calculateDistanceKm(
      latitude,
      longitude,
      merchantLatitude,
      merchantLongitude,
    ),
  };
}

function isWithinRadius(row, radiusKm) {
  if (row?.distanceKm === null || row?.distanceKm === undefined) return true;
  const distanceKm = Number(row?.distanceKm);
  if (!Number.isFinite(distanceKm)) return true;
  return distanceKm <= radiusKm;
}

function normalizeLocationText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const LOCATION_ALIASES = {
  kolhapur: [
    "kolhapur",
    "karvir",
    "karveer",
    "karveer taluka",
    "karvir taluka",
    "rajarampuri",
    "subhash road",
    "subhash nagar",
    "shastri nagar",
    "shahupuri",
    "tarabai park",
    "laxmipuri",
    "mangalwar peth",
    "mangalwar",
    "patil nursing home",
    "shenda park",
    "sykes extension",
    "shivaji park",
    "baba jarag nagar",
  ],
  sangli: ["sangli", "miraj", "kupwad", "vishrambag", "madhavnagar"],
  mumbai: ["mumbai", "bombay", "navi mumbai", "thane", "andheri", "bandra", "borivali", "dadar"],
  pune: ["pune", "poona", "pcmc", "pimpri", "chinchwad", "kothrud", "baner", "viman nagar", "hinjewadi", "fc road", "wakad", "hadapsar", "swargate", "camp"],
};

function getLocationCity(location) {
  const fullLocation = normalizeLocationText(location);
  if (!fullLocation) return "";

  for (const [city, aliases] of Object.entries(LOCATION_ALIASES)) {
    const candidates = [city, ...aliases]
      .map(normalizeLocationText)
      .filter(Boolean);
    if (candidates.some((candidate) => fullLocation.includes(candidate))) {
      return city;
    }
  }

  const parts = String(location || "").split(",");
  return normalizeLocationText(
    parts[0] || location,
  );
}

function offerMatchesLocation(row, location) {
  if (!location) return true;
  const fullLocNorm = normalizeLocationText(location);
  if (
    !fullLocNorm ||
    fullLocNorm === "current location" ||
    fullLocNorm === "your location" ||
    fullLocNorm === "detecting location"
  ) {
    return true;
  }

  const addressNorm = normalizeLocationText(
    [
      row?.merchant?.address,
      row?.merchant?.storeLocation,
      row?.merchant?.city,
      row?.merchant?.name,
      row?.merchant?.storeName,
      row?.merchant?.category,
      row?.merchant?.subCategory,
      row?.location,
      row?.storeLocation,
    ]
      .filter(Boolean)
      .join(" "),
  );
  if (!addressNorm) return true;

  // 1. Direct substring match
  if (addressNorm.includes(fullLocNorm) || fullLocNorm.includes(addressNorm)) return true;

  // 2. Recognized city / locality alias match
  for (const [city, aliases] of Object.entries(LOCATION_ALIASES)) {
    const candidates = [city, ...aliases].map(normalizeLocationText).filter(Boolean);
    const hasCityInLoc = candidates.some((cand) => fullLocNorm.includes(cand));
    const hasCityInAddr = candidates.some((cand) => addressNorm.includes(cand));
    if (hasCityInLoc && hasCityInAddr) return true;
  }

  // 3. Segment matches (split by comma or pipe)
  const segments = String(location)
    .split(/[,|]+/)
    .map(normalizeLocationText)
    .filter((s) => s.length >= 3);

  for (const seg of segments) {
    if (addressNorm.includes(seg) || seg.includes(addressNorm)) {
      return true;
    }
  }

  // 4. Token overlap (meaningful words with length >= 4)
  const tokens = fullLocNorm.split(/\s+/).filter((t) => t.length >= 4);
  if (tokens.some((token) => addressNorm.includes(token))) {
    return true;
  }

  return false;
}

function isManualLocationMatch(row, location) {
  const manualCityRadiusKm = 25;
  return (
    offerMatchesLocation(row, location) ||
    isWithinRadius(row, manualCityRadiusKm)
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOfferBadgeLabel(row) {
  const discountPercent = toNumber(row?.discountPercent, 0);
  if (discountPercent > 0) {
    return `${discountPercent}% OFF`;
  }

  const products = row?.selectedProducts || [];
  const productCount = Array.isArray(products) ? products.length : 0;
  if (productCount > 0) {
    return `${productCount} Product${productCount > 1 ? "s" : ""}`;
  }

  const category = String(row?.category || "").trim();
  return category ? category.toUpperCase() : "SPECIAL OFFER";
}

function matchOfferType(row, typeLabel) {
  const title = String(row?.title || "").toLowerCase();
  const category = String(row?.category || "").toLowerCase();
  const combined = `${title} ${category}`;
  const normalizedType = String(typeLabel || "")
    .trim()
    .toLowerCase();

  // Exact category match first for the new offer category model.
  if (normalizedType && category === normalizedType) {
    return true;
  }

  if (normalizedType === "flat discount") {
    return (
      row?.discountPercent > 0 ||
      combined.includes("discount") ||
      combined.includes("flat")
    );
  }

  if (normalizedType === "buy one get one (bogo)") {
    return (
      combined.includes("bogo") ||
      combined.includes("buy 1 get 1") ||
      combined.includes("buy one get one")
    );
  }

  if (normalizedType === "combo") {
    return combined.includes("combo");
  }

  if (normalizedType === "percentage off") {
    return (
      combined.includes("%") ||
      combined.includes("percent") ||
      combined.includes("percentage")
    );
  }

  return combined.includes(normalizedType);
}

function NearbyDealsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const isMerchantPreview = searchParams.get("view") === "merchant-preview";

  const [activeView, setActiveView] = useState("grid");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [distanceRadius, setDistanceRadius] = useState(50);
  const [priceRange, setPriceRange] = useState(5000);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [locationStatus, setLocationStatus] = useState("detecting");
  const [locationError, setLocationError] = useState("");
  const [topDiscountOnly, setTopDiscountOnly] = useState(false);
  const [activeNowOnly, setActiveNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");
  const [selectedOfferTypes, setSelectedOfferTypes] = useState({
    Special: false,
    Festival: false,
    "Limited Time": false,
    Combo: false,
    Clearance: false,
    "Flash Sale": false,
    "Buy One Get One (BOGO)": false,
    "Flat Discount": false,
    "Percentage Off": false,
    "Bundle Deal": false,
    "New Arrival Offer": false,
    "Seasonal Offer": false,
    "Weekend Offer": false,
    "Happy Hour Deal": false,
    "Member Exclusive": false,
    "First Purchase Offer": false,
    "Loyalty Reward": false,
    "Referral Offer": false,
    "Clear Stock Sale": false,
    "Free Gift Offer": false,
  });
  const [rawOffers, setRawOffers] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(16);
  const [merchantResults, setMerchantResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [merchantPage, setMerchantPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [offerPage, setOfferPage] = useState(1);
  const [hasMoreMerchants, setHasMoreMerchants] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreOffers, setHasMoreOffers] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [error, setError] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authRedirectTo, setAuthRedirectTo] = useState("/nearby-deals");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTranscriptRef = useRef("");
  const voiceSearchTimerRef = useRef(null);
  const voiceFinalizingRef = useRef(false);
  const voiceRestartCountRef = useRef(0);
  const voiceSessionRef = useRef(0);
  const micPermissionCheckedRef = useRef(false);
  const micPermissionGrantedRef = useRef(false);
  const lastLocationUpdateRef = useRef(0);
  const nearbyFetchSeqRef = useRef(0);

  const selectedTypeLabels = useMemo(
    () =>
      Object.keys(selectedOfferTypes).filter((key) => selectedOfferTypes[key]),
    [selectedOfferTypes],
  );

  const location = useMemo(
    () => searchParams.get("location") || "",
    [searchParams],
  );
  const manualLatitude = useMemo(() => {
    const value = Number(searchParams.get("lat"));
    return Number.isFinite(value) && Math.abs(value) > 0.000001 ? value : null;
  }, [searchParams]);
  const manualLongitude = useMemo(() => {
    const value = Number(searchParams.get("lng"));
    return Number.isFinite(value) && Math.abs(value) > 0.000001 ? value : null;
  }, [searchParams]);
  const query = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const selectedCategory = useMemo(
    () => searchParams.get("category") || "",
    [searchParams],
  );

  useEffect(() => {
    if (
      !loading &&
      user &&
      user.accountType === "merchant" &&
      !isMerchantPreview
    ) {
      router.replace("/merchant/dashboard");
    }
  }, [user, loading, router, isMerchantPreview]);

  useEffect(() => {
    if (String(location || "").trim()) {
      setRawOffers([]);
    }
  }, [location]);

  // 1) Initialize from global storage first to prevent "0 offers" blink
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("golo_current_location");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.coordinates?.lat && parsed?.coordinates?.lng) {
          setUserCoordinates(parsed.coordinates);
        }
      }
    } catch (e) {}
  }, []);

  // 2) Keep coordinates fresh via geolocation watch
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !navigator.geolocation ||
      !navigator.geolocation.watchPosition
    ) {
      setLocationStatus("unavailable");
      setLocationError("Location services are not available in this browser.");
      return;
    }

    let ignoreResult = false;
    setLocationStatus("detecting");
    setLocationError("");

    const handlePositionSuccess = (position) => {
      if (ignoreResult) return;

      const nextLat = Number(position.coords.latitude);
      const nextLng = Number(position.coords.longitude);
      if (Number.isNaN(nextLat) || Number.isNaN(nextLng)) return;

      setUserCoordinates((prev) => {
        if (!prev) {
          lastLocationUpdateRef.current = Date.now();
          return { lat: nextLat, lng: nextLng };
        }

        const latDiff = Math.abs(prev.lat - nextLat);
        const lngDiff = Math.abs(prev.lng - nextLng);
        const movedTooLittle = latDiff < 0.0015 && lngDiff < 0.0015;
        const updatedTooSoon =
          Date.now() - lastLocationUpdateRef.current < 15000;
        if (movedTooLittle || updatedTooSoon) {
          return prev;
        }

        lastLocationUpdateRef.current = Date.now();
        return { lat: nextLat, lng: nextLng };
      });
      setLocationStatus("ready");
      setLocationError("");
    };

    const handlePositionError = (geoError) => {
      if (ignoreResult) return;
      setUserCoordinates(null);

      if (geoError?.code === geoError.PERMISSION_DENIED) {
        setLocationStatus("denied");
        setLocationError(
          "Location permission denied. Enable it to use exact distance filters.",
        );
        return;
      }

      if (geoError?.code === geoError.POSITION_UNAVAILABLE) {
        setLocationStatus("unavailable");
        setLocationError("Current location is unavailable. Please try again.");
        return;
      }

      if (geoError?.code === geoError.TIMEOUT) {
        setLocationStatus("timeout");
        setLocationError("Location request timed out. Please try again.");
        return;
      }

      setLocationStatus("error");
      setLocationError("Could not detect your location.");
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (ignoreResult) return;
        handlePositionSuccess(position);
      },
      handlePositionError,
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 15000,
      },
    );

    return () => {
      ignoreResult = true;
    };
  }, []);

  useEffect(() => {
    const loadNearbyOffers = async () => {
      const fetchSeq = ++nearbyFetchSeqRef.current;
      setLoadingOffers(true);
      setError("");

      let finalOffers = [];

      const resolvedLat =
        typeof userCoordinates?.lat === "number" &&
        !Number.isNaN(userCoordinates.lat)
          ? userCoordinates.lat
          : undefined;
      const resolvedLng =
        typeof userCoordinates?.lng === "number" &&
        !Number.isNaN(userCoordinates.lng)
          ? userCoordinates.lng
          : undefined;

      // If user explicitly provided a location (navbar/manual), prefer that
      // and do not constrain results by current GPS coordinates.
      const hasManualCoordinates =
        manualLatitude !== null && manualLongitude !== null;
      const hasLocationQuery = Boolean(String(location || "").trim());

      // Priority: manual coordinates from URL > live GPS coordinates > nothing.
      // Always prefer real coordinates over text-only filtering.
      const fetchLat = hasManualCoordinates
        ? manualLatitude
        : resolvedLat;
      const fetchLng = hasManualCoordinates
        ? manualLongitude
        : resolvedLng;
      const hasCoordinateSearch =
        typeof fetchLat === "number" && typeof fetchLng === "number";
      const locationForRequest = hasLocationQuery ? location : "";

      try {
        const response = await getNearbyOffers({
          lat: fetchLat,
          lng: fetchLng,
          radiusKm: distanceRadius,
          location: locationForRequest || undefined,
          q: query || undefined,
          category: selectedCategory || undefined,
          sort: sortBy,
          maxPrice: priceRange < 5000 ? priceRange : undefined,
          applyPriceFilter: priceRange < 5000,
          offerTypes: selectedTypeLabels.join(","),
          topDiscountOnly: topDiscountOnly,
          activeNowOnly: activeNowOnly,
          page: 1,
          limit: 50,
        });

        const primaryRows = Array.isArray(response?.data)
          ? response.data.map(normalizeNearbyOffer)
          : [];
        const distanceResolvedRows = hasCoordinateSearch
          ? primaryRows.map((row) =>
              withResolvedDistance(row, fetchLat, fetchLng),
            )
          : primaryRows;
        const strictRows = hasCoordinateSearch
          ? distanceResolvedRows.filter((row) =>
              isWithinRadius(row, distanceRadius) || offerMatchesLocation(row, location),
            )
          : distanceResolvedRows;

        if (fetchSeq !== nearbyFetchSeqRef.current) return;
        finalOffers = strictRows.length > 0 ? strictRows : primaryRows;
      } catch (err) {
        if (fetchSeq !== nearbyFetchSeqRef.current) return;
        console.error("getNearbyOffers failed:", err);
      }
      
      if (query) {
        try {
          setMerchantPage(1);
          setProductPage(1);
          setOfferPage(1);
          const res = await unifiedSearch(query, { type: 'all', limit: 16, page: 1 });
          if (fetchSeq !== nearbyFetchSeqRef.current) return;
          
          const unifiedMerchants = res?.data?.merchants || [];
          const unifiedProducts = res?.data?.products || [];
          const unifiedOffers = res?.data?.offers || [];
          
          setMerchantResults(unifiedMerchants);
          setProductResults(unifiedProducts);
          
          setHasMoreMerchants(unifiedMerchants.length === 16);
          setHasMoreProducts(unifiedProducts.length === 16);
          setHasMoreOffers(unifiedOffers.length === 16);
          
          const newOffers = unifiedOffers.map(normalizeNearbyOffer);
          const combinedOffers = [...finalOffers, ...newOffers];
          const seenIds = new Set();
          finalOffers = combinedOffers.filter((o) => {
            const id = o.offerId || o.requestId || o._id;
            if (!id) return true;
            if (seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
          });
        } catch (err) {
          console.error("Failed to load unified search", err);
          if (finalOffers.length === 0) {
            setError("Search failed to load results. Please try again.");
          }
        }
      } else {
        setMerchantResults([]);
        setProductResults([]);
        setHasMoreMerchants(false);
        setHasMoreProducts(false);
        setHasMoreOffers(false);
      }

      setDisplayLimit(16);
      
      // Force React to recognize a new array reference
      setRawOffers([...finalOffers]);
      setLoadingOffers(false);
    };

    loadNearbyOffers();
  }, [
    distanceRadius,
    priceRange,
    location,
    query,
    selectedCategory,
    sortBy,
    userCoordinates?.lat,
    userCoordinates?.lng,
    manualLatitude,
    manualLongitude,
    selectedTypeLabels,
    topDiscountOnly,
    activeNowOnly,
  ]);

  const filteredDeals = (() => {
    const rows = rawOffers.filter((row) => {
      if (activeNowOnly && row?.isActiveNow !== undefined && !row.isActiveNow) {
        return false;
      }
      if (topDiscountOnly && toNumber(row?.discountPercent, 0) < 30) {
        return false;
      }
      if (selectedTypeLabels.length > 0) {
        const typeMatched = selectedTypeLabels.some((typeLabel) => matchOfferType(row, typeLabel));
        if (!typeMatched) return false;
      }
      const expiryCandidates = row?.endsAt || row?.expiresAt || row?.expiry || row?.expires_at || row?.endDate;
      if (expiryCandidates) {
        const ts = new Date(expiryCandidates).getTime();
        if (!Number.isNaN(ts) && ts < Date.now() - 86400000) {
          return false;
        }
      }
      return true;
    });

    const sortedRows = [...rows];

    if (sortBy === "price_asc") {
      sortedRows.sort((a, b) => toNumber(a?.displayPrice, 0) - toNumber(b?.displayPrice, 0));
    } else if (sortBy === "price_desc") {
      sortedRows.sort(
        (a, b) => toNumber(b?.displayPrice, 0) - toNumber(a?.displayPrice, 0),
      );
    } else if (sortBy === "newest") {
      sortedRows.sort(
        (a, b) =>
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime(),
      );
    } else if (sortBy === "discount_desc") {
      sortedRows.sort(
        (a, b) =>
          toNumber(b?.discountPercent, 0) - toNumber(a?.discountPercent, 0),
      );
    } else {
      sortedRows.sort((a, b) => {
        const distanceA =
          typeof a?.distanceKm === "number"
            ? a.distanceKm
            : Number.MAX_SAFE_INTEGER;
        const distanceB =
          typeof b?.distanceKm === "number"
            ? b.distanceKm
            : Number.MAX_SAFE_INTEGER;
        return distanceA - distanceB;
      });
    }

    if (!location || location === "Current Location" || location === "Your Location" || location === "Detecting location...") {
      return sortedRows;
    }

    const matched = sortedRows.filter((row) => {
      if (typeof row?.distanceKm === 'number' && isWithinRadius(row, distanceRadius)) {
        return true;
      }
      if (!row?.merchant?.address && !row?.merchant?.city && !row?.merchant?.name) {
        return true; 
      }
      return offerMatchesLocation(row, location);
    });

    return matched.length > 0 ? matched : sortedRows;
  })();

  const summary = useMemo(() => {
    const total = filteredDeals.length;
    const active = filteredDeals.filter((row) => row?.isActiveNow).length;
    const avgPrice =
      total > 0
        ? Math.round(
            filteredDeals.reduce(
              (sum, row) => sum + toNumber(row?.displayPrice, 0),
              0,
            ) / total,
          )
        : 0;

    return { total, active, avgPrice };
  }, [filteredDeals]);

  // IMPORTANT: All hooks must run on every render, in the same order, every
  // time. The early returns below (for the auth-loading state and the
  // merchant-redirect state) must come AFTER every hook call above this
  // point. Previously these returns sat in the middle of the hook list,
  // which meant some renders called fewer hooks than others -> React's
  // "Rendered more hooks than during the previous render" error.

  const clearAllFilters = () => {
    setDistanceRadius(50);
    setPriceRange(5000);
    setTopDiscountOnly(false);
    setActiveNowOnly(true);
    setSortBy("nearest");
    setSelectedOfferTypes({
      Special: false,
      Festival: false,
      "Limited Time": false,
      Combo: false,
      Clearance: false,
      "Flash Sale": false,
      "Buy One Get One (BOGO)": false,
      "Flat Discount": false,
      "Percentage Off": false,
      "Bundle Deal": false,
      "New Arrival Offer": false,
      "Seasonal Offer": false,
      "Weekend Offer": false,
      "Happy Hour Deal": false,
      "Member Exclusive": false,
      "First Purchase Offer": false,
      "Loyalty Reward": false,
      "Referral Offer": false,
      "Clear Stock Sale": false,
      "Free Gift Offer": false,
    });
  };

  const openDealDetails = (deal) => {
    const targetUrl = `/nearby-deals/deal?offerId=${deal.offerId}`;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          `golo_nearby_offer_${deal.offerId}`,
          JSON.stringify(deal),
        );
      } catch {}
    }

    router.push(targetUrl);
  };

  if (loading) {
    return <main className="min-h-screen bg-[#F3F3F3]" />;
  }

  if (user && user.accountType === "merchant" && !isMerchantPreview) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <Navbar />
      <CategoryBar
        variant="golocal"
        preferredCategories={user?.preferredCategories || []}
      />

      <section className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
        <button
          type="button"
          onClick={() => setShowMobileFilters((value) => !value)}
          className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm lg:hidden"
        >
          <SlidersHorizontal size={15} />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_1fr]">
          <aside
            className={`${showMobileFilters ? "block" : "hidden"} max-h-[68vh] overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:p-4`}
          >
            <div className="mb-4 flex items-center justify-between lg:mb-5">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <SlidersHorizontal size={14} /> Filters
              </button>
              <button
                className="text-xs font-semibold text-[#157A4F]"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>

            <div className="mb-4 lg:mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">
                DISTANCE RADIUS
              </p>
              <input
                type="range"
                min="1"
                max="50"
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="w-full accent-[#157A4F]"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#157A4F]">
                Selected: {distanceRadius} km
              </p>
            </div>

            <div className="mb-4 lg:mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">
                OFFER TYPE
              </p>
              <div className="grid max-h-[136px] grid-cols-2 gap-2 overflow-y-auto pr-1 text-xs text-gray-700 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent lg:grid-cols-1 lg:max-h-[150px] lg:pr-2">
                {OFFER_TYPES.map((item) => (
                  <label key={item} className="flex min-h-6 items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 shrink-0 rounded border-gray-300"
                      checked={selectedOfferTypes[item]}
                      onChange={(e) =>
                        setSelectedOfferTypes((prev) => ({
                          ...prev,
                          [item]: e.target.checked,
                        }))
                      }
                    />
                    <span className="min-w-0 truncate" title={item}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4 lg:mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">
                PRICE RANGE
              </p>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#157A4F]"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                <span>₹100</span>
                <span>₹1.5k</span>
                <span>₹5k</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#157A4F]">
                {priceRange < 5000
                  ? `Max: ₹${priceRange.toLocaleString("en-IN")}`
                  : "Max: Any price"}
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">
                OTHER TOGGLES
              </p>
              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Top Discount (30%+)</span>
                  <button
                    onClick={() => setTopDiscountOnly((v) => !v)}
                    className={`h-4 w-8 rounded-full p-[2px] ${topDiscountOnly ? "bg-[#1B9B5A]" : "bg-gray-300"}`}
                  >
                    <span
                      className={`block h-3 w-3 rounded-full bg-white transition ${topDiscountOnly ? "translate-x-4" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Today</span>
                  <button
                    onClick={() => setActiveNowOnly((v) => !v)}
                    className={`h-4 w-8 rounded-full p-[2px] ${activeNowOnly ? "bg-[#1B9B5A]" : "bg-gray-300"}`}
                  >
                    <span
                      className={`block h-3 w-3 rounded-full bg-white transition ${activeNowOnly ? "translate-x-4" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="text-[26px] font-extrabold leading-tight text-gray-900 sm:text-[34px]">
                  {selectedCategory || "Deals near you"}
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Showing {summary.total} offers
                  {selectedCategory ? ` in ${selectedCategory}` : ""}
                  {query ? ` for \"${query}\"` : ""}
                  {location ? ` in ${location}` : ""}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {locationStatus === "ready"
                    ? `Distance filter uses your live location (${distanceRadius} km radius) for offers with coordinates.`
                    : locationStatus === "detecting"
                      ? "Detecting your location for accurate nearby results..."
                      : "Enable location permission to make distance filters fully accurate."}
                </p>
                {locationError ? (
                  <p className="mt-1 text-[11px] text-amber-600">
                    {locationError}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  className={`rounded-md border border-gray-200 bg-white p-2 ${activeView === "grid" ? "text-gray-700" : "text-gray-400"}`}
                  onClick={() => setActiveView("grid")}
                >
                  <Grid2x2 size={14} />
                </button>
                <button
                  className={`rounded-md border border-gray-200 bg-white p-2 ${activeView === "list" ? "text-gray-700" : "text-gray-400"}`}
                  onClick={() => setActiveView("list")}
                >
                  <List size={14} />
                </button>
                <button className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 sm:flex-none">
                  Sort:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-gray-700 outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </button>
              </div>
            </div>

            <div className="mb-4 flex w-full gap-2 sm:gap-3">
              <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2 sm:px-3">
                <p className="text-[9px] leading-tight text-gray-500 sm:text-[11px]">
                  Total Deals
                </p>
                <p className="text-[18px] font-semibold text-gray-900 sm:text-[20px]">
                  {summary.total}
                </p>
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2 sm:px-3">
                <p className="text-[9px] leading-tight text-gray-500 sm:text-[11px]">
                  Active Now
                </p>
                <p className="text-[18px] font-semibold text-gray-900 sm:text-[20px]">
                  {summary.active}
                </p>
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2 sm:px-3">
                <p className="text-[9px] leading-tight text-gray-500 sm:text-[11px]">
                  Avg Price
                </p>
                <p className="text-[16px] font-semibold text-gray-900 sm:text-[20px]">
                  ₹{summary.avgPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {error ? (
              <p className="mb-3 text-[12px] text-red-600">{error}</p>
            ) : null}

            {query && !loadingOffers && (
              <h2 className="text-xl font-bold text-gray-900 mb-4">Offers matching "{query}"</h2>
            )}
            <div
              className={
                activeView === "list"
                  ? "space-y-4"
                  : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
              }
            >
              {loadingOffers ? (
                <NearbyDealsSkeleton view={activeView} />
              ) : filteredDeals.length === 0 ? (
                <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                  {query ? (
                    <>No deals found matching "{query}".</>
                  ) : location ? (
                    <>No deals found for "{location}".</>
                  ) : (
                    <>No offers found for the selected filters.</>
                  )}
                </div>
              ) : (
                filteredDeals.slice(0, displayLimit).map((deal, index) => {
                  const uniqueKey = `${deal.offerId || deal._id || deal.requestId || index}-${index}`;
                  return activeView === "list" ? (
                    <article
                      key={uniqueKey}
                      className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg"
                    >
                      <div className="relative h-48 md:h-auto md:w-[35%] shrink-0 overflow-hidden bg-gray-100">
                        <OfferCardMedia
                          imageUrl={deal.imageUrl}
                          videoUrl={deal.videoUrl}
                          title={deal.title}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[#157A4F] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                          {deal.category || "Special"}
                        </span>
                        <span className="absolute left-3 top-10 rounded-md bg-white/95 px-2 py-0.5 text-[9px] font-semibold text-gray-700 shadow-sm">
                          {formatDistance(deal.distanceKm)}
                        </span>
                        <span
                          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm ${getDaysRemainingText(deal.endsAt) === "Expired" ? "bg-red-500 text-white" : "bg-white/95 text-[#157A4F]"}`}
                        >
                          {getDaysRemainingText(deal.endsAt) || "N/A"}
                        </span>
                      </div>
                      <div className="p-4 md:p-6 flex flex-col flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                            <Tag size={10} />
                            {deal.category || "Offer"}
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
                          {deal.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1 font-semibold text-gray-900">
                            {deal.merchant?.name || "Merchant"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="shrink-0" />
                            <span className="truncate">{deal.merchant?.address || "Location not specified"}</span>
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400 mb-4">
                          Valid: {formatDate(deal.startsAt)} - {formatDate(deal.endsAt)}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {toNumber(deal.discountPercent, 0) > 0 && (
                              <span className="bg-[#E2F0D9] text-[#385723] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                Save {deal.discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="text-2xl font-extrabold text-gray-900">
                              ₹{toNumber(deal.displayPrice, 0).toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => openDealDetails(deal)}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#157A4F] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0f5c3a] shadow-sm hover:shadow active:scale-95"
                            >
                              <span>View Deal</span>
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <article
                      key={uniqueKey}
                      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100 sm:h-36">
                        <OfferCardMedia
                          imageUrl={deal.imageUrl}
                          videoUrl={deal.videoUrl}
                          title={deal.title}
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#157A4F] to-[#28A745] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          {deal.category || "Special"}
                        </span>
                        <span className="absolute left-2 top-8 rounded-md bg-white/95 px-2 py-0.5 text-[9px] font-semibold text-gray-700 shadow-sm">
                          {formatDistance(deal.distanceKm)}
                        </span>
                        <span
                          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${getDaysRemainingText(deal.endsAt) === "Expired" ? "bg-red-500 text-white" : "bg-white/95 text-[#157A4F]"}`}
                        >
                          {getDaysRemainingText(deal.endsAt) || "N/A"}
                        </span>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
                          {deal.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-gray-500">
                          {deal.merchant?.name || "Merchant"}
                        </p>
                        <p className="mt-2 text-[11px] text-gray-500 line-clamp-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {deal.merchant?.address || "Location not specified"}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          Valid: {formatDate(deal.startsAt)} -{" "}
                          {formatDate(deal.endsAt)}
                        </p>
                        <p className="mt-2 text-xl font-extrabold text-gray-900">
                          ₹
                          {toNumber(deal.displayPrice, 0).toLocaleString("en-IN")}
                        </p>
                        <button
                          onClick={() => openDealDetails(deal)}
                          className="mt-auto w-full rounded-lg border border-gray-200 bg-[#F7F7F7] py-2 text-xs font-bold text-gray-800 transition-colors duration-200 hover:border-[#157A4F] hover:bg-[#157A4F] hover:text-white"
                        >
                          View Deal
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
            {(filteredDeals.length > displayLimit || (query && hasMoreOffers)) && (
              <div className="mt-6 text-center">
                <button 
                  onClick={async () => {
                    if (filteredDeals.length > displayLimit) {
                      setDisplayLimit(prev => prev + 16);
                    } else if (query && hasMoreOffers) {
                      const nextPage = offerPage + 1;
                      const res = await unifiedSearch(query, { type: 'offers', limit: 16, page: nextPage });
                      const newOffers = (res?.data?.offers || []).map(normalizeNearbyOffer);
                      setRawOffers(prev => {
                        const combined = [...prev, ...newOffers];
                        const seenIds = new Set();
                        return combined.filter((o) => {
                          const id = o.offerId || o.requestId || o._id;
                          if (!id) return true;
                          if (seenIds.has(id)) return false;
                          seenIds.add(id);
                          return true;
                        });
                      });
                      setDisplayLimit(prev => prev + 16);
                      setHasMoreOffers(newOffers.length === 16);
                      setOfferPage(nextPage);
                    }
                  }}
                  className="px-6 py-2 rounded-full border border-[#157A4F] text-[#157A4F] font-bold text-sm hover:bg-[#157A4F] hover:text-white transition-colors"
                >
                  Load More Offers
                </button>
              </div>
            )}

            {query && !loadingOffers && (
              <div className="mt-12 mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Stores matching "{query}"</h2>
                {merchantResults.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                    No stores found matching "{query}".
                  </div>
                ) : (
                  <>
                    <div className={activeView === "list" ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
                      {merchantResults.map((merchant, idx) => (
                        <MerchantSearchCard key={`${merchant._id || merchant.merchantId}-${idx}`} merchant={merchant} view={activeView} />
                      ))}
                    </div>
                    {hasMoreMerchants && (
                      <div className="mt-6 text-center">
                        <button 
                          onClick={async () => {
                            const nextPage = merchantPage + 1;
                            const res = await unifiedSearch(query, { type: 'merchants', limit: 16, page: nextPage });
                            const newMerchants = res?.data?.merchants || [];
                            setMerchantResults(prev => {
                              const combined = [...prev, ...newMerchants];
                              const seen = new Set();
                              return combined.filter(m => {
                                const id = m._id || m.merchantId;
                                if (!id) return true;
                                if (seen.has(id)) return false;
                                seen.add(id);
                                return true;
                              });
                            });
                            setHasMoreMerchants(newMerchants.length === 16);
                            setMerchantPage(nextPage);
                          }}
                          className="px-6 py-2 rounded-full border border-[#157A4F] text-[#157A4F] font-bold text-sm hover:bg-[#157A4F] hover:text-white transition-colors"
                        >
                          Load More Stores
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {query && !loadingOffers && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Products matching "{query}"</h2>
                {productResults.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                    No products found matching "{query}".
                  </div>
                ) : (
                  <>
                    <div className={activeView === "list" ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
                      {productResults.map((product, idx) => (
                        <ProductSearchCard key={`${product._id}-${idx}`} product={product} view={activeView} />
                      ))}
                    </div>
                    {hasMoreProducts && (
                      <div className="mt-6 text-center">
                        <button 
                          onClick={async () => {
                            const nextPage = productPage + 1;
                            const res = await unifiedSearch(query, { type: 'products', limit: 16, page: nextPage });
                            const newProducts = res?.data?.products || [];
                            setProductResults(prev => {
                              const combined = [...prev, ...newProducts];
                              const seen = new Set();
                              return combined.filter(p => {
                                const id = p._id;
                                if (!id) return true;
                                if (seen.has(id)) return false;
                                seen.add(id);
                                return true;
                              });
                            });
                            setHasMoreProducts(newProducts.length === 16);
                            setProductPage(nextPage);
                          }}
                          className="px-6 py-2 rounded-full border border-[#157A4F] text-[#157A4F] font-bold text-sm hover:bg-[#157A4F] hover:text-white transition-colors"
                        >
                          Load More Products
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <AuthRequiredModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        title="Login or Register"
        description="Please log in or register to open deal details. You can still browse nearby deals without signing in."
        redirectTo={authRedirectTo}
      />
    </main>
  );
}

function NearbyDealsSkeleton({ view = "grid" }) {
  return (
    <>
      {Array.from({ length: view === "list" ? 5 : 8 }).map((_, idx) => (
        <article
          key={idx}
          className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="relative h-36 w-full overflow-hidden bg-gray-100">
            <div className="h-full w-full animate-pulse bg-[#e6ebf1]" />
            <span className="absolute left-2 top-2 h-5 w-20 animate-pulse rounded-full bg-[#d9dee5]" />
            <span className="absolute left-2 top-8 h-4 w-16 animate-pulse rounded-md bg-[#e2e6ec]" />
          </div>
          <div className="p-3 flex flex-col flex-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-[#e5e7eb]" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#edf0f4]" />
            <div className="mt-2 h-3 w-full animate-pulse rounded bg-[#edf0f4]" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-[#edf0f4]" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-[#edf0f4]" />
            <div className="mt-2 h-6 w-1/3 animate-pulse rounded bg-[#e5e7eb]" />
            <div className="mt-auto h-[34px] w-full animate-pulse rounded-lg bg-[#e5e7eb]" />
          </div>
        </article>
      ))}
    </>
  );
}

export default function NearbyDealsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F3F3F3]" />}>
      <NearbyDealsPageContent />
    </Suspense>
  );
}
