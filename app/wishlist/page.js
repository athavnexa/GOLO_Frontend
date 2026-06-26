"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSidebar from "../components/ProfileSidebar";
import { getWishlistAds, toggleWishlist } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useRoleProtection, LoadingScreen } from "../components/RoleBasedRedirect";
import { Loader2, Heart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { isLoading, isAuthorized } = useRoleProtection("user");
  const router = useRouter();

  const isChojaAd = (item) => {
    if (!item || item._type === "offer") return false;
    if (item.offerId || item.offerPublicId || item.offerRequestId || item.requestId) return false;
    return Boolean(item.adId || item._id || item.title);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return null;
  }

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlistAds();
      if (res.success && Array.isArray(res.data)) {
        // Filter out nulls in case some ads were deleted
        const validAds = res.data.filter(Boolean);

        // Remove any duplicates by ad ID
        const uniqueAds = Array.from(
          new Map(validAds.map(ad => [ad.adId || ad._id, ad])).values()
        );

        const adsOnly = uniqueAds.filter(ad => ad._type !== 'offer');

        setAds(adsOnly);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      const res = await toggleWishlist(wishlistId);
      if (res.success) {
        // Remove from UI — match by the UUID adId that's stored in wishlist
        setAds(prevAds => prevAds.filter(ad => ad.adId !== wishlistId));
      }
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const getSafeImageSrc = (ad) => {
    if (ad?.images && ad.images.length > 0) {
      const src = ad.images[0].trim();
      if (src.startsWith("/") || src.startsWith("http")) return src;
    }
    return "/images/placeholder.webp";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F8F6F2] px-3 py-5 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-4 lg:gap-10">
          
          {/* SIDEBAR */}
          <ProfileSidebar />

          {/* CONTENT */}
          <div className="lg:col-span-3">
            <div className="min-h-[420px] rounded-2xl bg-white p-4 shadow-sm sm:min-h-[500px] sm:rounded-3xl sm:p-10">
              <div className="mb-5 flex items-center justify-between sm:mb-10">
                <h2 className="text-2xl font-semibold text-black sm:text-3xl">
                  My Wishlist
                </h2>
                <span className="text-gray-500 text-sm">
                  {ads.length} {ads.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 size={40} className="animate-spin text-[#157A4F] mb-4" />
                  <p className="text-gray-500">Loading your wishlist...</p>
                </div>
              ) : ads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-8 max-w-md">
                    You haven't added any Choja ads to your wishlist yet. Discover listings and save them for later!
                  </p>
                  <Link href="/choja">
                    <button className="bg-[#157A4F] text-white px-8 py-3 rounded-full font-medium hover:bg-[#0f5c3a] transition-colors">
                      Browse Ads
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                  {ads.map((ad, index) => {
                    // wishlistId: the UUID stored in the wishlist array (for backend toggle & filter)
                    // linkId: used in the URL — prefer UUID, fallback to _id
                    const wishlistId = ad.adId;
                    const linkId = ad.adId || ad._id;
                    const price = ad?.price?.toLocaleString() || "0";
                    const isExternalImage = ad?.images?.length > 0;
                    
                    return (
                      <div key={`${linkId}-${index}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white pt-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        
                        <div className="relative h-48 overflow-hidden px-3 pt-3 sm:h-64 sm:px-4 sm:pt-4">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemove(wishlistId);
                            }}
                            className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition-colors hover:bg-red-50 sm:right-6 sm:top-6 sm:h-10 sm:w-10"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={18} />
                          </button>
                          <Link href={`/product/${linkId}`}>
                            <Image
                              src={getSafeImageSrc(ad)}
                              alt={ad.title || "Product Image"}
                              width={500}
                              height={300}
                              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-500"
                              unoptimized={isExternalImage}
                            />
                          </Link>
                        </div>

                        <div className="flex flex-1 flex-col p-4 sm:p-6">
                          <Link href={`/product/${linkId}`} className="block flex-1">
                            <h3 className="line-clamp-2 text-base font-semibold text-black transition group-hover:text-[#F5B849] sm:text-lg">
                              {ad.title || "Product Name"}
                            </h3>
                            <p className="mt-2 text-lg font-bold text-[#157A4F] sm:text-xl">
                              ₹{price}
                            </p>
                            <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-gray-500 sm:text-sm">
                              <span className="truncate">{ad.location || ad.city || "Location not specified"}</span>
                              <span>•</span>
                              <span>{ad.category || "General"}</span>
                            </div>
                          </Link>

                          <Link href={`/product/${linkId}`} className="mt-4 block sm:mt-6">
                            <button className="w-full rounded-xl bg-[#F5B849] py-2.5 font-medium text-black shadow-sm transition-all duration-300 hover:bg-[#e0a631] hover:shadow-md sm:py-3">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
