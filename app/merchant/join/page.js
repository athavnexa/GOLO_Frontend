"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// The hook useSearchParams() must be wrapped in Suspense for Next.js static builds
function JoinHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      router.replace(`/merchant-register?ref=${ref}`);
    } else {
      router.replace("/merchant-register");
    }
  }, [ref, router]);

  return null;
}

// This page handles referral links: /merchant/join?ref=ATHA6650
// It immediately redirects to the merchant registration page with the ref code
export default function MerchantJoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated AjuBaju Logo */}
        <div className="w-14 h-14 bg-[#157A4F] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-white font-black text-2xl">A</span>
        </div>
        <p className="text-[15px] font-semibold text-gray-600">Taking you to registration...</p>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#157A4F] animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-[#157A4F] animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-[#157A4F] animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <Suspense fallback={null}>
          <JoinHandler />
        </Suspense>
      </div>
    </div>
  );
}
