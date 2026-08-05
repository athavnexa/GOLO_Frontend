"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const FormContent = dynamic(() => import("./FormContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading form...
    </div>
  ),
});

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      Loading form...
    </div>}>
      <FormContent />
    </Suspense>
  );
}