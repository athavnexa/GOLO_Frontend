import { apiClient } from './core';
export async function getUserById(userId) {
    return apiClient(`/users/${userId}`);
}
// ==================== ADMIN REPORT STATS (REAL-TIME) ====================

/**
 * Get real-time user report stats (admin only)
 */
export async function getProfile() {
    return apiClient('/users/profile');
}

export async function updateProfile(data) {
    return apiClient('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function getLoyaltyHistory() {
    return apiClient('/vouchers/loyalty-history');
}

export async function toggleWishlist(adId) {
    return apiClient(`/users/wishlist/${adId}`, {
        method: 'POST',
    });
}

export async function getWishlistIds() {
    return apiClient('/users/wishlist/ids');
}

export async function getWishlistAds() {
    return apiClient('/users/wishlist');
}

// ============================================================
// NOTIFICATION APIs
// ============================================================

export async function getNotifications({ page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/users/notifications?${params}`);
}

export async function markNotificationRead(notificationId) {
    return apiClient(`/users/notifications/${notificationId}/read`, { method: 'POST' });
}

export async function markAllNotificationsRead() {
    return apiClient('/users/notifications/read-all', { method: 'POST' });
}

export async function clearAllNotifications() {
    return apiClient('/users/notifications/clear-all', { method: 'POST' });
}

// ============================================================
// I WANT PREFERENCE APIs
// ============================================================

export async function getIWantPreference() {
    return apiClient('/users/preferences/i-want');
}

export async function saveIWantPreference(payload) {
    return apiClient('/users/preferences/i-want', {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

// ============================================================
// ADS Ã¢â‚¬â€ PUBLIC APIs (no auth required)
// ============================================================

export async function savePreferredCategories(categories = []) {
    return updateProfile({ preferredCategories: categories });
}

export async function getMyAds({ page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/ads/user/me?${params}`);
}

export async function getAdsByUser(userId, { page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/ads/user/${userId}?${params}`);
}

export async function getAdWishlistCount(adId) {
    return apiClient(`/ads/wishlist-count/${adId}`);
}

export async function getMyVouchers({ page = 1, limit = 10, status } = {}) {
    let url = `/vouchers/my-vouchers?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return apiClient(url);
}

/**
 * Get single voucher details by ID
 * @param {string} voucherId - The voucher ID
 */
export async function getVoucherById(voucherId) {
    return apiClient(`/vouchers/${voucherId}`);
}

/**
 * Download voucher QR code
 * @param {string} voucherId - The voucher ID
 */
export async function getUserVouchers({ page = 1, limit = 50, status } = {}) {
    let url = `/vouchers/my-vouchers?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return apiClient(url);
}

/**
 * Calculate user deal statistics
 * Fetches all user vouchers and calculates redeemed deals and savings
 */
export async function getUserDealStatistics() {
    try {
        const result = await getUserVouchers({ limit: 100 });
        if (!result.success || !result.data) {
            return {
                dealsRedeemed: 0,
                totalSavings: 0,
                expired: [],
            };
        }

        const vouchers = result.data || [];
        let dealsRedeemed = 0;
        let totalSavings = 0;
        const expired = [];

        const now = new Date();

        vouchers.forEach(voucher => {
            // Check if voucher is redeemed (status: 'redeemed', 'partially_redeemed', 'used')
            if (voucher.status === 'redeemed' || voucher.status === 'used' || voucher.status === 'partially_redeemed') {
                dealsRedeemed++;
                // Add any discount/savings value from the offer
                if (voucher.discountValue) {
                    totalSavings += voucher.discountValue;
                } else if (voucher.offer?.discountValue) {
                    totalSavings += voucher.offer.discountValue;
                }
            }

            // Check if voucher is expired
            if (voucher.expiryDate && new Date(voucher.expiryDate) < now) {
                expired.push(voucher._id || voucher.id);
            }
        });

        return {
            dealsRedeemed,
            totalSavings,
            expired,
            allVouchers: vouchers,
        };
    } catch (error) {
        console.error('Error calculating deal statistics:', error);
        return {
            dealsRedeemed: 0,
            totalSavings: 0,
            expired: [],
        };
    }
}

// --- Follow Merchant ---
export async function deleteUserAccount(payload) {
    return apiClient('/users/account', {
        method: 'DELETE',
        body: JSON.stringify(payload),
    });
}

/**
 * Permanently delete merchant account & all store data
 * @param {{ reason: string, customReason?: string, confirmation: string }} payload
 */
