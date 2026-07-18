import AdClient from "./AdClient";

function getAbsoluteUrl(path) {
  if (!path) return "https://www.golo.com/images/default-ad.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `https://www.golo.com${path}`;
  return `https://www.golo.com/${path}`;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const adId = params?.id;
  
  if (!adId) {
    return {
      title: "Ad not found | GOLO",
      description: "This ad does not exist or has been removed."
    };
  }

  try {
    const res = await fetch(`http://localhost:3002/ads/${adId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Ad fetch failed");
    const data = await res.json();
    const ad = data.data || data;

    const title = ad?.title || ad?.productName || "GOLO Ad";
    const description = ad?.description || "Check out this amazing ad on GOLO!";
    
    let imageUrl = "https://www.golo.com/images/default-ad.jpg";
    if (ad?.images && ad.images.length > 0) {
      imageUrl = getAbsoluteUrl(ad.images[0]);
    } else if (ad?.imageUrl) {
      imageUrl = getAbsoluteUrl(ad.imageUrl);
    } else if (ad?.adImage) {
      imageUrl = getAbsoluteUrl(ad.adImage);
    }
    
    // Force jpeg for WhatsApp compatibility
    if (imageUrl.includes("res.cloudinary.com")) {
      imageUrl = imageUrl.replace(/\.(webp|avif|png|heic)$/i, ".jpg");
    }

    return {
      title: `${title} | GOLO`,
      description,
      openGraph: {
        title,
        description,
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
        title,
        description,
        images: [imageUrl],
      }
    };
  } catch (err) {
    console.error("Error generating metadata for ad:", err);
    return {
      title: "GOLO Ad",
      description: "Check out this amazing ad on GOLO!"
    };
  }
}

export default async function AdPage(props) {
  return <AdClient params={props.params} />;
}
