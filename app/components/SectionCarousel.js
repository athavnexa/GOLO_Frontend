import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SectionCarousel({ title, products, onItemClick }) {
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
  }, [products]);

  const scrollByAmount = (direction) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

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
            {products.map((item, idx) => {
              // Gracefully handle item formats from backend
              const isShop = !!item.merchantId;
              const itemId = item.id || item._id;
              
              // Backend payload mappings to fit existing ProductCard design
              const imageSrc = item.image || item.imageUrl || (item.images && item.images[0]) || "/images/placeholder.webp";
              const itemTitle = item.title;
              const subtitle = item.subtitle || item.description || item.category || "";
              const badge = item.discountPercent ? `${item.discountPercent}% OFF` : (item.badge || null);
              const buttonLabel = isShop ? "View Store" : "View Deal";

              return (
                <article
                  key={itemId || idx}
                  className="w-full min-w-full max-w-full flex-none snap-start overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] sm:w-auto sm:min-w-[280px] sm:max-w-[280px]"
                >
                  <div className="relative h-[170px] w-full overflow-hidden sm:h-[190px]">
                    <Image
                      src={imageSrc}
                      alt={itemTitle}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#ff8c10] px-2 py-1 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </div>

                  <div className="flex min-h-[145px] flex-col bg-[#ffe1a3] p-4 sm:min-h-[170px]">
                    <h3 className="line-clamp-2 min-h-[48px] text-[17px] font-semibold leading-6 text-[#30343c] sm:min-h-[56px] sm:text-[18px] sm:leading-7">
                      {itemTitle}
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-[40px] text-[12px] leading-5 text-[#7c8492] sm:min-h-[48px]">
                      {subtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => onItemClick && onItemClick(item, idx)}
                      className={`mt-auto h-10 w-full rounded-[7px] text-[13px] font-semibold text-white transition ${
                        isShop
                          ? "bg-[#2f9d3c] hover:bg-[#278531]"
                          : "bg-[#ff9012] hover:bg-[#e57f0c]"
                      }`}
                    >
                      {buttonLabel}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
