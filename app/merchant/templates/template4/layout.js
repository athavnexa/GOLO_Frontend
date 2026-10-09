"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Home } from "lucide-react";

export default function Template4Layout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/merchant/templates/template4" },
    { label: "Listings", href: "/merchant/templates/template4/products" },
    { label: "About Us", href: "/merchant/templates/template4/about" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/merchant/templates/template4" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6b35c8] rounded-lg flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[#1a1a2e]">Clean Home</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-[#6b35c8] transition-colors ${
                  pathname === link.href ? "text-[#6b35c8] font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#6b35c8]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="John Roy"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-gray-800 hidden sm:block">John Roy</span>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-14 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#6b35c8] rounded-lg flex items-center justify-center">
                <Home size={14} className="text-white" />
              </div>
              <span className="font-bold text-[#6b35c8] text-lg">HomeHaven</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Providing modern homeowners with the most reliable, efficient, and transparent home maintenance network in the country.
            </p>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4">Popular Services</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              {["Emergency Plumbing", "Electrical Diagnostics", "AC Repair & Service", "Smart Home Installation", "Wall Painting & Decor"].map((s) => (
                <li key={s}><a href="#" className="hover:text-[#6b35c8] transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li><Link href="/merchant/templates/template4" className="hover:text-[#6b35c8] transition-colors">Home</Link></li>
              <li><Link href="/merchant/templates/template4/products" className="hover:text-[#6b35c8] transition-colors">Services</Link></li>
              <li><Link href="/merchant/templates/template4/about" className="hover:text-[#6b35c8] transition-colors">About Us</Link></li>
              <li><Link href="/merchant/templates/template4/profile" className="hover:text-[#6b35c8] transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4">Support & Contact</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li className="flex items-center gap-2"><Phone size={13} className="text-[#6b35c8]" /> 1-800-HAVEN-HOME</li>
              <li className="flex items-center gap-2"><Mail size={13} className="text-[#6b35c8]" /> support@homehaven.com</li>
              <li className="flex items-center gap-2"><MapPin size={13} className="text-[#6b35c8]" /> 123 Design Way, Austin, TX</li>
            </ul>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-[#6b35c8] uppercase tracking-wider">SERVICE GUARANTEE</p>
              <p className="text-[10px] text-gray-400 mt-1">Fully insured and licensed in all 50 states.</p>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">© 2024 HomeHaven Services Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
