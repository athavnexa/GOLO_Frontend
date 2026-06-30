import { apiClient } from '../lib/api';

/**
 * Service for interacting with the Recommendation Engine API.
 */
class RecommendationService {
  /**
   * Fetch dynamic recommendation sections for the homepage.
   * @param {Object} params - Query parameters (e.g., { userId, lat, lng })
   */
  async getHomepage(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lng) queryParams.append('lng', params.lng.toString());

      const response = await apiClient(`/recommendations/homepage?${queryParams.toString()}`);
      
      // The backend returns { data: [...] } or just the array directly based on API conventions.
      // We normalize it to always return an array.
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch homepage recommendations:', error);
      return [];
    }
  }

  /**
   * Fetch recommendations relevant to a specific product (e.g., Similar Products, FBT).
   * @param {string} productId - The ID of the currently viewed product
   * @param {Object} params - Additional query params (e.g., { userId })
   */
  async getForProduct(productId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.userId) queryParams.append('userId', params.userId);

      const response = await apiClient(`/recommendations/products/${productId}?${queryParams.toString()}`);
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch product recommendations for ${productId}:`, error);
      return [];
    }
  }

  /**
   * Batch track recommendation events (impressions, clicks) to the backend.
   * @param {Array} events - Array of event objects
   */
  async trackEvents(events = []) {
    if (!events || events.length === 0) return;
    
    try {
      await apiClient('/recommendations/analytics/events', {
        method: 'POST',
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.error('Failed to report recommendation events:', error);
      // Fail silently to avoid interrupting UX
    }
  }
}

export default new RecommendationService();
