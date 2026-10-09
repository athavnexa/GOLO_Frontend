"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Price - High to Low", value: "price_desc" },
  { label: "Price - Low to High", value: "price_asc" },
  { label: "Alphabetically: A → Z", value: "alpha_asc" },
  { label: "Alphabetically: Z → A", value: "alpha_desc" },
  { label: "Recently Added", value: "recent" },
];

const SERVICES = [
  {
    id: 1,
    name: "Pre - Wedding Shoot",
    price: 289,
    order: 1,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    desc1: "Capture your love story before the big day with cinematic outdoor and studio setups.",
    desc2: "Includes a curated gallery of 80+ edited high-resolution images delivered within 7 days.",
  },
  {
    id: 2,
    name: "Birthday Shoot",
    price: 450,
    order: 2,
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
    desc1: "Celebrate your special milestone with vibrant, fun-filled birthday photography sessions.",
    desc2: "Themed props, balloon setups, and a professional lighting rig included in every package.",
  },
  {
    id: 3,
    name: "Casual Photoshoot",
    price: 85,
    order: 3,
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    desc1: "Laid-back lifestyle photography tailored to showcase your personality in natural settings.",
    desc2: "Perfect for social media content, portfolios, and personal keepsakes.",
  },
  {
    id: 4,
    name: "Satin Blush Cocktail",
    price: 195,
    order: 4,
    img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80",
    desc1: "Elegant cocktail-party photography that captures every glamorous moment with precision.",
    desc2: "Studio and on-location options available with same-week delivery of edited prints.",
  },
  {
    id: 5,
    name: "Baby Shower Shoot",
    price: 320,
    order: 5,
    img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
    desc1: "Tender and heartwarming photos that celebrate the joy of expecting a new arrival.",
    desc2: "Soft pastel-themed setups with props, florals, and custom backdrops available on request.",
  },
  {
    id: 6,
    name: "Identity / Passport Photo",
    price: 120,
    order: 6,
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    desc1: "Crisp, government-compliant passport and identity photos taken in minutes at our studio.",
    desc2: "Printed and digital copies provided; meets standards for all major countries and visa types.",
  },
  {
    id: 7,
    name: "Wedding Reels",
    price: 289,
    order: 7,
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    desc1: "Short-form cinematic reels that condense your wedding day into shareable, emotional highlights.",
    desc2: "Delivered as vertical and landscape cuts optimised for Instagram, YouTube, and WhatsApp.",
  },
  {
    id: 8,
    name: "Maternity Shoot",
    price: 450,
    order: 8,
    img: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=600&q=80",
    desc1: "Beautiful maternity portraits that celebrate the glow and grace of motherhood.",
    desc2: "Outdoor garden and indoor studio sessions available with styling and wardrobe guidance.",
  },
  {
    id: 9,
    name: "Event Shoot",
    price: 85,
    order: 9,
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    desc1: "Full-event coverage capturing candid moments, décor details, and group highlights.",
    desc2: "Ideal for corporate events, award nights, and private celebrations of any scale.",
  },
];

function sortServices(services, sortValue) {
  const arr = [...services];
  switch (sortValue) {
    case "price_desc":
      return arr.sort((a, b) => b.price - a.price);
    case "price_asc":
      return arr.sort((a, b) => a.price - b.price);
    case "alpha_asc":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "alpha_desc":
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    case "recent":
      return arr.sort((a, b) => a.order - b.order);
    default:
      return arr;
  }
}

export default function Template2Products() {
  const [sortValue, setSortValue] = useState("price_desc");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sorted = sortServices(SERVICES, sortValue);
  const filtered = sorted.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeLabel = SORT_OPTIONS.find((o) => o.value === sortValue)?.label;

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">

      {/* FILTER / SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-200 pb-8">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#819973]"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">SORT BY:</span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center justify-between gap-4 text-xs font-medium border border-[#d3a165] text-gray-800 rounded px-4 py-2 w-52 bg-white hover:bg-[#fdf7f0] transition-colors"
            >
              <span className="truncate">{activeLabel}</span>
              <ChevronDown
                size={14}
                className={`shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-xl z-20 py-1 min-w-[220px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortValue(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors ${
                      sortValue === opt.value
                        ? "text-[#d3a165] bg-[#fdf7f0] font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {sortValue === opt.value && <span className="text-[#d3a165]">✓</span>}
                    {sortValue !== opt.value && <span className="w-4" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS WRAPPER */}
      <div className="bg-[#f0eadd] rounded-2xl p-8 md:p-12 mb-12">

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">No services match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
                  <img
                    src={service.img}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start mb-2 px-1">
                  <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">
                    {service.name}
                  </h3>
                  <span className="font-bold text-gray-900 text-sm">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mb-1 px-1 leading-relaxed">
                  {service.desc1}
                </p>
                <p className="text-[11px] text-gray-400 mb-4 px-1 leading-relaxed">
                  {service.desc2}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button className="border border-[#d3a165] text-[#d3a165] px-4 py-1.5 rounded-lg text-xs font-bold mr-2 hover:bg-[#d3a165] hover:text-white transition-colors">Previous</button>
          <button className="w-8 h-8 rounded-lg bg-[#d3a165] text-white text-xs font-bold">1</button>
          <button className="w-8 h-8 rounded-lg text-[#d3a165] text-xs font-bold hover:bg-[#d3a165] hover:text-white transition-colors">2</button>
          <button className="w-8 h-8 rounded-lg text-[#d3a165] text-xs font-bold hover:bg-[#d3a165] hover:text-white transition-colors">3</button>
          <button className="border border-[#d3a165] text-[#d3a165] px-4 py-1.5 rounded-lg text-xs font-bold ml-2 hover:bg-[#d3a165] hover:text-white transition-colors">Next</button>
        </div>
      </div>

    </div>
  );
}
