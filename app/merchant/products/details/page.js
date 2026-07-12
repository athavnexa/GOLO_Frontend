"use client";

import { Suspense } from "react";
import MerchantProductDetailsContent from "./merchant-product-details-content";

export default function MerchantProductDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#efefef]" />}>
      <MerchantProductDetailsContent />
    </Suspense>
  );
}
