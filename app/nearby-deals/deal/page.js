import { redirect } from "next/navigation";
import DealClient from "./DealClient";

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
  const offerId = searchParams?.offerId;
  
  if (!offerId) {
    if (searchParams?.q || searchParams?.location) {
      return {
        title: "Search Nearby Deals | AjuBaju",
        description: "Browse nearby deals, offers, and local merchants on AjuBaju.",
        alternates: {
          canonical: "https://ajubaju.co.in/nearby-deals",
        },
      };
    }
    return {
      title: "Offer not found | AjuBaju",
      description: "This offer does not exist or has been removed."
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
    const res = await fetch(`${baseUrl}/offers/${offerId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Offer fetch failed");
    const data = await res.json();
    const offer = data.data || data;

    const title = offer?.title || offer?.offerTitle || offer?.productName || "AjuBaju Offer";
    const description = offer?.description || "Check out this amazing offer on AjuBaju!";
    
    let imageUrl = "https://ajubaju.co.in/images/merchant_shop_storefront.png";
    if (offer?.images && offer.images.length > 0) {
      imageUrl = getAbsoluteUrl(offer.images[0]);
    } else if (offer?.imageUrl) {
      imageUrl = getAbsoluteUrl(offer.imageUrl);
    } else if (offer?.offerImage) {
      imageUrl = getAbsoluteUrl(offer.offerImage);
    } else if (offer?.selectedProducts?.[0]?.imageUrl) {
      imageUrl = getAbsoluteUrl(offer.selectedProducts[0].imageUrl);
    } else if (offer?.selectedProducts?.[0]?.image) {
      imageUrl = getAbsoluteUrl(offer.selectedProducts[0].image);
    } else if (offer?.merchant?.shopPhoto) {
      imageUrl = getAbsoluteUrl(offer.merchant.shopPhoto);
    }

    // Force jpeg for WhatsApp compatibility
    if (imageUrl.includes("res.cloudinary.com")) {
      imageUrl = imageUrl.replace(/\.(webp|avif|png|heic)$/i, ".jpg");
    }

    const offerUrl = `https://ajubaju.co.in/nearby-deals/deal?offerId=${encodeURIComponent(offerId)}`;

    return {
      title: `${title} | AjuBaju Deals`,
      description,
      keywords: [
        title,
        offer?.category || "Local Offers",
        "local deals",
        "nearby discounts",
        "discount vouchers",
        "store offers",
        "AjuBaju deals",
      ],
      alternates: {
        canonical: offerUrl,
      },
      openGraph: {
        title: `Checkout this offer: ${title} | AjuBaju`,
        description,
        url: offerUrl,
        siteName: "AjuBaju",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: "image/jpeg",
          }
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `Checkout this offer: ${title} | AjuBaju`,
        description,
        images: [imageUrl],
      }
    };
  } catch (err) {
    console.error("Error generating metadata for offer:", err);
    return {
      title: "AjuBaju Offer",
      description: "Check out this amazing offer on AjuBaju!"
    };
  }
}

export default async function DealPage(props) {
  const searchParams = await props.searchParams;
  const offerId = searchParams?.offerId;

  // If a search query or location was passed instead of an offerId, redirect to the search/deals page
  if (!offerId && (searchParams?.q || searchParams?.location)) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(searchParams || {})) {
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      }
    }
    redirect(`/nearby-deals?${params.toString()}`);
  }

  let offerSchema = null;
  let breadcrumbSchema = null;

  if (offerId) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const res = await fetch(`${baseUrl}/offers/${offerId}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const offer = json.data || json;
        if (offer) {
          const title = offer?.title || offer?.offerTitle || "Special Offer";
          const desc = offer?.description || `Claim this discount voucher from ${offer?.merchant?.name || "verified merchant"} on AjuBaju.`;
          const price = Number(offer?.displayPrice ?? offer?.totalPrice ?? 0);
          const offerUrl = `https://ajubaju.co.in/nearby-deals/deal?offerId=${encodeURIComponent(offerId)}`;

          let imgUrl = "https://ajubaju.co.in/images/merchant_shop_storefront.png";
          if (offer?.images?.[0]) imgUrl = getAbsoluteUrl(offer.images[0]);
          else if (offer?.imageUrl) imgUrl = getAbsoluteUrl(offer.imageUrl);
          else if (offer?.merchant?.shopPhoto) imgUrl = getAbsoluteUrl(offer.merchant.shopPhoto);

          offerSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "description": desc,
            "image": imgUrl,
            "category": offer?.category || "Local Offers",
            "offers": {
              "@type": "Offer",
              "url": offerUrl,
              "price": price,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              ...(offer?.startsAt ? { "validFrom": offer.startsAt } : {}),
              ...(offer?.endsAt ? { "priceValidUntil": offer.endsAt } : {}),
              ...(offer?.merchant?.name
                ? {
                    "seller": {
                      "@type": "LocalBusiness",
                      "name": offer.merchant.name,
                      ...(offer.merchant.address ? { "address": offer.merchant.address } : {}),
                    },
                  }
                : {}),
            },
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
                "name": title,
                "item": offerUrl,
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
      {offerSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <DealClient />
    </>
  );
}
