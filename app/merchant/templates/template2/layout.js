"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Template2Layout({ children }) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-gray-800 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/merchant/templates/template2" className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#819973] rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#819973] rounded-full"></div>
            </div>
            <span className="font-serif font-bold text-xl text-[#819973] tracking-wide ml-1">Aura Studio</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-12 text-sm font-medium text-gray-500">
            <Link 
              href="/merchant/templates/template2" 
              className={`hover:text-[#819973] transition-colors pb-1 ${pathname === '/merchant/templates/template2' ? 'border-b-2 border-[#819973] text-gray-900' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/merchant/templates/template2/products" 
              className={`hover:text-[#819973] transition-colors pb-1 ${pathname === '/merchant/templates/template2/products' ? 'border-b-2 border-[#819973] text-gray-900' : ''}`}
            >
              Services
            </Link>
            <Link 
              href="/merchant/templates/template2#about" 
              className="hover:text-[#819973] transition-colors pb-1"
            >
              About Us
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah M." className="w-full h-full object-cover" />
            </div>
            <span className="font-medium text-sm text-gray-700 hidden sm:block">Sarah M.</span>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#fcfcfb] border-t border-gray-100 py-16 px-6 md:px-12 mt-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 border-2 border-[#819973] rotate-45 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-[#819973] rounded-full"></div>
              </div>
              <span className="font-serif font-bold text-lg text-[#819973] tracking-wide ml-1">Aura Studio</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mb-8">
              Elevating the everyday through mindful design and luxury craftsmanship. Join our community of style seekers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-[#819973] transition-colors"><Instagram size={16} /></a>
              <a href="#" className="text-gray-500 hover:text-[#819973] transition-colors"><Facebook size={16} /></a>
              <a href="#" className="text-gray-500 hover:text-[#819973] transition-colors"><Twitter size={16} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-gray-900 mb-6">Explore</h4>
            <ul className="space-y-4 text-xs text-gray-500">
              <li><Link href="/merchant/templates/template2" className="hover:text-[#819973] transition-colors">Home</Link></li>
              <li><Link href="/merchant/templates/template2#about" className="hover:text-[#819973] transition-colors">About Us</Link></li>
              <li><Link href="/merchant/templates/template2/products" className="hover:text-[#819973] transition-colors">Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-gray-900 mb-6">Newsletter</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Subscribe to receive exclusive access to new launches and seasonal private sales.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 w-full focus:outline-none focus:border-[#819973]"
              />
              <button className="bg-[#819973] text-white text-xs px-6 py-2.5 font-medium hover:bg-[#6b825d] transition-colors">
                Join
              </button>
            </div>
          </div>
          
        </div>
        <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            © 2024 AURA STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
