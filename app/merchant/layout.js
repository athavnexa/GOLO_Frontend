"use client";

import { usePathname } from "next/navigation";
import MerchantFooter from "./MerchantFooter";

export default function MerchantLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/merchant";
  const isTemplatePage = pathname.startsWith("/merchant/templates/");

  // Landing page and template previews render without any shared chrome
  if (isLandingPage || isTemplatePage) {
    return <>{children}</>;
  }

  return (
    <div className="merchant-layout">
      <style>{`
        .merchant-layout > div > footer {
          display: none;
        }
      `}</style>
      {children}
      <MerchantFooter />
    </div>
  );
}
