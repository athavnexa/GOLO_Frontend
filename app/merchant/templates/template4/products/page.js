"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronDown, PenTool, Wrench, Zap, Wind, Trash2, Paintbrush, ShieldCheck } from "lucide-react";

const CATEGORIES = [
  { name: "Plumbing", icon: <Wrench size={20} /> },
  { name: "Repairs", icon: <PenTool size={20} /> },
  { name: "Electrical", icon: <Zap size={20} /> },
  { name: "HVAC", icon: <Wind size={20} /> },
  { name: "Waste", icon: <Trash2 size={20} /> },
  { name: "Painting", icon: <Paintbrush size={20} /> },
  { name: "Cleaning", icon: <ShieldCheck size={20} /> },
];

const SERVICES = [
  {
    id: 1,
    name: "Full Home Deep Cleaning",
    category: "Cleaning",
    provider: "Maria Rodriguez",
    providerImg: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    desc: "Comprehensive sanitisation and eco-friendly scrubbing for every corner of your living",
    price: "$149",
    badge: "Cleaning",
  },
  {
    id: 2,
    name: "Kitchen Pipe & Drain Repair",
    category: "Plumbing",
    provider: "Daniel Chen",
    providerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80",
    desc: "Expert leak detection and pipe replacement using industrial-grade materials.",
    price: "$85",
    badge: "Plumbing",
  },
  {
    id: 3,
    name: "Smart Home Lighting Setup",
    category: "Electrical",
    provider: "James Wilson",
    providerImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
    desc: "Installation and programming of intelligent LED systems with mobile app integration.",
    price: "$120",
    badge: "Electrical",
  },
  {
    id: 4,
    name: "Modern Interior Repainting",
    category: "Painting",
    provider: "Elena Rossi",
    providerImg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=600&q=80",
    desc: "Professional multi-coat painting with precision edging and color consultation.",
    price: "$299",
    badge: "Painting",
    ratingOverlay: "4.7 (152)"
  },
  {
    id: 5,
    name: "AC Unit Filter Maintenance",
    category: "HVAC",
    provider: "Robert Taylor",
    providerImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
    desc: "Seasonal check-up and high-efficiency filter replacement for optimal air quality.",
    price: "$95",
    badge: "HVAC",
  },
  {
    id: 6,
    name: "Yard Landscape Renovation",
    category: "Repairs",
    provider: "Sarah Green",
    providerImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=600&q=80",
    desc: "Full design and planting of sustainable garden beds and drought-resistant turf.",
    price: "$450",
    badge: "Outdoor",
  },
  {
    id: 7,
    name: "Full Home Deep Cleaning",
    category: "Cleaning",
    provider: "Maria Rodriguez",
    providerImg: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    desc: "Comprehensive sanitisation and eco-friendly scrubbing for every corner of your living",
    price: "$149",
    badge: "Cleaning",
  },
  {
    id: 8,
    name: "Kitchen Pipe & Drain Repair",
    category: "Plumbing",
    provider: "Daniel Chen",
    providerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80",
    desc: "Expert leak detection and pipe replacement using industrial-grade materials.",
    price: "$85",
    badge: "Plumbing",
  },
  {
    id: 9,
    name: "Smart Home Lighting Setup",
    category: "Electrical",
    provider: "James Wilson",
    providerImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
    desc: "Installation and programming of intelligent LED systems with mobile app integration.",
    price: "$120",
    badge: "Electrical",
  },
];

export default function Template4Products() {
  const [activeCategory, setActiveCategory] = useState("Repairs");

  return (
    <div className="bg-white pb-20">
      
      {/* Category Filter Bar */}
      <div className="w-full bg-[#6b35c8] py-4 px-6 mb-12 flex items-center justify-center gap-8 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeCategory === cat.name ? "text-[#f5a623]" : "text-white/80 hover:text-white"
            }`}
          >
            {cat.icon}
            <span className="text-[10px] font-semibold uppercase tracking-wider">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Top-Rated Service Experts</h1>
            <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
              Curated professionals with verified backgrounds and consistent 4.5+ star ratings. Book instantly or request a custom quote.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-transparent border border-[#6b35c8] text-[#6b35c8] text-xs font-semibold px-4 py-2 rounded-full self-start md:mt-0 hover:bg-purple-50 transition-colors shrink-0">
            Sort: Most Popular
          </button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {SERVICES.map((service, index) => (
            <Link
              key={index}
              href={`/merchant/templates/template4/products/${service.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col border border-gray-100"
            >
              {/* Image */}
              <div className="relative aspect-[16/11] overflow-hidden bg-gray-100">
                <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-gray-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {service.badge}
                </span>
                
                {service.ratingOverlay && (
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded">
                    <Star size={10} className="text-white" fill="white" /> {service.ratingOverlay}
                  </div>
                )}
                
                <img
                  src={service.img}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Provider */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img src={service.providerImg} alt={service.provider} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{service.provider}</span>
                </div>

                <h3 className="font-extrabold text-[#1a1a2e] text-[15px] mb-2 leading-snug">{service.name}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-6 line-clamp-2">
                  {service.desc}
                </p>

                <div className="mt-auto border-t border-gray-100 pt-3 flex flex-col">
                  <span className="text-[10px] text-gray-400 font-medium mb-0.5">Starting at</span>
                  <span className="text-[#f5a623] font-bold text-[15px]">{service.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
