import FaqClient from "./FaqClient";
import { SECTIONS } from "./faqData";

export const metadata = {
  title: "Frequently Asked Questions (FAQs) | AjuBaju Support & Help",
  description: "Find authoritative answers to frequently asked questions about AjuBaju local store offers, discount vouchers, merchant registration, inventory tools, and Choja classifieds.",
  keywords: [
    "AjuBaju FAQs",
    "frequently asked questions",
    "AjuBaju help",
    "how to claim vouchers",
    "merchant registration AjuBaju",
    "Choja classifieds guide",
    "local deals FAQ",
    "discount vouchers questions",
  ],
  alternates: {
    canonical: "https://ajubaju.co.in/faqs",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQs) | AjuBaju Support & Help",
    description: "Find authoritative answers to frequently asked questions about AjuBaju local deals, vouchers, merchant tools, and Choja classifieds.",
    url: "https://ajubaju.co.in/faqs",
    siteName: "AjuBaju",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://ajubaju.co.in/images/merchant_shop_storefront.png",
        width: 1200,
        height: 630,
        alt: "AjuBaju FAQs & Help Center",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQs) | AjuBaju",
    description: "Authoritative answers to frequently asked questions about AjuBaju local store offers, vouchers, and Choja classifieds.",
    images: ["https://ajubaju.co.in/images/merchant_shop_storefront.png"],
  },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": SECTIONS.flatMap((section) =>
      section.qs.map(([q, a]) => ({
        "@type": "Question",
        "name": q.replace(/^\d+\.\s*/, "").trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a.replace(/\n/g, "<br/>"),
        },
      }))
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ajubaju.co.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Help Center",
        "item": "https://ajubaju.co.in/help-center",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "FAQs",
        "item": "https://ajubaju.co.in/faqs",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FaqClient />
    </>
  );
}
