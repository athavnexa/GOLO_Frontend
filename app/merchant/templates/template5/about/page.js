"use client";

import React from "react";

export default function Template5About() {
  return (
    <div className="bg-white overflow-hidden pb-12">
      
      {/* Top Image Collage */}
      <div className="w-full flex h-[350px] md:h-[450px]">
        <div className="w-1/4 h-full">
          <img src="https://images.unsplash.com/photo-1461023058943-0708ce151ed2?auto=format&fit=crop&w=500&q=80" alt="Coffee" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/4 h-full">
          <img src="https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80" alt="Fries" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/4 h-full">
          <img src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=500&q=80" alt="Tart" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/4 h-full">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" alt="Pizza" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Welcome Section */}
      <section className="bg-[#e8dfb4] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair italic font-bold text-white mb-8" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>
            Welcome to Sand & Saga Cafe
          </h1>
          <p className="text-[#a67c00] text-[15px] leading-relaxed font-medium">
            What started as a simple love for good coffee has grown into a place where our community comes together — one cup at a time. Since [year], we've been serving up freshly brewed coffee, handcrafted drinks, and made-from-scratch food in a space designed to feel like a home away from home.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative flex flex-col md:flex-row items-stretch bg-white min-h-[400px]">
        {/* Left Content */}
        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
          <h2 className="text-3xl font-playfair italic font-bold text-[#d4af37] mb-6">
            Our Story
          </h2>
          <p className="text-gray-700 text-sm leading-loose max-w-md">
            Sand and Saga began with a simple idea: great coffee shouldn't be complicated, and a café should feel like more than just a place to grab a quick drink. Founded by [founder name/story], we set out to create a space where quality, warmth, and community come first.<br/><br/>
            Every cup we pour reflects our commitment to sourcing the best beans, roasting them with care, and serving them with a smile.
          </p>
        </div>
        
        {/* Right Image with Clip Path */}
        <div className="w-full md:w-1/2 h-[400px] md:h-auto relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80)',
              clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
            }}
          />
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="bg-[#e8dfb4] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-playfair italic font-bold text-white mb-16 text-center md:text-left" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white/50">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white/50">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white/50">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white/50">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" alt="Team member" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
