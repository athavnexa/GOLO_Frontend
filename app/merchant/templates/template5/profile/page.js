"use client";

import { MapPin, Clock, Phone, Mail } from "lucide-react";

export default function Template5Profile() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Top Banner Area */}
      <section className="px-4 py-8 max-w-[1400px] mx-auto">
        <div className="bg-[#e8dfb4] rounded-[24px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12 gap-10">
          
          {/* Left: Founder Profile */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-[6px] border-white/40 shadow-lg mb-6">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" 
                alt="Lana Roy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[#7d6718] text-sm leading-relaxed max-w-xs font-medium">
              Hey! This Lana Roy . I as a founder of Sand and Saga Cafe invite you to our Cafe . We offer delicious treats to every customer we serve
            </p>
          </div>

          {/* Right: Cafe Image */}
          <div className="w-full md:w-2/3 h-full">
            <div className="rounded-[24px] overflow-hidden shadow-xl aspect-video md:aspect-auto md:h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80" 
                alt="Cafe Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-6 max-w-[1200px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#d4af37] mb-10">
          Sand and Saga Cafe
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          
          {/* Info Card 1 */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf1] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
              <MapPin size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-xs text-gray-800">124 Fashion Ave, Milan, IT</p>
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf1] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
              <Clock size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Business Hours</p>
              <p className="text-xs text-gray-800">Mon-Sat: 10am — 8pm</p>
            </div>
          </div>

          {/* Info Card 3 */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf1] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
              <Phone size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Call Us</p>
              <p className="text-xs text-gray-800">+39 02 123 4567</p>
            </div>
          </div>

          {/* Info Card 4 */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf1] flex items-center justify-center shrink-0 border border-[#d4af37]/20">
              <Mail size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Inquiries</p>
              <p className="text-xs text-gray-800">hello@sandandsaga.com</p>
            </div>
          </div>

        </div>

        {/* Contact Form Section */}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-playfair font-bold text-[#d4af37]">
            Contact Us !
          </h2>
        </div>
        
        <div className="bg-[#f9f9f9] rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm text-left">
          <form className="max-w-[900px] mx-auto">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Input text" 
                    className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-colors bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Input text" 
                    className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-colors bg-white shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="block text-sm text-gray-700 mb-2">Message</label>
                <textarea 
                  placeholder="Input text" 
                  className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-colors h-full min-h-[140px] resize-none bg-white shadow-sm"
                ></textarea>
              </div>

            </div>
            
            <div className="flex justify-center mt-10">
              <button 
                type="button"
                className="bg-[#d4af37] hover:bg-[#c4a132] text-white font-semibold px-16 py-3 rounded text-sm transition-colors shadow-md w-full sm:w-auto"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

      </section>

    </div>
  );
}
