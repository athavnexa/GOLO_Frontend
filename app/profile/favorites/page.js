"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Heart, MapPin, ChevronDown, SlidersHorizontal, Compass } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { getWishlistAds, toggleWishlist } from "../../lib/api";

const OFFER_TYPES = [
  "All",
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

const DISTANCE_OPTIONS = [
  { label: "Distance: Any", value: "all" },
  { label: "1-10 km", value: "1-10" },
  { label: "10-20 km", value: "10-20" },
  { label: "20-30 km", value: "20-30" },
  { label: "30+ km", value: "30+" },
];

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);
  if (!Number.isFinite(nLat1) || !Number.isFinite(nLon1) || !Number.isFinite(nLat2) || !Number.isFinite(nLon2)) return null;

  const R = 6371; // km
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GolocalFavoritesPage() {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistance, setSelectedDistance] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Default fallback coordinates if user denies permission
          setUserLocation({ latitude: 18.5204, longitude: 73.8567 });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlistAds();
      if (res?.success && Array.isArray(res.data)) {
        const validAds = res.data.filter(Boolean);
        const uniqueAds = Array.from(
          new Map(validAds.map(ad => [ad.adId || ad._id, ad])).values()
        );
        setAds(uniqueAds);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = useMemo(() => {
    if (!ads) return [];
    let list = [...ads];

    if (activeTab === "deals") {
      list = list.filter(ad => ad._type === 'offer');
    }

    // Category / Offer Type Filter
    if (selectedCategory && selectedCategory !== "All") {
      const matchKey = selectedCategory.toLowerCase();
      list = list.filter(ad => {
        const tag = String(ad.promoTag || "").toLowerCase();
        const cat = String(ad.category || "").toLowerCase();
        const title = String(ad.title || "").toLowerCase();
        const desc = String(ad.description || "").toLowerCase();

        return (
          tag.includes(matchKey) ||
          cat.includes(matchKey) ||
          title.includes(matchKey) ||
          desc.includes(matchKey)
        );
      });
    }

    // Distance Filter
    if (selectedDistance && selectedDistance !== "all" && userLocation) {
      list = list.filter(ad => {
        const adLat = ad.storeLocationLatitude ?? ad.latitude;
        const adLng = ad.storeLocationLongitude ?? ad.longitude;
        const dist = calculateDistanceKm(userLocation.latitude, userLocation.longitude, adLat, adLng);

        if (dist === null) return true; // Keep if coordinates not available

        if (selectedDistance === "1-10") return dist <= 10;
        if (selectedDistance === "10-20") return dist > 10 && dist <= 20;
        if (selectedDistance === "20-30") return dist > 20 && dist <= 30;
        if (selectedDistance === "30+") return dist > 30;
        return true;
      });
    }

    return list;
  }, [ads, activeTab, selectedCategory, selectedDistance, userLocation]);

  const getSafeImageSrc = (ad) => {
    if (ad?.images?.length > 0) {
      const src = ad.images[0].trim();
      if (src.startsWith("/") || src.startsWith("http")) return src;
    }
    if (ad?.imageUrl) return ad.imageUrl;
    return "/images/placeholder.webp";
  };

  const formatPrice = (ad) => {
    const price = Number(ad.price || ad.totalPrice || 0);
    return price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Price on request";
  };

  const getItemTag = (ad) => {
    if (ad.promoTag) return ad.promoTag;
    if (ad._type === 'offer') return 'Offer';
    if (ad.status === "active") return "Active";
    if (ad.status === "pending") return "Pending";
    if (ad.status === "rejected") return "Rejected";
    if (ad.isPromoted) return "Promoted";
    return "Saved";
  };

  const getItemLink = (ad) => {
    return `/nearby-deals/deal?offerId=${ad.adId || ad._id}`;
  };

  return (
    <>
      <Navbar />

      <div className="relative z-10 min-h-screen bg-transparent pt-10 md:pt-14">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="md:mt-8">
              <h1 className="text-[34px] leading-none font-semibold text-[#1f1f1f]">Your Favorites</h1>
              <p className="mt-2 text-[13px] text-[#6f6f6f]">
                {loading ? "Loading..." : `${filteredAds.length} item${filteredAds.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-1 bg-[#f8f8f8] border border-[#e5e5e5] rounded-xl p-1">
              {["all", "deals"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize ${
                    activeTab === tab
                      ? "bg-[#157a4f] text-white shadow-sm"
                      : "text-[#707070] hover:bg-gray-100"
                  }`}
                >
                  {tab === "all" ? "All" : "Deals"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category / Offer Type Dropdown */}
                <div className="relative inline-flex items-center">
                  <SlidersHorizontal size={14} className="absolute left-3 text-[#157a4f] pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 pl-8 pr-8 rounded-xl border border-[#e5e5e5] bg-white text-sm text-[#5d5d5d] font-medium outline-none transition focus:border-[#157a4f] appearance-none cursor-pointer hover:bg-gray-50"
                  >
                    {OFFER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type === "All" ? "Category: All" : type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 text-[#777] pointer-events-none" />
                </div>

                {/* Distance Dropdown */}
                <div className="relative inline-flex items-center">
                  <Compass size={14} className="absolute left-3 text-[#157a4f] pointer-events-none" />
                  <select
                    value={selectedDistance}
                    onChange={(e) => setSelectedDistance(e.target.value)}
                    className="h-10 pl-8 pr-8 rounded-xl border border-[#e5e5e5] bg-white text-sm text-[#5d5d5d] font-medium outline-none transition focus:border-[#157a4f] appearance-none cursor-pointer hover:bg-gray-50"
                  >
                    {DISTANCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 text-[#777] pointer-events-none" />
                </div>
              </div>

              <div className="text-sm text-[#8a8a8a] inline-flex items-center gap-4">
                <span>Showing {filteredAds.length} result{filteredAds.length !== 1 ? 's' : ''}</span>
                <span className="text-[#3f3f3f] font-semibold">Sort: Recently Saved</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-10 flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#157a4f] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Loading your favorites...</p>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Heart size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {activeTab === "all" ? "Your favorites list is empty" : "No deals saved yet"}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md">
                {activeTab === "all"
                  ? "Start exploring and save your favorite deals!"
                  : "Save some deals to see them here."}
              </p>
              <Link href="/nearby-deals" className="bg-[#157a4f] text-white px-8 py-3 rounded-full font-medium hover:bg-[#0f5c3a] transition-colors inline-flex items-center justify-center">
                Explore Deals
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {filteredAds.map((ad, idx) => {
                const locationText =
                  [ad.city, ad.state].filter(Boolean).join(", ") ||
                  ad.location ||
                  ad.storeLocation ||
                  ad.merchant?.storeLocation ||
                  ad.merchant?.address ||
                  ad.merchantLocation ||
                  ad.area ||
                  "Nearby Store";

                const tag = getItemTag(ad);
                const itemLink = getItemLink(ad);

                const adLat = ad.storeLocationLatitude ?? ad.latitude;
                const adLng = ad.storeLocationLongitude ?? ad.longitude;
                const calculatedDist = userLocation ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, adLat, adLng) : null;

                return (
                  <div key={`${ad.adId || ad._id}-${idx}`} className="rounded-xl border border-[#e8e8e8] bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="relative h-28 shrink-0">
                      <Image
                        src={getSafeImageSrc(ad)}
                        alt={ad.title || "Saved item"}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-semibold rounded-full bg-white/95 px-2.5 py-0.5 text-[#333] shadow-sm">
                        {tag}
                      </span>
                      {calculatedDist !== null && (
                        <span className="absolute top-2 right-2 text-[10px] font-semibold rounded-full bg-[#157a4f] text-white px-2 py-0.5 shadow-sm">
                          {calculatedDist < 1 ? `${(calculatedDist * 1000).toFixed(0)}m` : `${calculatedDist.toFixed(1)}km`}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#9a9a9a]">
                          <span className="truncate max-w-[110px] font-medium">{ad.category || (ad._type === 'offer' ? 'Deal' : 'Category')}</span>
                          <span className="inline-flex items-center gap-1 truncate max-w-[110px]" title={locationText}>
                            <MapPin size={11} className="shrink-0 text-[#157a4f]" /> {locationText.split(",")[0]}
                          </span>
                        </div>
                        <h3 className="mt-1 text-[15px] font-semibold text-[#262626] leading-tight line-clamp-2" title={ad.title}>
                          {ad.title || "Untitled Listing"}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-[#157a4f]">{formatPrice(ad)}</p>
                      </div>

                      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#f2f2f2]">
                        <Link
                          href={itemLink}
                          className="flex-1 h-9 rounded-lg bg-[#157a4f] text-white text-sm font-semibold flex items-center justify-center hover:bg-[#0f5c3a] transition"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={async () => {
                            try {
                              await toggleWishlist(ad.adId || ad._id);
                              setAds(prev => prev.filter(a => (a.adId || a._id) !== (ad.adId || a._id)));
                            } catch (err) {
                              console.error("Remove failed", err);
                            }
                          }}
                          className="w-9 h-9 rounded-lg border border-[#cde6da] text-[#157a4f] flex items-center justify-center hover:bg-[#f0fdf4] transition shrink-0"
                          title="Remove from favorites"
                        >
                          <Heart size={14} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
