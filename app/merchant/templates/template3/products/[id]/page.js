"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Template3ProductDetails() {
  return (
    <div className="bg-[#e8ddc7] min-h-screen pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#7e2b29]">Product Details</h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="bg-white rounded-sm overflow-hidden shadow-2xl flex flex-col">
          
          {/* Top Split Section */}
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Left Image Section */}
            <div className="flex-1 bg-[#64795c] p-8 md:p-12 lg:p-16 flex items-center justify-center">
              <div className="w-full aspect-square relative shadow-2xl">
                <img src="https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1000&q=80" alt="Modernist Retreat" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Right Details Section */}
            <div className="flex-1 bg-[#7e2b29] p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Modernist Retreat</h2>
              <p className="text-white/90 text-sm leading-relaxed mb-12 max-w-lg font-medium">
                Discover your dream home! This beautifully designed house features spacious bedrooms, a modern kitchen, bright living areas, and stylish finishes throughout. Located in a peaceful neighborhood with easy access to schools, shopping, and public transport, it's the perfect place for comfortable family living.
              </p>
              
              <div className="mt-auto flex justify-end w-full">
                <span className="text-2xl font-bold">$15,000,000</span>
              </div>
            </div>
          </div>

          {/* Bottom Gallery Section */}
          <div className="bg-white py-16 px-8 md:px-24 flex items-center justify-between gap-8 relative">
            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={32} />
            </button>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square w-full">
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80" alt="Gallery 1" className="w-full h-full object-cover shadow-md hover:shadow-xl transition-shadow" />
              </div>
              <div className="aspect-square w-full">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Gallery 2" className="w-full h-full object-cover shadow-md hover:shadow-xl transition-shadow" />
              </div>
            </div>
            
            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronRight size={32} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
