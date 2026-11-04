export default async function sitemap() {
  const baseUrl = "https://ajubaju.co.in";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
  const now = new Date();

  // 1. Static Core Landing Pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/nearby-deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/choja`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help-center`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. Exact Local Deal Categories
  const dealCategories = [
    "Food & Restaurants",
    "Home Services",
    "Beauty & Wellness",
    "Healthcare & Medical",
    "Hotels & Accommodation",
    "Shopping & Retail",
    "Education & Training",
    "Real Estate",
    "Events & Entertainment",
    "Professional Services",
    "Automotive Services",
    "Home Improvement",
    "Fitness & Sports",
    "Daily Needs & Utilities",
    "Local Businesses & Vendors",
  ];
  const dealCategoryRoutes = dealCategories.map((cat) => ({
    url: `${baseUrl}/nearby-deals?category=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Exact Choja Classified Categories
  const chojaCategories = [
    "Education",
    "Vehicle",
    "Property",
    "Employment",
    "Mobiles",
    "Electronics & Home Appliances",
    "Matrimonial",
    "Business",
    "Astrology",
    "Health & Wellness",
    "Lost & Found",
    "Service",
    "Personal",
    "Pets",
    "Public Notice",
    "Travel",
    "Furniture",
    "Greetings & Tributes",
  ];
  const chojaCategoryRoutes = chojaCategories.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 4. Dynamic Offers (Nearby Deals)
  let offerRoutes = [];
  try {
    const res = await fetch(`${apiUrl}/offers/nearby?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const offers = json.data || json;
      if (Array.isArray(offers)) {
        offerRoutes = offers
          .filter((item) => item?.requestId || item?._id || item?.id)
          .map((item) => {
            const id = item.requestId || item._id || item.id;
            return {
              url: `${baseUrl}/nearby-deals/deal?offerId=${encodeURIComponent(id)}`,
              lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
              changeFrequency: "daily",
              priority: 0.8,
            };
          });
      }
    }
  } catch (err) {
    console.warn("[Sitemap] Failed to fetch offers:", err?.message);
  }

  // 5. Dynamic Classified Ads (Choja)
  let adRoutes = [];
  try {
    const res = await fetch(`${apiUrl}/ads?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const ads = json.data || json;
      if (Array.isArray(ads)) {
        adRoutes = ads
          .filter((ad) => ad?._id || ad?.id)
          .map((ad) => {
            const id = ad._id || ad.id;
            return {
              url: `${baseUrl}/product/${id}`,
              lastModified: ad.updatedAt ? new Date(ad.updatedAt) : now,
              changeFrequency: "daily",
              priority: 0.8,
            };
          });
      }
    }
  } catch (err) {
    console.warn("[Sitemap] Failed to fetch ads:", err?.message);
  }

  // 6. Dynamic Verified Merchants (deduplicated by merchantId)
  let merchantRoutes = [];
  const knownMerchantIds = new Set();

  // 6a. Also harvest merchant IDs from dynamic offers
  try {
    if (Array.isArray(offerRoutes)) {
      // Offers fetched above have merchants attached
    }
  } catch (_) {}

  try {
    const res = await fetch(`${apiUrl}/merchant/public/search?q=a&limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const merchants = json.data || json;
      if (Array.isArray(merchants)) {
        merchants
          .filter((m) => m?.merchantId || m?._id || m?.userId)
          .forEach((m) => {
            const mId = String(m.merchantId || m._id || m.userId);
            if (!knownMerchantIds.has(mId)) {
              knownMerchantIds.add(mId);
              merchantRoutes.push({
                url: `${baseUrl}/nearby-deals/store?merchantId=${encodeURIComponent(mId)}`,
                lastModified: now,
                changeFrequency: "daily",
                priority: 0.85,
              });
            }
          });
      }
    }
  } catch (err) {
    console.warn("[Sitemap] Failed to fetch merchants:", err?.message);
  }

  return [
    ...staticRoutes,
    ...dealCategoryRoutes,
    ...chojaCategoryRoutes,
    ...merchantRoutes,
    ...offerRoutes,
    ...adRoutes,
  ];
}
