"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";

export default function Template5Layout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/merchant/templates/template5" },
    { label: "Products", href: "/merchant/templates/template5/products" },
    { label: "About Us", href: "/merchant/templates/template5/about" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />

      {/* HEADER */}
      <header className="bg-[#cf9d34] h-[60px] flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
        {/* Logo */}
        <Link href="/merchant/templates/template5" className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-white text-lg font-playfair tracking-wide ml-1">Sand and Saga</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm text-white transition-opacity ${
                pathname === link.href ? "font-semibold opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Link href="/merchant/templates/template5/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                alt="Sarah M."
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-white font-medium hidden sm:block">Sarah M.</span>
          </Link>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 bg-white">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#cf9d34] text-white py-12 px-6 md:px-12 mt-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 border-[1.5px] border-white rotate-45 relative flex-shrink-0"></div>
              <span className="font-bold text-lg font-playfair">Style Haven Boutique</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Curating timeless elegance and modern style for the sophisticated individual. Your haven for high-quality fashion.
            </p>
          </div>

          {/* Shop Collections */}
          <div>
            <h4 className="font-bold text-sm mb-4 font-playfair">Shop Collections</h4>
            <ul className="space-y-3 text-xs text-white/80">
              <li><Link href="/merchant/templates/template5" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/merchant/templates/template5/products" className="hover:text-white transition-colors">Producst</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold text-sm mb-4 font-playfair">Information</h4>
            <ul className="space-y-3 text-xs text-white/80">
              <li><Link href="/merchant/templates/template5/about" className="hover:text-white transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-sm mb-4 font-playfair">Connect</h4>
            <ul className="space-y-3 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0" />
                <a href="mailto:hello@stylehaven.com" className="hover:text-white transition-colors">hello@stylehaven.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="flex-shrink-0" />
                <span>123 Fashion Ave, NY</span>
              </li>
            </ul>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors"><Instagram size={16} /></a>
              <a href="#" className="text-white/80 hover:text-white transition-colors"><Facebook size={16} /></a>
              <a href="#" className="text-white/80 hover:text-white transition-colors"><Twitter size={16} /></a>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
