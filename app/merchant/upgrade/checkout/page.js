"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import MerchantNavbar from "../../MerchantNavbar";
import { ArrowLeft, Check, Crown, Zap, TrendingUp, Shield, Headphones, BarChart3, Infinity, CreditCard, Lock, FileText, Building2 } from "lucide-react";

import { getSubscriptionPlans } from "../../../lib/api";

const getIconForPlan = (planName) => {
  const name = (planName || '').toLowerCase();
  if (name.includes('premium') || name.includes('enterprise')) return Crown;
  if (name.includes('pro')) return TrendingUp;
  return Zap;
};

const getColorForPlan = (planName) => {
  const name = (planName || '').toLowerCase();
  if (name.includes('premium') || name.includes('enterprise')) return "#7c3aed";
  if (name.includes('pro')) return "#2563eb";
  return "#157a4f";
};

const MONTH_OPTIONS = [
  { value: 1, label: "1 Month" },
  { value: 12, label: "12 Months" },
  { value: 24, label: "24 Months" },
  { value: 48, label: "48 Months" },
];

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const planId = searchParams.get("plan") || "basic";
  const [selectedMonths, setSelectedMonths] = useState(1);

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    getSubscriptionPlans()
      .then(res => setPlans(res || []))
      .catch(console.error)
      .finally(() => setLoadingPlans(false));
  }, []);

  const plan = plans.find(p => p.id === planId) || plans[0];

  const subtotal = plan ? plan.price * selectedMonths : 0;
  const discount = selectedMonths >= 24 ? 0.20 : selectedMonths >= 12 ? 0.15 : selectedMonths >= 3 ? 0.10 : 0;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;
  const perMonth = plan ? Math.round(total / selectedMonths) : 0;

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/upgrade/checkout");
    }
    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || loadingPlans || !plan) return <div className="min-h-screen bg-[#ececec]" />;
  if (user.accountType !== "merchant") return null;

  const IconComponent = getIconForPlan(plan.name);
  const planColor = getColorForPlan(plan.name);

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="upgrade" />

      <main className="w-full px-8 py-10 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <button
            onClick={() => router.push("/merchant/upgrade")}
            className="inline-flex items-center gap-2 text-[13px] text-[#5a5a5a] hover:text-[#157a4f] mb-6"
          >
            <ArrowLeft size={14} /> Back to Plans
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-5">
              <div className="rounded-[16px] border border-[#d7dbe2] bg-white p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="h-14 w-14 rounded-[16px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${planColor}15` }}
                  >
                    <IconComponent size={28} style={{ color: planColor }} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-[24px] font-bold text-[#1e1e1e]">{plan.name}</h1>
                    <p className="text-[13px] text-[#6f6f6f] mt-1">{plan.description}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-[28px] font-extrabold text-[#1e1e1e]">₹{perMonth.toLocaleString()}</span>
                      <span className="text-[13px] text-[#777]">/month</span>
                      {discount > 0 && (
                        <span className="text-[12px] font-semibold text-[#157a4f] bg-[#f0f7f2] px-2 py-0.5 rounded-full">
                          Save {discount * 100}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] border border-[#d7dbe2] bg-white p-6">
                <h2 className="text-[16px] font-semibold text-[#1e1e1e] mb-4">Select Billing Period</h2>
                <div className="relative">
                  <select
                    value={selectedMonths}
                    onChange={(e) => setSelectedMonths(Number(e.target.value))}
                    className="h-12 w-full appearance-none rounded-[12px] border border-[#d7dbe2] bg-white px-4 pr-10 text-[13px] font-semibold text-[#4a5565] outline-none transition-all focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1] cursor-pointer"
                  >
                    {MONTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#157a4f]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-[#777] mt-2">
                  {selectedMonths >= 24
                    ? "You get 20% discount on 24+ months"
                    : selectedMonths >= 12
                      ? "You get 15% discount on 12+ months"
                      : selectedMonths >= 3
                        ? "You get 10% discount on 3+ months"
                        : "Select 3+ months to unlock discounts"}
                </p>
              </div>

              <div className="rounded-[16px] border border-[#d7dbe2] bg-white p-6">
                <h2 className="text-[16px] font-semibold text-[#1e1e1e] mb-4">What&apos;s included</h2>
                <ul className="space-y-3">
                  {plan.displayFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[#4a5565]">
                      <Check size={16} className="shrink-0 mt-0.5 text-[#157a4f]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[16px] border border-[#d7dbe2] bg-white p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#f0f7f2] flex items-center justify-center shrink-0">
                    <Shield size={20} className="text-[#157a4f]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#1e1e1e]">Secure checkout</h3>
                    <p className="text-[12px] text-[#6f6f6f] mt-1">
                      Your payment is encrypted with 256-bit SSL. We never store your card details. All transactions are compliant with PCI DSS standards.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-[#777]">
                  <span className="inline-flex items-center gap-1"><Lock size={12} /> SSL Encrypted</span>
                  <span className="text-[#d7dbe2]">|</span>
                  <span>PCI Compliant</span>
                  <span className="text-[#d7dbe2]">|</span>
                  <span>GDPR Ready</span>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 self-start">
              <div className="rounded-[16px] border border-[#d7dbe2] bg-white p-6">
                <h3 className="text-[15px] font-semibold text-[#1e1e1e] uppercase tracking-wider mb-4">Order Summary</h3>

                <div className="space-y-3 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6f6f6f]">Plan</span>
                    <span className="font-semibold text-[#1e1e1e]">{plan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6f6f6f]">Billing period</span>
                    <span className="font-semibold text-[#1e1e1e]">{selectedMonths} {selectedMonths === 1 ? "month" : "months"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6f6f6f]">Monthly price</span>
                    <span className="font-semibold text-[#1e1e1e]">₹{plan.monthlyPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6f6f6f]">Subtotal</span>
                    <span className="font-semibold text-[#1e1e1e]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-[#157a4f]">
                      <span>Discount ({discount * 100}%)</span>
                      <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-[#e5e5e5] pt-3 flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#1e1e1e]">Total</span>
                    <span className="text-[22px] font-extrabold text-[#157a4f]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Proceeding to payment for ${plan.name} — ${selectedMonths} months at ₹${total.toLocaleString()}`)}
                  className="mt-5 w-full h-12 rounded-[12px] bg-[#157a4f] text-white font-semibold text-[14px] hover:bg-[#12653e] transition-colors"
                >
                  Proceed to Payment
                </button>

                <div className="mt-4 rounded-[10px] bg-[#f8fbfa] p-3">
                  <p className="text-[11px] text-[#157a4f] font-medium text-center">
                    ✓ 14-day free trial • Cancel anytime • No hidden charges
                  </p>
                </div>

                <p className="text-center text-[10px] text-[#999] mt-3">
                  Secure payment processed by GOLO. Cancel anytime before renewal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F3F3]" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
