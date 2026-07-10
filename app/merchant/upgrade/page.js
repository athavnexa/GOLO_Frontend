"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import { Crown, Check, Zap, TrendingUp, Headphones } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "GOLO BASIC",
    price: "₹999",
    period: "/month",
    description: "Perfect for small shops getting started",
    icon: Zap,
    features: [
      "Up to 50 active products",
      "Basic analytics dashboard",
      "Standard customer support",
      "1 banner promotion/month",
      "Basic loyalty points system",
      "Email notifications",
      "Mobile app access",
    ],
  },
  {
    id: "pro",
    name: "GOLO PRO",
    price: "₹2,499",
    period: "/month",
    description: "For growing businesses that need more",
    icon: TrendingUp,
    popular: true,
    features: [
      "Up to 500 active products",
      "Advanced analytics & insights",
      "Priority customer support",
      "5 banner promotions/month",
      "Advanced loyalty program",
      "Multi-location support",
      "Custom promotions & deals",
      "Email + chat support",
      "API access (basic)",
    ],
    highlightBorder: "border-[#efb02e]",
    highlightShadow: "hover:shadow-[0_0_0_2px_rgba(239,176,46,0.25)]",
  },
  {
    id: "premium",
    name: "GOLO PREMIUM",
    price: "₹4,999",
    period: "/month",
    description: "Maximum power for enterprise",
    icon: Crown,
    features: [
      "Unlimited active products",
      "Real-time advanced analytics",
      "24/7 dedicated support",
      "Unlimited banner promotions",
      "Enterprise loyalty program",
      "Unlimited locations",
      "Full API access & integrations",
      "Custom branding & reports",
      "Fraud protection suite",
    ],
  },
];

export default function MerchantUpgradePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/upgrade");
    }
    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#ececec]" />;
  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="upgrade" />

      <main className="w-full px-8 py-10 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f0f7f2] px-4 py-1.5 text-[11px] font-semibold text-[#157a4f] uppercase tracking-wider">
              <Crown size={14} /> Upgrade Your Plan
            </span>
            <h1 className="mt-4 text-[36px] font-bold text-[#1e1e1e]">Choose the right plan for your business</h1>
            <p className="mt-3 text-[14px] text-[#6f6f6f] max-w-[600px] mx-auto">
              Scale your business with powerful tools, analytics, and promotions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const IconComponent = plan.icon;

              return (
                 <div
                   key={plan.id}
                   className={`relative flex flex-col rounded-[20px] border bg-white p-6 transition-all duration-200 ${
                     plan.highlightBorder
                       ? `${plan.highlightBorder} ${plan.highlightShadow}`
                       : plan.popular
                         ? "border-[#157a4f] shadow-[0_0_0_2px_rgba(21,122,79,0.15)] hover:shadow-[0_0_0_2px_rgba(21,122,79,0.25)]"
                         : "border-[#d7dbe2] hover:shadow-lg"
                   }`}
                 >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#efb02e] px-4 py-1 text-[11px] font-bold text-white shadow-md">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-[14px] bg-[#f0f7f2] flex items-center justify-center">
                      <IconComponent size={24} className="text-[#157a4f]" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#1e1e1e]">{plan.name}</h3>
                      <p className="text-[11px] text-[#777]">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-[32px] font-extrabold text-[#1e1e1e] leading-none">{plan.price}</span>
                    <span className="text-[13px] text-[#777]">/month</span>
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[#4a5565]">
                        <Check size={16} className="shrink-0 mt-0.5 text-[#157a4f]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => router.push(`/merchant/upgrade/checkout?plan=${plan.id}`)}
                    className="w-full h-11 rounded-[12px] bg-[#157a4f] text-white font-semibold text-[13px] hover:bg-[#12653e] transition-colors mt-auto"
                  >
                    Select Plan
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-[16px] bg-white border border-[#d7dbe2] p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
                  <Headphones size={20} className="text-[#d97706]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1e1e1e]">Need help choosing?</h3>
                  <p className="text-[13px] text-[#6f6f6f] mt-1">
                    Our team is ready to help you pick the perfect plan.
                  </p>
                </div>
              </div>
              <button className="h-10 px-6 rounded-[10px] border border-[#d7dbe2] bg-white text-[13px] font-semibold text-[#157a4f] hover:bg-[#f4fbf7] transition shrink-0">
                Contact Sales
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#999] mt-6">
            All plans include SSL security, regular updates, and GDPR compliance. Cancel anytime.
          </p>
        </div>
      </main>
    </div>
  );
}
