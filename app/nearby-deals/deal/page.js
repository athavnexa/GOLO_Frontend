import DealClient from "./DealClient";

function getAbsoluteUrl(path) {
  if (!path) return "https://www.golo.com/images/default-offer.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `https://www.golo.com${path}`;
  return `https://www.golo.com/${path}`;
}

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const offerId = searchParams?.offerId;
  
  if (!offerId) {
    return {
      title: "Offer not found | GOLO",
      description: "This offer does not exist or has been removed."
    };
  }

  try {
    const res = await fetch(`http://localhost:3002/offers/${offerId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Offer fetch failed");
    const data = await res.json();
    const offer = data.data || data;

    const title = offer?.title || offer?.offerTitle || offer?.productName || "GOLO Offer";
    const description = offer?.description || "Check out this amazing offer on GOLO!";
    
    let imageUrl = "https://www.golo.com/images/default-offer.jpg";
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

    const offerUrl = `https://www.golo.com/nearby-deals/deal?offerId=${encodeURIComponent(offerId)}`;

    return {
      title: `${title} | GOLO`,
      description,
      openGraph: {
        title: `Checkout this offer: ${title}`,
        description,
        url: offerUrl,
        siteName: "GOLO",
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
        title: `Checkout this offer: ${title}`,
        description,
        images: [imageUrl],
      }
    };
  } catch (err) {
    console.error("Error generating metadata for offer:", err);
    return {
      title: "GOLO Offer",
      description: "Check out this amazing offer on GOLO!"
    };
  }
}

export default async function DealPage(props) {
  return <DealClient />;
}
