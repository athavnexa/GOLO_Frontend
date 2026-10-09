"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Template3Homepage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="bg-white flex flex-col md:flex-row">
        <div className="flex-1 px-6 md:px-24 py-20 flex flex-col justify-center">
          <div className="inline-block border border-gray-200 px-3 py-1 rounded-full text-[10px] text-gray-500 font-medium mb-6 self-start">
            Trusted Real Estate Partner
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
            Find Your <br />
            <span className="text-[#a45441] italic font-serif">Perfect</span> Home <br />
            in <span className="text-[#a45441] italic font-serif">Aura.</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-10">
            Explore our curated collection of luxury villas, modern apartments, and premium estates tailored to your unique lifestyle.
          </p>
          <Link href="/merchant/templates/template3/products" className="bg-[#b3664d] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[#9a543e] transition-colors self-start shadow-md shadow-[#b3664d]/30">
            Explore
          </Link>
        </div>
        <div className="flex-1 relative aspect-square md:aspect-auto">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" alt="Beautiful house" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-[#efe7db] py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-[#a45441] text-2xl font-bold mb-3">What we offer</h2>
          <p className="text-gray-500 text-xs mb-16">Dedicated to providing the best property matchmaking experiences globally.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Offer 1 */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-xl">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" alt="Buy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
              <div className="absolute inset-0 bg-[#b3664d]/40 mix-blend-multiply"></div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <h3 className="text-white font-bold text-lg mb-2">Buy Properties</h3>
                <p className="text-white/80 text-[10px] leading-relaxed max-w-[80%]">Find your dream home, villa, or estate from our premium listings.</p>
              </div>
            </div>
            {/* Offer 2 */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-xl">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Rent" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
              <div className="absolute inset-0 bg-[#b3664d]/40 mix-blend-multiply"></div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <h3 className="text-white font-bold text-lg mb-2">Rent Properties</h3>
                <p className="text-white/80 text-[10px] leading-relaxed max-w-[80%]">Explore short-term stays, long-term rentals, and office spaces.</p>
              </div>
            </div>
            {/* Offer 3 */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-xl">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" alt="Sell" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
              <div className="absolute inset-0 bg-[#b3664d]/40 mix-blend-multiply"></div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <h3 className="text-white font-bold text-lg mb-2">Sell Your Property</h3>
                <p className="text-white/80 text-[10px] leading-relaxed max-w-[80%]">Get unmatched visibility and premium valuation for your property.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ESTATES */}
      <section className="bg-white py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Handpicked Featured Estates</h2>
              <p className="text-gray-500 text-xs max-w-sm leading-relaxed">Our curated list of properties handpicked to meet your refined architectural brilliance.</p>
            </div>
            <Link href="/merchant/templates/template3/products" className="border border-[#a45441] text-[#a45441] px-5 py-2 rounded-full text-[10px] font-bold hover:bg-[#a45441] hover:text-white transition-colors">
              View All Listing
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" alt="Azure Sky Mansion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Azure Sky Mansion</h4>
                  <Link href="/merchant/templates/template3/products/1" className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-[#a45441]">Details ↗</Link>
                </div>
                <span className="font-bold text-[#64795c] text-sm">$8,900,000</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" alt="The Concrete Loft" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">The Concrete Loft</h4>
                  <Link href="/merchant/templates/template3/products/2" className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-[#a45441]">Details ↗</Link>
                </div>
                <span className="font-bold text-[#64795c] text-sm">$4,250,000</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=800&q=80" alt="Modernist Retreat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Modernist Retreat</h4>
                  <Link href="/merchant/templates/template3/products/3" className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-[#a45441]">Details ↗</Link>
                </div>
                <span className="font-bold text-[#64795c] text-sm">$15,000,000</span>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80" alt="Eco-Villa Series" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Eco-Villa Series</h4>
                  <Link href="/merchant/templates/template3/products/4" className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-[#a45441]">Details ↗</Link>
                </div>
                <span className="font-bold text-[#64795c] text-sm">$2,100,000</span>
              </div>
            </div>
            {/* Card 5 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" alt="Heritage Manor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Heritage Manor</h4>
                  <Link href="/merchant/templates/template3/products/5" className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-[#a45441]">Details ↗</Link>
                </div>
                <span className="font-bold text-[#64795c] text-sm">$3,500,000</span>
              </div>
            </div>
            {/* Card 6 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" alt="Sunscape Terrace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Sunscape Terrace</h4>
                  <Link href="/merchant/templates/template3/products/6" className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-[#a45441]">Details ↗</Link>
                </div>
                <span className="font-bold text-[#64795c] text-sm">$6,700,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section id="about" className="px-6 md:px-12 py-12 mb-20 bg-white">
        <div className="max-w-[1400px] mx-auto relative">
          
          <div className="bg-[#5e6f54] rounded-[2rem] p-12 lg:p-16 w-full lg:w-4/5 flex flex-col md:flex-row gap-12 relative z-0">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-10">
                <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center bg-transparent">
                  <div className="w-2 h-2 border border-white rotate-45 bg-white"></div>
                </div>
                <span className="font-serif font-bold text-xl tracking-wide ml-1">Aura Estates</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#a45441]">
                    <MapPin size={16} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">Location</span>
                  </div>
                  <p className="text-gray-800 text-[10px] font-medium">124 Fashion Ave, Milan, IT</p>
                </div>
                <div className="bg-white rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#a45441]">
                    <Clock size={16} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">Business Hours</span>
                  </div>
                  <p className="text-gray-800 text-[10px] font-medium">Mon-Sat: 9am - 6pm</p>
                </div>
                <div className="bg-white rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#a45441]">
                    <Mail size={16} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">Inquiries</span>
                  </div>
                  <p className="text-gray-800 text-[10px] font-medium break-all">info@auraestates.com</p>
                </div>
                <div className="bg-white rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#a45441]">
                    <Phone size={16} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">Call Us</span>
                  </div>
                  <p className="text-gray-800 text-[10px] font-medium">+39 02 123 4567</p>
                </div>
              </div>
              
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                Our company Aura Estates has served over 50+ customers till today. We offer a wide range of properties.
              </p>
            </div>
            <div className="flex-1 hidden md:block relative min-h-[300px]">
               {/* Man image */}
            </div>
          </div>
          
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[110%] z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" alt="Agent" className="w-full h-full object-cover" />
          </div>

        </div>
        
        {/* Contact Form */}
        <div className="max-w-[1000px] mx-auto bg-[#7e2b29] rounded-[2rem] p-10 md:p-16 mt-8 shadow-2xl relative z-20">
          <h2 className="text-center text-white text-3xl font-bold mb-10">Contact Us !</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <input type="text" placeholder="Your Name" className="w-full bg-white rounded-lg px-4 py-3.5 text-sm focus:outline-none" />
              <input type="email" placeholder="Your Email address" className="w-full bg-white rounded-lg px-4 py-3.5 text-sm focus:outline-none" />
            </div>
            <div>
              <textarea placeholder="Write your message" className="w-full h-full min-h-[120px] bg-white rounded-lg px-4 py-3.5 text-sm focus:outline-none resize-none"></textarea>
            </div>
            <div className="md:col-span-2 text-center mt-6">
              <button type="button" className="bg-[#b3664d] text-white px-12 py-3 rounded-lg text-sm font-medium hover:bg-[#9a543e] transition-colors shadow-lg">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}
