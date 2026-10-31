import { apiClient, getStoredRefreshToken } from './core';
export async function loginUser(email, password, accountType = 'user') {
    return apiClient('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, accountType }),
    });
}

export async function socialAuthUser(payload) {
    return apiClient('/users/social-auth', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function validateMerchantStep(payload) {
    return apiClient('/users/validate-registration-step', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function registerUser({
    name,
    email,
    password,
    phone,
    accountType = 'user',
    storeName,
    storeEmail,
    gstNumber,
    storeCategory,
    storeSubCategory,
    businessType,
    merchantRole,
    yearsInBusiness,
    businessDescription,
    contactNumber,
    storeLocation,
    storeLocationLatitude,
    storeLocationLongitude,
    documents,
    referralCode,
}) {
    return apiClient('/users/register', {
        method: 'POST',
        body: JSON.stringify({
            name,
            email,
            password,
            phone,
            accountType,
            storeName,
            storeEmail,
            gstNumber,
            storeCategory,
            storeSubCategory,
            businessType,
            merchantRole,
            yearsInBusiness,
            businessDescription,
            contactNumber,
            storeLocation,
            storeLocationLatitude,
            storeLocationLongitude,
            documents,
            referralCode,
        }),
    });
}

export async function refreshTokenApi() {
    const refreshToken = getStoredRefreshToken();

    return apiClient('/users/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}

export async function logoutUser() {
    return apiClient('/users/logout', {
        method: 'POST',
    });
}

export async function sendForgotPasswordOTP(email, accountType) {
    return apiClient('/users/forgot-password/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email, accountType }),
    });
}

export async function verifyForgotPasswordOTP(email, otp, accountType) {
    return apiClient('/users/forgot-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp, accountType }),
    });
}

export async function resetForgotPassword(email, otp, newPassword, accountType) {
    return apiClient('/users/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword, accountType }),
    });
}

// ============================================================
// USER / PROFILE APIs
// ============================================================

export async function sendPasswordChangeOTP() {
    return apiClient('/users/send-password-otp', {
        method: 'POST',
    });
}

export async function verifyPasswordChangeOTP(otp) {
    return apiClient('/users/verify-password-otp', {
        method: 'POST',
        body: JSON.stringify({ otp }),
    });
}

export async function changePasswordWithOTP(otp, newPassword) {
    return apiClient('/users/change-password-otp', {
        method: 'POST',
        body: JSON.stringify({ otp, newPassword }),
    });
}

export async function changePassword(currentPassword, newPassword) {
    return apiClient('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
}

// ============================================================
// WISHLIST APIs
// ============================================================


export async function sendEmailOtp({ email, type = 'register', accountType = 'user' }) {
    return apiClient('/users/email-otp/send', {
        method: 'POST',
        body: JSON.stringify({ email: email?.trim(), type, accountType }),
    });
}

export async function verifyEmailOtp({ email, otp }) {
    return apiClient('/users/email-otp/verify', {
        method: 'POST',
        body: JSON.stringify({ email: email?.trim(), otp: otp?.trim() }),
    });
}

export async function validateReferralCode(referralCode) {
    if (!referralCode) return { valid: false, message: 'Referral code required' };
    return apiClient('/users/referral/validate/' + encodeURIComponent(referralCode.trim()));
}

export async function syncPendingMerchantLocation() {
    return apiClient('/users/pending-location/sync', {
        method: 'POST',
    });
}
