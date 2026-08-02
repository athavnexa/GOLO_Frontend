"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import { getHomeSectionConfig, getNearbyOffers, getHomepageRecommendations } from "./lib/api";

const SHOP_FALLBACKS = [
  {
    id: "shop-1",
    merchantId: "shop-1",
    title: "Moon Cafe",
    subtitle: "Get the latest smart watch with advanced health tracking.",
    image: "/images/place1.jpg",
    buttonLabel: "View Store",
    type: "shop",
  },
  {
    id: "shop-2",
    merchantId: "shop-2",
    title: "Luxury Spa Package",
    subtitle: "Relax and rejuvenate with our exclusive spa treatments.",
    image: "/images/deal2.jpg",
    buttonLabel: "View Store",
    type: "shop",
  },
  {
    id: "shop-3",
    merchantId: "shop-3",
    title: "Fashion Apparel Sale",
    subtitle: "Discover the latest trends in fashion wear.",
    image: "/images/deal3.jpg",
    buttonLabel: "View Store",
    type: "shop",
  },
  {
    id: "shop-4",
    merchantId: "shop-4",
    title: "Weekend Getaway",
    subtitle: "Book your perfect weekend getaway at unbeatable prices.",
    image: "/images/place4.jpg",
    buttonLabel: "View Store",
    type: "shop",
  },
];

const DEAL_FALLBACKS = [
  {
    id: "deal-1",
    offerId: "deal-1",
    title: "Smart Watch Pro",
    subtitle: "Get the latest smart watch with advanced health tracking.",
    image: "/images/del1.webp",
    badge: "50% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-2",
    offerId: "deal-2",
    title: "Luxury Spa Package",
    subtitle: "Relax and rejuvenate with our exclusive spa treatments.",
    image: "/images/deal2.jpg",
    badge: "30% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-3",
    offerId: "deal-3",
    title: "Fashion Apparel Sale",
    subtitle: "Discover the latest trends in fashion wear.",
    image: "/images/deal3.jpg",
    badge: "25% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-4",
    offerId: "deal-4",
    title: "Weekend Getaway",
    subtitle: "Book your perfect weekend getaway at unbeatable prices.",
    image: "/images/deal4.jpg",
    badge: "40% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-5",
    offerId: "deal-5",
    title: "Smart TV",
    subtitle: "Get the latest smart watch with advanced health tracking.",
    image: "/images/tv.jpg",
    badge: "50% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-6",
    offerId: "deal-6",
    title: "Bazaar Special",
    subtitle: "Discover the latest trends in fashion wear.",
    image: "/images/banner1.jpg",
    badge: "25% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-7",
    offerId: "deal-7",
    title: "Movie Fair",
    subtitle: "Get the latest smart watch with advanced health tracking.",
    image: "/images/hero.jpg",
    badge: "50% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-8",
    offerId: "deal-8",
    title: "Foodie Sale",
    subtitle: "Relax and rejuvenate with our exclusive spa treatments.",
    image: "/images/place2.avif",
    badge: "30% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-9",
    offerId: "deal-9",
    title: "Sweet Day Sale",
    subtitle: "Discover the latest trends in fashion wear.",
    image: "/images/deal1.jpg",
    badge: "25% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
  {
    id: "deal-10",
    offerId: "deal-10",
    title: "Weekend Special",
    subtitle: "Book your perfect weekend getaway at unbeatable prices.",
    image: "/images/place4.jpg",
    badge: "40% OFF",
    buttonLabel: "View Deal",
    type: "deal",
  },
];

function normalizeOffers(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.offers)) return response.data.offers;
  if (Array.isArray(response?.offers)) return response.offers;
  return [];
}

function buildShopCards(offers = []) {
  const seen = new Set();
  const shops = [];

  offers.forEach((offer, index) => {
    const merchantId = String(
      offer?.merchant?.merchantId ||
        offer?.merchantId ||
        offer?.merchant?._id ||
        offer?.merchant?.id ||
        ""
    ).trim();

    if (!merchantId || seen.has(merchantId)) return;
    seen.add(merchantId);

    shops.push({
      id: `shop-${merchantId}`,
      merchantId,
      title: offer?.merchant?.name || offer?.title || `Popular Shop ${index + 1}`,
      subtitle:
        offer?.description ||
        offer?.merchant?.address ||
        "Discover offers and products from this store.",
      image:
        offer?.merchant?.profilePhoto ||
        offer?.imageUrl ||
        offer?.images?.[0] ||
        SHOP_FALLBACKS[index % SHOP_FALLBACKS.length].image,
      buttonLabel: "View Store",
      type: "shop",
    });
  });

  return shops;
}

function buildDealCards(offers = []) {
  return offers
    .map((offer, index) => {
      const offerId = String(offer?.offerId || offer?._id || offer?.id || "").trim();
      if (!offerId) return null;

      const discountPercent = Number(offer?.discountPercent || 0);
      const fallback = DEAL_FALLBACKS[index % DEAL_FALLBACKS.length];

      return {
        id: `deal-${offerId}`,
        offerId,
        title: offer?.title || fallback.title,
        subtitle:
          offer?.description ||
          offer?.merchant?.name ||
          fallback.subtitle,
        image:
          offer?.imageUrl ||
          offer?.images?.[0] ||
          fallback.image,
        badge:
          discountPercent > 0
            ? `${discountPercent}% OFF`
            : fallback.badge,
        buttonLabel: "View Deal",
        type: "deal",
      };
    })
    .filter(Boolean);
}

function SectionSkeleton({ title }) {
  return (
    <section className="border-t border-[#bcc4cf] bg-[#f4f4f4] py-10">
      <div className="mx-auto max-w-[1260px] px-4 lg:px-6">
        <div className="mb-5 h-8 w-56 animate-pulse rounded-full bg-[#e2e8f0]" />
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={`${title}-skeleton-${index}`}
              className="flex-none overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] w-[260px] min-w-[260px] max-w-[260px] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] md:w-[240px] md:min-w-[240px] md:max-w-[240px] lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px]"
            >
              <div className="relative h-[140px] sm:h-[190px] md:h-[160px] lg:h-[190px] w-full animate-pulse bg-[#dbe3ed]" />
              <div className="flex min-h-[135px] sm:min-h-[170px] flex-col gap-4 bg-[#ffe1a3] p-3 sm:p-4">
                <div className="h-5 sm:h-6 w-4/5 animate-pulse rounded-full bg-[#f4d77f]" />
                <div className="h-3 sm:h-4 w-full animate-pulse rounded-full bg-[#f4d77f]" />
                <div className="h-3 sm:h-4 w-5/6 animate-pulse rounded-full bg-[#f4d77f]" />
                <div className="mt-auto h-9 sm:h-10 w-full animate-pulse rounded-[7px] bg-[#ffd16c]" />
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
              className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1f2937] shadow-[0_10px_30px_rgba(15,23,42,0.18)] sm:-left-5 sm:h-11 sm:w-11"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1f2937] shadow-[0_10px_30px_rgba(15,23,42,0.18)] sm:-right-5 sm:h-11 sm:w-11"
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
                className="flex-none snap-start overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] w-[260px] min-w-[260px] max-w-[260px] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] md:w-[240px] md:min-w-[240px] md:max-w-[240px] lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px]"
              >
                <div className="relative h-[140px] sm:h-[190px] md:h-[160px] lg:h-[190px] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {item.type === "deal" && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#ff8c10] px-2 py-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="flex min-h-[135px] sm:min-h-[170px] flex-col bg-[#ffe1a3] p-3 sm:p-4">
                  <h3 className="line-clamp-2 min-h-[40px] sm:min-h-[56px] text-[15px] sm:text-[18px] font-semibold leading-5 sm:leading-7 text-[#30343c]">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 min-h-[36px] sm:min-h-[48px] text-[11px] sm:text-[12px] leading-4 sm:leading-5 text-[#7c8492]">
                    {item.subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={() => onItemClick(item)}
                    className={`mt-auto h-9 sm:h-10 w-full rounded-[7px] text-[12px] sm:text-[13px] font-semibold text-white transition ${
                      item.type === "shop"
                        ? "bg-[#2f9d3c] hover:bg-[#278531]"
                        : "bg-[#2f9d3c] hover:bg-[#278531]"
                    }`}
                  >
                    {item.buttonLabel}
                  </button>
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
        });

        if (cancelled) return;

        if (Array.isArray(response)) {
            const mappedSections = response.map(section => ({
                ...section,
                items: section.products.map((p, index) => {
                    const fallback = DEAL_FALLBACKS[index % DEAL_FALLBACKS.length];
                    return {
                        id: p.id,
                        offerId: p.offerId,
                        merchantId: p.merchantId,
                        title: p.title || fallback.title,
                        subtitle: p.merchantName || p.category || p.subtitle || fallback.subtitle,
                        image: p.imageUrl || p.image || fallback.image,
                        badge: p.discountPercent > 0 ? `${p.discountPercent}% OFF` : p.badge || fallback.badge,
                        buttonLabel: p.type === 'shop' ? "View Store" : "View Deal",
                        type: p.type || 'deal'
                    };
                })
            }));
            
            // Only keep sections that actually have items
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
  }, [selectedLocation, selectedQuery]);

  const handleShopClick = (item) => {
    if (!item?.merchantId || String(item.merchantId).startsWith("shop-")) return;
    router.push(`/nearby-deals/store?merchantId=${encodeURIComponent(item.merchantId)}`);
  };

  const handleDealClick = (item) => {
    if (!item?.offerId || String(item.offerId).startsWith("deal-")) return;
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
