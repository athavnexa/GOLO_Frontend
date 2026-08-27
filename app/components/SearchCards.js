"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Tag, Star, Package, ArrowRight } from "lucide-react";

export function MerchantSearchCard({ merchant, view = "grid" }) {
  const profilePic = merchant?.profilePic || merchant?.shopPhoto || merchant?.profilePhoto || "/images/default-user-avatar.jpg";
  const storeName = merchant?.storeName || merchant?.name || "Merchant";
  const category = merchant?.storeCategory || merchant?.category || "Store";
  const address = merchant?.storeLocation || merchant?.address || merchant?.city || "Location not specified";

  const isList = view === "list";

  if (isList) {
    return (
      <article className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg">
        <Link href={`/nearby-deals/store?merchantId=${merchant.merchantId || merchant.userId || merchant._id}`} className="flex flex-col md:flex-row flex-1">
          <div className="relative h-48 md:h-auto md:w-[35%] shrink-0 overflow-hidden bg-gray-100">
            <img
              src={profilePic}
              alt={storeName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.target.src = "/images/deal1.jpg"; }}
            />
            <span className="absolute left-3 top-3 rounded-full bg-[#157A4F] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
              Store Profile
            </span>
          </div>

          <div className="p-4 md:p-6 flex flex-col flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#157A4F]/10 flex items-center justify-center text-sm font-bold text-[#157A4F]">
                {storeName.charAt(0)}
              </div>
              <span className="font-semibold text-gray-900 text-sm truncate">{category}</span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-snug truncate">
              {storeName}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1 font-semibold text-yellow-600">
                <Star size={14} fill="currentColor" className="text-yellow-500" />
                {merchant?.rating || merchant?.averageRating || 4.5}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{address}</span>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-end">
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#157A4F] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0f5c3a] shadow-sm hover:shadow active:scale-95">
                <span>View Store</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#157A4F]/40 hover:shadow-xl h-full">
      <Link href={`/nearby-deals/store?merchantId=${merchant.merchantId || merchant.userId || merchant._id}`} className="flex flex-col items-center w-full h-full px-4 pt-5 pb-4">
        {/* Circular Profile Image */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-[3px] ring-[#157A4F]/15 ring-offset-2 transition-all duration-300 group-hover:ring-[#157A4F]/40 group-hover:scale-105">
            <img
              src={profilePic}
              alt={storeName}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.src = "/images/deal1.jpg"; }}
            />
          </div>
          {/* Online-style indicator dot */}
          <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-[#28A745] border-[2.5px] border-white" />
        </div>

        {/* Store Name */}
        <h3 className="text-sm font-bold text-gray-900 text-center line-clamp-1 w-full mb-1">
          {storeName}
        </h3>

        {/* Category Badge */}
        <span className="inline-flex items-center gap-1 rounded-full bg-[#157A4F]/8 px-2.5 py-0.5 text-[10px] font-semibold text-[#157A4F] mb-2">
          <Tag size={10} />
          {category}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1.5">
          <Star size={11} fill="currentColor" className="text-yellow-500" />
          <span className="font-semibold text-yellow-600">{merchant?.rating || merchant?.averageRating || "4.5"}</span>
        </div>

        {/* Location */}
        <p className="text-[10px] text-gray-400 text-center line-clamp-1 flex items-center gap-1 mb-3 w-full justify-center">
          <MapPin size={10} className="shrink-0 text-gray-400" />
          {address}
        </p>

        {/* View Store Button */}
        <button className="mt-auto w-full rounded-full bg-gradient-to-r from-[#157A4F] to-[#1a9a5e] py-2 text-[11px] font-bold text-white transition-all duration-200 hover:shadow-md active:scale-[0.97]">
          View Store
        </button>
      </Link>
    </article>
  );
}

export function ProductSearchCard({ product, view = "grid" }) {
  const imageUrl = product?.imageUrl || (product?.images && product?.images[0]) || "/images/deal2.avif";
  const productName = product?.productName || product?.name || "Product";
  const price = product?.offerPrice || product?.price || 0;
  const originalPrice = product?.regularPrice || product?.price || 0;
  
  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const isList = view === "list";

  if (isList) {
    return (
      <article className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg">
        <Link href={`/nearby-deals/product?id=${product._id}`} className="flex flex-col md:flex-row flex-1">
          <div className="relative h-48 md:h-auto md:w-[35%] shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt={productName}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
              onError={(e) => { e.target.src = "/images/deal2.avif"; }}
            />
            <span className="absolute left-3 top-3 rounded-full bg-[#157A4F] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
              Product
            </span>
          </div>

          <div className="p-4 md:p-6 flex flex-col flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                <Package size={10} />
                {product?.category || "Item"}
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
              {productName}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1 font-semibold text-yellow-600">
                <Star size={14} fill="currentColor" className="text-yellow-500" />
                New
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {product?.category || "General"}
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                {discount > 0 && (
                  <span className="bg-[#E2F0D9] text-[#385723] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Save {discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#157A4F] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0f5c3a] shadow-sm hover:shadow active:scale-95">
                  <span>View Product</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg h-full">
      <Link href={`/nearby-deals/product?id=${product._id}`} className="flex flex-col h-full">
        <div className="relative h-44 w-full overflow-hidden bg-gray-100 sm:h-36 flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={productName}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            onError={(e) => { e.target.src = "/images/deal2.avif"; }}
          />
          <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#157A4F] to-[#28A745] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {product?.category || "Item"}
          </span>
          {discount > 0 && (
            <span className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm bg-white/95 text-[#157A4F]">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
            {productName}
          </h3>
          <p className="mt-1 text-[11px] text-gray-500">
            {product?.category || "Product"}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-gray-900">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <button className="mt-auto w-full rounded-lg border border-gray-200 bg-[#F7F7F7] py-2 text-xs font-bold text-gray-800 transition-colors duration-200 hover:border-[#157A4F] hover:bg-[#157A4F] hover:text-white">
            View Product
          </button>
        </div>
      </Link>
    </article>
  );
}
