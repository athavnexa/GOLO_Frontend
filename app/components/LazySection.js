import React, { useRef, useEffect, useState } from 'react';
import { useRecommendationTracking } from '../hooks/useRecommendationTracking';

/**
 * Lazy loads a section below the fold and automatically tracks impressions once visible.
 */
export function LazySection({ 
  sectionKey, 
  strategy, 
  products, 
  context, 
  children,
  priority = false 
}) {
  const containerRef = useRef(null);
  const { trackImpression } = useRecommendationTracking();
  const [isVisible, setIsVisible] = useState(priority);
  const hasLoggedImpression = useRef(false);

  useEffect(() => {
    // If priority, we render immediately. We still need to track impression.
    const element = containerRef.current;
    if (!element) return;

    let timeoutId;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        if (!isVisible) setIsVisible(true);
        
        // Wait 500ms before logging impression to ensure they actually saw it
        timeoutId = setTimeout(() => {
          if (!hasLoggedImpression.current && products && products.length > 0) {
            hasLoggedImpression.current = true;
            trackImpression(sectionKey, strategy, products, context);
          }
        }, 500);
      } else {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }, { threshold: 0.1 }); // >10% visible is enough to trigger load/impression

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, sectionKey, strategy, products, context, trackImpression]);

  if (!products || products.length === 0) return null;

  return (
    <div ref={containerRef} className="w-full min-h-[10px]">
      {isVisible ? children : (
        <div style={{ height: '350px' }} aria-hidden="true" />
      )}
    </div>
  );
}
