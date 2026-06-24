import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M3 2.75a1 1 0 0 1 1.5-.86l12.2 7.06a1 1 0 0 1 0 1.72L4.5 17.73a1 1 0 0 1-1.5-.86V2.75Z" />
      <path d="M16.9 8.7 14.2 6.1l-8.3 8.3 10.9-5.7Z" />
      <path d="M14.2 17.9 16.9 15.3 6 9.6l8.2 8.3Z" />
      <path d="M17.4 8.3 15.4 6.3 13.3 8.4l2 2 2.1-2.1Z" />
      <path d="M17.4 15.7 15.4 17.7 13.3 15.6l2-2 2.1 2.1Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook, color: "bg-[#1877F2]" },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram, color: "bg-[#E4405F]" },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube, color: "bg-[#FF0000]" },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[#e7a91f] bg-[#f3b22a] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[30px] border border-white/60 bg-[#f6c24f] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.12)] sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#157a4f] shadow-sm">
                G
              </div>
              <div>
                <p className="text-xl font-semibold text-[#2f2a1e]">GOLO</p>
                <p className="text-sm text-[#5a4514]/80">Local deals, shops, and everyday favorites</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#5a4514]/90 sm:text-base">
              Discover nearby offers, support local businesses, and enjoy a smoother way to shop, save, and explore.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 ${color}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:min-w-[420px]">
            <div className="flex-1">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#5a4514]">Explore</h4>
              <ul className="space-y-2 text-sm text-[#4e3d1d]">
                <li><Link href="/" className="transition hover:text-[#157a4f] hover:underline">Home</Link></li>
                <li><Link href="/nearby-deals" className="transition hover:text-[#157a4f] hover:underline">Nearby Deals</Link></li>
                <li><Link href="/choja" className="transition hover:text-[#157a4f] hover:underline">Choja</Link></li>
              </ul>
            </div>

            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[18px] bg-[#157a4f] px-4 py-3 text-white shadow-md transition hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
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
