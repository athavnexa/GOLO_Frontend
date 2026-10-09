"use client";

import { MapPin, Calendar, Award } from "lucide-react";

export default function Template4About() {
  return (
    <div className="bg-white">
      
      {/* Profile Header */}
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Profile Image */}
          <div className="w-full md:w-[400px] shrink-0 relative pt-4 pl-4">
            {/* Purple accent corner */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-[3px] border-l-[3px] border-[#6b35c8]"></div>
            
            <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-xl relative z-10 bg-gray-100">
              {/* Using a placeholder that resembles a worker in red overalls if possible, else generic worker */}
              <img 
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=800&q=80" 
                alt="Elias Vance"
                className="w-full h-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 bg-[#6b35c8] w-14 h-14 rounded-xl flex items-center justify-center shadow-lg translate-x-[-16px] translate-y-[-16px]">
                <Award className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col pt-4">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#6b35c8] bg-[#f8f6ff] px-4 py-2 rounded-full mb-6 uppercase tracking-wider border border-[#e8e0f8] w-max">
              <MapPin size={10} /> SUBHASH ROAD, LAXMIPURI KOLHAPUR
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-4 tracking-tight">
              Elias Vance
            </h1>
            
            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 max-w-2xl">
              Master Carpenter and General Contractor specializing in high-end kitchen renovations and custom cabinetry with over 15 years of precision experience.
            </p>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="flex items-center gap-2 bg-[#f9f9f9] text-gray-600 text-[11px] font-semibold px-4 py-2 rounded-full border border-gray-200">
                <span className="text-[#f5a623] text-sm">🔑</span> Carpentry
              </span>
              <span className="flex items-center gap-2 bg-[#f9f9f9] text-gray-600 text-[11px] font-semibold px-4 py-2 rounded-full border border-gray-200">
                <span className="text-[#f5a623] text-sm">💧</span> Plumbing
              </span>
              <span className="flex items-center gap-2 bg-[#f9f9f9] text-gray-600 text-[11px] font-semibold px-4 py-2 rounded-full border border-gray-200">
                <span className="text-[#f5a623] text-sm">⚡</span> Electrical
              </span>
              <span className="flex items-center gap-2 bg-[#f9f9f9] text-gray-600 text-[11px] font-semibold px-4 py-2 rounded-full border border-gray-200">
                <span className="text-[#f5a623] text-sm">🖌️</span> Painting
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-16 border-t border-b border-gray-100 py-8 mb-8 w-full max-w-2xl">
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a2e]">482</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">JOBS COMPLETED</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a2e]">4.95</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">CLIENT RATING</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a2e]">15+</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">EXP. YEARS</p>
              </div>
            </div>

            <button className="bg-[#6b35c8] hover:bg-[#5a2aad] text-white font-bold px-8 py-3 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2 w-max">
              <Calendar size={16} /> Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-[#fafafa] border-t border-gray-100 mt-12 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#6b35c8] mb-8 font-serif">
            Contact Us !
          </h2>
          
          <form className="max-w-[800px] bg-white p-0 rounded-2xl bg-transparent">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Input text" 
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#6b35c8] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Input text" 
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#6b35c8] transition-colors bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm text-gray-700 mb-2">Message</label>
                <textarea 
                  placeholder="Input text" 
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#6b35c8] transition-colors h-full min-h-[140px] resize-none bg-white"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button 
                type="button"
                className="bg-[#6b35c8] hover:bg-[#5a2aad] text-white font-semibold px-12 py-2.5 rounded text-sm transition-colors w-[200px]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
