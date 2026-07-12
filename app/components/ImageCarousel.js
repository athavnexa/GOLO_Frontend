"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function isLocalUri(src) {
  return typeof src === "string" && (
    src.startsWith("file:") || src.startsWith("blob:") || src.startsWith("data:")
  );
}

function SafeImage({
  src,
  alt,
  fill = false,
  className = "",
  style,
  priority,
  quality,
  sizes,
  ...rest
}) {
  if (isLocalUri(src)) {
    const inlineStyle = fill
      ? { width: "100%", height: "100%", objectFit: "cover", display: "block", ...(style || {}) }
      : { display: "block", ...(style || {}) };

    return <img src={src} alt={alt} className={className} style={inlineStyle} {...rest} />;
  }

  return (
    <Image
      src={src || "/images/deal2.avif"}
      alt={alt}
      fill={fill}
      className={className}
      style={style}
      {...rest}
    />
  );
}

export default function ImageCarousel({ images = [], videoUrl = null, alt = "Product" }) {
  const mediaList = [
    ...(images || []).map(url => ({ type: 'image', url }))
  ];
  if (videoUrl) {
    mediaList.push({ type: 'video', url: videoUrl });
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomData, setZoomData] = useState({ xPercent: 50, yPercent: 50, xPixel: 0, yPixel: 0 });
  const [loadedImages, setLoadedImages] = useState({});
  const LENS_SIZE = 120;
  const mainImageRef = useRef(null);

  // Preload all images when component mounts or mediaList changes
  useEffect(() => {
    if (mediaList.length === 0) return;
    
    mediaList.forEach((media) => {
      if (media.type === 'image' && !loadedImages[media.url]) {
        const img = new window.Image();
        img.src = media.url;
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [media.url]: true }));
        };
      }
    });
  }, [mediaList]);

  // Auto-rotate images every 3 seconds with infinity loop
  useEffect(() => {
    if (mediaList.length === 0 || isHovering) return;
    
    // Don't auto-rotate if current is video
    if (mediaList[currentIndex]?.type === 'video') return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [mediaList, isHovering, currentIndex]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const handlePrev = () => {
    if (mediaList.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaList.length) % mediaList.length);
  };

  const handleNext = () => {
    if (mediaList.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
  };

  // Show empty state if no media
  if (mediaList.length === 0) {
    return (
      <div className="relative w-full h-[400px] lg:h-[500px] bg-[#f0f0f0] rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-sm text-[#666]">No media available</div>
      </div>
    );
  }

  const currentMedia = mediaList[currentIndex];
  const isVideo = currentMedia.type === 'video';

  const handleMouseMove = (event) => {
    if (isVideo) return; // Disable zoom lens on video {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.min(Math.max(0, event.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, event.clientY - rect.top), rect.height);

    setZoomData({
      xPercent: (x / rect.width) * 100,
      yPercent: (y / rect.height) * 100,
      xPixel: x,
      yPixel: y,
    });
  };

  return (
    <div className="relative w-full overflow-visible">
      <div
        ref={mainImageRef}
        className="relative w-full h-[400px] lg:h-[500px] bg-[#f0f0f0] rounded-xl overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main Media */}
        <div className="relative w-full h-full">
          {isVideo ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <video 
                src={currentMedia.url} 
                controls 
                autoPlay
                className="w-full h-full object-contain"
                onLoadedData={() => setImageLoaded(true)}
              />
            </div>
          ) : (
            <SafeImage
              src={currentMedia.url}
              alt={`${alt} - Image ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              priority={currentIndex === 0}
              quality={90}
            />
          )}

          {!imageLoaded && !isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0]">
              <div className="text-sm text-[#666]">Loading image...</div>
            </div>
          )}

          {isHovering && !isVideo && (
            <div
              className="absolute border-2 border-white/90 shadow-lg bg-white/15 pointer-events-none rounded-full"
              style={{
                width: `${LENS_SIZE}px`,
                height: `${LENS_SIZE}px`,
                left: `${zoomData.xPixel}px`,
                top: `${zoomData.yPixel}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>

        {/* Navigation Buttons - Only show if multiple media items */}
        {mediaList.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-[#333]" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-[#333]" />
            </button>

            {/* Image Counter / Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {mediaList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? "bg-white w-6" 
                      : "bg-white/50 hover:bg-white/70 w-2"
                  }`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter Text */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
              {currentIndex + 1} / {mediaList.length}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Zoom Popup - Now with preloaded images */}
      {isHovering && !isVideo && loadedImages[currentMedia.url] && (
        <div className="hidden lg:block absolute top-0 left-[calc(100%+20px)] w-[550px] h-[500px] rounded-xl border border-[#e5e7eb] bg-white shadow-2xl overflow-hidden z-50 pointer-events-none">
          <div className="relative w-full h-full">
            {/* High Quality Zoomed Image */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${currentMedia.url})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "400% 400%",
                backgroundPosition: `${zoomData.xPercent}% ${zoomData.yPercent}%`,
                imageRendering: "auto",
                transition: "background-position 0.05s ease-out",
              }}
            />
            
            {/* Optional: Add a subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-inner pointer-events-none" />
          </div>
        </div>
      )}
      
      {/* Optional: Show loading indicator for zoom popup */}
      {isHovering && !isVideo && !loadedImages[currentMedia.url] && (
        <div className="hidden lg:block absolute top-0 left-[calc(100%+20px)] w-[550px] h-[500px] rounded-xl border border-[#e5e7eb] bg-white shadow-2xl overflow-hidden z-50 pointer-events-none flex items-center justify-center">
          <div className="text-sm text-[#666]">Loading zoom view...</div>
        </div>
      )}
    </div>
  );
}
