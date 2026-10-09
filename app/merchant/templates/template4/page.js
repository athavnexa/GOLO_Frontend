"use client";

import Link from "next/link";
import { Star, Check, Phone, Wrench, Zap, Wind, PenTool, Paintbrush, Sparkles, ClipboardCheck, Clock, Smartphone } from "lucide-react";

const SERVICES = [
  {
    icon: <Wrench size={24} className="text-[#f5a623]" />,
    name: "Plumbing Services",
    desc: "From burst pipes to full pipe replacements, our experts handle it all with precision.",
    price: "$89",
  },
  {
    icon: <Zap size={24} className="text-[#f5a623]" />,
    name: "Electrical Repairs",
    desc: "Safe and reliable electrical solutions for your home's lighting and wiring needs.",
    price: "$120",
  },
  {
    icon: <Wind size={24} className="text-[#f5a623]" />,
    name: "HVAC Maintenance",
    desc: "Keep your home at the perfect temperature year-round with our system tune-ups.",
    price: "$150",
  },
  {
    icon: <PenTool size={24} className="text-[#f5a623]" />,
    name: "Handyman Help",
    desc: "Your \"to-do\" list, handled. Furniture assembly, mounting, and small repairs.",
    price: "$75",
  },
  {
    icon: <Paintbrush size={24} className="text-[#f5a623]" />,
    name: "Home Painting",
    desc: "Refresh your space with professional interior and exterior painting services.",
    price: "$299",
  },
  {
    icon: <Sparkles size={24} className="text-[#f5a623]" />,
    name: "Deep Cleaning",
    desc: "A spotless home from top to bottom. Eco-friendly products and thorough care.",
    price: "$110",
  },
];

const FEATURES = [
  {
    icon: <ClipboardCheck size={24} className="text-[#f5a623]" />,
    title: "Strictly Vetted Professionals",
    desc: "Every technician undergoes a rigorous multi-step background check and skills assessment.",
  },
  {
    icon: <Clock size={24} className="text-[#f5a623]" />,
    title: "Always On-Time Guarantee",
    desc: "We respect your time. If we're late by more than 15 minutes, your next service is 20% off.",
  },
  {
    icon: <Smartphone size={24} className="text-[#f5a623]" />,
    title: "Smart Booking System",
    desc: "Manage appointments, track arrivals, and pay invoices all from your mobile device.",
  },
];

export default function Template4Home() {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 bg-[#f8f6ff] px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider border border-purple-50">
              Trusted in 10,000+ Homes
            </div>
            
            <h1 className="text-[40px] md:text-[56px] font-extrabold text-[#1a1a2e] leading-[1.1] mb-6 tracking-tight">
              Your home,
              <br />
              <span className="text-[#6b35c8] italic font-serif">perfectly</span>
              <br />
              <span className="text-[#6b35c8]">maintained.</span>
            </h1>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[360px]">
              Professional, vetted experts for every home need. Reliable service, transparent pricing, and quality you can trust.
            </p>
            
            <Link
              href="/merchant/templates/template4/products"
              className="inline-block bg-[#6b35c8] hover:bg-[#5a2aad] text-white font-semibold px-8 py-2.5 rounded-md text-sm transition-all shadow-md"
            >
              Explore
            </Link>
          </div>

          {/* Right */}
          <div className="relative flex justify-end">
            {/* Soft purple blob shape background */}
            <div className="absolute inset-0 bg-[#e8e6f1] rounded-[40px] transform rotate-3 scale-105 translate-x-4 -translate-y-4 z-0"></div>
            
            <div className="relative z-10 w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
                alt="Home maintenance professional"
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-20">
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                <ShieldCheckIcon size={16} className="text-[#6b35c8]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900">Satisfaction Guaranteed</p>
                <p className="text-[9px] text-gray-400 mt-0.5">We re-do it free if not 100% satisfied</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PREMIUM SERVICES */}
      <section className="bg-[#9c93c4] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold text-[#3a2868] mb-4">Our Premium Services</h2>
              <p className="text-white text-sm leading-relaxed">
                We offer a wide range of residential maintenance and repair services tailored to your needs.
              </p>
            </div>
            <Link
              href="/merchant/templates/template4/products"
              className="inline-flex items-center justify-center bg-[#6b35c8] text-white font-semibold text-xs px-6 py-3 rounded-md hover:bg-[#5a2aad] transition-colors shrink-0"
            >
              Browse All Services
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl p-6 hover:-translate-y-1 transition-transform shadow-sm"
              >
                <div className="text-xl mb-4 bg-yellow-50 w-10 h-10 flex items-center justify-center rounded-lg">{s.icon}</div>
                <h3 className="font-extrabold text-gray-900 text-sm mb-2">{s.name}</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed mb-6 h-8">{s.desc}</p>
                <span className="text-[#f5a623] font-bold text-[11px]">From {s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY HOMEOWNERS CHOOSE */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Features */}
          <div>
            <h2 className="text-[28px] font-extrabold text-[#3a2868] mb-4 leading-tight">
              Why Homeowners Choose<br/>HomeHaven
            </h2>
            <p className="text-gray-500 text-sm mb-10 max-w-md">
              We've built our reputation on quality, speed, and absolute transparency. We treat every home as if it were our own.
            </p>
            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:border-purple-200 transition-colors">
                  <div className="text-xl shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-[13px] mb-1">{f.title}</h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Booking card mockup */}
          <div className="bg-[#bcb2e0] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            {/* White card inside */}
            <div className="bg-white rounded-2xl p-6 shadow-xl relative z-10 w-full max-w-sm mx-auto">
              
              <div className="flex items-start justify-between mb-8 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
                    <span className="text-yellow-500 text-xs">🔧</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Upcoming Service</p>
                    <p className="text-[11px] font-bold text-gray-800">Jun 12, 10:00 AM</p>
                  </div>
                </div>
                <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Mark" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs">Mark Peterson</p>
                  <p className="text-[10px] text-gray-400">Senior HVAC Specialist</p>
                </div>
                <div className="ml-auto w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                   <Phone size={10} className="text-gray-400"/>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-[11px]">
                <div className="flex justify-between text-gray-500">
                  <span>Service Fee</span>
                  <span className="font-semibold text-gray-800">$120.00</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-50 pt-2 text-gray-900">
                  <span>Total Estimate</span>
                  <span>$120.00</span>
                </div>
              </div>

            </div>
            
            <div className="text-center mt-8 relative z-10">
              <p className="font-bold text-gray-900 text-lg mb-2">Ready to start?</p>
              <p className="text-[11px] text-gray-600 mb-6">Download our app to manage everything in one place.</p>
              <button className="bg-[#f5a623] text-white font-bold px-6 py-2 rounded-md text-xs shadow-md">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-6 pb-20">
        <div className="max-w-[1000px] mx-auto bg-[#6b35c8] rounded-[32px] py-16 px-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9c93c4]/40 rounded-full -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9c93c4]/40 rounded-full translate-x-1/4 -translate-y-1/4" />
          
          <div className="max-w-xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-4">Love your home again with HomeHaven</h2>
            <p className="text-purple-100 text-[13px] mb-8 leading-relaxed">
              Join thousands of homeowners who have found their trusted partners for home maintenance. Get your first estimate in seconds.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/merchant/templates/template4/about#contact" className="bg-white text-[#f5a623] font-bold px-8 py-3 rounded-full text-[13px] transition-colors shadow-lg">
                Get a Free Quote
              </Link>
              <Link href="/merchant/templates/template4/about#contact" className="bg-white text-[#f5a623] font-bold px-8 py-3 rounded-full text-[13px] transition-colors shadow-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function ShieldCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
