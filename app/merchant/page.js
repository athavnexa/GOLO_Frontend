"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { 
  BarChart3, Globe, QrCode, Sparkles, Users, Ticket, 
  Bell, Box, MessageSquare, Check, ArrowRight, Star, 
  MapPin, Store, ChevronRight, Mail, Phone, ExternalLink 
} from "lucide-react";

function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function MerchantLandingPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const stats = [
    { value: "5,000+", label: "Active Merchants", desc: "Local shops trust GOLO" },
    { value: "1.2M+", label: "Monthly Users", desc: "Active local shoppers" },
    { value: "25+", label: "Store Categories", desc: "Diverse listing options" },
    { value: "4.9/5", label: "Merchant Rating", desc: "Highly rated platform" }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Advanced business analytics",
      desc: "Get real-time insights on your sales performance, visitor counts, and category benchmarks to optimize operations.",
      tags: ["Revenue & Sales", "Sales by category", "Visitor insights"]
    },
    {
      icon: Globe,
      title: "Mini business website",
      desc: "Instantly create a professional, mobile-friendly online storefront to showcase products, services, and locations.",
      tags: ["Online Store", "Mobile Optimized", "Custom Link"]
    },
    {
      icon: QrCode,
      title: "QR code redemption",
      desc: "Redeem user offers instantly at your store counter with a simple QR code scan for a frictionless check-out flow.",
      tags: ["Instant Scan", "Secure verification", "Paperless"]
    },
    {
      icon: Sparkles,
      title: "Smart Promotion Engine",
      desc: "Create limited-time deals, flash sales, or flat discounts that automatically push to nearby shoppers on GOLO.",
      tags: ["Targeted ads", "Smart scheduler", "High ROI"]
    },
    {
      icon: Users,
      title: "Customer CRM",
      desc: "Track local customer preferences, transaction history, and ratings to keep your buyers returning.",
      tags: ["User Insights", "Loyalty metrics", "Feedback manager"]
    },
    {
      icon: Ticket,
      title: "Offers and Deals Management",
      desc: "Easily publish, edit, pause, or extend your vouchers and campaigns dynamically from your dashboard.",
      tags: ["Flexible control", "Stock limits", "Expiry tracking"]
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      desc: "Alert nearby buyers automatically when you post a new deal or update stock levels at your location.",
      tags: ["Push notifications", "Real-time updates", "Geo-targeted"]
    },
    {
      icon: Box,
      title: "Inventory Manager",
      desc: "Monitor claimed offer volumes and stock thresholds in real-time to avoid over-redeeming vouchers.",
      tags: ["Stock tracking", "Usage alert", "Auto-pause"]
    },
    {
      icon: MessageSquare,
      title: "Direct Chat Support",
      desc: "Chat directly with local buyers inquiring about your deals, storefront timings, or custom services.",
      tags: ["Live chat", "Lead generation", "Direct response"]
    }
  ];

  const testimonials = [
    {
      stars: 5,
      quote: "GOLO helped me double my spice shop sales in just 30 days! Setting up my store profile took less than 5 minutes, and local customers started arriving with QR codes the next morning.",
      author: "Sachin Patil",
      role: "Owner, Patil Spices, Kolhapur",
      avatar: "SP"
    },
    {
      stars: 5,
      quote: "The analytics tools are fantastic. I can see exactly how many people viewed my dry fruit offers and which discounts converted the most visitors. GOLO is a must-have for local shops.",
      author: "Abhishek Chougule",
      role: "Founder, Sangli Dry Fruits",
      avatar: "AC"
    },
    {
      stars: 5,
      quote: "We love the QR code checkout flow. It makes redeeming discount vouchers super simple for my staff and secure for customers. Highly recommend GOLO for local growth.",
      author: "Pooja Sharma",
      role: "Manager, Royal Bakery, Kolhapur",
      avatar: "PS"
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1e2228] font-sans antialiased">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between transition-shadow duration-300 hover:shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/merchant" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#157a4f] text-[20px] font-bold text-white shadow-sm">
              G
            </div>
            <span className="text-xl font-extrabold tracking-wide text-[#157a4f] flex items-center gap-1.5">
              GOLO <span className="text-[#f3b12a]">Merchant</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-[#666] hover:text-[#157a4f] transition-colors">
            Login
          </Link>
          <Link href="/register">
            <button className="h-10 px-5 rounded-full bg-[#f3b12a] hover:bg-[#e0a022] text-[#1e2228] font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfcf9] to-white px-6 py-16 lg:py-28 lg:px-20 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div className="space-y-7 lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#157a4f] animate-pulse" />
              Trusted by 5,000+ local businesses
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold text-[#1f2329] leading-[1.05] tracking-tight">
              Digitize Your <br />
              Local Shop. <br />
              <span className="text-[#f3b12a]">Maximize Your <br />Reach.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              GOLO Merchant lets you build a digital storefront, connect with local buyers, and grow your local business community in Sangli & Kolhapur.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register">
                <button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#f3b12a] hover:bg-[#e0a022] text-[#1e2228] font-bold text-base shadow-[0_4px_12px_rgba(243,177,42,0.25)] transition-all duration-200 hover:-translate-y-0.5">
                  Start 50-Day Free Trial
                </button>
              </Link>
              <a href="#tools">
                <button className="w-full sm:w-auto h-12 px-8 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-[#1e2228] font-semibold text-base transition-all duration-200 hover:-translate-y-0.5">
                  Explore Platforms
                </button>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check size={14} />
                </div>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check size={14} />
                </div>
                Setup in 5 minutes
              </span>
            </div>
          </div>

          {/* Right Image with overlays */}
          <div className="relative lg:ml-6 flex items-center justify-center w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-[580px] w-full aspect-[4/3]">
              <Image 
                src="/images/merchant_shop_storefront.png" 
                alt="Vibrant local shop storefront" 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -top-6 -left-4 sm:-left-6 bg-white rounded-2xl shadow-xl border border-gray-50 p-3.5 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#f3b12a]">
                <Store size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Growth</p>
                <p className="text-sm font-extrabold text-[#1f2329]">50+ orders generated today</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl shadow-xl border border-gray-50 p-3.5 flex items-center gap-3 animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Earning Status</p>
                <p className="text-sm font-extrabold text-green-700">Earned Rs. 1,200+ today</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <ScrollReveal>
        <section className="bg-gray-50/50 border-y border-gray-100 py-10 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1f2329]">{stat.value}</p>
                <p className="text-sm font-bold text-[#1f2329]">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* TOOLS SECTION */}
      <ScrollReveal>
        <section id="tools" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Powerful Tools for Local Growth
            </h2>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f3b12a]">
              Everything you need to manage, market, and grow your local shop and classified ads in a single easy-to-use platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-[#157a4f]">
                    <Icon size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {feature.tags.map((tag, j) => (
                      <span key={j} className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* ANALYTICS FEATURE SECTION */}
      <ScrollReveal>
        <section className="bg-gray-50/50 border-y border-gray-100 py-20 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Analytics Chart Mockup */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md space-y-4 max-w-[540px] w-full mx-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Analytics Performance</h4>
                  <p className="text-[11px] text-gray-400">Monthly sales & visitor activity</p>
                </div>
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Live</span>
              </div>
              
              {/* SVG Chart */}
              <div className="h-48 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#f3f4f6" strokeWidth="0.2" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f3f4f6" strokeWidth="0.2" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#f3f4f6" strokeWidth="0.2" />
                  
                  {/* Week 1 Bars */}
                  <rect x="12" y="15" width="3.5" height="20" rx="1.5" fill="#157a4f" />
                  <rect x="16.5" y="10" width="3.5" height="25" rx="1.5" fill="#f3b12a" />

                  {/* Week 2 Bars */}
                  <rect x="37" y="7" width="3.5" height="28" rx="1.5" fill="#157a4f" />
                  <rect x="41.5" y="17" width="3.5" height="18" rx="1.5" fill="#f3b12a" />

                  {/* Week 3 Bars */}
                  <rect x="62" y="20" width="3.5" height="15" rx="1.5" fill="#157a4f" />
                  <rect x="66.5" y="13" width="3.5" height="22" rx="1.5" fill="#f3b12a" />

                  {/* Week 4 Bars */}
                  <rect x="87" y="5" width="3.5" height="30" rx="1.5" fill="#157a4f" />
                  <rect x="91.5" y="10" width="3.5" height="25" rx="1.5" fill="#f3b12a" />
                  
                  {/* Baseline */}
                  <line x1="0" y1="35" x2="100" y2="35" stroke="#e5e7eb" strokeWidth="0.4" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold px-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>

            {/* Right Text */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Data That Drives Decisions
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Get real-time insights on how your storefront is performing, who your customers are, and which deals generate the most sales.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Track Store Visitors</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Monitor daily unique views and visitor locations in real time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Monitor Offer Conversions</h4>
                    <p className="text-xs text-gray-500 mt-0.5">See which promotions convert impressions into actual QR scans.</p>
                  </div>
                </div>
              </div>

              <button onClick={() => router.push("/register")} className="inline-flex items-center gap-2 text-sm font-bold text-[#157a4f] hover:text-[#0f5c3d] transition-colors pt-2">
                View Analytics Feature
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* PROMOTION GRADIENT CARD SECTION */}
      <ScrollReveal>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#f9b233] via-[#f9b233] to-[#faf8f5] border border-[#f9b233]/20 p-8 sm:p-12 lg:p-16 shadow-xl flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
            <div className="space-y-6 lg:max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-black/5 border border-black/10 text-[#1e2228] px-3 py-1 rounded-full w-fit">
                <svg className="w-3 h-3 text-[#1e2228]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125V9.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                LIMITED TIME OFFER
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-[#1e2228]">
                Get Your First 50 Days of <br /><span className="text-[#f97316]">GOLO Premium</span> for Free.
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl">
                Experience every single feature, including the Analytics Suite and Smart Promotion Engine, with zero risk. No hidden fees, no credit card, just pure business growth.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800 pt-2 font-semibold">
                <span className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-400/50 text-[#f97316]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  Zero Setup Fees
                </span>
                <span className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-400/50 text-[#f97316]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  Dedicated Support Manager
                </span>
                <span className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-400/50 text-[#f97316]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  Unlimited Inventory Lists
                </span>
                <span className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-400/50 text-[#f97316]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  Featured Store Placement
                </span>
              </div>
            </div>

            <div className="bg-[#fcf7ee]/80 border border-[#f9b233]/40 rounded-[24px] p-8 lg:w-[350px] text-center space-y-4 shadow-sm shrink-0 flex flex-col justify-center">
              <div>
                <p className="text-5xl font-extrabold tracking-tight text-[#1e2228]">$0</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1e2228] mt-1">for first 50 days</p>
              </div>
              <hr className="border-[#f9b233]/25" />
              <p className="text-xs text-gray-600 italic leading-relaxed py-2">
                "The best decision we made for our boutique this year."
              </p>
              <button onClick={() => router.push("/register")} className="w-full h-12 rounded-xl bg-[#e6a71e] hover:bg-[#d99712] text-[#1e2228] font-bold text-sm shadow-sm transition-transform hover:-translate-y-0.5">
                Claim My 50 Days
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* TESTIMONIALS SECTION */}
      <ScrollReveal>
        <section className="bg-gray-50/50 border-t border-gray-100 py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Success Stories From Local Heroes
              </h2>
              <p className="text-sm text-gray-500">
                See how local shops and merchants are growing their sales using GOLO.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-[#f3b12a]">
                      {Array.from({ length: item.stars }).map((_, j) => (
                        <Star key={j} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#157a4f]/10 text-[#157a4f] text-sm font-bold">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.author}</p>
                      <p className="text-xs text-gray-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA FOOTER BANNER */}
      <ScrollReveal>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#fcf4e3] to-[#fbf7f0] border border-[#f3b12a]/30 p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Ready to reach more customers?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Join thousands of business owners who are already growing their local stores and classified ads footprint with GOLO.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <button onClick={() => router.push("/register")} className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#f3b12a] hover:bg-[#e0a022] text-[#1e2228] font-bold text-base shadow-sm transition-transform hover:-translate-y-0.5">
                Register My Business
              </button>
              <button onClick={() => router.push("/merchant/help")} className="w-full sm:w-auto h-12 px-8 rounded-xl border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-semibold text-base transition-transform hover:-translate-y-0.5">
                Schedule a Demo
              </button>
            </div>
            
            <p className="text-xs text-gray-400">
              Start your 50-day free trial. No credit card required.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* BRAND FOOTER */}
      <footer className="bg-[#f3b12a] text-[#1e2228] py-16 px-6 border-t border-[#cf8b0e]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#157a4f] text-[20px] font-bold text-white shadow-sm">
                G
              </div>
              <span className="text-xl font-bold tracking-wide text-[#157a4f]">GOLO <span className="text-[#1e2228]/80 text-sm font-medium ml-1">Merchant</span></span>
            </div>
            <p className="text-xs text-[#1e2228]/85 leading-relaxed max-w-[260px]">
              GOLO Merchant is a smart digital storefront builder helping local retailers and services digitize and grow their sales.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#157a4f]">Platform</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#1e2228]/85">
              <li><Link href="#tools" className="hover:underline">Features</Link></li>
              <li><Link href="/merchant/pricing" className="hover:underline">Pricing Plans</Link></li>
              <li><Link href="/merchant/help" className="hover:underline">Success Stories</Link></li>
              <li><Link href="/merchant/help" className="hover:underline">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#157a4f]">Support</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#1e2228]/85">
              <li><Link href="/merchant/help" className="hover:underline">Help Center</Link></li>
              <li><Link href="/merchant/settings" className="hover:underline">Dashboard Settings</Link></li>
              <li><Link href="/merchant/help" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/merchant/help" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#157a4f]">Newsletter</h4>
            <p className="text-xs text-[#1e2228]/85 leading-relaxed">
              Get the latest marketing insights and tools sent directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1 max-w-[280px]">
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Business Email" 
                className="flex-1 h-9 px-3 rounded-lg border border-transparent bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#157a4f]"
                required
              />
              <button type="submit" className="h-9 px-4 rounded-lg bg-[#157a4f] hover:bg-[#0f5c3d] text-white text-xs font-bold transition-colors">
                Join
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] text-green-700 font-bold">✓ Subscribed successfully!</p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#cf8b0e]/30 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#1e2228]/75">
          <p>© 2026 GOLO Merchant Website. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            <Link href="#" className="hover:underline">Facebook</Link>
            <Link href="#" className="hover:underline">Instagram</Link>
            <Link href="#" className="hover:underline">LinkedIn</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
