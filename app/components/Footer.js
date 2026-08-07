"use client";

import Link from "next/link";
import {
  Info,
  Briefcase,
  FileText,
  Store,
  HelpCircle,
  Mail,
  Shield,
  Cookie,
  MapPin,
  Phone,
  CreditCard,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  QrCode,
  Landmark,
  Wallet,
} from "lucide-react";

function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M3 2.75a1 1 0 0 1 1.5-.86l12.2 7.06a1 1 0 0 1 0 1.72L4.5 17.73a1 1 0 0 1-1.5-.86V2.75Z" />
      <path d="M16.9 8.7 14.2 6.1l-8.3 8.3 10.9-5.7Z" />
      <path d="M14.2 17.9 16.9 15.3 6 9.6l8.2 8.3Z" />
      <path d="M17.4 8.3 15.4 6.3 13.3 8.4l2 2 2.1-2.1Z" />
      <path d="M17.4 15.7 15.4 17.7 13.3 15.6l2-2 2.1 2.1Z" />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98 1.12.09 2.27-.56 2.98-1.42Z" />
    </svg>
  );
}

function XIcon({ size = 15, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ width: size, height: size }} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-8 bg-[#e89a23] text-[#33250b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Upper Main Footer section */}
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: Company */}
          <div>
            <h4 className="text-[16px] font-extrabold text-[#241a07] mb-5 tracking-tight">Company</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/about" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <Info size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/careers" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <Briefcase size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Careers</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <FileText size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/press" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <FileText size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Press</span>
                </Link>
              </li>
              <li>
                <Link href="/merchant/upgrade" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <Store size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Become a Merchant</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="text-[16px] font-extrabold text-[#241a07] mb-5 tracking-tight">Customer Service</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/help-center" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <HelpCircle size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Help Center</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <Mail size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <HelpCircle size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>FAQs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-[16px] font-extrabold text-[#241a07] mb-5 tracking-tight">Legal</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/terms" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <FileText size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <Shield size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] hover:text-[#111] transition-colors">
                  <Cookie size={16} strokeWidth={2.2} className="shrink-0" />
                  <span>Cookie Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Mail us & Download App */}
          <div>
            <h4 className="text-[16px] font-extrabold text-[#241a07] mb-5 tracking-tight">Mail us</h4>
            <div className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16] mb-6">
              <Mail size={16} strokeWidth={2.2} className="shrink-0" />
              <a href="mailto:hr@nexaprime.in" className="hover:text-[#111] transition-colors">hr@nexaprime.in</a>
            </div>

            <div className="border-t border-[#d88c1b] my-5" />

            <h5 className="text-[11px] font-bold text-[#4c3a16] uppercase tracking-wider mb-3">DOWNLOAD THE APP</h5>
            <div className="flex flex-col gap-2.5 max-w-[160px]">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[6px] bg-black px-3.5 py-1.5 text-white transition hover:bg-black/90 shadow-sm"
              >
                <PlayStoreIcon />
                <span className="text-[8px] font-medium leading-[1.2] text-gray-300">
                  GET IT ON
                  <br />
                  <span className="text-[13px] font-semibold text-white">Google Play</span>
                </span>
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[6px] bg-black px-3.5 py-1.5 text-white transition hover:bg-black/90 shadow-sm"
              >
                <AppStoreIcon />
                <span className="text-[8px] font-medium leading-[1.2] text-gray-300">
                  Download on the
                  <br />
                  <span className="text-[13px] font-semibold text-white">App Store</span>
                </span>
              </a>
            </div>
          </div>

          {/* Column 5: Registered Office Address */}
          <div>
            <h4 className="text-[16px] font-extrabold text-[#241a07] mb-5 tracking-tight">Registered office address</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-[13.5px] font-medium text-[#4c3a16]">
                <MapPin size={18} strokeWidth={2.2} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold text-[#241a07]">Address:</span> Subhash Rd, Y.P.Powar nagar, Kolhapur, Maharashtra 416012
                </p>
              </div>
              <div className="flex items-center gap-3 text-[13.5px] font-medium text-[#4c3a16]">
                <Phone size={18} strokeWidth={2.2} className="shrink-0" />
                <p>
                  <span className="font-bold text-[#241a07]">Phone:</span> 09359514237
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#cf8618] border-t border-[#d88c1b] py-5 px-6">
        <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <p className="text-[13px] font-medium text-[#2d2412]">
            © 2026 GOLO. All rights reserved.
          </p>

          {/* Middle: Payments */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[12.5px] font-bold text-[#2d2412] tracking-wider uppercase">
            <span className="flex items-center gap-1.5 shrink-0"><QrCode size={16} /> UPI</span>
            <div className="h-4 w-px bg-[#2d2412]/30 hidden sm:block" />
            <span className="flex items-center gap-1.5 shrink-0"><CreditCard size={16} /> Cards</span>
            <div className="h-4 w-px bg-[#2d2412]/30 hidden sm:block" />
            <span className="flex items-center gap-1.5 shrink-0"><Landmark size={16} /> Netbanking</span>
            <div className="h-4 w-px bg-[#2d2412]/30 hidden sm:block" />
            <span className="flex items-center gap-1.5 shrink-0"><Wallet size={16} /> Wallet</span>
          </div>

          {/* Right: Social Media links */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2d2412]/40 text-[#2d2412] hover:bg-[#2d2412] hover:text-white transition-all duration-200"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2d2412]/40 text-[#2d2412] hover:bg-[#2d2412] hover:text-white transition-all duration-200"
            >
              <XIcon size={14} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2d2412]/40 text-[#2d2412] hover:bg-[#2d2412] hover:text-white transition-all duration-200"
            >
              <Youtube size={15} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2d2412]/40 text-[#2d2412] hover:bg-[#2d2412] hover:text-white transition-all duration-200"
            >
              <Facebook size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
