"use client";

import { use } from "react";
import Link from "next/link";

const SERVICES = {
  1: {
    id: 1,
    name: "Kitchen Pipe and Drain Cleaning",
    category: "Home Services",
    price: "₹ 100",
    img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
    desc: "Premium Cold Coffee. Cool, creamy, and irresistibly delicious—our signature cold coffee is the perfect pick-me-up anytime.\nAvailable in vanilla, chocolate rich flavors.",
  }
};

export default function Template4ProductDetail({ params }) {
  const { id } = use(params);
  const service = SERVICES[1]; // using [1] as fallback/default to match the screenshot

  return (
    <div className="bg-white pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-[#6b35c8] font-serif tracking-tight leading-tight mb-2">
            Product Details
          </h1>
          <p className="text-[14px] text-gray-600">
            Category : {service.category}
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-16">
          
          {/* Left: Image */}
          <div className="w-full md:w-[40%] max-w-[400px] shrink-0 flex items-center justify-center">
            <img
              src={service.img}
              alt={service.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right: Detail Card */}
          <div className="flex-1 w-full border border-[#f5a623] p-10 flex flex-col justify-center">
            <div className="flex items-start justify-between gap-6 mb-8">
              <h2 className="text-[28px] font-bold text-[#6b35c8] font-serif leading-[1.2] max-w-[70%]">
                {service.name}
              </h2>
              <div className="shrink-0 border border-[#f5a623] text-[#f5a623] font-semibold text-sm px-6 py-2 rounded-full">
                {service.price}
              </div>
            </div>

            <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-line">
              {service.desc}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
