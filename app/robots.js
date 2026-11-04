export default function robots() {
  const baseUrl = "https://ajubaju.co.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/nearby-deals",
          "/nearby-deals/*",
          "/choja",
          "/choja/*",
          "/product/*",
          "/category/*",
          "/help-center",
          "/faqs",
          "/terms",
          "/privacy",
          "/cookie-policy",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/merchant",
          "/merchant/*",
          "/profile",
          "/profile/*",
          "/chats",
          "/chats/*",
          "/my-ads",
          "/my-deals",
          "/post-ad",
          "/wishlist",
          "/analytics",
          "/select-location",
          "/template6",
          "/api/*",
          "/*?*token=",
          "/*?*auth=",
          "/*?*session=",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/*",
          "/merchant/*",
          "/profile/*",
          "/chats/*",
          "/my-ads",
          "/my-deals",
          "/post-ad",
          "/wishlist",
          "/*?*token=",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/admin/*",
          "/merchant/*",
          "/profile/*",
          "/chats/*",
          "/my-ads",
          "/my-deals",
          "/post-ad",
          "/wishlist",
          "/*?*token=",
        ],
      },
      // Explicit directives for AI Search & Answer Engines (ChatGPT, Perplexity, Gemini, Claude)
      {
        userAgent: "GPTBot",
        allow: ["/", "/nearby-deals", "/choja", "/category/*", "/product/*", "/faqs", "/help-center"],
        disallow: ["/admin/*", "/merchant/*", "/profile/*", "/chats/*"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/nearby-deals", "/choja", "/category/*", "/product/*", "/faqs", "/help-center"],
        disallow: ["/admin/*", "/merchant/*", "/profile/*", "/chats/*"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/nearby-deals", "/choja", "/category/*", "/product/*", "/faqs", "/help-center"],
        disallow: ["/admin/*", "/merchant/*", "/profile/*", "/chats/*"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
