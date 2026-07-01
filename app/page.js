"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import { getHomeSectionConfig, getNearbyOffers } from "./lib/api";
import RecommendationService from "./services/recommendation.service";
import { useRecommendationTracking } from "./hooks/useRecommendationTracking";
import { SectionCarousel } from "./components/SectionCarousel";
import { SectionSkeleton } from "./components/SectionSkeleton";
import { LazySection } from "./components/LazySection";

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [homepageSections, setHomepageSections] = useState([]);
  const [isLoadingRows, setIsLoadingRows] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, getUserAccountType } = useAuth();
  const { trackClick } = useRecommendationTracking();
  
  // Extract context fields
  const selectedLocation = searchParams.get("location") || "";
  const selectedQuery = searchParams.get("q") || "";

  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Generate a simple session ID for analytics
    let sid = sessionStorage.getItem("golo_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("golo_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const accountType = user?.accountType || getUserAccountType();
      if (accountType === "merchant") {
        router.replace("/merchant/dashboard");
      }
    }
  }, [user, loading, router, getUserAccountType]);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageRows() {
      setIsLoadingRows(true);
      try {
        const params = {
          q: selectedQuery || undefined,
          location: selectedLocation || undefined,
          userId: user?.id || undefined
        };
        
        const sectionsData = await RecommendationService.getHomepage(params);

        if (!cancelled) {
          setHomepageSections(Array.isArray(sectionsData) ? sectionsData : []);
        }
      } catch (err) {
        console.error("Failed to load homepage recommendations", err);
        if (!cancelled) {
          setHomepageSections([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRows(false);
        }
      }
    }

    loadHomepageRows();

    return () => {
      cancelled = true;
    };
  }, [selectedLocation, selectedQuery, user]);

  const handleItemClick = (item, sectionKey, strategy, position, requestId) => {
    const targetId = item.offerId || item.merchantId || item.id || item._id;
    if (!targetId || String(targetId).startsWith("mock-")) return;
    
    // Fire click event through decoupled hook
    trackClick(sectionKey, strategy, item, position + 1, {
      userId: user?.id,
      sessionId,
      requestId
    });

    // Navigate using existing frontend logic
    if (item.type === "merchant" || item.merchantId) {
      router.push(`/nearby-deals/store?merchantId=${encodeURIComponent(targetId)}`);
    } else {
      router.push(`/nearby-deals/deal?offerId=${encodeURIComponent(targetId)}`);
    }
  };

  return (
    <>
      <style>{`
        .homepage-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <main className="min-h-screen bg-[#f4f4f4]">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryBar
          variant="golocal"
          preferredCategories={user?.preferredCategories || []}
        />

        <div className="bg-[#f4c035]">
          <Hero />
        </div>

        {isLoadingRows ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <SectionSkeleton key={`skeleton-${i}`} title="Loading recommendations..." />
            ))}
          </>
        ) : (
          <>
            {homepageSections.map((section, index) => {
               // Render above the fold immediately, lazy load below the fold
               const isAboveTheFold = index < 3;
               
               return (
                 <LazySection 
                   key={section.key || `section-${index}`}
                   sectionKey={section.key}
                   strategy={section.strategy}
                   products={section.products}
                   context={{ userId: user?.id, sessionId, requestId: section.metadata?.requestId }}
                   priority={isAboveTheFold}
                 >
                   <SectionCarousel 
                     title={section.title}
                     strategy={section.strategy || section.key}
                     products={section.products} 
                     onItemClick={(item, idx) => handleItemClick(item, section.key, section.strategy, idx, section.metadata?.requestId)} 
                   />
                 </LazySection>
               );
            })}
          </>
        )}

        <Footer />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4f4f4]" />}>
      <HomeContent />
    </Suspense>
  );
}
