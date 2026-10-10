"use client";

import { use } from "react";
import Link from "next/link";

const SERVICES = {
  1: {
    id: 1,
    name: "Cold Coffee",
    category: "Food & Restaurants",
    price: "₹ 100",
    img: "https://images.unsplash.com/photo-1461023058943-0708ce151ed2?auto=format&fit=crop&w=800&q=80",
    desc: "Premium Cold Coffee. Cool, creamy, and irresistibly delicious—our signature cold coffee is the perfect pick-me-up anytime.\nAvailable in vanilla, chocolate rich flavors.",
    subImages: [
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=300&q=80"
    ]
  }
};

export default function Template5ProductDetail({ params }) {
  const { id } = use(params);
  const service = SERVICES[1]; // using [1] as fallback/default

  return (
    <div className="bg-[#e2d5ad] min-h-[calc(100vh-60px)] pb-12 flex flex-col">
      
      <div className="max-w-[1200px] mx-auto px-6 pt-16 w-full flex-1 flex flex-col">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-10 tracking-wide">
          Product Details
        </h1>

        {/* Content Box */}
        <div className="flex flex-col md:flex-row bg-white rounded shadow-xl overflow-hidden min-h-[500px]">
          
          {/* Left: Main Image */}
          <div className="w-full md:w-1/2">
            <img 
              src={service.img} 
              alt={service.name} 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <h2 className="text-[32px] font-playfair font-bold text-[#d4af37] mb-6">
              {service.name}
            </h2>
            
            <p className="text-gray-600 text-[13px] leading-relaxed mb-8 whitespace-pre-line max-w-sm">
              {service.desc}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pt-6 border-t border-gray-100">
              <span className="text-gray-500 text-[13px]">
                Category : {service.category}
              </span>
              <div className="border border-[#d4af37] text-[#d4af37] font-bold text-sm px-8 py-2.5 rounded-full text-center shrink-0">
                {service.price}
              </div>
            </div>

            {/* Sub Images */}
            <div className="grid grid-cols-2 gap-6 max-w-sm">
               {service.subImages.map((src, idx) => (
                 <div key={idx} className="aspect-square bg-gray-100 rounded overflow-hidden">
                   <img src={src} alt="Details" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                 </div>
               ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
