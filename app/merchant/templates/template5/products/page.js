"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Check } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Citrus Sunbeam Oolong",
    price: "$6.50",
    desc: "A light, floral oolong infused with dried orange peel and a hint of lemongrass.",
    img: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?auto=format&fit=crop&w=600&q=80",
    tags: ["Popular", "Organic"]
  },
  {
    id: 2,
    name: "Honey Lemon Hibiscus",
    price: "$5.75",
    desc: "A vibrant ruby infusion with tart hibiscus, local honey, and fresh lemon zest.",
    img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80",
    tags: ["Best Seller", "Caffeine Free"]
  },
  {
    id: 3,
    name: "Golden Earl Grey",
    price: "$6.00",
    desc: "Traditional bergamot-infused black tea elevated with edible gold leaf and citrus oils.",
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
    tags: ["Classic", "Premium"]
  },
  {
    id: 4,
    name: "Citrus Sunbeam Oolong",
    price: "$6.50",
    desc: "A light, floral oolong infused with dried orange peel and a hint of lemongrass.",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    tags: ["Popular", "Organic"]
  },
  {
    id: 5,
    name: "Honey Lemon Hibiscus",
    price: "$5.75",
    desc: "A vibrant ruby infusion with tart hibiscus, local honey, and fresh lemon zest.",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    tags: ["Best Seller", "Caffeine Free"]
  },
  {
    id: 6,
    name: "Golden Earl Grey",
    price: "$6.00",
    desc: "Traditional bergamot-infused black tea elevated with edible gold leaf and citrus oils.",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    tags: ["Classic", "Premium"]
  },
  {
    id: 7,
    name: "Citrus Sunbeam Oolong",
    price: "$6.50",
    desc: "A light, floral oolong infused with dried orange peel and a hint of lemongrass.",
    img: "https://images.unsplash.com/photo-1585238341215-62d3c907a164?auto=format&fit=crop&w=600&q=80",
    tags: ["Popular", "Organic"]
  },
  {
    id: 8,
    name: "Honey Lemon Hibiscus",
    price: "$5.75",
    desc: "A vibrant ruby infusion with tart hibiscus, local honey, and fresh lemon zest.",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    tags: ["Iced Only", "Caffeine Free"]
  },
  {
    id: 9,
    name: "Golden Earl Grey",
    price: "$6.00",
    desc: "Traditional bergamot-infused black tea elevated with edible gold leaf and citrus oils.",
    img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
    tags: ["Classic", "Premium"]
  }
];

export default function Template5Products() {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState("Price - High to Low");

  const SORT_OPTIONS = [
    "Price - High to Low",
    "Price - Low to High",
    "Alphabetically",
    "Recently Added"
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      
      <div className="max-w-[1200px] mx-auto px-6 pt-10">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          
          <div className="relative w-full md:w-[300px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search collection..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-full focus:outline-none focus:border-[#d4af37] transition-colors bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto relative">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sort by:</span>
            <button 
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-700 hover:border-gray-300 transition-colors bg-white min-w-[140px] justify-between"
            >
              {sortValue} <ChevronDown size={14} />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-[160px] bg-white border border-gray-100 rounded shadow-xl z-20 py-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortValue(opt); setSortOpen(false); }}
                    className="w-full text-left text-[11px] px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    style={{ color: sortValue === opt ? '#d4af37' : '#4b5563' }}
                  >
                    {sortValue === opt ? <Check size={12} /> : <span className="w-3" />} 
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <Link
              key={p.id}
              href={`/merchant/templates/template5/products/${p.id}`}
              className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] relative overflow-hidden p-2">
                <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                  {p.tags.map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur-sm text-gray-800 text-[8px] font-bold px-2 py-1 rounded shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <img 
                  src={p.img} 
                  alt={p.name} 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-playfair font-bold text-gray-900 text-[15px] leading-snug">{p.name}</h3>
                  <span className="font-bold text-[#d4af37] text-sm shrink-0">{p.price}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                  {p.desc}
                </p>
                <div className="mt-auto pt-3 flex items-center gap-1 text-[9px] font-bold text-[#d4af37] uppercase tracking-wider">
                  View Details <ChevronDown size={10} className="-rotate-90" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
