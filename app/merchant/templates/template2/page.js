"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Template2Homepage() {
  return (
    <div className="flex flex-col gap-24 py-12 md:py-24">
      {/* HERO SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-10">
          <div className="inline-block border border-yellow-200 px-4 py-1.5 rounded-full text-[10px] font-bold text-yellow-600 tracking-widest uppercase mb-4">
            AURA STUDIO
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-[#2a3623] leading-[1.1]">
            Capturing<br />
            <span className="text-[#819973] italic font-light">Life's Radiance</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Experience a hand-picked collection where timeless sophistication meets contemporary comfort. Aura Studio is your sanctuary for premium style.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <MapPin size={18} className="text-[#819973] mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider">LOCATION</p>
                <p className="text-xs text-gray-800 font-medium mt-1">124 Fashion Ave, Milan, IT</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <Clock size={18} className="text-[#819973] mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider">BUSINESS HOURS</p>
                <p className="text-xs text-gray-800 font-medium mt-1">Mon-Sat, 10am - 8pm</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <Phone size={18} className="text-[#819973] mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider">CALL US</p>
                <p className="text-xs text-gray-800 font-medium mt-1">+39 02 123 4567</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
              <Mail size={18} className="text-[#819973] mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider">INQUIRIES</p>
                <p className="text-xs text-gray-800 font-medium mt-1">hello@aurastudio.com</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/merchant/templates/template2/products" className="bg-[#819973] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#6b825d] transition-colors shadow-lg shadow-[#819973]/30">
              Explore Services
            </Link>
            <a href="#about" className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-full text-sm font-medium hover:border-gray-400 transition-colors">
              About Us
            </a>
          </div>
        </div>
        
        <div className="flex-1 relative w-full aspect-[4/5] max-w-lg mx-auto">
          <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80" alt="Studio" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent p-10 flex flex-col justify-end">
              <p className="text-white/80 text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Photography Studio</p>
              <p className="text-white text-2xl font-serif">Capture your memories</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section id="about" className="bg-gradient-to-b from-[#eadecc] to-[#faf9f6] py-24">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-12 h-[1px] bg-[#d3a165]"></div>
            <span className="text-[#d3a165] text-xs font-bold tracking-[0.2em] uppercase">Our Story</span>
            <div className="w-12 h-[1px] bg-[#d3a165]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif text-[#4a2e2b] leading-tight mb-16 max-w-3xl mx-auto">
            We believe style is a silent conversation between you and the world.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="text-[#d3a165] font-serif italic text-xl mb-4">The Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Founded in 2024, Aura Studio was born from a desire to bridge the gap between high-fashion artistry and everyday wearability. We source textiles that feel like a second skin and designs that empower the wearer.
              </p>
            </div>
            <div>
              <h3 className="text-[#d3a165] font-serif italic text-xl mb-4">Our Promise</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sustainability isn't just a buzzword; it's our backbone. Every piece in our collection is ethically manufactured and designed to last beyond seasons, resisting the 'fast fashion' cycle through superior craftsmanship.
              </p>
            </div>
          </div>

          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-800">50+ Happy Customers</p>
              <div className="flex gap-0.5 text-[#d3a165] text-xs mt-0.5">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <p className="text-[#d3a165] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Our Services</p>
        <h2 className="text-3xl font-serif text-[#2a3623] mb-12">Capturing Memories</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col group">
            <div className="aspect-[4/5] rounded-md overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Wedding" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-1.5">Pre-Wedding Photoshoot</h4>
            <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">Elegant floor-length velvet dress in deep navy with silk lining.</p>
            <div className="mt-auto flex justify-between items-center text-sm">
              <span className="font-bold text-[#d3a165]">$120.00</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col group">
            <div className="aspect-[4/5] rounded-md overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80" alt="Birthday" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-1.5">Birthday Shoot</h4>
            <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">Luxurious double-breasted coat made from premium italian wool.</p>
            <div className="mt-auto flex justify-between items-center text-sm">
              <span className="font-bold text-[#d3a165]">$210.00</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col group">
            <div className="aspect-[4/5] rounded-md overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" alt="Baby" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-1.5">Baby Shower Shoot</h4>
            <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">Structured blazer with subtle quilting and brushed gold buttons.</p>
            <div className="mt-auto flex justify-between items-center text-sm">
              <span className="font-bold text-[#d3a165]">$89.00</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col group">
            <div className="aspect-[4/5] rounded-md overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" alt="Casual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-1.5">Casual Photoshoot</h4>
            <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">Hand-painted silk scarf featuring intricate 24k gold leaf details.</p>
            <div className="mt-auto flex justify-between items-center text-sm">
              <span className="font-bold text-[#d3a165]">$175.00</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/merchant/templates/template2/products" className="inline-block border border-gray-300 text-gray-700 px-10 py-3 rounded-full text-xs font-bold tracking-wide uppercase hover:border-[#819973] hover:text-[#819973] transition-colors">
            View All Services
          </Link>
        </div>
      </section>

      {/* TEAM STRIP */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 w-full mb-12">
        <div className="bg-[#9db090] p-8 md:p-12 rounded-2xl">
          <div className="bg-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Sarah Miller" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-serif text-[#d3a165]">Sarah Miller</h3>
              </div>
              <p className="text-gray-600 text-sm max-w-sm mb-8 leading-relaxed mx-auto md:mx-0">
                Passionate about minimalist tailoring and sustainable luxury since 2021.
              </p>
              <div className="inline-flex items-center gap-2 text-[#d3a165] bg-[#fcf9f2] px-4 py-2 rounded">
                <div className="w-4 h-4 border-2 border-[#d3a165] rotate-45 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#d3a165] rounded-full"></div>
                </div>
                <span className="font-serif font-bold text-sm tracking-wide">Aura Studio</span>
              </div>
              <p className="text-xs text-gray-400 mt-3">Capture your every special moment.</p>
            </div>
            
            <div className="flex-1 w-full aspect-video rounded-xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80" alt="Workspace" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
