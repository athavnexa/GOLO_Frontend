import Cookies from 'js-cookie';

function normalizeBackendApiBaseUrl(rawValue) {
    const trimmedValue = String(rawValue || '').trim();
    if (!trimmedValue) return '';
    const protocolMatches = [...trimmedValue.matchAll(/https?:\/\//g)];
    let normalizedValue = trimmedValue;
    if (protocolMatches.length > 1) {
        normalizedValue = trimmedValue.slice(protocolMatches[protocolMatches.length - 1].index);
    }
    return normalizedValue.replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeBackendApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
export const API_ORIGIN_URL = API_BASE_URL;

const _MASKED_BASE = '/media';
// Capture the cloud name so it is preserved in the masked path: /media/<cloudname>/image/upload/...
const _CLOUDINARY_URL_RE = /https?:\/\/res\.cloudinary\.com\/([^/]+)\//g;

function _maskCloudinaryStr(str) {
    if (!str || typeof str !== 'string') return str;
    if (!str.includes('res.cloudinary.com')) return str;
    // Replace origin but keep cloud name: /media/<cloudname>/
    return str.replace(_CLOUDINARY_URL_RE, (_match, cloudName) => `${_MASKED_BASE}/${cloudName}/`);
}

function _maskCloudinaryDeep(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return _maskCloudinaryStr(obj);
    if (Array.isArray(obj)) return obj.map(_maskCloudinaryDeep);
    if (typeof obj === 'object') {
        const out = {};
        for (const k of Object.keys(obj)) {
            out[k] = _maskCloudinaryDeep(obj[k]);
        }
        return out;
    }
    return obj;
}

const BASE_URL = API_BASE_URL;
const PUBLIC_AUTH_ENDPOINTS = new Set([
    '/users/login',
    '/users/register',
    '/users/social-auth',
    '/users/refresh',
    '/users/forgot-password/send-otp',
    '/users/forgot-password/verify-otp',
    '/users/forgot-password/reset',
]);

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

export function getStoredAccessToken() {
    if (typeof window === 'undefined') return '';
    return Cookies.get(ACCESS_TOKEN_STORAGE_KEY) || Cookies.get('golo-access-token') || Cookies.get('accessToken') || Cookies.get('authToken') || '';
}

export function getStoredRefreshToken() {
    if (typeof window === 'undefined') return '';
    return Cookies.get(REFRESH_TOKEN_STORAGE_KEY) || Cookies.get('golo-refresh-token') || Cookies.get('refreshToken') || '';
}

export function setStoredAuthTokens({ accessToken = '', refreshToken = '' } = {}) {
    if (typeof window === 'undefined') return;
    if (accessToken) {
        Cookies.set(ACCESS_TOKEN_STORAGE_KEY, accessToken, { expires: 7, path: '/' });
        Cookies.set('accessToken', accessToken, { expires: 7, path: '/' });
        Cookies.set('authToken', accessToken, { expires: 7, path: '/' });
    } else {
        Cookies.remove(ACCESS_TOKEN_STORAGE_KEY, { path: '/' });
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('authToken', { path: '/' });
    }
    if (refreshToken) {
        Cookies.set(REFRESH_TOKEN_STORAGE_KEY, refreshToken, { expires: 7, path: '/' });
        Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
    } else {
        Cookies.remove(REFRESH_TOKEN_STORAGE_KEY, { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
    }
}

export function clearStoredAuthTokens() {
    if (typeof window === 'undefined') return;
    Cookies.remove(ACCESS_TOKEN_STORAGE_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_STORAGE_KEY, { path: '/' });
    Cookies.remove('golo-access-token', { path: '/' });
    Cookies.remove('golo-refresh-token', { path: '/' });
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('authToken', { path: '/' });
}

export async function apiClient(endpoint, options = {}) {
    if (!BASE_URL) {
        const configError = new Error('NEXT_PUBLIC_API_URL is not configured');
        configError.status = 0;
        configError.data = {
            message: 'Backend API URL is missing. Set NEXT_PUBLIC_API_URL in the frontend environment.',
            endpoint,
        };
        throw configError;
    }

    const url = `${BASE_URL}${endpoint}`;
    const isPublicAuthEndpoint = [...PUBLIC_AUTH_ENDPOINTS].some((path) => endpoint.startsWith(path));

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const storedAccessToken = getStoredAccessToken();
    if (storedAccessToken && !headers.Authorization && !headers.authorization) {
        headers.Authorization = `Bearer ${storedAccessToken}`;
    }

    const config = {
        ...options,
        headers,
        credentials: 'include',
        cache: 'no-store',
    };

    let response;
    try {
        response = await fetch(url, config);
    } catch (error) {
        const networkError = new Error(
            `Unable to connect to API at ${BASE_URL}. ` +
            `Please ensure the backend is running and NEXT_PUBLIC_API_URL is correct.`
        );
        networkError.status = 0;
        networkError.data = {
            message: networkError.message,
            endpoint,
            url,
        };
        networkError.cause = error;
        throw networkError;
    }

    if (response.status === 401 && typeof window !== 'undefined' && !isPublicAuthEndpoint) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            const retryResponse = await fetch(url, { ...config, headers });
            return handleResponse(retryResponse);
        }
    }

    return handleResponse(response);
}

async function handleResponse(response) {
    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || 'API request failed');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return _maskCloudinaryDeep(data);
}

async function tryRefreshToken() {
    try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) return false;

        const response = await fetch(`${BASE_URL}/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            clearStoredAuthTokens();
            if (typeof window !== 'undefined') {
                Cookies.remove('user', { path: '/' });
                window.dispatchEvent(new Event('golo-auth-cleared'));
            }
            return false;
        }

        const nextAccessToken = data?.data?.accessToken || data?.accessToken || '';
        if (!nextAccessToken) return false;

        setStoredAuthTokens({ accessToken: nextAccessToken, refreshToken });
        return true;
    } catch {
        return false;
    }
}
