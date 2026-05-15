"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({ images = [], alt = "Product" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-rotate images every 3 seconds with infinity loop
  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images]);

  const handlePrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Show single image if no images array or empty
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[400px] lg:h-[500px] bg-[#f0f0f0] rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-sm text-[#666]">No images available</div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] bg-[#f0f0f0] rounded-xl overflow-hidden group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={currentImage}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          priority={currentIndex === 0}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0]">
            <div className="text-sm text-[#666]">Loading image...</div>
          </div>
        )}
      </div>

      {/* Navigation Buttons - Only show if multiple images */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-[#333]" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-[#333]" />
          </button>

          {/* Image Counter / Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Image Counter Text */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
