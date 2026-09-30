import { getPublicMerchantProductById } from "../../lib/api/merchant";;
import ProductClient from "./ProductClient";

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id;
  if (!id) {
    return {
      title: "Product Details | AjuBaju",
      description: "View product details on AjuBaju.",
    };
  }

  try {
    const data = await getPublicMerchantProductById(id);
    const product = data?.data;
    
    if (!product) {
      return {
        title: "Product Not Found | AjuBaju",
      };
    }

    const defaultImage = "https://ajubaju.co.in/images/merchant_shop_storefront.png"; // Must be PNG/JPG for WhatsApp
    let ogImage = product.images?.[0] || product.image || defaultImage;

    // WhatsApp rejects .webp and .avif. If it's Cloudinary with f_auto, replace it.
    if (typeof ogImage === "string") {
      ogImage = ogImage.replace("f_auto", "f_jpg").replace(/\.webp$|\.avif$/, ".jpg");
      if (ogImage.startsWith("/")) {
        ogImage = `https://ajubaju.co.in${ogImage}`;
      }
    }

    const desc = product.description || `Check out ${product.name} on AjuBaju!`;

    return {
      title: `${product.name} | AjuBaju`,
      description: desc,
      openGraph: {
        title: `${product.name} | AjuBaju`,
        description: desc,
        images: [{ url: ogImage }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | AjuBaju`,
        description: desc,
        images: [ogImage],
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Details | AjuBaju",
    };
  }
}

export default function ProductPage() {
  // The client component reads searchParams via useSearchParams()
  return <ProductClient />;
}
