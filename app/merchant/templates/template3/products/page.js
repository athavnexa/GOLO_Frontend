"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import Link from "next/link";

const allProperties = [
  { id: 1, title: "Azure Sky Mansion",   price: 8900000,  display: "$8,900,000",  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "The Concrete Loft",   price: 4250000,  display: "$4,250,000",  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Modernist Retreat",   price: 15000000, display: "$15,000,000", image: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Eco-Villa Series",    price: 2100000,  display: "$2,100,000",  image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Heritage Manor",      price: 3500000,  display: "$3,500,000",  image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Sunscape Terrace",    price: 6700000,  display: "$6,700,000",  image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Azure Sky Mansion",   price: 8900000,  display: "$8,900,000",  image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "The Concrete Loft",   price: 4250000,  display: "$4,250,000",  image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80" },
  { id: 9, title: "Modernist Retreat",   price: 15000000, display: "$15,000,000", image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80" },
];

const sortOptions = [
  { label: "Price - High to Low", value: "high-to-low" },
  { label: "Price - Low to High", value: "low-to-high" },
  { label: "Alphabetically",      value: "alpha" },
  { label: "Recently Added",      value: "recent" },
];

export default function Template3Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("high-to-low");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sorted = [...allProperties]
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "high-to-low") return b.price - a.price;
      if (sort === "low-to-high") return a.price - b.price;
      if (sort === "alpha")       return a.title.localeCompare(b.title);
      return 0; // recently added — original order
    });

  const currentLabel = sortOptions.find(o => o.value === sort)?.label;

  return (
    <div className="bg-[#e2d5c3] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="relative w-full max-w-2xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search collection..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-transparent rounded-full py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7e2b29] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[10px] font-bold tracking-widest text-gray-700 uppercase">SORT BY:</span>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center justify-between gap-4 text-xs font-medium border border-gray-300 text-gray-800 rounded bg-white px-4 py-3 w-56 shadow-sm hover:border-[#7e2b29] transition-colors"
              >
                {currentLabel}
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-30 py-1 overflow-hidden">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 text-left px-4 py-2.5 text-xs transition-colors ${sort === opt.value ? "bg-[#f0e9df] text-[#7e2b29] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {sort === opt.value && <Check size={12} className="shrink-0 text-[#7e2b29]" />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((prop, i) => (
            <Link
              href={`/merchant/templates/template3/products/${prop.id}`}
              key={`${prop.id}-${i}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col hover:-translate-y-1"
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex justify-between items-start mt-auto">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{prop.title}</h4>
                  <span className="text-[10px] text-[#a45441] flex items-center gap-1 font-medium">
                    Details ↗
                  </span>
                </div>
                <span className="font-bold text-[#64795c] text-sm">{prop.display}</span>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-24 text-gray-500 text-sm">No properties found for "{search}".</div>
        )}

      </div>
    </div>
  );
}
