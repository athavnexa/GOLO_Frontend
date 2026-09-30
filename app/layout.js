import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./context/AuthContext";
import { VoucherProvider } from "./context/VoucherContext";
import GlobalAppBanner from "./components/GlobalAppBanner";
import PlatformReviewModal from "./components/PlatformReviewModal";
import ClarityAnalytics from "./components/ClarityAnalytics";

export const metadata = {
  title: {
    default: "AjuBaju | Best Local Deals, Offers & Services Near You",
    template: "%s | AjuBaju",
  },
  description: "Discover the best local discounts, exclusive offers, nearby store deals, and services around you. Save big on shopping, dining, wellness, and more with AjuBaju.",
  keywords: [
    "local deals", "nearby offers", "coupons", "discounts", "local savings", 
    "shopping deals", "store offers", "AjuBaju", "Choja",
    "ajubaju kolhapur", "kolhapur", "kolhapur deals", "kolhapur ads", "choja kolhapur",
    "best local offers", "nearby discounts", "dining offers", "wellness discount coupons", 
    "local business finder", "store discounts near me", "nearby services marketplace", 
    "best deals in city", "ajubaju app savings", "active merchant discounts"
  ],
  authors: [{ name: "AjuBaju Team" }],
  creator: "AjuBaju",
  publisher: "AjuBaju",
  metadataBase: new URL("https://ajubaju.co.in"),
  openGraph: {
    title: "AjuBaju | Best Local Deals, Offers & Services Near You",
    description: "Discover the best local discounts, exclusive offers, nearby store deals, and services around you.",
    url: "https://ajubaju.co.in",
    siteName: "AjuBaju",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AjuBaju | Best Local Deals, Offers & Services Near You",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative isolate bg-[#f3f3f3] font-sans">
        <AuthProvider>
          <VoucherProvider>
            <main className="relative z-10 min-h-screen bg-[#f3f3f3]">{children}</main>
            <GlobalAppBanner />
            <PlatformReviewModal />
            <ClarityAnalytics />
          </VoucherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
