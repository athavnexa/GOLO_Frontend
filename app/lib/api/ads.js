import { apiClient, API_ORIGIN_URL } from './core';
import { updateProfile } from './user';
export async function getAllAds({ page = 1, limit = 10, category, sortBy, sortOrder } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    return apiClient(`/ads?${params}`);
}

export async function searchAds({ q = '', category, location, minPrice, maxPrice, sortBy, sortOrder, lat, lng, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ q, page, limit });
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    return apiClient(`/ads/search?${params}`);
}

export async function getAdById(adId) {
    // Backend automatically tracks views for authenticated users via JWT
    // No visitorId needed - anonymous views are not tracked
    return apiClient(`/ads/${adId}`);
}

export async function getAdsByCategory(category, { page = 1, limit = 10, sortBy, sortOrder } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    return apiClient(`/ads/category/${encodeURIComponent(category)}?${params}`);
}

export async function getFeaturedDeals(limit = 10) {
    return apiClient(`/ads/home/featured?limit=${limit}`);
}

export async function getTrendingSearches(limit = 10) {
    return apiClient(`/ads/home/trending?limit=${limit}`);
}

export async function getRecommendedDeals(limit = 10) {
    // New backend recommendations endpoint (requires auth)
    return apiClient(`/recommendations/deals?limit=${limit}`);
}

// Persist user's preferred categories (array of strings)
export async function getPopularPlaces(limit = 10) {
    return apiClient(`/ads/home/popular-places?limit=${limit}`);
}

export async function getNearbyAds({ lat, lng, distance = 10000, category, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ lat, lng, distance, page, limit });
    if (category) params.append('category', category);
    return apiClient(`/ads/nearby?${params}`);
}

// ============================================================
// ADS Ã¢â‚¬â€ AUTHENTICATED APIs
// ============================================================

export async function createAd(adData) {
    return apiClient('/ads', {
        method: 'POST',
        body: JSON.stringify(adData),
    });
}

export async function updateAd(adId, updateData) {
    return apiClient(`/ads/${adId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    });
}

export async function deleteAd(adId) {
    return apiClient(`/ads/${adId}`, {
        method: 'DELETE',
    });
}

export async function cancelAd(adId) {
    return apiClient(`/ads/${adId}/cancel`, {
        method: 'POST',
    });
}

// ============================================================
// WALLETS
// ============================================================

export async function trackAdView(adId) {
    if (!adId) return;
    try {
        return await apiClient(`/ads/${adId}/view`, {
            method: 'POST',
        });
    } catch (e) {
        console.warn('[Analytics] Failed to track ad view:', e);
    }
}

export async function trackAdContactClick(adId) {
    if (!adId) return;
    try {
        return await apiClient(`/ads/${adId}/click`, {
            method: 'POST',
        });
    } catch (e) {
        console.warn('[Analytics] Failed to track contact click:', e);
    }
}

export async function getNearbyOffers({
    merchantId,
    lat,
    lng,
    radiusKm = 5,
    location,
    q,
    category,
    sort,
    maxPrice,
    applyPriceFilter = false,
    offerTypes,
    topDiscountOnly = false,
    activeNowOnly = false,
    page = 1,
    limit = 20,
    _t,  // cache buster (ignored by backend, just varies cache key)
  } = {}) {
    const params = new URLSearchParams();
    if (merchantId) params.set('merchantId', String(merchantId));
    if (typeof lat === 'number' && !Number.isNaN(lat)) params.set('lat', String(lat));
    if (typeof lng === 'number' && !Number.isNaN(lng)) params.set('lng', String(lng));
    if (radiusKm) params.set('radiusKm', String(radiusKm));
    if (location) params.set('location', String(location));
    if (q) params.set('q', String(q));
    if (category) params.set('category', String(category));
    if (sort) params.set('sort', String(sort));
    if (offerTypes) params.set('offerTypes', String(offerTypes));
    if (topDiscountOnly) params.set('topDiscount', String(topDiscountOnly));
    if (activeNowOnly) params.set('activeNow', 'true');
    else params.set('activeNow', 'false');
    if (
        applyPriceFilter &&
        typeof maxPrice === 'number' &&
        !Number.isNaN(maxPrice) &&
        maxPrice > 0
    ) {
        params.set('maxPrice', String(maxPrice));
    }
    if (_t) params.set('_t', String(_t));  // cache buster
    params.set('page', String(page));
    params.set('limit', String(limit));
    const endpoint = `/offers/nearby?${params.toString()}`;
    const safePage = Number(page) || 1;
    const safeLimit = Number(limit) || 20;

    if (isNearbyOffersPrimaryUnsupported()) {
        try {
            return await fetchAbsoluteJson(`${LOCAL_BACKEND_URL}${endpoint}`);
        } catch {
            return emptyNearbyOffersResponse(safePage, safeLimit);
        }
    }

    try {
        return await apiClient(endpoint);
    } catch (error) {
        if (error?.status !== 404) {
            throw error;
        }

        markNearbyOffersPrimaryUnsupported();
        try {
            return await fetchAbsoluteJson(`${LOCAL_BACKEND_URL}${endpoint}`);
        } catch {
            return emptyNearbyOffersResponse(safePage, safeLimit);
        }
    }
}

export async function getNearbyOfferDetails(offerId) {
    if (!offerId) throw new Error("Offer ID is required");
    return apiClient(`/offers/${offerId}`);
}

// ============================================================
// PUBLIC MERCHANT APIS
// ============================================================

export async function searchMerchants(query, { page = 1, limit = 10 } = {}) {
    return apiClient(`/merchant/public/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

export async function searchProducts(query, { page = 1, limit = 10 } = {}) {
    return apiClient(`/merchant/products/public/search/global?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

// ==================== UNIFIED SEARCH & SEARCH HISTORY ====================
export function getSearchSessionId() {
    if (typeof window === 'undefined') return '';
    try {
        let sid = localStorage.getItem('ajubaju_search_session_id');
        if (!sid) {
            sid = 'sess_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
            localStorage.setItem('ajubaju_search_session_id', sid);
        }
        return sid;
    } catch (_e) {
        return '';
    }
}

export async function unifiedSearch(query, { type = 'all', page = 1, limit = 15, location = '', strict = false } = {}) {
    const sessionId = getSearchSessionId();
    const locParam = location ? `&location=${encodeURIComponent(location)}` : '';
    const sessParam = sessionId ? `&sessionId=${encodeURIComponent(sessionId)}` : '';
    const strictParam = strict ? '&strict=true' : '';
    return apiClient(`/search/unified?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}${locParam}${sessParam}${strictParam}`);
}

export async function getSearchHistory({ limit = 6 } = {}) {
    const sessionId = getSearchSessionId();
    try {
        const res = await apiClient(`/search/history?limit=${limit}&sessionId=${encodeURIComponent(sessionId)}`);
        return res?.data || [];
    } catch (e) {
        console.warn('Failed to get search history:', e);
        return [];
    }
}

export async function saveSearchHistory({ query, location = '' } = {}) {
    if (!query || !query.trim()) return null;
    const sessionId = getSearchSessionId();
    try {
        return await apiClient('/search/history', {
            method: 'POST',
            body: JSON.stringify({
                query: query.trim(),
                location: (location || '').trim(),
                sessionId,
            }),
        });
    } catch (e) {
        console.warn('Failed to save search history:', e);
        return null;
    }
}

export async function deleteSearchHistoryItem({ id, query } = {}) {
    const sessionId = getSearchSessionId();
    const params = new URLSearchParams();
    if (sessionId) params.set('sessionId', sessionId);
    if (id) params.set('id', id);
    if (query) params.set('query', query);
    try {
        return await apiClient(`/search/history?${params.toString()}`, {
            method: 'DELETE',
        });
    } catch (e) {
        console.warn('Failed to delete search history item:', e);
        return { success: false };
    }
}

export async function clearSearchHistory() {
    const sessionId = getSearchSessionId();
    try {
        return await apiClient(`/search/history?sessionId=${encodeURIComponent(sessionId)}`, {
            method: 'DELETE',
        });
    } catch (e) {
        console.warn('Failed to clear search history:', e);
        return { success: false };
    }
}

export async function createItemDemandRequest({ keyword, originalQuery, userContact, userName, location, notes, userId } = {}) {
    const sessionId = getSearchSessionId();
    try {
        return await apiClient('/search/item-demand-request', {
            method: 'POST',
            body: JSON.stringify({
                keyword,
                originalQuery,
                userContact,
                userName,
                location,
                notes,
                userId,
                sessionId,
            }),
        });
    } catch (e) {
        console.warn('Failed to submit item request:', e);
        return { success: false, message: e.message };
    }
}

export async function getZeroResultAnalytics() {
    try {
        const res = await apiClient('/search/analytics/zero-result-rate');
        return res?.data || null;
    } catch (e) {
        console.warn('Failed to get zero result analytics:', e);
        return null;
    }
}

// ==================== ACCOUNT DELETION ====================

/**
 * Permanently delete user account
 * @param {{ reason: string, customReason?: string, confirmation: string }} payload
 */


const LOCAL_BACKEND_URL = API_ORIGIN_URL;
let nearbyOffersRouteMissingOnPrimary = false;
const NEARBY_OFFERS_PRIMARY_UNSUPPORTED_KEY = 'golo_nearby_offers_primary_unsupported';

function markNearbyOffersPrimaryUnsupported() {
    nearbyOffersRouteMissingOnPrimary = true;
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(NEARBY_OFFERS_PRIMARY_UNSUPPORTED_KEY, '1');
    } catch {
    }
}

if (typeof window !== 'undefined') {
    try {
        localStorage.removeItem(NEARBY_OFFERS_PRIMARY_UNSUPPORTED_KEY);
    } catch {}
}

function isNearbyOffersPrimaryUnsupported() {
    return false;
}

function emptyNearbyOffersResponse(page = 1, limit = 20) {
    return {
        success: true,
        data: [],
        pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
        },
    };
}

async function fetchAbsoluteJson(url) {
    const headers = {
        'Content-Type': 'application/json',
    };

    let response;
    try {
        response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include',
        });
    } catch (error) {
        const networkError = new Error('Unable to connect to service. Please try again later.');
        networkError.status = 0;
        networkError.data = { message: 'Unable to connect to service. Please try again later.' };
        networkError.cause = error;
        throw networkError;
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const requestError = new Error(data?.message || `Request failed (${response.status})`);
        requestError.status = response.status;
        requestError.data = data;
        throw requestError;
    }

    return data;
}

