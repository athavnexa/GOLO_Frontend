const fs = require('fs');
let c = fs.readFileSync('app/lib/api/core.js', 'utf-8');
const r = `const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
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
}`;

c = c.replace(/export function getStoredAccessToken\(\)[\s\S]*?export function clearStoredAuthTokens\(\) \{[\s\S]*?\}/, r);
fs.writeFileSync('app/lib/api/core.js', c);
