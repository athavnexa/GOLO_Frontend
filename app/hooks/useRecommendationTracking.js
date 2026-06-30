import { useRef, useEffect, useCallback } from 'react';
import RecommendationService from '../services/recommendation.service';

/**
 * Hook for buffering and batching recommendation analytics events.
 * @param {Object} options 
 * @param {number} options.flushIntervalMs - How often to flush the buffer
 */
export function useRecommendationTracking({ flushIntervalMs = 3000 } = {}) {
  const eventBuffer = useRef([]);
  const flushTimer = useRef(null);
  const trackedImpressions = useRef(new Set());

  const flushEvents = useCallback(() => {
    if (eventBuffer.current.length > 0) {
      RecommendationService.trackEvents([...eventBuffer.current]);
      eventBuffer.current = [];
    }
  }, []);

  useEffect(() => {
    flushTimer.current = setInterval(flushEvents, flushIntervalMs);
    
    // Flush on page unload
    const handleBeforeUnload = () => flushEvents();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (flushTimer.current) clearInterval(flushTimer.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      flushEvents(); // Final flush on unmount
    };
  }, [flushEvents, flushIntervalMs]);

  const queueEvent = useCallback((event) => {
    eventBuffer.current.push({
      ...event,
      timestamp: new Date().toISOString(),
      version: 1
    });
  }, []);

  const trackImpression = useCallback((sectionKey, strategy, products, context = {}) => {
    if (!products || products.length === 0) return;
    
    // De-duplicate impressions
    const impressionId = `${sectionKey}_${strategy}`;
    if (trackedImpressions.current.has(impressionId)) return;
    trackedImpressions.current.add(impressionId);

    queueEvent({
      eventType: 'impression',
      sectionKey,
      strategy,
      userId: context.userId,
      sessionId: context.sessionId,
      requestId: context.requestId,
      products: products.map((p, idx) => ({
        id: p.offerId || p.merchantId || p.id || p._id,
        position: idx + 1,
        tags: p.tags || [],
        categoryId: p.categoryId || "",
        merchantId: p.merchantId || ""
      }))
    });
  }, [queueEvent]);

  const trackClick = useCallback((sectionKey, strategy, product, position, context = {}) => {
    queueEvent({
      eventType: 'click',
      sectionKey,
      strategy,
      userId: context.userId,
      sessionId: context.sessionId,
      requestId: context.requestId,
      products: [{
        id: product.offerId || product.merchantId || product.id || product._id,
        position,
        tags: product.tags || [],
        categoryId: product.categoryId || "",
        merchantId: product.merchantId || ""
      }]
    });
  }, [queueEvent]);

  return {
    trackImpression,
    trackClick
  };
}
