"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Tag, Star, Package, ArrowRight } from "lucide-react";

export function MerchantSearchCard({ merchant, view = "grid" }) {
  const profilePic = merchant?.profilePic || "/images/deal1.jpg";
  const storeName = merchant?.storeName || merchant?.name || "Merchant";
  const category = merchant?.category || "Store";
  const address = merchant?.address || merchant?.city || "Location not specified";

  const isList = view === "list";

  if (isList) {
    return (
      <article className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg">
        <Link href={`/nearby-deals/store?merchantId=${merchant.merchantId}`} className="flex flex-col md:flex-row flex-1">
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
                4.5
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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg h-full">
      <Link href={`/nearby-deals/store?merchantId=${merchant.merchantId}`} className="flex flex-col h-full">
        <div className="relative h-44 w-full overflow-hidden bg-gray-100 sm:h-36">
          <img
            src={profilePic}
            alt={storeName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = "/images/deal1.jpg"; }}
          />
          <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#157A4F] to-[#28A745] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {category}
          </span>
        </div>
        <div className="p-3 flex flex-col flex-1">
          <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
            {storeName}
          </h3>
          <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1 font-semibold text-yellow-600">
            <Star size={12} fill="currentColor" className="text-yellow-500" />
            4.5 rating
          </p>
          <p className="mt-2 text-[11px] text-gray-500 line-clamp-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {address}
          </p>
          <button className="mt-auto w-full rounded-lg border border-gray-200 bg-[#F7F7F7] py-2 text-xs font-bold text-gray-800 transition-colors duration-200 hover:border-[#157A4F] hover:bg-[#157A4F] hover:text-white">
            View Store
          </button>
        </div>
      </Link>
    </article>
  );
}

export function ProductSearchCard({ product, view = "grid" }) {
  const imageUrl = product?.imageUrl || "/images/deal2.avif";
  const productName = product?.productName || "Product";
  const price = product?.offerPrice || product?.regularPrice || 0;
  const originalPrice = product?.regularPrice || 0;
  
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
