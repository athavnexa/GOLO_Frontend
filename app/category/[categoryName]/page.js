import CategoryClient from "./CategoryClient";

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const rawCat = params?.categoryName || "";
  const categoryName = decodeURIComponent(rawCat);
  const sub = searchParams?.sub ? decodeURIComponent(searchParams.sub) : "";

  const titlePrefix = sub ? `${categoryName} (${sub})` : categoryName;
  const title = `${titlePrefix} Classifieds & Second Hand Listings | Choja AjuBaju`;
  const description = `Browse verified ${titlePrefix} listings, buy and sell second-hand items, compare prices, and connect directly with local sellers in your area on Choja by AjuBaju.`;
  const canonicalUrl = `https://ajubaju.co.in/category/${encodeURIComponent(categoryName)}${sub ? `?sub=${encodeURIComponent(sub)}` : ""}`;

  return {
    title,
    description,
    keywords: [
      categoryName,
      `${categoryName} second hand`,
      `${categoryName} OLX`,
      `${categoryName} classifieds`,
      `${categoryName} buy sell`,
      `${categoryName} near me`,
      `used ${categoryName.toLowerCase()}`,
      "Choja ads",
      "ajubaju choja",
      "kolhapur classifieds",
      "used products marketplace",
      "local classifieds",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Choja by AjuBaju",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://ajubaju.co.in/images/merchant_shop_storefront.png",
          width: 1200,
          height: 630,
          alt: `${titlePrefix} on Choja AjuBaju`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://ajubaju.co.in/images/merchant_shop_storefront.png"],
    },
  };
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const rawCat = params?.categoryName || "";
  const categoryName = decodeURIComponent(rawCat);
  const sub = searchParams?.sub ? decodeURIComponent(searchParams.sub) : "";
  const canonicalUrl = `https://ajubaju.co.in/category/${encodeURIComponent(categoryName)}${sub ? `?sub=${encodeURIComponent(sub)}` : ""}`;

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} Classifieds`,
    "description": `Browse verified ${categoryName} listings on Choja by AjuBaju.`,
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "AjuBaju",
      "url": "https://ajubaju.co.in",
    },
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
        "name": "Choja Classifieds",
        "item": "https://ajubaju.co.in/choja",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryClient />
    </>
  );
}
