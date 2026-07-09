import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./context/AuthContext";
import { VoucherProvider } from "./context/VoucherContext";

export const metadata = {
  title: {
    default: "GOLO | Best Local Deals, Offers & Services Near You",
    template: "%s | GOLO",
  },
  description: "Discover the best local discounts, exclusive offers, nearby store deals, and services around you. Save big on shopping, dining, wellness, and more with GOLO.",
  keywords: [
    "local deals", "nearby offers", "coupons", "discounts", "local savings", 
    "shopping deals", "store offers", "GOLO", "Choja",
    "golo kolhapur", "kolhapur", "kolhapur deals", "kolhapur ads", "choja kolhapur",
    "best local offers", "nearby discounts", "dining offers", "wellness discount coupons", 
    "local business finder", "store discounts near me", "nearby services marketplace", 
    "best deals in city", "golo app savings", "active merchant discounts"
  ],
  authors: [{ name: "GOLO Team" }],
  creator: "GOLO",
  publisher: "GOLO",
  metadataBase: new URL("https://golo.co.in"),
  openGraph: {
    title: "GOLO | Best Local Deals, Offers & Services Near You",
    description: "Discover the best local discounts, exclusive offers, nearby store deals, and services around you.",
    url: "https://golo.co.in",
    siteName: "GOLO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOLO | Best Local Deals, Offers & Services Near You",
    description: "Discover the best local discounts, exclusive offers, nearby store deals, and services around you.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative isolate bg-[#f3f3f3]">
        <AuthProvider>
          <VoucherProvider>
            <main className="relative z-10 min-h-screen bg-[#f3f3f3]">{children}</main>
          </VoucherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
