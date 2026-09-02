"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, Clock, Store, Tag } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import { getHomepageRecommendations } from "./lib/api";

function formatValidityText(endDate, fallbackText = "") {
  if (!endDate) return fallbackText;
  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    return typeof endDate === "string" ? endDate : fallbackText;
  }
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Ends Today";
  if (diffDays === 1) return "Ends Tomorrow";
  if (diffDays <= 7) return `Ends in ${diffDays} days`;
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `Valid till ${end.getDate()} ${months[end.getMonth()]}`;
}

function SectionSkeleton({ title }) {
  return (
    <section className="border-t border-[#bcc4cf] bg-[#f4f4f4] py-7 sm:py-10">
      <div className="mx-auto max-w-[1260px] px-4 lg:px-6">
        <div className="mb-5 h-8 w-56 animate-pulse rounded-full bg-[#e2e8f0]" />
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={`${title}-skeleton-${index}`}
              className="flex-none overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] w-[260px] min-w-[260px] max-w-[260px] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] md:w-[250px] md:min-w-[250px] md:max-w-[250px] lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px] flex flex-col"
            >
              <div className="relative h-[150px] sm:h-[180px] w-full animate-pulse bg-[#dbe3ed]" />
              <div className="flex flex-1 flex-col justify-between bg-[#ffe1a3] p-3 sm:p-3.5 gap-2 min-h-[165px]">
                <div className="space-y-2">
                  <div className="h-5 w-4/5 animate-pulse rounded bg-[#f4d77f]" />
                  <div className="h-3.5 w-3/5 animate-pulse rounded bg-[#f4d77f]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#f4d77f]" />
                </div>
                <div className="pt-2 border-t border-[#f0cf85] space-y-2">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[#f4d77f]" />
                  <div className="h-8.5 w-full animate-pulse rounded-[7px] bg-[#ffd16c]" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionCarousel({ title, items, onItemClick }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateState = () => {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1
      );
    };

    updateState();
    element.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      element.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [items]);

  const scrollByAmount = (direction) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="border-t border-[#bcc4cf] bg-[#f4f4f4] py-7 sm:py-10">
      <div className="mx-auto max-w-[1260px] px-4 lg:px-6">
        <h2 className="mb-5 text-[22px] font-semibold text-[#343943] sm:text-[28px]">
          {title}
        </h2>

        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1f2937] shadow-[0_10px_30px_rgba(15,23,42,0.18)] hover:bg-white transition sm:-left-5 sm:h-11 sm:w-11"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1f2937] shadow-[0_10px_30px_rgba(15,23,42,0.18)] hover:bg-white transition sm:-right-5 sm:h-11 sm:w-11"
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight size={22} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => (
              <article
                key={item.id}
                onClick={() => onItemClick(item)}
                className="group cursor-pointer flex-none snap-start overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-all duration-300 w-[260px] min-w-[260px] max-w-[260px] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] md:w-[250px] md:min-w-[250px] md:max-w-[250px] lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px] flex flex-col"
              >
                <div className="relative h-[150px] sm:h-[180px] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    unoptimized
                  />

                  {item.badge && (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-[#ff6b00] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                      <Tag size={10} className="stroke-[2.5]" />
                      {item.badge}
                    </span>
                  )}

                  {item.validityText && (
                    <div className="absolute right-2.5 bottom-2.5 rounded-full bg-black/65 backdrop-blur-sm px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white flex items-center gap-1 shadow-sm max-w-[80%] truncate">
                      <Clock size={10} className="shrink-0 text-[#f5b849]" />
                      <span className="truncate">{item.validityText}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between bg-[#ffe1a3] p-3 sm:p-3.5 gap-1.5 min-h-[165px]">
                  <div>
                    <h3
                      title={item.title}
                      className="line-clamp-1 text-[14px] sm:text-[16px] font-bold leading-tight text-[#222730] tracking-tight group-hover:text-[#157A4F] transition-colors"
                    >
                      {item.title}
                    </h3>

                    {item.merchantName && (
                      <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-semibold text-[#5c4a1e] truncate mt-1">
                        <Store size={12} className="shrink-0 text-[#8c7438]" />
                        <span className="truncate">{item.merchantName}</span>
                      </div>
                    )}

                    {item.location && (
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#786432] truncate mt-0.5">
                        <MapPin size={11} className="shrink-0 text-[#d97706]" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1.5 border-t border-[#f0cf85]">
                    <div className="flex items-baseline justify-between gap-1">
                      {item.price !== null && item.price !== undefined && Number(item.price) > 0 ? (
                        <div className="flex items-baseline gap-1.5 truncate">
                          <span className="text-[15px] sm:text-[17px] font-extrabold text-[#157A4F]">
                            ₹{Number(item.price).toLocaleString()}
                          </span>
                          {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                            <span className="text-[11px] sm:text-[12px] text-[#8c7438] line-through font-medium">
                              ₹{Number(item.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] sm:text-[12px] font-bold text-[#157A4F] truncate">
                          {item.type === 'shop' ? 'Visit Store' : 'Special Offer'}
                        </span>
                      )}

                      {item.discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-[#b45309] bg-[#fde68a] px-1.5 py-0.5 rounded shrink-0">
                          {item.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                      className="mt-2 h-8 sm:h-9 w-full rounded-[7px] bg-[#2f9d3c] hover:bg-[#258330] active:scale-[0.99] text-[12px] sm:text-[13px] font-semibold text-white transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>{item.buttonLabel}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicSections, setDynamicSections] = useState([]);
  const [isLoadingRows, setIsLoadingRows] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, getUserAccountType } = useAuth();
  const selectedLocation = searchParams.get("location") || "";
  const selectedQuery = searchParams.get("q") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";

  useEffect(() => {
    if (!loading && user) {
      const accountType = user?.accountType || getUserAccountType();
      if (accountType === "merchant") {
        router.replace("/merchant/dashboard");
      }
    }
  }, [user, loading, router, getUserAccountType]);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageRows() {
      setIsLoadingRows(true);
      try {
        const response = await getHomepageRecommendations({
            location: selectedLocation || undefined,
            q: selectedQuery || undefined,
            lat: lat || undefined,
            lng: lng || undefined,
        });

        if (cancelled) return;

        if (Array.isArray(response)) {
            const mappedSections = response.map(section => ({
                ...section,
                items: (section.products || []).map((p, index) => {
                    const isShop = p.type === 'shop';
                    const merchantName = p.merchantName || p.merchant?.name || p.merchant?.storeName || (isShop ? p.title : "");
                    const location = p.storeLocation || p.merchantLocation || p.location || p.city || p.merchant?.storeLocation || p.merchant?.city || "";
                    const price = p.price !== undefined && p.price !== null && p.price !== "" ? Number(p.price) : null;
                    const originalPrice = p.originalPrice !== undefined && p.originalPrice !== null && p.originalPrice !== "" ? Number(p.originalPrice) : null;
                    const discountPercent = p.discountPercent !== undefined && Number(p.discountPercent) > 0 
                      ? Number(p.discountPercent) 
                      : (price && originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
                    const validityText = formatValidityText(p.endDate || p.validUntil || p.expiryDate || p.promotionExpiryText, "");

                    return {
                        id: p.id || p.offerId || p.merchantId || `item-${index}`,
                        offerId: p.offerId || p.id,
                        merchantId: p.merchantId || p.merchant?.merchantId,
                        title: p.title || "Special Offer",
                        subtitle: p.description || p.subtitle || "",
                        merchantName,
                        location,
                        price,
                        originalPrice,
                        discountPercent,
                        validityText,
                        image: p.imageUrl || p.image || (Array.isArray(p.images) && p.images[0]) || "/images/placeholder.webp",
                        badge: discountPercent > 0 ? `${discountPercent}% OFF` : (p.promoTag || p.badge || ""),
                        buttonLabel: isShop ? "View Store" : "View Deal",
                        type: p.type || 'deal'
                    };
                })
            }));
            
            setDynamicSections(mappedSections.filter(s => s.items.length > 0));
        } else {
            setDynamicSections([]);
        }
      } catch (err) {
        if (!cancelled) {
          setDynamicSections([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRows(false);
        }
      }
    }

    loadHomepageRows();

    return () => {
      cancelled = true;
    };
  }, [selectedLocation, selectedQuery, lat, lng]);

  const handleShopClick = (item) => {
    if (!item?.merchantId) return;
    router.push(`/nearby-deals/store?merchantId=${encodeURIComponent(item.merchantId)}`);
  };

  const handleDealClick = (item) => {
    if (!item?.offerId) return;
    router.push(`/nearby-deals/deal?offerId=${encodeURIComponent(item.offerId)}`);
  };

  return (
    <>
      <style>{`
        .homepage-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <main className="min-h-screen bg-[#f4f4f4]">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryBar
          variant="golocal"
          preferredCategories={user?.preferredCategories || []}
        />

        <div className="bg-[#f4c035]">
          <Hero />
        </div>

        {isLoadingRows ? (
          <>
            <SectionSkeleton title="Loading..." />
            <SectionSkeleton title="Loading..." />
            <SectionSkeleton title="Loading..." />
          </>
        ) : (
          <>
            {dynamicSections.map((section, idx) => (
                <SectionCarousel
                  key={section.key || idx}
                  title={section.title}
                  items={section.items}
                  onItemClick={(item) => {
                      if (item.type === 'shop') handleShopClick(item);
                      else handleDealClick(item);
                  }}
                />
            ))}
          </>
        )}

        <Footer />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4f4f4]" />}>
      <HomeContent />
    </Suspense>
  );
}
