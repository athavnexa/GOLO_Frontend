"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getAllAds, getNearbyAds, searchAds, trackAdView, trackAdContactClick } from "../lib/api/ads";
import { useApiQuery } from "../lib/hooks/useApiQuery";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";
import { normalizeAppPath } from "../lib/path";

const SORT_OPTIONS = [
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Nearby", value: "distance_asc" },
];

const BIG_CARD_LAYOUT = {
    col: "col-span-12 lg:col-span-6",
    row: "row-span-2",
};

const SMALL_CARD_LAYOUT = {
    col: "col-span-12 sm:col-span-6 lg:col-span-3",
    row: "row-span-1",
};

function getAdTemplateType(ad) {
    if (ad?.templateId === 1) return "big";
    if (ad?.templateId === 3) return "text";
    return "small";
}

function getSafeImageSrc(value) {
    if (!value || typeof value !== "string") return "/images/placeholder.webp";
    const src = value.trim();
    if (!src) return "/images/placeholder.webp";
    if (src.startsWith("/")) return src;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return "/images/placeholder.webp";
}

const chatButtonClass =
    "bg-[#157a4f] text-white font-semibold shadow-[0_10px_22px_rgba(21,122,79,0.26)] hover:bg-[#126542] transition-colors";

const callButtonClass =
    "bg-[#efb02e] text-[#1f2329] font-semibold shadow-[0_10px_22px_rgba(239,176,46,0.28)] hover:bg-[#d79d25] transition-colors";

function assignBentoLayout(adsList) {
    return adsList.map((ad) => {
        const type = getAdTemplateType(ad);
        const layout = type === "big" ? BIG_CARD_LAYOUT : SMALL_CARD_LAYOUT;
        return { ...ad, ...layout, type };
    });
}

    function getDisplayPrice(ad) {
        const candidates = [
            ad?.price,
            ad?.categorySpecificData?.price,
            ad?.categorySpecificData?.rent,
            ad?.categorySpecificData?.askingPrice,
            ad?.categorySpecificData?.rentAmount,
            ad?.categorySpecificData?.fees,
            ad?.categorySpecificData?.pricePerPerson,
            ad?.categorySpecificData?.consultationFee,
            ad?.categorySpecificData?.charges,
        ];

        for (const value of candidates) {
            if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
            if (typeof value === "string") {
                const normalized = value.replace(/[^0-9.]/g, "");
                const parsed = Number(normalized);
                if (Number.isFinite(parsed) && parsed > 0) return parsed;
            }
        }

        return null;
    }

function RecentListingsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = normalizeAppPath(usePathname());
    const [sortValue, setSortValue] = useState("createdAt_desc");
    const [userLocation, setUserLocation] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("golo_current_location");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed?.coordinates?.lat && parsed?.coordinates?.lng) {
                        return {
                            lat: parsed.coordinates.lat,
                            lng: parsed.coordinates.lng,
                        };
                    }
                }
            } catch (e) {
                console.error("Error reading stored location:", e);
            }
        }
        return null;
    });
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const { isAuthenticated } = useAuth();

    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const latFromUrl = searchParams.get("lat");
    const lngFromUrl = searchParams.get("lng");
    const manualLatitude = latFromUrl ? parseFloat(latFromUrl) : null;
    const manualLongitude = lngFromUrl ? parseFloat(lngFromUrl) : null;

    // Get user location for proximity sorting
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    // Geolocation permission denied or unavailable — proceed without userLocation
                },
                { timeout: 8000, maximumAge: 60000 }
            );
        }
    }, []);

    const resolvedLat = (manualLatitude !== null || location) ? manualLatitude : userLocation?.lat;
    const resolvedLng = (manualLongitude !== null || location) ? manualLongitude : userLocation?.lng;

    const isProximitySort = sortValue === "distance_asc";
    const hasLocationFilter = Boolean(location || manualLatitude !== null);

    // Only include coordinates in queryKey when proximity sort or explicit location filter is requested.
    // This prevents background GPS acquisition from wiping away listings for new visitors!
    const activeQueryLat = (isProximitySort || hasLocationFilter) ? (resolvedLat || '') : '';
    const activeQueryLng = (isProximitySort || hasLocationFilter) ? (resolvedLng || '') : '';

    const queryKey = [
        'choja_recent_listings',
        q || '',
        category || '',
        location || '',
        sortValue || '',
        activeQueryLat,
        activeQueryLng
    ];

    const { data: response, error: queryError, isLoading } = useApiQuery(
        queryKey,
        async () => {
            const [sortBy, sortOrder] = sortValue.split("_");

            // 1. Proximity Sort ("Nearby"):
            if (isProximitySort) {
                if (resolvedLat && resolvedLng) {
                    try {
                        const nearbyRes = await getNearbyAds({
                            lat: resolvedLat,
                            lng: resolvedLng,
                            category,
                            page: 1,
                            limit: 50
                        });
                        const nearbyAds = nearbyRes?.success
                            ? (nearbyRes.data?.ads || nearbyRes.data || [])
                            : [];
                        if (nearbyAds.length > 0) {
                            return nearbyRes;
                        }
                    } catch (e) {
                        console.warn("Failed fetching nearby ads:", e);
                    }
                }

                // Fallback for Nearby: No ads nearby or no location permission
                const fallbackRes = await getAllAds({
                    page: 1,
                    limit: 50,
                    category,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                });
                return {
                    ...fallbackRes,
                    isFallback: true,
                    fallbackNotice: (resolvedLat && resolvedLng)
                        ? "No ads found in your immediate area. Showing recent listings across all regions."
                        : "Enable location for distance sorting. Showing recent listings across all regions.",
                };
            }

            // 2. Search / Category / Location filtering:
            if (q || location || category) {
                try {
                    const searchRes = await searchAds({
                        q,
                        category,
                        location,
                        sortBy,
                        sortOrder,
                        lat: location ? (resolvedLat || undefined) : undefined,
                        lng: location ? (resolvedLng || undefined) : undefined,
                        page: 1,
                        limit: 50,
                    });
                    const searchAdsList = searchRes?.success
                        ? (searchRes.data?.ads || searchRes.data || [])
                        : [];

                    if (searchAdsList.length > 0) {
                        return searchRes;
                    }

                    // If search returned 0 ads with coordinates, retry without coordinates first
                    if (location && (resolvedLat || resolvedLng)) {
                        const broaderRes = await searchAds({
                            q,
                            category,
                            location,
                            sortBy,
                            sortOrder,
                            page: 1,
                            limit: 50,
                        });
                        const broaderList = broaderRes?.success
                            ? (broaderRes.data?.ads || broaderRes.data || [])
                            : [];
                        if (broaderList.length > 0) {
                            return {
                                ...broaderRes,
                                isFallback: true,
                                fallbackNotice: "Showing all matching ads in " + location + ".",
                            };
                        }
                    }

                    // Universal fallback: If specific search/filter returned 0 ads,
                    // fall back to recent ads across the platform so visitors never see a dead screen
                    const allAdsFallback = await getAllAds({
                        page: 1,
                        limit: 50,
                        sortBy,
                        sortOrder,
                    });
                    const allList = allAdsFallback?.success
                        ? (allAdsFallback.data?.ads || allAdsFallback.data || [])
                        : [];
                    if (allList.length > 0) {
                        let notice = "Showing recent listings across all categories.";
                        if (location && !q) {
                            notice = 'No listings found in "' + location + '". Showing recent listings from other areas.';
                        } else if (category && !q) {
                            notice = 'No listings found in ' + category + '. Showing recent listings across all categories.';
                        } else if (q) {
                            notice = 'No listings matched "' + q + '". Showing popular recent listings instead.';
                        }
                        return {
                            ...allAdsFallback,
                            isFallback: true,
                            fallbackNotice: notice,
                        };
                    }

                    return searchRes;
                } catch (e) {
                    console.error("Error searching ads:", e);
                    const fallbackRes = await getAllAds({
                        page: 1,
                        limit: 50,
                        category,
                        sortBy,
                        sortOrder,
                    });
                    return fallbackRes;
                }
            }

            // 3. Default Choja browse: Always fetch all active platform ads
            return getAllAds({
                page: 1,
                limit: 50,
                category,
                sortBy,
                sortOrder,
            });
        },
        {
            dedupingInterval: 4000,
        }
    );

    const rawAds = response?.success ? (response.data?.ads || response.data || []) : [];
    const ads = Array.isArray(rawAds) ? rawAds : [];
    const loading = isLoading && ads.length === 0;
    const error = queryError ? "Failed to load listings." : (response && !response.success ? "Could not load listings." : "");
    const isFallback = Boolean(response?.isFallback);
    const fallbackNotice = response?.fallbackNotice || "";

    const layoutAds = assignBentoLayout(ads);

    return (
        <section className="w-full pt-4 pb-10">

            {/* Compact sort bar */}
            <div className={`w-full px-4 sm:px-6 lg:px-8 mb-6 flex items-center ${(q || location || isFallback || loading || (!loading && ads.length === 0)) ? "justify-between" : "justify-end"} gap-3 flex-wrap`}>
                {(q || location || isFallback || loading || (!loading && ads.length === 0)) && (
                    <p className="text-sm text-gray-500 font-medium">
                        {loading
                            ? "Loading…"
                            : isFallback
                                ? "Showing Popular Listings"
                                : ads.length === 0
                                    ? "No ads found"
                                    : (q && location
                                        ? <span>Results for &quot;{q}&quot; in &quot;{location}&quot;</span>
                                        : q
                                            ? <span>Results for &quot;{q}&quot;</span>
                                            : location
                                                ? <span>Results in &quot;{location}&quot;</span>
                                                : "")}
                    </p>
                )}
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-semibold">Sort:</label>
                    <select
                        value={sortValue}
                        onChange={e => setSortValue(e.target.value)}
                        className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white cursor-pointer shadow-sm hover:border-gray-300 transition"
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 auto-rows-[220px] gap-6 grid-flow-row grid-flow-dense">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-3xl bg-gray-100 animate-pulse ${i === 0
                                    ? "col-span-12 lg:col-span-6 row-span-2"
                                    : "col-span-12 sm:col-span-6 lg:col-span-3 row-span-1"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!loading && error && (
                <div className="text-center py-16 px-5 text-red-400">
                    <p>{error}</p>
                </div>
            )}

            {/* Fallback Notice Banner */}
            {isFallback && fallbackNotice && (
                <div className="w-full px-4 sm:px-6 lg:px-8 mb-4">
                    <div className="bg-amber-50/95 border border-amber-200/90 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-amber-900 text-xs sm:text-sm shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2.5">
                            <span className="text-base sm:text-lg">📍</span>
                            <span className="font-medium">{fallbackNotice}</span>
                        </div>
                        {(location || sortValue === "distance_asc") && (
                            <button
                                onClick={() => {
                                    setSortValue("createdAt_desc");
                                    router.push("/choja");
                                }}
                                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 whitespace-nowrap transition cursor-pointer"
                            >
                                View All
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!loading && !error && ads.length === 0 && (
                <div className="text-center py-16 px-5 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        🔍
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-1.5">
                        {q ? ('No ads found for "' + q + '"') : location ? ('No ads found in "' + location + '"') : "No listings available right now"}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        {q || location
                            ? "We couldn't find any listings matching your search. Try different keywords or browse all active classifieds."
                            : "New listings are posted regularly. Check back soon or post the first ad!"}
                    </p>
                    {(q || location || sortValue !== "createdAt_desc") && (
                        <button
                            onClick={() => {
                                setSortValue("createdAt_desc");
                                router.push("/choja");
                            }}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#157a4f] text-white text-xs font-bold shadow-md hover:bg-[#126542] transition cursor-pointer"
                        >
                            Browse All Classifieds
                        </button>
                    )}
                </div>
            )}

            {!loading && !error && ads.length > 0 && (
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <GridPackerContainer>
                        {layoutAds.map((ad, index) => {
                            const cls = `${ad.col} ${ad.row}`;
                            if (ad.type === "big") {
                                return <MultiImageAd key={ad._id || ad.adId || index} ad={ad} className={cls} isAuthenticated={isAuthenticated} onRequireAuth={() => setShowAuthPrompt(true)} />;
                            } else if (ad.type === "small") {
                                return <SingleImageAd key={ad._id || ad.adId || index} ad={ad} className={cls} isAuthenticated={isAuthenticated} onRequireAuth={() => setShowAuthPrompt(true)} />;
                            } else {
                                return <TextAd key={ad._id || ad.adId || index} ad={ad} className={cls} isAuthenticated={isAuthenticated} onRequireAuth={() => setShowAuthPrompt(true)} />;
                            }
                        })}
                    </GridPackerContainer>
                </div>
            )}

            <AuthRequiredModal
                isOpen={showAuthPrompt}
                onClose={() => setShowAuthPrompt(false)}
                title="Login or Register"
                description="Please log in or register to chat, call, or post your ad."
                redirectTo={pathname || "/"}
            />
        </section>
    );
}

export default function RecentListings() {
    return (
        <Suspense fallback={
            <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-12 auto-rows-[220px] gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-3xl bg-gray-100 animate-pulse ${i === 0
                                ? "col-span-12 lg:col-span-6 row-span-2"
                                : "col-span-12 sm:col-span-6 lg:col-span-3 row-span-1"
                                }`}
                        />
                    ))}
                </div>
            </div>
        }>
            <RecentListingsContent />
        </Suspense>
    );
}

// Helpers for packer: derive numeric spans from Tailwind class strings
function getColSpanFromClass(colClass) {
    if (!colClass || typeof window === 'undefined') return 12;
    const w = window.innerWidth;
    // default
    let span = 12;
    // pick lg if applicable
    if (w >= 1024) {
        const m = colClass.match(/lg:col-span-(\d+)/);
        if (m) return parseInt(m[1], 10);
    }
    if (w >= 640) {
        const m = colClass.match(/sm:col-span-(\d+)/);
        if (m) return parseInt(m[1], 10);
    }
    const m = colClass.match(/col-span-(\d+)/);
    if (m) return parseInt(m[1], 10);
    return span;
}

function getRowSpanFromClass(rowClass) {
    if (!rowClass) return 1;
    const m = rowClass.match(/row-span-(\d+)/);
    if (m) return parseInt(m[1], 10);
    return 1;
}

function GridPackerContainer({ children }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const columns = 12;

        function pack() {
            // clear previous explicit placement
            Array.from(container.children).forEach((child) => {
                child.style.gridColumnStart = '';
                child.style.gridRowStart = '';
            });

            const occupancy = {}; // row -> boolean array cols 1-based

            function isFree(r, c, w, h) {
                for (let rr = r; rr < r + h; rr++) {
                    if (!occupancy[rr]) occupancy[rr] = new Array(columns + 1).fill(false);
                    for (let cc = c; cc < c + w; cc++) {
                        if (occupancy[rr][cc]) return false;
                    }
                }
                return true;
            }

            function occupy(r, c, w, h) {
                for (let rr = r; rr < r + h; rr++) {
                    if (!occupancy[rr]) occupancy[rr] = new Array(columns + 1).fill(false);
                    for (let cc = c; cc < c + w; cc++) occupancy[rr][cc] = true;
                }
            }

            Array.from(container.children).forEach((child) => {
                const w = parseInt(child.dataset.colspan || '12', 10);
                const h = parseInt(child.dataset.rowspan || '1', 10);

                // find first row/col where it fits
                let placed = false;
                for (let r = 1; !placed; r++) {
                    for (let c = 1; c <= columns - w + 1; c++) {
                        if (isFree(r, c, w, h)) {
                            occupy(r, c, w, h);
                            child.style.gridColumnStart = `${c}`;
                            child.style.gridRowStart = `${r}`;
                            placed = true;
                            break;
                        }
                    }
                }
            });
        }

        let rafId = 0;

        function schedulePack() {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                pack();
            });
        }

        // Repack when images load or children change
        schedulePack();

        const imgs = container.querySelectorAll('img');
        let loaded = 0;
        imgs.forEach((img) => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener('load', schedulePack);
                img.addEventListener('error', schedulePack);
            }
        });

        const observer = new MutationObserver(schedulePack);
        observer.observe(container, { childList: true, subtree: false, attributes: true });

        window.addEventListener('resize', schedulePack);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            observer.disconnect();
            window.removeEventListener('resize', schedulePack);
            imgs.forEach((img) => {
                img.removeEventListener('load', schedulePack);
                img.removeEventListener('error', schedulePack);
            });
        };
    }, [children]);

    return (
        <div ref={containerRef} className="grid grid-cols-12 auto-rows-[220px] gap-4 sm:gap-6" style={{ position: 'relative' }}>
            {children}
        </div>
    );
}

function MultiImageAd({ ad, className, isAuthenticated, onRequireAuth }) {
    const router = useRouter();
    const images = ad.images && ad.images.length > 0
        ? ad.images.map(getSafeImageSrc)
        : ["/images/placeholder.webp", "/images/placeholder.webp", "/images/placeholder.webp"];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [images.length]);

    const targetId = ad.adId || ad._id;
    const targetUrl = targetId ? `/product/${targetId}` : "#";

    return (
        <Link
            href={targetUrl}
            onClick={() => {
                if (targetId) trackAdView(targetId);
            }}
            className={`relative block rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition ${className}`}
            data-colspan={getColSpanFromClass(ad.col)}
            data-rowspan={getRowSpanFromClass(ad.row)}
        >
            {images.map((img, index) => (
                <Image
                    key={index}
                    src={img}
                    alt={ad.title || "Ad"}
                    fill
                    unoptimized
                    priority={index === current}
                    className={`object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute bottom-0 p-8 text-white w-full">
                <h2 className="text-2xl font-bold leading-snug">{ad.title}</h2>
                <p className="mt-2 text-sm opacity-90">{ad.description}</p>
                {getDisplayPrice(ad) !== null && (
                    <p className="mt-4 text-2xl font-bold text-yellow-400">₹{getDisplayPrice(ad).toLocaleString("en-IN")}</p>
                )}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) {
                                onRequireAuth();
                                return;
                            }
                            trackAdContactClick(ad.adId || ad._id);
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}`);
                        }}
                        className={`px-4 py-2 text-sm rounded-xl ${chatButtonClass}`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) {
                                onRequireAuth();
                                return;
                            }
                            trackAdContactClick(ad.adId || ad._id);
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}&autoCall=1`);
                        }}
                        className={`px-4 py-2 text-sm rounded-xl ${callButtonClass}`}
                    >
                        Call
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${index === current ? "bg-white" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </Link>
    );
}

function SingleImageAd({ ad, className, isAuthenticated, onRequireAuth }) {
    const router = useRouter();
    const image = ad.images && ad.images[0] ? getSafeImageSrc(ad.images[0]) : "/images/placeholder.webp";

    const targetId = ad.adId || ad._id;
    const targetUrl = targetId ? `/product/${targetId}` : "#";

    return (
        <Link
            href={targetUrl}
            onClick={() => {
                if (targetId) trackAdView(targetId);
            }}
            className={`relative block rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition ${className}`}
            data-colspan={getColSpanFromClass(ad.col)}
            data-rowspan={getRowSpanFromClass(ad.row)}
        >
            <Image
                src={image}
                alt={ad.title || "Ad"}
                fill
                unoptimized
                priority
                className="object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 p-4 text-white w-full">
                <h3 className="text-sm font-semibold">{ad.title}</h3>
                {getDisplayPrice(ad) !== null && (
                    <p className="text-lg font-bold text-yellow-400 mt-1">₹{getDisplayPrice(ad).toLocaleString("en-IN")}</p>
                )}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) {
                                onRequireAuth();
                                return;
                            }
                            trackAdContactClick(ad.adId || ad._id);
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}`);
                        }}
                        className={`flex-1 py-2 text-xs rounded-lg ${chatButtonClass}`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) {
                                onRequireAuth();
                                return;
                            }
                            trackAdContactClick(ad.adId || ad._id);
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}&autoCall=1`);
                        }}
                        className={`flex-1 py-2 text-xs rounded-lg ${callButtonClass}`}
                    >
                        Call
                    </button>
                </div>
            </div>
        </Link>
    );
}

function TextAd({ ad, className, isAuthenticated, onRequireAuth }) {
    const router = useRouter();

    const targetId = ad.adId || ad._id;
    const targetUrl = targetId ? `/product/${targetId}` : "#";

    return (
        <Link
            href={targetUrl}
            onClick={() => {
                if (targetId) trackAdView(targetId);
            }}
            className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between block ${className}`}
            data-colspan={getColSpanFromClass(ad.col)}
            data-rowspan={getRowSpanFromClass(ad.row)}
        >
            <div>
                <span className="text-xs uppercase tracking-wide text-gray-400">{ad.category || "Category"}</span>
                <h3 className="mt-3 font-semibold text-gray-900 leading-snug">{ad.title}</h3>
                {getDisplayPrice(ad) !== null && (
                    <p className="mt-2 text-lg font-bold text-[var(--accent-500)]">₹{getDisplayPrice(ad).toLocaleString("en-IN")}</p>
                )}
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                            onRequireAuth();
                            return;
                        }
                        trackAdContactClick(ad.adId || ad._id);
                        router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}`);
                    }}
                    className={`flex-1 py-2 text-xs rounded-lg ${chatButtonClass}`}
                >
                    Chat
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isAuthenticated) {
                            onRequireAuth();
                            return;
                        }
                        trackAdContactClick(ad.adId || ad._id);
                        router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}&autoCall=1`);
                    }}
                    className={`flex-1 py-2 text-xs rounded-lg ${callButtonClass}`}
                >
                    Call
                </button>
            </div>
        </Link>
    );
}
