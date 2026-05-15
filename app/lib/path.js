export function normalizeAppPath(pathname = "") {
  if (typeof pathname !== "string") return "";

  if (pathname === "/api") return "/";
  if (pathname.startsWith("/api/")) {
    return pathname.slice(4) || "/";
  }

  return pathname || "/";
}