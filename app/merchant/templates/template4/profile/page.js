"use client";

import { Award, BookOpen, Clock, MapPin, Star } from "lucide-react";

export default function Template4Profile() {
  return (
    <div className="bg-white pb-20">
      
      {/* Profile Header */}
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Profile Image */}
          <div className="w-full md:w-[400px] shrink-0 relative">
            {/* Purple accent corner */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#6b35c8]"></div>
            
            <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=800&q=80" 
                alt="Elias Vance"
                className="w-full h-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute bottom-4 right-4 bg-[#6b35c8] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#6b35c8] bg-purple-50 px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest border border-purple-100 w-max">
              <MapPin size={12} /> SUBHASH ROAD, LAXMIPURI KOLHAPUR
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-4">
              Elias Vance
            </h1>
            
            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-2xl">
              Master Carpenter and General Contractor specializing in high-end kitchen renovations and custom cabinetry with over 15 years of precision experience.
            </p>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-[#f5a623]">🔨</span> Carpentry
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-[#f5a623]">💧</span> Plumbing
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-[#f5a623]">⚡</span> Electrical
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-[#f5a623]">🎨</span> Painting
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-12 border-t border-b border-gray-100 py-6 mb-8 w-full max-w-2xl">
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a2e]">482</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">JOBS COMPLETED</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a2e]">4.95</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">CLIENT RATING</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a2e]">15+</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">EXP. YEARS</p>
              </div>
            </div>

            <button className="bg-[#6b35c8] hover:bg-[#5a2aad] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-[#6b35c8]/20 flex items-center gap-2 w-max">
              <BookOpen size={16} /> Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#f8f9fa] border-t border-gray-100 mt-12 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-[#6b35c8] mb-8">
            Contact Us !
          </h2>
          
          <form className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  placeholder="Input text" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6b35c8] transition-colors"
                />
              </div>
              <div className="md:row-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea 
                  placeholder="Input text" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6b35c8] transition-colors h-[120px] resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="Input text" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6b35c8] transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button 
                type="button"
                className="bg-[#6b35c8] hover:bg-[#5a2aad] text-white font-bold px-12 py-3 rounded-xl text-sm transition-colors shadow-md w-full md:w-auto min-w-[200px]"
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
