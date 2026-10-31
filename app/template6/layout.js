"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";

export default function Template6Layout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/template6" },
    { label: "Products", href: "/template6/products" },
    { label: "About Us", href: "/template6/about" },
    { label: "Gallery", href: "/template6/gallery" },
  ];

  const isActive = (href) => {
    if (href === "/template6") {
      return pathname === "/template6" || pathname === "/template6/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#ece4d9] text-[#222] font-sans flex flex-col selection:bg-[#d4a329]/20 selection:text-[#222]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />

      {/* HEADER */}
      <header className="bg-[#4d5885] h-[64px] flex items-center justify-between px-6 md:px-14 sticky top-0 z-50 shadow-sm border-b border-white/10">
        {/* Left: Brand Logo & Name */}
        <Link href="/template6" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 border-[1.5px] border-white rotate-45 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold text-white text-[19px] font-playfair tracking-wide">
            Sand and Saga
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-8 md:gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] md:text-[14px] text-white transition-all duration-200 tracking-wide ${
                  active
                    ? "font-semibold opacity-100 underline decoration-2 underline-offset-8"
                    : "opacity-80 hover:opacity-100 hover:underline hover:underline-offset-8"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Avatar + Name */}
        <div className="flex items-center gap-3.5">
          <div className="h-5 w-[1px] bg-white/30 hidden sm:block"></div>
          <Link
            href="/template6/profile"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/60 shadow-sm group-hover:ring-2 group-hover:ring-white/40 transition-all">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Sarah M."
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] text-white font-medium hidden sm:inline-block">
              Sarah M.
            </span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-[#ece4d9]">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#4d5885] text-white pt-14 pb-10 px-6 md:px-14 border-t border-white/10 mt-auto">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-5 h-5 border-[1.5px] border-white rotate-45 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <span className="font-bold text-[17px] font-playfair tracking-wide">
                Style Haven Boutique
              </span>
            </div>
            <p className="text-[12px] text-white/80 leading-relaxed max-w-[260px]">
              Curating timeless elegance and modern style for the sophisticated individual. Your haven for high-quality fashion.
            </p>
          </div>

          {/* Col 2: Shop Collections */}
          <div>
            <h4 className="font-bold text-[14px] mb-4 font-playfair tracking-wide">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-[12px] text-white/80">
              <li>
                <Link href="/template6" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/template6/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/template6/gallery" className="hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information */}
          <div>
            <h4 className="font-bold text-[14px] mb-4 font-playfair tracking-wide">
              Information
            </h4>
            <ul className="space-y-2.5 text-[12px] text-white/80">
              <li>
                <Link href="/template6/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[14px] mb-4 font-playfair tracking-wide">
                Connect
              </h4>
              <ul className="space-y-2 text-[12px] text-white/80">
                <li className="flex items-center gap-2">
                  <Mail size={14} className="shrink-0" />
                  <a href="mailto:hello@stylehaven.com" className="hover:text-white transition-colors">
                    hello@stylehaven.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0" />
                  <span>123 Fashion Ave, NY</span>
                </li>
              </ul>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={17} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={17} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <span>© 2026 Sand and Saga Cafe. All rights reserved.</span>
          <span className="flex items-center gap-1.5 font-medium text-white/80">
            Made with <span className="text-[#888cfa] font-bold">Visily</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
