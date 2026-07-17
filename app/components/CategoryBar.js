"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Grid,
  GraduationCap,
  Car,
  Home,
  Briefcase,
  Smartphone,
  Tv,
  Heart,
  Store,
  Sparkles,
  Search,
  Wrench,
  User,
  PawPrint,
  Megaphone,
  Plane,
  Sofa,
  Gift,
  Package,
  Utensils,
  HeartPulse,
  Building2,
  ShoppingBag,
  Building,
  Ticket,
  Hammer,
  Dumbbell,
  Zap,
} from "lucide-react";
import { createPortal } from "react-dom";
import { normalizeAppPath, withFrontendBasePath } from "../lib/path";
// Categories are now dynamically fetched from backend API
import { API_BASE_URL } from "../lib/api";

// ----- Icon maps (choja / "all" categories) -----
const allIconMap = {
  Education: GraduationCap,
  Vehicle: Car,
  Property: Home,
  Employment: Briefcase,
  Mobiles: Smartphone,
  "Electronics & Home Appliances": Tv,
  Matrimonial: Heart,
  Business: Store,
  Astrology: Sparkles,
  "Health & Wellness": HeartPulse,
  "Lost & Found": Search,
  Service: Wrench,
  Personal: User,
  Pets: PawPrint,
  "Public Notice": Megaphone,
  Travel: Plane,
  Furniture: Sofa,
  "Greetings & Tributes": Gift,
  Other: Package,
};

// ----- Icon maps (golocal categories) -----
const golocalIconMap = {
  "Food & Restaurants": Utensils,
  "Home Services": Wrench,
  "Beauty & Wellness": Sparkles,
  "Healthcare & Medical": HeartPulse,
  "Hotels & Accommodation": Building2,
  "Shopping & Retail": ShoppingBag,
  "Education & Training": GraduationCap,
  "Real Estate": Building,
  "Events & Entertainment": Ticket,
  "Professional Services": Briefcase,
  "Automotive Services": Car,
  "Home Improvement": Hammer,
  "Fitness & Sports": Dumbbell,
  "Daily Needs & Utilities": Zap,
  "Local Businesses & Vendors": Store,
};

// Pastel circle background + matching darker shade for icon/text, cycled per item.
const COLOR_PALETTE = [
  { bg: "#fde8e8", dark: "#c2185b" }, // pink
  { bg: "#eaf0fb", dark: "#1d4ed8" }, // blue
  { bg: "#f3e8fd", dark: "#7c3aed" }, // purple
  { bg: "#e6f7f1", dark: "#0f766e" }, // teal
  { bg: "#eef0fb", dark: "#4338ca" }, // indigo
  { bg: "#fef3c7", dark: "#b45309" }, // yellow/amber
  { bg: "#fdeaf2", dark: "#be185d" }, // rose
  { bg: "#eef3fa", dark: "#0369a1" }, // sky blue
  { bg: "#e8f5e9", dark: "#15803d" }, // green
  { bg: "#fde8d9", dark: "#c2410c" }, // orange
];

export default function CategoryBar({ variant = "choja", preferredCategories = [] }) {
  return <CategoryBarContent variant={variant} preferredCategories={preferredCategories} />;
}

function CategoryBarContent({ variant = "choja", preferredCategories = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [golocalActiveCategory, setGolocalActiveCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Dynamic Categories State
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
        const payload = await res.json();
        if (payload.success && Array.isArray(payload.data)) {
          // Filter to only Active categories
          setDbCategories(payload.data.filter(c => c.status === "Active"));
        }
      } catch (err) {
        console.error("Failed to fetch categories dynamically", err);
      } finally {
        setIsLoadingCats(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const buttonRefs = useRef({});
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  const pathname = normalizeAppPath(usePathname());
  // Derive active category from URL like /category/Vehicle
  const activeCat = (() => {
    const match = pathname?.match(/^\/category\/([^/?]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  })();

  const activeGolocalCategoryFromUrl = (() => {
    if (pathname !== "/nearby-deals") return null;
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    return category ? decodeURIComponent(category) : null;
  })();

  // Filter DB categories into Golocal and Main
  const golocalCategories = useMemo(() => {
    const validGolocalNames = new Set([
      "Food & Restaurants", "Home Services", "Beauty & Wellness", "Healthcare & Medical",
      "Hotels & Accommodation", "Shopping & Retail", "Education & Training", "Real Estate",
      "Events & Entertainment", "Professional Services", "Automotive Services", 
      "Home Improvement", "Fitness & Sports", "Daily Needs & Utilities", "Local Businesses & Vendors"
    ]);
    return dbCategories.filter(c => validGolocalNames.has(c.name));
  }, [dbCategories]);

  const mainCategories = useMemo(() => {
    // Anything not golocal and has no parent
    const golocalSet = new Set(golocalCategories.map(c => c.name));
    return dbCategories.filter(c => !golocalSet.has(c.name) && (!c.parent || c.parent === 'None (Root Category)'));
  }, [dbCategories, golocalCategories]);

  // Map backend category names to frontend display names for matching
  const BACKEND_TO_DISPLAY_MAP = {
    "Food & Dining": "Food & Restaurants",
    "Beauty": "Beauty & Wellness",
    "Healthcare": "Healthcare & Medical",
  };

  const preferredDisplaySet = useMemo(() => {
    const set = new Set();
    if (Array.isArray(preferredCategories) && preferredCategories.length > 0) {
      preferredCategories.forEach(cat => {
        const displayName = BACKEND_TO_DISPLAY_MAP[cat] || cat;
        if (golocalCategories.some(c => c.name === displayName)) {
          set.add(displayName);
        }
      });
    }
    return set;
  }, [preferredCategories]);

  const orderedGolocalCategories = useMemo(() => {
    const preferred = [];
    const others = [];
    golocalCategories.forEach(cat => {
      if (preferredDisplaySet.has(cat.name)) {
        preferred.push(cat);
      } else {
        others.push(cat);
      }
    });
    return [...preferred, ...others];
  }, [preferredDisplaySet]);

  // Render the full list — the bar fills available width with equal spacing
  // between chips, and falls back to horizontal scroll only once it overflows.
  const categoriesToRender = variant === "golocal" ? orderedGolocalCategories.slice(0, 10) : mainCategories.slice(0, 10);
  const iconMapForVariant = variant === "golocal" ? golocalIconMap : allIconMap;

  // Stable color lookup keyed by category name, so colors don't shift when the
  // visible/ordered slice changes (e.g. preferred categories reordering).
  const allNamesForVariant = dbCategories.map(c => c.name);

  const colorForCategory = (name) => {
    const idx = allNamesForVariant.indexOf(name);
    const safeIdx = idx === -1 ? 0 : idx;
    return COLOR_PALETTE[safeIdx % COLOR_PALETTE.length];
  };

  useEffect(() => {
    function handleClickOutside(e) {
      const clickedInsideWrapper = wrapperRef.current?.contains(e.target);
      const clickedInsideDropdown = dropdownRef.current?.contains(e.target);
      if (!clickedInsideWrapper && !clickedInsideDropdown) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToCategory = (categoryName, sub = null) => {
    if (variant === "golocal") {
      const nextParams = new URLSearchParams();
      nextParams.set("category", categoryName);

      const currentParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;

      const currentLocation = currentParams?.get("location");
      if (currentLocation) {
        nextParams.set("location", currentLocation);
      }

      const currentQuery = currentParams?.get("q");
      if (currentQuery) {
        nextParams.set("q", currentQuery);
      }

      const targetUrl = withFrontendBasePath(`/nearby-deals?${nextParams.toString()}`);

      if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
      }

      setGolocalActiveCategory(categoryName);
      setActiveDropdown(null);
      setShowAllModal(false);
      return;
    }

    const encoded = encodeURIComponent(categoryName);
    const url = sub
      ? withFrontendBasePath(`/category/${encoded}?sub=${encodeURIComponent(sub)}`)
      : withFrontendBasePath(`/category/${encoded}`);

    if (typeof window !== "undefined") {
      window.location.assign(url);
    }

    setActiveDropdown(null);
    setShowAllModal(false);
  };

  const handleCategoryClick = (cat) => {
    if (variant === "golocal") {
      navigateToCategory(cat.name);
      return;
    }

    if (!cat.sub) {
      navigateToCategory(cat.name);
      return;
    }

    if (activeDropdown === cat.name) {
      setActiveDropdown(null);
      return;
    }

    const rect = buttonRefs.current[cat.name]?.getBoundingClientRect();
    if (!rect) return;

    setDropdownPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });

    setActiveDropdown(cat.name);
  };

  const isCategoryActive = (catName) =>
    variant === "golocal" ? activeGolocalCategory === catName : activeCat === catName;

  const shellPaddingY = isMobile ? "4px" : "9px";
  const iconLabelGap = isMobile ? "3px" : "5px";
  const iconSize = isMobile ? "32px" : "40px";
  const iconGlyphSize = isMobile ? 15 : 18;
  const labelMinHeight = isMobile ? "20px" : "26px";
  const pillPadding = isMobile ? "6px 8px" : "9px 14px";
  const pillWidth = isMobile ? "80px" : "104px";

  return (
    <>
      {/* MAIN BAR — icon-over-label card style.
          Background is transparent on purpose: the actual gradient
          (colors: #f8a812 -> #fad081 -> #f8f6f265, height 270) is rendered
          once as a shared fixed layer by <Navbar />, positioned behind both
          the header and this bar, so there is zero seam between them.

          NOTE: this bar is intentionally NOT sticky/fixed. It scrolls with
          the page like normal content, so as the user scrolls down it
          disappears underneath the (sticky, higher z-index) Navbar header
          instead of stacking on top of it. */}
      <div
        ref={wrapperRef}
        className="border-0 shadow-none"
        style={{
          width: "100%",
          background: "transparent",
          position: "relative",
          zIndex: 1,
          border: "0 solid transparent",
          borderBottom: "0 solid transparent",
          boxShadow: "none",
          outline: "none",
          marginTop: -2,
          paddingTop: 0,
          overflow: "hidden",
        }}
      >
        <div
          className="golo-category-shell"
          style={{
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-start",
            padding: `${shellPaddingY} 24px`,
            gap: "12px",
          }}
        >
          {/* Categories — fills available width with equal spacing, scrolls if it overflows */}
          <div
            className={variant === "golocal" ? "golo-category-scroll golo-category-row" : "golo-category-scroll choja-category-row"}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: categoriesToRender.length > 6 ? "space-between" : "flex-start",
              gap: "8px",
              overflowX: "hidden",
              flexWrap: "nowrap",
              flex: 1,
              minWidth: 0,
            }}
          >
            {categoriesToRender.map((cat) => {
              const active = isCategoryActive(cat.name);
              const { bg, dark } = colorForCategory(cat.name);
              const IconComponent = iconMapForVariant[cat.name] || Package;
              return (
                <button
                  key={cat.name}
                  ref={(el) => (buttonRefs.current[cat.name] = el)}
                  className="golo-category-pill"
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: iconLabelGap,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    width: pillWidth,
                    flexShrink: 0,
                    padding: pillPadding,
                  }}
                >
                  <span
                    style={{
                      width: iconSize,
                      height: iconSize,
                      borderRadius: "50%",
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconComponent size={iconGlyphSize} color={dark} strokeWidth={2} />
                  </span>
                  <span
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordBreak: "break-word",
                      fontSize: isMobile ? "11px" : "12.5px",
                      fontWeight: 700,
                      color: active ? "#157A4F" : "#1f2933",
                      textAlign: "center",
                      lineHeight: 1.2,
                      borderBottom: active ? "2px solid #157A4F" : "2px solid transparent",
                      paddingBottom: "2px",
                      width: "100%",
                      minHeight: labelMinHeight,
                    }}
                  >
                    {cat.name}
                    {variant !== "golocal" && cat.sub && (
                      <ChevronDown
                        size={11}
                        style={{
                          display: "inline",
                          verticalAlign: "middle",
                          marginLeft: "2px",
                          transition: "transform 0.2s",
                          transform: activeDropdown === cat.name ? "rotate(180deg)" : "none",
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEE ALL — static, always visible on the right */}
          <button
            onClick={() => setShowAllModal(true)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: iconLabelGap,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              minWidth: isMobile ? "54px" : "72px",
              flexShrink: 0,
              padding: isMobile ? "2px 4px" : "2px 6px",
            }}
          >
            <span
              style={{
                width: iconSize,
                height: iconSize,
                borderRadius: "12px",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
              }}
            >
              <Grid size={iconGlyphSize} />
            </span>
            <span style={{ fontSize: isMobile ? "11px" : "12.5px", fontWeight: 700, color: "#1f2933" }}>
              See All
            </span>
          </button>
        </div>
      </div>

      {/* DROPDOWN (sub-categories, choja only) */}
      {activeDropdown && dropdownPosition && typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 9999,
              background: "#fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              borderRadius: "16px",
              padding: "8px",
              border: "1px solid #e5e7eb",
              minWidth: "180px",
              animation: "fadeDown 0.15s ease",
            }}
          >
            <style>{`@keyframes fadeDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }`}</style>
            <button
              onClick={() => navigateToCategory(activeDropdown)}
              style={{ width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", border: "none", background: "transparent", fontWeight: 700, fontSize: "14px", color: "#157A4F", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              All {activeDropdown}
            </button>
            <div style={{ height: "1px", background: "#e5e7eb", margin: "4px 0" }} />
            {mainCategories
              .find((c) => c.name === activeDropdown)
              ?.sub?.map((subItem) => (
                <button
                  key={subItem}
                  onClick={() => navigateToCategory(activeDropdown, subItem)}
                  style={{ width: "100%", textAlign: "left", padding: "9px 14px", borderRadius: "10px", border: "none", background: "transparent", fontSize: "13px", fontWeight: 500, color: "#374151", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {subItem}
                </button>
              ))}
          </div>,
          document.body
        )}

      {/* SEE ALL MODAL */}
      {showAllModal && typeof window !== "undefined" &&
        createPortal(
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAllModal(false); }}
          >
            <div className="golo-category-modal" style={{ background: "#fff", borderRadius: "24px", padding: "32px", width: "90%", maxWidth: "720px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>All Categories</h3>
                <button onClick={() => setShowAllModal(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: "10px", padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>
                  ✕ Close
                </button>
              </div>

              <p style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "12px", textTransform: "uppercase" }}>Categories</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "24px" }}>
                {(variant === "golocal" ? golocalCategories : mainCategories).map((cat) => {
                  const { bg, dark } = colorForCategory(cat.name);
                  const IconComponent = (variant === "golocal" ? golocalIconMap : allIconMap)[cat.name] || Package;
                  const subs = dbCategories.filter(c => c.parent === cat.name).map(c => c.name);
                  const hasSub = subs.length > 0;
                  return (
                    <div key={cat.name} className="flex flex-col">
                      <button
                        onClick={() => navigateToCategory(cat.name)}
                        style={{
                          padding: "14px 10px",
                          borderRadius: "14px",
                          border: isCategoryActive(cat.name) ? `1.5px solid ${dark}` : "1.5px solid transparent",
                          background: bg,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: dark,
                          textAlign: "center",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                      >
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 8px",
                          }}
                        >
                          <IconComponent size={20} color={dark} strokeWidth={2} />
                        </span>
                        {cat.name}
                        {hasSub && (
                          <ChevronDown 
                            size={14} 
                            style={{ display: "inline-block", marginLeft: "4px" }}
                          />
                        )}
                      </button>
                      {hasSub && (
                        <div style={{ paddingLeft: "52px", paddingRight: "16px", marginTop: "8px", marginBottom: "16px" }}>
                          {subs.map((s) => (
                            <div
                              key={s}
                              style={{ padding: "8px 0", fontSize: "13px", color: "#4b5563", cursor: "pointer", borderLeft: "2px solid #f3f4f6", paddingLeft: "12px" }}
                              onClick={() => {
                                navigateToCategory(cat.name, s);
                                setShowAllModal(false);
                              }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {variant !== "golocal" && (
                <>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "12px", textTransform: "uppercase" }}>More Categories</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                    {extraCategories.map((cat) => {
                      const { bg, dark } = colorForCategory(cat);
                      const IconComponent = allIconMap[cat] || Package;
                      return (
                        <button
                          key={cat}
                          onClick={() => navigateToCategory(cat)}
                          style={{
                            padding: "14px 10px",
                            borderRadius: "14px",
                            border: "1.5px solid transparent",
                            background: bg,
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: dark,
                            textAlign: "center",
                            transition: "transform 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                        >
                          <span
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 8px",
                            }}
                          >
                            <IconComponent size={20} color={dark} strokeWidth={2} />
                          </span>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}