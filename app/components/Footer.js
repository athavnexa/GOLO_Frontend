"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Store,
  BadgeHelp,
  RotateCcw,
  Mail,
  HelpCircle,
  FileText,
  Shield,
  ChevronRight,
  Briefcase,
  Package,
  Smartphone,
  ShoppingBag,
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

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
];

function GOLOFooter() {
  return (
    <footer className="mt-5 bg-[#f3a61c] text-[#2d2412] sm:mt-8">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white text-2xl font-black text-[#f3a61c] shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                G
              </div>
              <p className="text-[28px] font-extrabold tracking-tight text-white">
                GOLO
              </p>
            </div>
            <p className="mt-6 max-w-[260px] text-[14px] leading-6 text-[#3f310f]">
              Your local marketplace for the best deals, nearby. Connecting communities with trusted merchants.
            </p>
            <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-[#8d6708]">
              Download the app
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center gap-2 rounded-[4px] bg-[#1f1f1f] px-3 text-white shadow-sm"
              >
                <PlayStoreIcon />
                <span className="text-[10px] font-semibold leading-3">
                  GET IT ON
                  <br />
                  <span className="text-[14px]">Google Play</span>
                </span>
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center gap-2 rounded-[4px] bg-[#1f1f1f] px-3 text-white shadow-sm"
              >
                <Smartphone size={16} />
                <span className="text-[10px] font-semibold leading-3">
                  DOWNLOAD ON
                  <br />
                  <span className="text-[14px]">App Store</span>
                </span>
              </a>
            </div>
          </div>

          <FooterColumn
            title="Shop"
            items={[
              { href: "/nearby-deals", icon: MapPin, label: "Nearby Deals" },
              { href: "/nearby-deals?sort=popular", icon: Store, label: "Popular Shops" },
              { href: "/nearby-deals?sort=flash", icon: BadgeHelp, label: "Flash Deals" },
              { href: "/nearby-deals?sort=new", icon: Package, label: "New Arrivals" },
              { href: "/nearby-deals?sort=best", icon: ChevronRight, label: "Best Sellers" },
            ]}
          />

          <FooterColumn
            title="Customer Service"
            items={[
              { href: "/help", icon: HelpCircle, label: "Help Center" },
              { href: "/returns", icon: RotateCcw, label: "Returns & Refunds" },
              { href: "/contact", icon: Mail, label: "Contact Us" },
              { href: "/faqs", icon: HelpCircle, label: "FAQs" },
            ]}
          />

          <FooterColumn
            title="Company"
            items={[
              { href: "/about", icon: FileText, label: "About Us" },
              { href: "/careers", icon: Briefcase, label: "Careers" },
              { href: "/blog", icon: FileText, label: "Blog" },
              { href: "/press", icon: FileText, label: "Press" },
              { href: "/merchant/upgrade", icon: ShoppingBag, label: "Become a Merchant" },
            ]}
          />

          <FooterColumn
            title="Legal"
            items={[
              { href: "/terms", icon: FileText, label: "Terms of Service" },
              { href: "/privacy", icon: Shield, label: "Privacy Policy" },
              { href: "/refund-policy", icon: RotateCcw, label: "Refund Policy" },
              { href: "/cookie-policy", icon: Shield, label: "Cookie Policy" },
            ]}
          />
        </div>

        <div className="mt-10 border-t border-black/10 pt-5">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
            <p className="text-[13px] font-medium text-[#3d2f0f]">
              © 2026 GOLO. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[13px] font-semibold text-white/90">
              <span className="rounded-full border border-white/40 px-3 py-1">UPI</span>
              <span className="rounded-full border border-white/40 px-3 py-1">PAYPAL</span>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efb335] text-white shadow-sm transition hover:scale-105"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h3 className="text-[17px] font-extrabold text-[#2d2412]">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map(({ href, icon: Icon, label }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex items-center gap-3 text-[14px] text-[#4d3c16] transition hover:text-[#1f1f1f]"
            >
              <Icon size={14} className="shrink-0 opacity-80" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegacyFooter() {
  return (
    <footer className="mt-5 border-t border-[#e7a91f] bg-[#f3b22a] py-4 sm:mt-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[18px] border border-white/60 bg-[#f6c24f] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.10)] sm:gap-6 sm:rounded-[30px] sm:p-8 sm:shadow-[0_18px_44px_rgba(0,0,0,0.12)] lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base font-black text-[#157a4f] shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                G
              </div>
              <div>
                <p className="text-base font-semibold text-[#2f2a1e] sm:text-xl">GOLO</p>
                <p className="text-xs text-[#5a4514]/80 sm:text-sm">Local deals, shops, and everyday favorites</p>
              </div>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#5a4514]/90 sm:mt-4 sm:text-base sm:leading-7">
              Discover nearby offers, support local businesses, and enjoy a smoother way to shop, save, and explore.
            </p>

            <div className="mt-3 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 sm:h-11 sm:w-11"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:min-w-[420px]">
            <div className="flex-1">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5a4514] sm:mb-3 sm:text-sm sm:tracking-[0.2em]">Explore</h4>
              <ul className="space-y-1.5 text-xs text-[#4e3d1d] sm:space-y-2 sm:text-sm">
                <li><Link href="/" className="transition hover:text-[#157a4f] hover:underline">Home</Link></li>
                <li><Link href="/nearby-deals" className="transition hover:text-[#157a4f] hover:underline">Nearby Deals</Link></li>
                <li><Link href="/choja" className="transition hover:text-[#157a4f] hover:underline">Choja</Link></li>
              </ul>
            </div>

            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#157a4f] px-3 py-2.5 text-white shadow-md transition hover:-translate-y-0.5 sm:gap-3 sm:rounded-[18px] sm:px-4 sm:py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 sm:h-11 sm:w-11 sm:rounded-2xl">
                <PlayStoreIcon />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Get it on</p>
                <p className="text-base font-semibold">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname() || "";
  const isGolocalSurface =
    pathname === "/" ||
    pathname.startsWith("/nearby-deals") ||
    (pathname.startsWith("/profile") &&
      !pathname.startsWith("/profile/transactions") &&
      !/^\/profile\/[a-f0-9]{24}$/i.test(pathname)) ||
    pathname.startsWith("/my-deals");

  return isGolocalSurface ? <GOLOFooter /> : <LegacyFooter />;
}
