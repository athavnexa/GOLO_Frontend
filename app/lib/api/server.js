import { cookies } from 'next/headers';

/**
 * Utility to securely retrieve the auth token in Next.js Server Components
 * @returns {string} The access token if available, otherwise an empty string.
 */
export function getServerAuthToken() {
    try {
        const cookieStore = cookies();
        return cookieStore.get('accessToken')?.value || 
               cookieStore.get('golo-access-token')?.value || 
               cookieStore.get('authToken')?.value || '';
    } catch (e) {
        // Fallback for cases where headers/cookies can't be resolved dynamically
        return '';
    }
}

/**
 * Server-side version of the API client to fetch data without client-side hydration flashing.
 * Uses the auth cookies securely fetched from next/headers.
 */
export async function serverApiClient(endpoint, options = {}) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';
    if (!BASE_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is missing.');
    }

    const token = getServerAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        cache: 'no-store' // Avoid aggressive caching for authenticated data
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || 'Server API request failed');
        error.status = response.status;
        throw error;
    }

    return data;
}
