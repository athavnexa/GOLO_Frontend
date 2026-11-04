import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./context/AuthContext";
import { VoucherProvider } from "./context/VoucherContext";
import QueryProvider from "./context/QueryProvider";
import GlobalAppBanner from "./components/GlobalAppBanner";
import PlatformReviewModal from "./components/PlatformReviewModal";
import ClarityAnalytics from "./components/ClarityAnalytics";

export const metadata = {
  title: {
    default: "AjuBaju | Best Local Deals, Offers, Stores & Choja Classifieds",
    template: "%s | AjuBaju",
  },
  description: "Discover the best local discounts, exclusive offers, nearby store deals, and Choja classifieds at rates much cheaper than OLX. Save big on shopping, dining, wellness, and buy & sell used items near you with AjuBaju.",
  keywords: [
    // AjuBaju Core & Deals
    "AjuBaju", "ajubaju.co.in", "local deals", "nearby offers", "coupons", "discounts", "local savings", 
    "shopping deals", "store offers", "best local offers", "nearby discounts", "dining offers", 
    "wellness discount coupons", "local business finder", "store discounts near me", "nearby services marketplace", 
    "best deals in city", "active merchant discounts", "food vouchers", "restaurant discount vouchers",
    // Competitor & Comparative Search Terms
    "Nearbuy alternative", "Magicpin offers alternative", "Justdial local shops", "GrabOn coupons", 
    "CashKaro local deals", "local discount vouchers", "nearby retail offers",
    // Choja & Classifieds (Cheaper Than OLX Alternative)
    "Choja", "Choja classifieds", "ajubaju choja", "cheaper than olx", "cheaper alternative to olx", 
    "post ads cheaper than olx", "buy sell used products", "second hand mobile phones", "used bikes kolhapur", 
    "second hand cars", "furniture marketplace", "used electronics", "olx alternative", "olx alternative India", 
    "sites like olx", "quikr alternative", "post ads nearby", "classified listing site", "lowest price ad posting",
    // Geo Intent (Kolhapur & Maharashtra Hubs)
    "ajubaju kolhapur", "kolhapur deals", "kolhapur ads", "choja kolhapur", "buy sell kolhapur", 
    "rajarampuri deals", "shahupuri offers", "maharashtra local deals", "local shops kolhapur"
  ],
  authors: [{ name: "AjuBaju Team" }],
  creator: "AjuBaju",
  publisher: "AjuBaju",
  metadataBase: new URL("https://ajubaju.co.in"),
  alternates: {
    canonical: "https://ajubaju.co.in",
  },
  openGraph: {
    title: "AjuBaju | Best Local Deals, Offers, Stores & Choja Classifieds",
    description: "Discover the best local discounts, exclusive offers, nearby store deals, and Choja classifieds at rates much cheaper than OLX near you.",
    url: "https://ajubaju.co.in",
    siteName: "AjuBaju",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://ajubaju.co.in/images/merchant_shop_storefront.png",
        width: 1200,
        height: 630,
        alt: "AjuBaju & Choja - Local Deals & Classifieds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AjuBaju | Best Local Deals, Offers, Stores & Choja Classifieds",
    description: "Discover the best local discounts, exclusive offers, nearby store deals, and Choja classifieds at rates much cheaper than OLX near you.",
    images: ["https://ajubaju.co.in/images/merchant_shop_storefront.png"],
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

const structuredSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ajubaju.co.in/#website",
      "url": "https://ajubaju.co.in",
      "name": "AjuBaju",
      "alternateName": ["Choja", "AjuBaju Choja"],
      "description": "Discover local deals, nearby store discounts, and classified ads cheaper than OLX on AjuBaju & Choja.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ajubaju.co.in/nearby-deals?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://ajubaju.co.in/#organization",
      "name": "AjuBaju",
      "url": "https://ajubaju.co.in",
      "logo": "https://ajubaju.co.in/images/logo.png"
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
      </head>
      <body className={`${poppins.className} ${poppins.variable} relative isolate bg-[#f3f3f3] font-sans`}>
        <AuthProvider>
          <VoucherProvider>
            <QueryProvider>
              <main className="relative z-10 min-h-screen bg-[#f3f3f3]">{children}</main>
              <GlobalAppBanner />
              <PlatformReviewModal />
              <ClarityAnalytics />
            </QueryProvider>
          </VoucherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
