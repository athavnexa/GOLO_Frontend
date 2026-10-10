"use client";

import Link from "next/link";
import { Coffee, Leaf, ShieldCheck, Heart, Truck, Gift, Sun, ArrowRight } from "lucide-react";

export default function Template5Home() {
  return (
    <div className="bg-white overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 border-[1px] border-[#d4af37] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute top-4 left-4 w-40 h-40 border-[1px] border-[#d4af37] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        
        <div className="absolute bottom-10 right-0 w-32 h-32 border-[1px] border-[#d4af37] rounded-full translate-x-1/2 translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-6 right-4 w-40 h-40 border-[1px] border-[#d4af37] rounded-full translate-x-1/2 translate-y-1/2 opacity-60"></div>

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Image */}
          <div className="w-full md:w-1/2 z-10">
            <div className="rounded-[32px] overflow-hidden aspect-square md:aspect-[4/5] shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80" 
                alt="Cafe Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 z-10 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-[#d4af37] leading-tight mb-12">
              Sand & Saga<br/>Cafe
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={14} className="text-[#d4af37]" />
              <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Our Quality Promise</span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2">100% Organic</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">No synthetic pesticides or wax coatings on our fruits.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Daily Zesting!</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">Pastries are prepared with zest harvested just minutes before baking.</p>
              </div>
            </div>

            <Link 
              href="/merchant/templates/template5/products"
              className="inline-flex items-center justify-center border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white font-medium text-xs px-8 py-3 rounded-full transition-colors w-max"
            >
              Learn About Our Produces
            </Link>
          </div>
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section className="bg-[#e8dfb4]/40 py-20 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          
          <div className="w-full md:w-1/2">
            <div className="rounded-[32px] overflow-hidden aspect-[3/4] shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80" 
                alt="Coffee cups"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={14} className="text-gray-800" />
              <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">Our Heritage</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 leading-tight mb-6">
              Where Every Cup<br/>Tells a Story
            </h2>
            
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                Inspired by the rich tradition of coffee culture and the joy of sharing good food, our cafe blends timeless flavors with modern hospitality. Every cup and every dish is prepared with care, passion, and a commitment to excellence.
              </p>
              <p>
                These are generic versions. If you share your cafe's name, theme (modern, vintage, luxury, college hangout, etc.), and a few details about how it started, I can write a unique "Our Origin" section that feels authentic to your brand.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-white mb-4 shadow-sm">
              <Coffee size={20} />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg mb-2">Premium Quality Coffee</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Expertly brewed from carefully selected beans to deliver rich flavor and exceptional freshness in every cup.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-white mb-4 shadow-sm">
              <Heart size={20} />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg mb-2">Family Friendly</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Freshly prepared using quality ingredients, offering the perfect combination of taste, freshness, and satisfaction.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-white mb-4 shadow-sm">
              <Truck size={20} />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg mb-2">Takeaway and Delivery</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              A warm, welcoming atmosphere where friends and families can relax, connect, and enjoy quality time together.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-white mb-4 shadow-sm">
              <Gift size={20} />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg mb-2">Delicious Snacks</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Enjoy your favorite coffee and meals wherever you are with our quick takeaway and reliable home delivery service.
            </p>
          </div>

        </div>
      </section>

      {/* CITRUS SWEETS SECTION */}
      <section className="bg-gray-50/50 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="text-center mb-12">
            <div className="w-8 h-8 rounded-full bg-[#e8dfb4]/60 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
              <Sun size={16} />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">Citrus Sweets</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Handcrafted daily in our kitchen using freshly harvested citrus zest and aromatic blossoms.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-[1000px] mx-auto">
            {/* Item 1 */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-[4/5] relative overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-white/90 text-gray-800 text-[9px] font-bold px-2 py-1 rounded">Freshly Baked</span>
                <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80" alt="Scone" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-playfair font-bold text-gray-900 text-[15px]">Orange Blossom Scone</h4>
                  <span className="font-bold text-[#d4af37] text-sm">$4.25</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
                  Buttery, crumbly scone glazed with orange blossom water and topped with candied zest.
                </p>
                <div className="mt-auto pt-4 flex items-center gap-1 text-[9px] font-bold text-[#d4af37] uppercase tracking-wider">
                  View Details <ArrowRight size={10} />
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-[4/5] relative overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-white/90 text-gray-800 text-[9px] font-bold px-2 py-1 rounded">Best Seller</span>
                <img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80" alt="Tart" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-playfair font-bold text-gray-900 text-[15px]">Lemon Curd Tart</h4>
                  <span className="font-bold text-[#d4af37] text-sm">$5.50</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
                  Zesty lemon curd in a shortcrust pastry, finished with a dollop of toasted meringue.
                </p>
                <div className="mt-auto pt-4 flex items-center gap-1 text-[9px] font-bold text-[#d4af37] uppercase tracking-wider">
                  View Details <ArrowRight size={10} />
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-[4/5] relative overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-white/90 text-gray-800 text-[9px] font-bold px-2 py-1 rounded">Gluten Free</span>
                <img src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80" alt="Cake" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-playfair font-bold text-gray-900 text-[15px]">Citrus Almond Cake</h4>
                  <span className="font-bold text-[#d4af37] text-sm">$4.75</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
                  Moist flourless almond cake infused with whole boiled oranges and almond.
                </p>
                <div className="mt-auto pt-4 flex items-center gap-1 text-[9px] font-bold text-[#d4af37] uppercase tracking-wider">
                  View Details <ArrowRight size={10} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
             <Link href="/merchant/templates/template5/products" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#d4af37] uppercase tracking-wider hover:underline">
               Browse Full Products <ArrowRight size={12} />
             </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
