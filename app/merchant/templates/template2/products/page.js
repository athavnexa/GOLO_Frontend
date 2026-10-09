"use client";

import { ChevronDown, Search } from "lucide-react";

export default function Template2Products() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
      
      {/* FILTER / SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-200 pb-8">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search collection..." 
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#819973]"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">SORT BY:</span>
          <div className="relative">
            <button className="flex items-center justify-between gap-4 text-xs font-medium border border-[#d3a165] text-gray-800 rounded px-4 py-2 w-48 bg-white">
              Price - High to Low
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-xl z-20 py-2 hidden">
              <div className="px-4 py-2 text-xs text-[#d3a165] bg-gray-50 flex items-center gap-2">
                <span>✓</span> Price - High to Low
              </div>
              <div className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">Price - Low to High</div>
              <div className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">Alphabetically</div>
              <div className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">Recently Added</div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS WRAPPER */}
      <div className="bg-[#f0eadd] rounded-2xl p-8 md:p-12 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Pre-Wedding" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Pre - Wedding Shoot</h3>
              <span className="font-bold text-gray-900 text-sm">$289.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Elegant floor-length velvet dress in deep navy with silk lining.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80" alt="Birthday" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Birthday Shoot</h3>
              <span className="font-bold text-gray-900 text-sm">$450.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Luxurious double-breasted coat made from premium italian wool.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" alt="Casual" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Casual Photoshoot</h3>
              <span className="font-bold text-gray-900 text-sm">$85.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Hand-painted silk scarf featuring intricate 24k gold leaf details.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80" alt="Satin" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Satin Blush Cocktail Dress</h3>
              <span className="font-bold text-gray-900 text-sm">$195.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Playful yet refined midi dress with a delicate sweetheart neckline.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Baby Shower Shoot</h3>
              <span className="font-bold text-gray-900 text-sm">$320.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Structured blazer with subtle quilting and brushed gold buttons.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" alt="Passport" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Identity Size / Passport Photo</h3>
              <span className="font-bold text-gray-900 text-sm">$120.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Dangling freshwater pearls set in minimalist gold wire frames.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 7 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" alt="Reels" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Wedding Reels</h3>
              <span className="font-bold text-gray-900 text-sm">$289.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Elegant floor-length velvet dress in deep navy with silk lining.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 8 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=600&q=80" alt="Maternity" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Maternity Shoot</h3>
              <span className="font-bold text-gray-900 text-sm">$450.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Luxurious double-breasted coat made from premium italian.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

          {/* Card 9 */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" alt="Event" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2 px-1">
              <h3 className="font-serif font-bold text-gray-900 text-sm w-2/3 leading-tight">Event Shoot</h3>
              <span className="font-bold text-gray-900 text-sm">$85.00</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 px-1 leading-relaxed">Hand-painted silk scarf featuring intricate 24k gold leaf details.</p>
            <button className="mt-auto w-full py-2.5 rounded-xl border border-[#d3a165] text-[#d3a165] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d3a165] hover:text-white transition-colors">
              View Details
            </button>
          </div>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button className="border border-[#d3a165] text-[#d3a165] px-4 py-1.5 rounded-lg text-xs font-bold mr-2 hover:bg-[#d3a165] hover:text-white transition-colors">Previous</button>
          <button className="w-8 h-8 rounded-lg text-[#d3a165] text-xs font-bold hover:bg-[#d3a165] hover:text-white transition-colors">1</button>
          <button className="w-8 h-8 rounded-lg text-[#d3a165] text-xs font-bold hover:bg-[#d3a165] hover:text-white transition-colors">2</button>
          <button className="w-8 h-8 rounded-lg text-[#d3a165] text-xs font-bold hover:bg-[#d3a165] hover:text-white transition-colors">3</button>
          <button className="border border-[#d3a165] text-[#d3a165] px-4 py-1.5 rounded-lg text-xs font-bold ml-2 hover:bg-[#d3a165] hover:text-white transition-colors">Next</button>
        </div>
      </div>
      
    </div>
  );
}
