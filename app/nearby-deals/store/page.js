import StoreClient from "./StoreClient";

const CANONICAL_R2_PUBLIC_URL = "https://pub-21e329eb32bd4d239fbb89a98ea331f9.r2.dev";

function getAbsoluteUrl(path) {
  if (!path) return "https://ajubaju.co.in/images/merchant_shop_storefront.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/media/file/")) {
    const key = path.replace("/api/media/file/", "");
    return `${CANONICAL_R2_PUBLIC_URL}/${key.replace(/^\/+/, "")}`;
  }
  if (path.startsWith("/uploads/") || path.startsWith("uploads/")) {
    return `${CANONICAL_R2_PUBLIC_URL}/${path.replace(/^\/+/, "")}`;
  }
  if (path.startsWith("/")) return `https://ajubaju.co.in${path}`;
  if (path.includes("/")) {
    return `${CANONICAL_R2_PUBLIC_URL}/${path}`;
  }
  return `https://ajubaju.co.in/${path}`;
}

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const merchantId = searchParams?.merchantId;

  if (!merchantId) {
    return {
      title: "Store Details | AjuBaju Deals",
      description: "Discover verified local merchant stores and nearby shopping discounts on AjuBaju.",
      alternates: {
        canonical: "https://ajubaju.co.in/nearby-deals",
      },
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
    const res = await fetch(`${baseUrl}/merchant/public/${merchantId}/profile`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Merchant fetch failed");
    const json = await res.json();
    const store = json.data || json;

    const storeName = store?.storeName || "Local Store";
    const location = store?.storeLocation || "Near You";
    const category = store?.storeCategory || "Local Store";
    const title = `${storeName} | Offers & Location in ${location}`;
    const description = `Visit ${storeName} in ${location}. Browse active discounts, store vouchers, product catalog, and directions on AjuBaju.`;
    const storeUrl = `https://ajubaju.co.in/nearby-deals/store?merchantId=${encodeURIComponent(merchantId)}`;

    let imageUrl = "https://ajubaju.co.in/images/merchant_shop_storefront.png";
    if (store?.shopPhoto) {
      imageUrl = getAbsoluteUrl(store.shopPhoto);
    } else if (store?.profilePhoto) {
      imageUrl = getAbsoluteUrl(store.profilePhoto);
    }

    if (imageUrl.includes("res.cloudinary.com")) {
      imageUrl = imageUrl.replace(/\.(webp|avif|png|heic)$/i, ".jpg");
    }

    return {
      title,
      description,
      keywords: [
        storeName,
        `${storeName} offers`,
        `${storeName} ${location}`,
        category,
        "local store offers",
        "nearby shops",
        "store discounts",
        "AjuBaju",
      ],
      alternates: {
        canonical: storeUrl,
      },
      openGraph: {
        title,
        description,
        url: storeUrl,
        siteName: "AjuBaju",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: storeName,
            type: "image/jpeg",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.warn("[Metadata] Error generating store metadata:", error?.message);
    return {
      title: "Local Store | AjuBaju Deals",
      description: "Discover local merchant stores and nearby discounts on AjuBaju.",
    };
  }
}

export default async function NearbyStorePage(props) {
  const searchParams = await props.searchParams;
  const merchantId = searchParams?.merchantId;

  let localBusinessSchema = null;
  let breadcrumbSchema = null;
  if (merchantId) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const res = await fetch(`${baseUrl}/merchant/public/${merchantId}/profile`, {
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        const store = json.data || json;
        if (store?.storeName) {
          localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": store.storeName,
            "description": `Browse offers, products, and services from ${store.storeName} on AjuBaju.`,
            "url": `https://ajubaju.co.in/nearby-deals/store?merchantId=${encodeURIComponent(merchantId)}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": store.storeLocation || "",
            },
            ...(store.storeLocationLatitude && store.storeLocationLongitude
              ? {
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": store.storeLocationLatitude,
                    "longitude": store.storeLocationLongitude,
                  },
                }
              : {}),
          };

          breadcrumbSchema = {
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
                "name": "Nearby Deals",
                "item": "https://ajubaju.co.in/nearby-deals",
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": store.storeName,
                "item": `https://ajubaju.co.in/nearby-deals/store?merchantId=${encodeURIComponent(merchantId)}`,
              },
            ],
          };
        }
      }
    } catch (e) {
      // Non-blocking schema fallback
    }
  }

  return (
    <>
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <StoreClient />
    </>
  );
}
