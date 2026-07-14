"use client";
import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import {
  Search,
  MapPin,
  User,
  X,
  LogOut,
  ChevronDown,
  Shield,
  ShieldCheck,
  FileText,
  Bell,
  Trophy,
  Heart,
  Mic,
  Briefcase,
  LayoutGrid,
  MessageSquare,
  MoreVertical
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../lib/api";
import { normalizeAppPath } from "../lib/path";
import { reverseGeocode, searchLocations } from "../services/leafletService";

const CURRENT_LOCATION_STORAGE_KEY = "golo_current_location";
const MIC_PERMISSION_STORAGE_KEY = "golo_voice_mic_permission";

function getShortLocationLabel(locationDetails) {
  const rawAddress = String(
    locationDetails?.address ||
      locationDetails?.displayName ||
      locationDetails?.name ||
      "",
  );

  const parts = rawAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !/^\d{4,}$/.test(part));

  if (parts.length >= 2) {
    return parts.slice(0, 2).join(", ");
  }

  return parts[0] || "Current Location";
}

function normalizeVoiceTranscript(value = "") {
  return String(value)
    .replace(/[.。]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getBestSpeechTranscript(results = []) {
  return normalizeVoiceTranscript(
    Array.from(results)
      .map((result) => {
        const alternatives = Array.from(result || []);
        const bestAlternative = alternatives.reduce((best, current) => {
          if (!best) return current;
          const currentConfidence = Number(current?.confidence || 0);
          const bestConfidence = Number(best?.confidence || 0);
          if (currentConfidence > bestConfidence) return current;
          if (
            currentConfidence === bestConfidence &&
            String(current?.transcript || "").length >
              String(best?.transcript || "").length
          ) {
            return current;
          }
          return best;
        }, null);
        return bestAlternative?.transcript || "";
      })
      .join(" "),
  );
}

function NavbarContent({
  searchQuery: externalSearchQuery = "",
  setSearchQuery: setExternalSearchQuery = () => {},
}) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    externalSearchQuery || searchParams.get("q") || "",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [currentLocationLabel, setCurrentLocationLabel] = useState("");
  const [currentLocationCoordinates, setCurrentLocationCoordinates] =
    useState(null);
  const hasManualLocationRef = useRef(false);
  const hasCurrentLocationAccessRef = useRef(false);
  const urlLocation = searchParams.get("location") || "";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync with external prop if it changes
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  useEffect(() => {
    if (urlLocation) {
      hasManualLocationRef.current = true;
      hasCurrentLocationAccessRef.current = false;
      setLocation(urlLocation);
      return;
    }

    if (
      currentLocationLabel &&
      hasCurrentLocationAccessRef.current &&
      !hasManualLocationRef.current
    ) {
      setLocation(currentLocationLabel);
    }
  }, [urlLocation, currentLocationLabel]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (urlLocation) return;

    if (!navigator?.geolocation) {
      localStorage.removeItem(CURRENT_LOCATION_STORAGE_KEY);
      if (!hasManualLocationRef.current) {
        setCurrentLocationLabel("");
        setCurrentLocationCoordinates(null);
        setLocation("");
      }
      return;
    }

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (cancelled) return;

        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        hasCurrentLocationAccessRef.current = true;
        setCurrentLocationCoordinates(coordinates);

        try {
          const locationDetails = await reverseGeocode(
            coordinates.lng,
            coordinates.lat,
          );
          if (cancelled) return;

          const label = getShortLocationLabel(locationDetails);
          setCurrentLocationLabel(label);
          setLocation((prev) => {
            if (urlLocation || hasManualLocationRef.current) return prev;
            return label;
          });
          localStorage.setItem(
            CURRENT_LOCATION_STORAGE_KEY,
            JSON.stringify({ label, coordinates, updatedAt: Date.now() }),
          );
        } catch {
          const fallbackLabel = "Current Location";
          if (cancelled) return;
          hasCurrentLocationAccessRef.current = true;
          setCurrentLocationLabel(fallbackLabel);
          setLocation((prev) =>
            hasManualLocationRef.current ? prev : fallbackLabel,
          );
        }
      },
      () => {
        hasCurrentLocationAccessRef.current = false;
        setCurrentLocationLabel("");
        setCurrentLocationCoordinates(null);
        localStorage.removeItem(CURRENT_LOCATION_STORAGE_KEY);
        if (!hasManualLocationRef.current && !urlLocation) {
          setLocation("");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5 * 60 * 1000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [urlLocation]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setExternalSearchQuery(val);
  };

  const handleLocationChange = (val) => {
    hasManualLocationRef.current = true;
    hasCurrentLocationAccessRef.current = false;
    setLocation(val);
    setShowSuggestions(true);
  };

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [isListening, setIsListening] = useState(false);

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
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
  const router = useRouter();
  const pathname = normalizeAppPath(usePathname());
  const { user, isAuthenticated, logout } = useAuth();
  const logoHref =
    isAuthenticated && user?.accountType === "merchant" ? "/" : "/";
  const isGolocalSurface =
    pathname === "/" ||
    pathname.startsWith("/nearby-deals") ||
    (pathname.startsWith("/profile") &&
      !pathname.startsWith("/profile/transactions") &&
      !/^\/profile\/[a-f0-9]{24}$/i.test(pathname)) ||
    pathname.startsWith("/my-deals");
  const isChojaSurface =
    pathname.startsWith("/choja") ||
    /^\/profile\/[a-f0-9]{24}$/i.test(pathname) ||
    pathname.startsWith("/profile/transactions");
  const isMerchantSurface = isAuthenticated && user?.accountType === "merchant";
  const useGolocalHomeNav = isGolocalSurface;
  const homeNavHref = "/choja";
  const primaryNavLabel = useGolocalHomeNav ? "My Deals" : "Post Your Ad";
  const primaryNavHref = useGolocalHomeNav ? "/my-deals" : "/post-ad";
  const secondaryNavLabel = useGolocalHomeNav ? "Nearby Deals" : "Chats";
  const secondaryNavHref = useGolocalHomeNav ? "/nearby-deals" : "/chats";

  const defaultLocationSuggestions = [
    {
      name: "Pune",
      displayName: "Pune, Maharashtra, India",
      address: "Pune, Maharashtra, India",
    },
    {
      name: "Mumbai",
      displayName: "Mumbai, Maharashtra, India",
      address: "Mumbai, Maharashtra, India",
    },
    {
      name: "Kolhapur",
      displayName: "Kolhapur, Maharashtra, India",
      address: "Kolhapur, Maharashtra, India",
    },
    {
      name: "Bangalore",
      displayName: "Bangalore, Karnataka, India",
      address: "Bangalore, Karnataka, India",
    },
    { name: "Delhi", displayName: "Delhi, India", address: "Delhi, India" },
    {
      name: "Hyderabad",
      displayName: "Hyderabad, Telangana, India",
      address: "Hyderabad, Telangana, India",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;

    try {
      if (
        window.sessionStorage.getItem(MIC_PERMISSION_STORAGE_KEY) === "granted"
      ) {
        micPermissionGrantedRef.current = true;
      }
    } catch {
      // Ignore storage access issues.
    }

    let permissionStatus;
    let cancelled = false;

    const syncPermission = (state) => {
      if (cancelled) return;
      micPermissionCheckedRef.current = Boolean(state);
      micPermissionGrantedRef.current = state === "granted";
      try {
        if (state === "granted") {
          window.sessionStorage.setItem(MIC_PERMISSION_STORAGE_KEY, "granted");
        } else if (state === "denied") {
          window.sessionStorage.removeItem(MIC_PERMISSION_STORAGE_KEY);
        }
      } catch {
        // Ignore storage access issues.
      }
    };

    navigator.permissions
      ?.query?.({ name: "microphone" })
      .then((status) => {
        if (cancelled) return;
        permissionStatus = status;
        syncPermission(status.state);
        status.onchange = () => syncPermission(status.state);
      })
      .catch(() => {
        // Permission API is optional; getUserMedia will request access on first use.
      });

    return () => {
      cancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (dropdownRef.current || mobileDropdownRef.current) &&
        !dropdownRef.current?.contains(event.target) &&
        !mobileDropdownRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }

      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showSuggestions || !isAuthenticated) {
      setLocationLoading(false);
      if (!showSuggestions) {
        setLocationSuggestions([]);
      }
      return;
    }

    const trimmedLocation = location.trim();
    let active = true;

    if (!trimmedLocation) {
      setLocationSuggestions(defaultLocationSuggestions.slice(0, 6));
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(trimmedLocation, {
          limit: 6,
          country: "in",
        });
        if (!active) return;
        setLocationSuggestions(
          Array.isArray(results) && results.length > 0
            ? results.slice(0, 6)
            : defaultLocationSuggestions.slice(0, 6),
        );
      } catch {
        if (active) {
          setLocationSuggestions(defaultLocationSuggestions.slice(0, 6));
        }
      } finally {
        if (active) {
          setLocationLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [location, showSuggestions, isAuthenticated]);

  // Fetch notifications for authenticated users
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getNotifications({ limit: 15 });
      if (res?.success) {
        setNotifications(res.data?.notifications || []);
        setUnreadCount(res.data?.unreadCount || 0);
      }
    } catch {
      // fail silently
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleNotifBellClick = () => {
    setShowNotifications((prev) => !prev);
    setShowProfileMenu(false);
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // fail silently
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // fail silently
    }
  };

  const runSearch = (
    nextSearch = searchQuery,
    nextLocation = location,
    nextCoordinates = null,
  ) => {
    const trimmedSearch = nextSearch.trim();
    const trimmedLocation = nextLocation.trim();
    const resolvedCoordinates =
      nextCoordinates ||
      (trimmedLocation && trimmedLocation === currentLocationLabel
        ? currentLocationCoordinates
        : null);
    const isDetectedCurrentLocation =
      Boolean(trimmedLocation) &&
      Boolean(currentLocationLabel) &&
      trimmedLocation === currentLocationLabel &&
      resolvedCoordinates &&
      Number.isFinite(resolvedCoordinates.lat) &&
      Number.isFinite(resolvedCoordinates.lng);

    const params = new URLSearchParams();
    const currentCategory = searchParams.get("category");
    if (currentCategory) params.set("category", currentCategory);
    const currentView = searchParams.get("view");
    if (currentView) params.set("view", currentView);

    if (trimmedSearch) params.set("q", trimmedSearch);
    if (trimmedLocation && !isDetectedCurrentLocation)
      params.set("location", trimmedLocation);
    if (
      resolvedCoordinates &&
      Number.isFinite(resolvedCoordinates.lat) &&
      Number.isFinite(resolvedCoordinates.lng)
    ) {
      params.set("lat", String(resolvedCoordinates.lat));
      params.set("lng", String(resolvedCoordinates.lng));
    }

    const isNearbySurface = pathname.startsWith("/nearby-deals");
    const isUserSurface =
      pathname === "/my-deals" ||
      pathname === "/wishlist" ||
      pathname === "/my-ads" ||
      pathname.startsWith("/profile");
    const isCategorySurface = pathname.startsWith("/category/");
    const targetBase =
      isNearbySurface || pathname === "/" || isUserSurface
        ? "/nearby-deals"
        : isCategorySurface
          ? pathname
          : "/choja";

    // Nearby deals browsing (including location/city filtering) should work without auth.
    if (!isAuthenticated && targetBase !== "/nearby-deals") {
      setShowAuthPrompt(true);
      return;
    }

    router.push(
      params.toString() ? `${targetBase}?${params.toString()}` : targetBase,
    );
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      runSearch();
      setShowSuggestions(false);
    }
  };

  const clearSearchAndShowLocationOffers = () => {
    handleSearchChange("");
    setShowSuggestions(false);

    const fallbackLocation = location || currentLocationLabel || "";
    const fallbackCoordinates =
      currentLocationCoordinates &&
      (!fallbackLocation || fallbackLocation === currentLocationLabel)
        ? currentLocationCoordinates
        : null;

    if (!location && currentLocationLabel) {
      setLocation(currentLocationLabel);
    }

    runSearch("", fallbackLocation, fallbackCoordinates);
  };

  const handleSearchInputChange = (value) => {
    if (!value && searchQuery) {
      clearSearchAndShowLocationOffers();
      return;
    }

    handleSearchChange(value);
  };

  const cacheMicrophonePermission = (isGranted) => {
    micPermissionCheckedRef.current = true;
    micPermissionGrantedRef.current = isGranted;

    try {
      if (isGranted) {
        window.sessionStorage.setItem(MIC_PERMISSION_STORAGE_KEY, "granted");
      } else {
        window.sessionStorage.removeItem(MIC_PERMISSION_STORAGE_KEY);
      }
    } catch {
      // Session storage may be unavailable in private browsing.
    }
  };

  const ensureMicrophonePermission = async (sessionId) => {
    if (micPermissionGrantedRef.current) return true;

    try {
      if (
        window.sessionStorage.getItem(MIC_PERMISSION_STORAGE_KEY) === "granted"
      ) {
        micPermissionGrantedRef.current = true;
        return true;
      }
    } catch {
      // Ignore storage access issues.
    }

    try {
      const permissionStatus = await navigator.permissions?.query?.({
        name: "microphone",
      });
      if (sessionId !== voiceSessionRef.current) return false;

      if (permissionStatus?.state === "granted") {
        cacheMicrophonePermission(true);
        return true;
      }

      if (permissionStatus?.state === "denied") {
        cacheMicrophonePermission(false);
        setIsListening(false);
        setVoiceError(
          "Microphone is blocked. Please allow mic access from browser site settings.",
        );
        return false;
      }
    } catch {
      // Some browsers do not support querying microphone permission.
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setIsListening(false);
      setVoiceError("Microphone access is not available in this browser.");
      return false;
    }

    try {
      if (!micPermissionCheckedRef.current) {
        setVoiceError("Allow microphone once to start voice search.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      stream.getTracks().forEach((track) => track.stop());
      if (sessionId !== voiceSessionRef.current) return false;

      cacheMicrophonePermission(true);
      return true;
    } catch {
      if (sessionId !== voiceSessionRef.current) return false;
      cacheMicrophonePermission(false);
      setIsListening(false);
      setVoiceError(
        "Please allow microphone access once, then tap Speak Again.",
      );
      return false;
    }
  };

  const stopVoiceListening = () => {
    if (voiceSearchTimerRef.current) {
      window.clearTimeout(voiceSearchTimerRef.current);
      voiceSearchTimerRef.current = null;
    }
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onsoundstart = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onnomatch = null;
      }
      recognitionRef.current?.stop?.();
    } catch {
      // Speech recognition may already be stopped.
    }
    setIsListening(false);
  };

  const closeVoiceModal = () => {
    voiceSessionRef.current += 1;
    stopVoiceListening();
    voiceFinalizingRef.current = true;
    setVoiceModalOpen(false);
  };

  const finalizeVoiceSearch = (
    spokenValue = voiceTranscriptRef.current,
    sessionId = voiceSessionRef.current,
  ) => {
    if (sessionId !== voiceSessionRef.current) return;
    const spokenText = normalizeVoiceTranscript(spokenValue);
    if (!spokenText || voiceFinalizingRef.current) return;

    voiceFinalizingRef.current = true;
    setVoiceTranscript(spokenText);
    handleSearchChange(spokenText);
    setIsListening(false);

    if (voiceSearchTimerRef.current) {
      window.clearTimeout(voiceSearchTimerRef.current);
      voiceSearchTimerRef.current = null;
    }

    try {
      recognitionRef.current?.stop?.();
    } catch {
      // Ignore if the browser already stopped listening.
    }

    window.setTimeout(() => {
      if (sessionId !== voiceSessionRef.current) return;
      setVoiceModalOpen(false);
      runSearch(spokenText);
      voiceFinalizingRef.current = false;
    }, 360);
  };

  const startVoiceSearch = async () => {
    const canUsePublicSearch =
      pathname === "/" || pathname.startsWith("/nearby-deals");
    if (!isAuthenticated && !canUsePublicSearch) {
      setShowAuthPrompt(true);
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setVoiceModalOpen(true);
    const sessionId = voiceSessionRef.current + 1;
    voiceSessionRef.current = sessionId;
    setVoiceTranscript("");
    voiceTranscriptRef.current = "";
    voiceFinalizingRef.current = false;
    voiceRestartCountRef.current = 0;
    setIsListening(false);
    setVoiceError("");
    if (voiceSearchTimerRef.current) {
      window.clearTimeout(voiceSearchTimerRef.current);
      voiceSearchTimerRef.current = null;
    }

    if (!SpeechRecognition) {
      setIsListening(false);
      setVoiceError(
        "Voice search is not supported in this browser. Please try Chrome or Edge.",
      );
      return;
    }

    const hasMicrophonePermission = await ensureMicrophonePermission(sessionId);
    if (sessionId !== voiceSessionRef.current || !hasMicrophonePermission) {
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onsoundstart = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onnomatch = null;
        recognitionRef.current.abort?.();
      }
    } catch {
      // Ignore stale recognition cleanup errors.
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    const restartRecognition = (delay = 180) => {
      if (sessionId !== voiceSessionRef.current) return;
      if (
        voiceFinalizingRef.current ||
        voiceTranscriptRef.current ||
        voiceRestartCountRef.current >= 1
      )
        return;
      voiceRestartCountRef.current += 1;
      window.setTimeout(() => {
        if (sessionId !== voiceSessionRef.current) return;
        if (voiceFinalizingRef.current || voiceTranscriptRef.current) return;
        try {
          setIsListening(true);
          setVoiceError("Listening again... speak now.");
          recognition.start();
        } catch {
          setVoiceError("Tap Speak Again and try speaking closer to the mic.");
          setIsListening(false);
        }
      }, delay);
    };

    recognition.onstart = () => {
      if (sessionId !== voiceSessionRef.current) return;
      setIsListening(true);
      setVoiceError("");
    };

    recognition.onaudiostart = () => {
      if (sessionId !== voiceSessionRef.current) return;
      setIsListening(true);
      setVoiceError("");
    };

    recognition.onsoundstart = () => {
      if (sessionId !== voiceSessionRef.current) return;
      setIsListening(true);
      setVoiceError("");
    };

    recognition.onspeechstart = () => {
      if (sessionId !== voiceSessionRef.current) return;
      setIsListening(true);
      if (voiceSearchTimerRef.current) {
        window.clearTimeout(voiceSearchTimerRef.current);
        voiceSearchTimerRef.current = null;
      }
    };

    recognition.onspeechend = () => {
      if (sessionId !== voiceSessionRef.current) return;
      if (voiceTranscriptRef.current && !voiceFinalizingRef.current) {
        if (voiceSearchTimerRef.current) {
          window.clearTimeout(voiceSearchTimerRef.current);
        }
        voiceSearchTimerRef.current = window.setTimeout(() => {
          finalizeVoiceSearch(voiceTranscriptRef.current, sessionId);
        }, 380);
      }
    };

    recognition.onresult = (event) => {
      if (sessionId !== voiceSessionRef.current) return;
      const spokenText = getBestSpeechTranscript(event.results);

      setVoiceTranscript(spokenText);
      voiceTranscriptRef.current = spokenText;
      if (spokenText) {
        handleSearchChange(spokenText);
        if (voiceSearchTimerRef.current) {
          window.clearTimeout(voiceSearchTimerRef.current);
        }
        voiceSearchTimerRef.current = window.setTimeout(() => {
          finalizeVoiceSearch(spokenText, sessionId);
        }, 650);
      }

      const hasFinalResult = Array.from(event.results).some(
        (result) => result.isFinal,
      );
      if (hasFinalResult && spokenText) {
        finalizeVoiceSearch(spokenText, sessionId);
      }
    };

    recognition.onerror = (event) => {
      if (sessionId !== voiceSessionRef.current) return;
      setIsListening(false);
      if (
        (event?.error === "no-speech" || event?.error === "audio-capture") &&
        !voiceTranscriptRef.current
      ) {
        setVoiceError("Listening... please speak a little closer to the mic.");
        restartRecognition(220);
        return;
      }
      if (event?.error === "aborted") {
        return;
      }
      const errorMessage =
        event?.error === "not-allowed"
          ? "Microphone permission is blocked. Please allow mic access and try again."
          : "Could not hear clearly. Please try speaking again.";
      setVoiceError(errorMessage);
    };

    recognition.onend = () => {
      if (sessionId !== voiceSessionRef.current) return;
      setIsListening(false);
      if (voiceTranscriptRef.current && !voiceFinalizingRef.current) {
        voiceSearchTimerRef.current = window.setTimeout(() => {
          finalizeVoiceSearch(voiceTranscriptRef.current, sessionId);
        }, 250);
      } else if (!voiceFinalizingRef.current && !voiceTranscriptRef.current) {
        restartRecognition(220);
      }
    };

    recognition.onnomatch = () => {
      if (sessionId !== voiceSessionRef.current) return;
      if (!voiceTranscriptRef.current) {
        setVoiceError(
          "I heard something but couldn't understand it. Please speak clearly.",
        );
        restartRecognition(250);
      }
    };

    recognitionRef.current = recognition;
    try {
      setIsListening(true);
      setVoiceError("Listening...");
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError(
        "Could not start microphone. Please close this popup and try again.",
      );
    }
  };

  const searchVoiceTranscript = () => {
    const spokenText = normalizeVoiceTranscript(voiceTranscript);
    if (!spokenText) return;
    finalizeVoiceSearch(spokenText);
  };

  useEffect(() => {
    return () => {
      voiceSessionRef.current += 1;
      if (voiceSearchTimerRef.current) {
        window.clearTimeout(voiceSearchTimerRef.current);
      }
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // Ignore cleanup errors.
      }
    };
  }, []);

  const openMobileLocationPicker = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    const currentQuery =
      typeof window !== "undefined" ? window.location.search : "";
    const redirectPath = `${pathname}${currentQuery}`;
    router.push(
      `/select-location?redirect=${encodeURIComponent(redirectPath)}`,
    );
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    router.push("/login");
  };

  const handleProfileAvatarClick = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const requireAuth = (callback) => (event) => {
    if (!isAuthenticated) {
      if (event?.preventDefault) event.preventDefault();
      if (event?.stopPropagation) event.stopPropagation();
      setShowAuthPrompt(true);
      return;
    }

    if (callback) callback(event);
  };

  return (
    <>
      {/* SHARED GRADIENT LAYER — matches reference exactly:
          colors: ["#f8a812", "#fad081", "#f8f6f265"], vertical, height 270,
          sits behind both the header and the category bar below it so the
          gradient is continuous with zero seam. */}
      <div
        aria-hidden="true"
        style={{
          height: 220,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 0,
          background:
            "linear-gradient(180deg, #f8a812 0%, #fad081 50%, #f8f6f265 100%)",
          pointerEvents: "none",
        }}
      />
      <header
        className="sticky top-0 z-[9999] py-4 px-4 md:py-4 md:px-8 border-0"
        style={{
          background: scrolled
            ? "linear-gradient(180deg, #f8a812 0%, #fad081 100%)"
            : "transparent",
          border: "none",
          borderBottom: "none",
          boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)" : "none",
          transition: "background 0.2s ease, box-shadow 0.2s ease",
          marginBottom: -2,
        }}
      >
        <div className="w-full h-[60px] flex items-center justify-between gap-3">
          {/* LOGO TOGGLE PILLS */}
          {!isMerchantSurface ? (
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <Link
                href="/"
                className="flex h-11 items-center gap-1.5 rounded-full bg-white px-4 shadow-sm transition hover:opacity-90"
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold leading-none text-white"
                  style={{ background: "#157A4F" }}
                >
                  G
                </span>
                <span className="text-[15px] font-extrabold tracking-wide text-[#157A4F]">
                  GOLO
                </span>
              </Link>
              <Link
                href="/choja"
                className="hidden h-11 items-center gap-1.5 rounded-full bg-white px-4 shadow-sm transition hover:opacity-90 sm:flex"
              >
                <Briefcase size={16} className="text-[#1f2933]" strokeWidth={2.4} />
                <span className="text-[15px] font-extrabold tracking-wide text-[#1f2933]">
                  CHOJA
                </span>
              </Link>
            </div>
          ) : (
            <Link href={logoHref} className="flex min-w-0 items-center gap-2">
              <div
                className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold"
                style={{ color: "#157A4F" }}
              >
                G
              </div>
              <span className="text-lg font-semibold tracking-wide text-white sm:text-xl">
                GOLO
              </span>
            </Link>
          )}

          {/* CENTER */}
          <div
            className="hidden md:flex items-center gap-3 flex-1 mx-6 max-w-4xl h-11"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SEARCH */}
            <div
              className="flex-[1.4] flex items-center rounded-full bg-white px-5 h-11 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Search size={18} className="mr-2 text-gray-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => {
                  if (!isAuthenticated) setShowAuthPrompt(true);
                }}
                placeholder="Search listings..."
                className="flex-1 outline-none text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none"
                readOnly={!isAuthenticated}
              />

              <button
                type="button"
                onClick={startVoiceSearch}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#157A4F] transition hover:bg-[#edf8f2]"
                aria-label="Search by voice"
              >
                <Mic size={17} />
              </button>

              {searchQuery && (
                <button
                  onClick={clearSearchAndShowLocationOffers}
                  className="ml-2 text-gray-400 transition opacity-70"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* LOCATION */}
            <div className="relative flex-[1] max-w-[260px]" ref={dropdownRef}>
              <div className="flex items-center rounded-full bg-white px-4 h-11 shadow-sm">
                <MapPin
                  size={17}
                  strokeWidth={2.4}
                  className="mr-2 shrink-0 text-[#ff7a1a]"
                />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => {
                    if (!isAuthenticated) {
                      setShowAuthPrompt(true);
                      return;
                    }
                    setShowSuggestions(true);
                  }}
                  placeholder="Location"
                  className="w-full min-w-0 outline-none text-sm font-semibold bg-transparent text-[#1f2933] placeholder-gray-500 focus:outline-none"
                  readOnly={!isAuthenticated}
                />

                {location ? (
                  <button
                    onClick={() => {
                      setLocation("");
                      hasManualLocationRef.current = false;
                      setShowSuggestions(false);
                      runSearch(searchQuery, "");
                    }}
                    className="ml-1 shrink-0 text-gray-400 transition opacity-70"
                  >
                    <X size={14} />
                  </button>
                ) : null}
                <ChevronDown
                  size={14}
                  className="ml-1 shrink-0 text-gray-400"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthPrompt(true);
                      return;
                    }
                    setShowSuggestions((prev) => !prev);
                  }}
                />
              </div>

              {/* LOCATION DROPDOWN */}
              {showSuggestions && (
                <div className="absolute top-14 left-0 w-full min-w-[260px] rounded-xl shadow-lg py-2 z-50 bg-white border border-gray-200">
                  {locationLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Searching cities...
                    </div>
                  ) : locationSuggestions.length > 0 ? (
                    locationSuggestions.slice(0, 6).map((place, index) => (
                      <div
                        key={`${place.displayName || place.name || index}-${index}`}
                      >
                        <div
                          onClick={() => {
                            const nextLocation =
                              place.displayName ||
                              place.address ||
                              place.name ||
                              place.city ||
                              "";
                            const nextCoordinates = place.coordinates || null;
                            hasManualLocationRef.current = true;
                            hasCurrentLocationAccessRef.current = false;
                            setLocation(nextLocation);
                            setShowSuggestions(false);
                            runSearch(searchQuery, nextLocation, nextCoordinates);
                          }}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                        >
                          <MapPin
                            size={16}
                            style={{ color: "var(--color-primary)" }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-black">
                              {place.name ||
                                place.city ||
                                place.displayName?.split(",")[0] ||
                                "Location"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {place.displayName ||
                                place.address ||
                                place.state ||
                                "India"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No city matches found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex shrink-0 items-center justify-end gap-3">
            {/* PROFILE / AUTH */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* NOTIFICATION BELL */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={handleNotifBellClick}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md hover:scale-105 transition"
                    style={{ color: "#157A4F" }}
                    aria-label="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="fixed left-1/2 top-[72px] z-[9999] w-[calc(100vw-1.5rem)] max-w-[332px] -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[calc(100vw-2rem)] sm:max-w-80 sm:translate-x-0">
                      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100 sm:px-4 sm:py-3">
                        <p className="text-sm font-semibold text-gray-800">
                          Notifications
                        </p>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-[#157A4F] hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto sm:max-h-80">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell
                              size={28}
                              className="mx-auto mb-2 text-gray-300"
                            />
                            <p className="text-sm text-gray-400">
                              No notifications yet
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                if (!notif.read) handleMarkRead(notif._id);
                                setShowNotifications(false);
                                if (notif.offerId) router.push(`/nearby-deals/deal?offerId=${notif.offerId}`);
                              }}
                              className={`flex items-start gap-2.5 px-3.5 py-2.5 border-b border-gray-50 transition cursor-pointer sm:gap-3 sm:px-4 sm:py-3 ${
                                notif.read
                                  ? "bg-white"
                                  : "bg-green-50 hover:bg-green-100"
                              }`}
                            >
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#157A4F]/10 sm:h-8 sm:w-8 sm:mt-0.5">
                                <Bell size={14} className="text-[#157A4F]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="break-words text-[13px] leading-snug text-gray-800 sm:text-sm">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </p>
                              </div>
                              {!notif.read && (
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#157A4F] mt-2" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PROFILE AVATAR */}
                <div className="relative" ref={profileRef}>
                  <div
                    onClick={handleProfileAvatarClick}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="relative w-9 h-9">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition bg-white overflow-hidden"
                        style={{ color: "#157A4F" }}
                      >
                        {user?.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatarUrl}
                            alt={user?.name || "Profile"}
                            className="h-full w-full object-cover"
                          />
                        ) : user?.name ? (
                          <span className="text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className="hidden text-white sm:block"
                    />
                  </div>

                  {/* Profile Dropdown — surface-specific ordered links */}
                  {showProfileMenu && (
                    <div className="absolute top-12 right-0 w-[calc(100vw-2rem)] max-w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[9999]">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {isGolocalSurface ? (
                        <>
                          <Link
                            href="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <User size={16} /> My Profile
                          </Link>
                          <Link
                            href="/profile/favorites"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Heart size={16} className="text-red-500" /> Wishlist
                          </Link>
                          <Link
                            href="/my-deals"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FileText size={16} /> Claimed Deals
                          </Link>
                          <Link
                            href="/nearby-deals"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <MapPin size={16} /> Nearby Deals
                          </Link>
                          <Link
                            href="/profile/notifications"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Bell size={16} /> Notifications
                          </Link>
                          <div className="border-t border-gray-100 mt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/choja/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <User size={16} /> My Profile
                          </Link>
                          <Link
                            href="/post-ad"
                            onClick={requireAuth(() => setShowProfileMenu(false))}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FileText size={16} /> Post Your Ads
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Heart size={16} className="text-red-500" /> Wishlist
                          </Link>
                          <Link
                            href="/chats"
                            onClick={requireAuth(() => setShowProfileMenu(false))}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <MessageSquare size={16} /> Chats
                          </Link>
                          <Link
                            href="/my-ads"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <LayoutGrid size={16} /> My Ads
                          </Link>
                          <Link
                            href="/profile/transactions"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition md:hidden"
                          >
                            <FileText size={16} /> Transactions
                          </Link>

                          {user?.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#157A4F] hover:bg-green-50 transition border-t border-gray-100 mt-1"
                            >
                              <Shield size={16} /> Admin Dashboard
                            </Link>
                          )}
                          <div className="border-t border-gray-100 mt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/merchant")}
                    className="flex h-9 px-5 rounded-full items-center justify-center bg-orange-500 text-white font-bold text-sm shadow-sm hover:bg-orange-600 hover:-translate-y-0.5 transition-transform whitespace-nowrap"
                  >
                    Become a Merchant
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/login?redirect=${encodeURIComponent(pathname || "/")}`,
                      )
                    }
                    className="h-9 px-6 rounded-full flex items-center justify-center border-2 border-orange-500 text-orange-500 font-bold text-sm bg-white hover:bg-orange-50 transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </button>
                </div>
                {/* Mobile Menu */}
                <div className="md:hidden relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 shadow-sm hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 flex flex-col gap-2 px-3">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push("/merchant");
                        }}
                        className="w-full h-10 rounded-full bg-orange-500 text-white font-bold text-sm shadow-sm hover:bg-orange-600 transition-colors"
                      >
                        Become a Merchant
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
                        }}
                        className="w-full h-10 rounded-full border-2 border-orange-500 text-orange-500 font-bold text-sm bg-white hover:bg-orange-50 transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH + LOCATION ROW */}
        <div className="-mx-4 px-4 py-2 md:hidden">
          <div className="mx-auto flex h-[46px] w-full max-w-[358px] items-center rounded-full bg-white px-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
            <div className="flex min-w-0 flex-1 items-center">
              <Search
                size={19}
                strokeWidth={2}
                className="mr-2.5 shrink-0 text-[#7b7f86]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => {
                  if (!isAuthenticated) setShowAuthPrompt(true);
                }}
                placeholder="Search for services,"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#1f2933] outline-none placeholder:text-[#85878b]"
                readOnly={!isAuthenticated}
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7fffb] text-[#157A4F]"
                aria-label="Search by voice"
              >
                <Mic size={16} />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearchAndShowLocationOffers}
                  className="ml-1 text-gray-400"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative ml-2 shrink-0" ref={mobileDropdownRef}>
              <div
                role="button"
                tabIndex={0}
                onClick={openMobileLocationPicker}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  openMobileLocationPicker();
                }}
                className="flex h-9 min-w-[84px] max-w-[116px] items-center rounded-full bg-[#f7fffb] px-2.5 text-left"
                aria-label="Change location"
              >
                <MapPin
                  size={16}
                  strokeWidth={2.4}
                  className="mr-1.5 shrink-0 text-[#ff7a1a]"
                />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-[#2d2d2d]">
                  {location || "Location"}
                </span>
                {location && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      setLocation("");
                      hasManualLocationRef.current = false;
                      setShowSuggestions(false);
                      runSearch(searchQuery, "");
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      event.stopPropagation();
                      setLocation("");
                      hasManualLocationRef.current = false;
                      setShowSuggestions(false);
                      runSearch(searchQuery, "");
                    }}
                    className="ml-1 text-gray-400"
                    aria-label="Clear location"
                  >
                    <X size={12} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile surface-switch row replaces the old text-link nav row.
            Border removed to keep the header-to-category-bar gradient seamless. */}
        {!isMerchantSurface && (
          <div className="-mx-4 flex gap-2 px-4 pb-2 pt-2 text-[14px] font-extrabold md:hidden">
            <Link
              href="/"
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-white text-[#157A4F] shadow-sm transition hover:opacity-90"
            >
              <span
                className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold leading-none text-white"
                style={{ background: "#157A4F" }}
              >
                G
              </span>{" "}
              GOLO
            </Link>
            <Link
              href="/choja"
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-white text-[#1f2933] shadow-sm transition hover:opacity-90"
            >
              <Briefcase size={15} strokeWidth={2.4} /> CHOJA
            </Link>
          </div>
        )}
      </header>

      {voiceModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 px-4">
          <style>{`
            @keyframes voice-wave {
              0%, 100% { transform: scaleY(0.35); opacity: 0.45; }
              45% { transform: scaleY(1); opacity: 1; }
            }
            @keyframes voice-ring {
              0% { transform: scale(0.86); opacity: 0.42; }
              100% { transform: scale(1.35); opacity: 0; }
            }
            .voice-wave-bar {
              animation: voice-wave 0.75s ease-in-out infinite;
              transform-origin: center;
            }
            .voice-ring {
              animation: voice-ring 1.25s ease-out infinite;
            }
          `}</style>
          <div className="w-full max-w-[420px] rounded-[26px] bg-white px-6 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="mx-auto flex items-center justify-center gap-3">
              <div
                className={`flex h-14 w-10 items-center justify-end gap-1 transition-opacity ${isListening ? "opacity-100" : "opacity-0"}`}
              >
                {[0, 1, 2, 3].map((item) => (
                  <span
                    key={`left-${item}`}
                    className="voice-wave-bar block w-1.5 rounded-full bg-[#efb02e]"
                    style={{
                      height: `${18 + item * 6}px`,
                      animationDelay: `${item * 0.09}s`,
                    }}
                  />
                ))}
              </div>

              <div
                className={`relative flex h-20 w-20 items-center justify-center rounded-full transition ${isListening ? "bg-[#fff3dc] shadow-[0_0_0_12px_rgba(239,176,46,0.14)]" : "bg-[#fff3dc]"}`}
              >
                {isListening ? (
                  <>
                    <span className="voice-ring absolute inset-2 rounded-full border-2 border-[#efb02e]" />
                    <span
                      className="voice-ring absolute inset-1 rounded-full border border-[#157A4F]"
                      style={{ animationDelay: "0.35s" }}
                    />
                  </>
                ) : null}
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#efb02e] text-white shadow-lg transition ${isListening ? "scale-110" : "scale-100"}`}
                >
                  <Mic size={28} />
                </div>
              </div>

              <div
                className={`flex h-14 w-10 items-center justify-start gap-1 transition-opacity ${isListening ? "opacity-100" : "opacity-0"}`}
              >
                {[0, 1, 2, 3].map((item) => (
                  <span
                    key={`right-${item}`}
                    className="voice-wave-bar block w-1.5 rounded-full bg-[#157A4F]"
                    style={{
                      height: `${36 - item * 6}px`,
                      animationDelay: `${item * 0.09 + 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <h2 className="mt-5 text-[22px] font-semibold text-[#1f2933]">
              {isListening ? "Listening..." : "Voice Search"}
            </h2>
            <p className="mt-2 text-[13px] leading-5 text-[#6b7280]">
              {voiceTranscript
                ? "Your search is appearing live in the search bar."
                : "Speak what you want to search."}
            </p>

            <div className="mt-5 min-h-[54px] rounded-[16px] border border-[#ececec] bg-[#fafafa] px-4 py-3 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                {isListening ? "Live transcript" : "Recognized words"}
              </p>
              <p className="mt-1 min-h-6 text-[16px] font-semibold text-[#1f2933] transition-all">
                {voiceTranscript ||
                  (isListening ? "Start speaking..." : "Nothing captured yet")}
                {isListening && !voiceTranscript ? (
                  <span className="ml-1 inline-block animate-pulse text-[#efb02e]">
                    ●
                  </span>
                ) : null}
              </p>
            </div>

            {voiceError ? (
              <p className="mt-3 rounded-[12px] bg-[#fff0f0] px-3 py-2 text-[12px] font-medium text-[#d63f3f]">
                {voiceError}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={closeVoiceModal}
                className="h-10 rounded-full border border-[#e5e7eb] bg-white px-5 text-[13px] font-semibold text-[#4b5563]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={startVoiceSearch}
                className="h-10 rounded-full bg-[#fff7e2] px-5 text-[13px] font-semibold text-[#b77905]"
              >
                Speak Again
              </button>
              <button
                type="button"
                onClick={searchVoiceTranscript}
                disabled={!voiceTranscript.trim()}
                className="h-10 rounded-full bg-[#157A4F] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#a7c8b9]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthRequiredModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        title="Login or Register"
        description="Please log in or create an account to access GOLO listings, chats, posting, and search from the home page."
        redirectTo={pathname || "/"}
      />
    </>
  );
}

export default function Navbar(props) {
  return (
    <Suspense
      fallback={
        <header className="theme-footer shadow-sm sticky top-0 z-[9999] border-b border-gray-200 h-16">
          <div className="w-full px-4 md:px-8 h-16 bg-gray-50 animate-pulse" />
        </header>
      }
    >
      <NavbarContent {...props} />
    </Suspense>
  );
}
