"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_ORIGIN_URL, getActiveHomepageBanners } from "../lib/api";

const MAX_SLIDES = 10;

function isRemoteUrl(url) {
  const normalized = String(url || "").trim();
  if (!normalized) return false;
  return /^(https?:\/\/|data:|blob:)/i.test(normalized);
}

function extractBannerImageUrl(item) {
  if (!item) return null;
  if (typeof item === "string") return item;
  return (
    item.imageUrl ||
    item.imageURL ||
    item.bannerImageUrl ||
    item.bannerImageURL ||
    item.bannerImage ||
    item.image ||
    null
  );
}

function normalizeImageUrl(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return null;
  if (/^(data:|blob:)/i.test(url)) return url;
  if (isRemoteUrl(url) || url.startsWith("/")) return url;

  // If backend stored a relative path, prefer prefixing with configured API URL.
  const apiBase = API_ORIGIN_URL;
  if (apiBase) {
    const base = apiBase.replace(/\/$/, "");
    const path = url.replace(/\\/g, "/").replace(/^\//, "");
    return `${base}/${path}`;
  }

  return url.replace(/\\/g, "/");
}

function extractMerchantId(item) {
  const raw = String(item?.merchantId || "").trim();
  if (raw && !raw.startsWith("shop-")) {
    return raw;
  }
  return "";
}

function parseDateValue(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getBannerDisplayStatus(item) {
  const rawStatus = String(item?.status || "").trim().toLowerCase();
  if (rawStatus === "rejected") return "rejected";
  if (rawStatus === "under_review" || rawStatus === "pending") return "under_review";

  const startDate = parseDateValue(item?.startDate || item?.start || item?.start_date);
  const endDate = parseDateValue(item?.endDate || item?.end || item?.end_date);
  const now = new Date();

  if (startDate && now < startDate) return "upcoming";
  if (endDate && now > endDate) return "expired";
  if (rawStatus === "active" || rawStatus === "approved") return "active";
  if (!startDate && !endDate) return rawStatus || "active";
  return "active";
}

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const failedUrlsRef = useRef(new Set());

  const searchParams = useSearchParams();
  const urlLocation = searchParams ? searchParams.get("location") : "";

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageBanners() {
      try {
        if (isMounted) {
          setLoading(true);
        }

        let city = "";
        let fullLocation = "";
        let labelStr = urlLocation || "";

        try {
          const stored = localStorage.getItem("golo_current_location");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.city) {
              // Use the exact city provided by the GPS/Location API
              city = parsed.city;
            }
            if (parsed?.fullLocation) {
              fullLocation = parsed.fullLocation;
            } else if (parsed?.label) {
              fullLocation = parsed.label;
            }
            if (!labelStr) {
              labelStr = parsed?.label || "";
            }
          }
        } catch (e) {
          console.warn("Failed to parse city location from localStorage", e);
        }

        // If no explicit city was found in storage, fallback to parsing the label
        if (!city && labelStr) {
          // Extract the most significant area (usually at the end of the short label)
          const parts = labelStr.split(",");
          city = parts[parts.length - 1].trim();
        }

        // Always pass the most complete string we have as fullLocation
        const locationToSend = fullLocation || labelStr || city;

        const res = await getActiveHomepageBanners(MAX_SLIDES, city, locationToSend);

        const bannerCandidate =
          res?.data?.data ??
          res?.data?.rows ??
          res?.data ??
          res?.rows ??
          res;

        const rows = Array.isArray(bannerCandidate)
          ? bannerCandidate
          : Array.isArray(bannerCandidate?.rows)
            ? bannerCandidate.rows
            : [];

        if (process.env.NODE_ENV !== "production") {
          // Helps quickly confirm if backend is returning data at all.
          console.log("[Hero] Active banners response:", res);
          console.log("[Hero] Active banners rows:", rows);
        }

        const dynamicSlides = rows
          .filter((item) => getBannerDisplayStatus(item) === "active")
          .map((item) => {
            const imageUrl = normalizeImageUrl(extractBannerImageUrl(item));
            if (!imageUrl) return null;

            const merchantId = extractMerchantId(item);
            const href = merchantId
              ? `/nearby-deals/store?merchantId=${encodeURIComponent(merchantId)}`
              : null;

            return {
              url: imageUrl,
              href,
              id: item._id || item.id,
              rawTitle: item.bannerTitle || "",
            };
          })
          .filter(Boolean);

        let finalSlides = [...dynamicSlides];
        const platformBanners = [
          { url: "/images/platform-banners/platform_banner_1.png", href: null },
          { url: "/images/platform-banners/platform_banner_2.png", href: null },
          { url: "/images/platform-banners/platform_banner_3.jpg", href: null },
          { url: "/images/platform-banners/platform_banner_4.png", href: null },
        ];

        let i = 0;
        while (finalSlides.length < MAX_SLIDES && platformBanners.length > 0) {
          finalSlides.push({ ...platformBanners[i % platformBanners.length], isFallback: true, id: `fallback_${i}` });
          i++;
        }

        if (isMounted) {
          const clamped = finalSlides.slice(0, MAX_SLIDES);
          setSlides(clamped);
          setDebugInfo(`Showing ${clamped.length} banners`);
          setCurrent(0);
        }
      } catch (error) {
        if (isMounted) {
          console.error("[Hero] Error loading approved banners:", error);
          setDebugInfo(`Error: ${error?.message || "Failed to load banners"}`);
          setSlides([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHomepageBanners();

    window.addEventListener('locationUpdated', loadHomepageBanners);

    return () => {
      isMounted = false;
      window.removeEventListener('locationUpdated', loadHomepageBanners);
    };
  }, [urlLocation]);

  // Auto slide
  useEffect(() => {
    if (!slides.length || isHovered) return;
    if (current >= slides.length) {
      setCurrent(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides, isHovered, current]);

  const handleNext = () => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getSlideClasses = (index, current, length) => {
    if (length <= 1) return "opacity-100 z-30 scale-100 translate-x-0 rounded-[20px] sm:rounded-[32px] shadow-2xl";

    const diff = (index - current + length) % length;
    
    if (diff === 0) {
      // Active slide (Center)
      return "opacity-100 z-30 scale-100 translate-x-0 rounded-[20px] sm:rounded-[32px] shadow-2xl";
    } else if (diff === 1) {
      // Next slide (Right)
      return "opacity-60 z-20 scale-[0.80] translate-x-[94%] blur-[2px] rounded-[20px] sm:rounded-[32px] cursor-pointer hover:opacity-80";
    } else if (diff === length - 1) {
      // Prev slide (Left)
      return "opacity-60 z-20 scale-[0.80] -translate-x-[94%] blur-[2px] rounded-[20px] sm:rounded-[32px] cursor-pointer hover:opacity-80";
    } else {
      // Hidden slides
      return "opacity-0 z-10 scale-50 translate-x-0 rounded-[20px] sm:rounded-[32px] pointer-events-none";
    }
  };

  const handleImageError = (url) => {
    const normalized = String(url || "");
    if (!normalized) return;
    if (failedUrlsRef.current.has(normalized)) return;
    failedUrlsRef.current.add(normalized);

    if (process.env.NODE_ENV !== "production") {
      console.warn("[Hero] Failed to load banner image:", normalized);
    }

    setSlides((prev) => {
      const next = prev.filter((slide) => slide.url !== normalized);
      return next;
    });
  };

  const imageClassName =
    "absolute inset-0 h-full w-full object-cover object-center rounded-[20px] sm:rounded-[32px]";

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-[#F8F6F2]">
        <div className="relative h-[170px] w-full bg-[#ece9e1] sm:h-[360px] sm:aspect-auto md:h-[530px]" />
      </section>
    );
  }

  if (!slides.length) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <section className="relative w-full overflow-hidden bg-[#F8F6F2]">
          <div className="relative w-full h-[220px] flex items-center justify-center text-[12px] text-gray-600">
            {debugInfo || "No approved banners returned by API"}
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#F8F6F2]">

      {/* Carousel Wrapper */}
      <div 
        className="relative flex items-center justify-center w-full h-[200px] sm:h-[380px] md:h-[550px] overflow-hidden px-4 sm:px-10 py-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
          {slides.map((slide, index) => {
            const isActive = index === current;
            const diff = (index - current + slides.length) % slides.length;
            const isClickableSide = diff === 1 || diff === slides.length - 1;

            return (
              <div
                key={index}
                onClick={isClickableSide ? () => setCurrent(index) : undefined}
                className={`absolute w-[90%] sm:w-[90%] max-w-[1250px] h-full transition-all duration-700 ease-in-out ${getSlideClasses(index, current, slides.length)}`}
              >
                {/* Dark Overlay for non-active slides */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/30 rounded-[20px] sm:rounded-[32px] z-10 pointer-events-none transition-opacity duration-700"></div>
                )}
                
                {slide.href ? (
                  <Link
                    href={isActive ? slide.href : '#'}
                    className={`absolute inset-0 block ${isActive ? 'cursor-pointer' : 'cursor-default'}`}
                    aria-label={`Open merchant store for banner ${index + 1}`}
                    onClick={(e) => {
                      if (!isActive) e.preventDefault(); // Prevent navigating if clicking side slide
                    }}
                  >
                    {isRemoteUrl(slide.url) ? (
                      <img
                        src={slide.url}
                        alt={`Slide ${index + 1}`}
                        className={imageClassName}
                        loading={index === 0 ? "eager" : "lazy"}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(slide.url)}
                      />
                    ) : (
                      <Image
                        src={slide.url}
                        alt={`Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover object-center rounded-[20px] sm:rounded-[32px]"
                        onError={() => handleImageError(slide.url)}
                      />
                    )}
                  </Link>
                ) : (
                  <div className="absolute inset-0 block">
                    {isRemoteUrl(slide.url) ? (
                      <img
                        src={slide.url}
                        alt={`Slide ${index + 1}`}
                        className={imageClassName}
                        loading={index === 0 ? "eager" : "lazy"}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(slide.url)}
                      />
                    ) : (
                      <Image
                        src={slide.url}
                        alt={`Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover object-center rounded-[20px] sm:rounded-[32px]"
                        onError={() => handleImageError(slide.url)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 md:left-6 lg:left-8 z-40 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={24} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-2 sm:right-4 md:right-6 lg:right-8 z-40 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight size={24} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
              </button>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
