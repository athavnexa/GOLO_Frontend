"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Template3Layout({ children }) {
  const pathname = usePathname();
  
  const handleScroll = (e, targetId) => {
    if (pathname === '/merchant/templates/template3') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      {/* HEADER */}
      <header className="bg-[#f0e9df] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/merchant/templates/template3" className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#7e2b29] rotate-45 flex items-center justify-center bg-[#7e2b29]">
              <div className="w-2 h-2 border border-white rotate-45"></div>
            </div>
            <span className="font-serif font-bold text-xl text-[#7e2b29] tracking-wide ml-1">Aura Estates</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-12 text-sm text-gray-500 font-medium ml-auto">
            <Link 
              href="/merchant/templates/template3" 
              className={`hover:text-[#7e2b29] transition-colors py-7 border-b-2 ${pathname === '/merchant/templates/template3' ? 'border-[#7e2b29] text-gray-900' : 'border-transparent'}`}
            >
              Home
            </Link>
            <Link 
              href="/merchant/templates/template3/products" 
              className={`hover:text-[#7e2b29] transition-colors py-7 border-b-2 ${pathname.includes('/products') ? 'border-[#7e2b29] text-gray-900' : 'border-transparent'}`}
            >
              Services
            </Link>
            <Link 
              href="/merchant/templates/template3#about" 
              onClick={(e) => handleScroll(e, 'about')}
              className="hover:text-[#7e2b29] transition-colors py-7 border-b-2 border-transparent"
            >
              About Us
            </Link>
          </nav>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#faf9f8] border-t border-gray-100 py-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 border-2 border-[#7e2b29] rotate-45 flex items-center justify-center bg-[#7e2b29]">
                <div className="w-1.5 h-1.5 border border-white rotate-45"></div>
              </div>
              <span className="font-serif font-bold text-lg text-[#7e2b29] tracking-wide ml-1">Aura Estates</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mb-8">
              Setting the global gold standard in luxury property matchmaking. Connecting visionary homeowners with exquisite architectural experiences.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#7e2b29] hover:border-[#7e2b29] cursor-pointer transition-colors"><Phone size={14} /></div>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#7e2b29] hover:border-[#7e2b29] cursor-pointer transition-colors"><Mail size={14} /></div>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#7e2b29] hover:border-[#7e2b29] cursor-pointer transition-colors"><MapPin size={14} /></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-6">Services</h4>
            <ul className="space-y-4 text-xs text-gray-500">
              <li><a href="#" className="hover:text-[#7e2b29] transition-colors">Property Management</a></li>
              <li><a href="#" className="hover:text-[#7e2b29] transition-colors">Real Estate Investment</a></li>
              <li><a href="#" className="hover:text-[#7e2b29] transition-colors">Relocation Services</a></li>
              <li><a href="#" className="hover:text-[#7e2b29] transition-colors">Home Valuation</a></li>
              <li><a href="#" className="hover:text-[#7e2b29] transition-colors">Mortgage Advisory</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xs tracking-widest uppercase text-gray-900 mb-6">EXPLORE</h4>
            <ul className="space-y-4 text-xs text-gray-500">
              <li><Link href="/merchant/templates/template3" className="hover:text-[#7e2b29] transition-colors">Home</Link></li>
              <li><Link href="/merchant/templates/template3#about" className="hover:text-[#7e2b29] transition-colors">About Us</Link></li>
              <li><Link href="/merchant/templates/template3/products" className="hover:text-[#7e2b29] transition-colors">Products</Link></li>
            </ul>
          </div>
          
        </div>
        <div className="max-w-[1400px] mx-auto mt-16 pt-8 text-left">
          <p className="text-[9px] text-gray-400 font-medium">
            © 2024 Aura Estates International. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
