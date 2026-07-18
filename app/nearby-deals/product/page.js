import { getPublicMerchantProductById } from "../../lib/api";
import ProductClient from "./ProductClient";

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id;
  if (!id) {
    return {
      title: "Product Details | GOLO",
      description: "View product details on GOLO.",
    };
  }

  try {
    const data = await getPublicMerchantProductById(id);
    const product = data?.data;
    
    if (!product) {
      return {
        title: "Product Not Found | GOLO",
      };
    }

    const defaultImage = "https://golo.co.in/images/place2.avif"; // Using a sensible fallback
    const ogImage = product.images?.[0] || product.image || defaultImage;
    const desc = product.description || `Check out ${product.name} on GOLO!`;

    return {
      title: `${product.name} | GOLO`,
      description: desc,
      openGraph: {
        title: `${product.name} | GOLO`,
        description: desc,
        images: [ogImage],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | GOLO`,
        description: desc,
        images: [ogImage],
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Details | GOLO",
    };
  }
}

export default function ProductPage() {
  // The client component reads searchParams via useSearchParams()
  return <ProductClient />;
}
