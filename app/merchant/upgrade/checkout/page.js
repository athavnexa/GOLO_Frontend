"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import MerchantNavbar from "../../MerchantNavbar";
import { ArrowLeft, CheckCircle2, TrendingUp, Shield, Crown, Zap, Lock, Info, Loader2 } from "lucide-react";
import { subscribeToPlan } from "../../../lib/api";

const PLANS = {
  basic: {
    id: "basic",
    name: "GOLO BASIC",
    monthlyPrice: 999,
    color: "#157a4f",
    icon: Zap,
    description: "Perfect for small shops getting started",
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
  pro: {
    id: "pro",
    name: "GOLO PRO",
    monthlyPrice: 2499,
    color: "#2563eb",
    icon: TrendingUp,
    description: "For growing businesses that need more",
    features: [
      "Up to 500 active products",
      "Advanced loyalty program",
      "Advanced analytics & insights",
      "Multi-location support",
      "Priority customer support",
      "Custom promotions & deals",
      "5 banner promotions/month",
      "Email + chat support",
      "API access (basic)",
    ],
  },
  premium: {
    id: "premium",
    name: "GOLO PREMIUM",
    monthlyPrice: 4999,
    color: "#7c3aed",
    icon: Crown,
    description: "Maximum power for enterprise operations",
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
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
};

const MONTH_OPTIONS = [1, 3, 6, 12];

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const planId = searchParams.get("plan") || "basic";
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const backendPlanNameMap = {
        basic: "Starter",
        pro: "Pro",
        premium: "Premium"
      };
      const actualPlanName = backendPlanNameMap[planId] || "Starter";
      const billingCycle = selectedMonths >= 12 ? "yearly" : "monthly";

      await subscribeToPlan(actualPlanName, billingCycle);
      router.push("/merchant/dashboard?upgrade=success");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const plan = PLANS[planId] || PLANS.basic;
  const IconComponent = plan.icon;

  const getDiscount = (months) => {
    if (months === 12) return 0.316; // Approx discount for 12 months in design
    if (months === 6) return 0.233;  // Approx discount for 6 months in design
    if (months === 3) return 0.133;  // Approx discount for 3 months in design
    return 0;
  };

  const getPriceForMonths = (months) => {
    const sub = plan.monthlyPrice * months;
    const disc = Math.round(sub * getDiscount(months));
    // To match screenshot exactly for PRO:
    if (plan.id === "pro") {
      if (months === 3) return 6499;
      if (months === 6) return 11499;
      if (months === 12) return 20499;
    }
    return sub - disc;
  };

  const subtotal = getPriceForMonths(selectedMonths);
  const gst = Math.round(subtotal * 0.18);
  const pgFee = Math.round(subtotal * 0.02);
  const total = subtotal + gst + pgFee;

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/upgrade/checkout");
    }
    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#F9FAFB]" />;
  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="upgrade" />

      <main className="w-full px-8 py-10 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <button
            onClick={() => router.push("/merchant/upgrade")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#157a4f] hover:text-[#12653e] mb-6"
          >
            <ArrowLeft size={16} /> Back to Plans
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between bg-white p-6 rounded-[16px] shadow-sm border border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                    <IconComponent size={28} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <h1 className="text-[20px] font-extrabold text-[#111827] uppercase">{plan.name}</h1>
                    <p className="text-[14px] text-[#6B7280] mt-0.5">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-extrabold text-[#111827]">₹{plan.monthlyPrice.toLocaleString()}</div>
                  <div className="text-[13px] text-[#6B7280]">/month</div>
                </div>
              </div>

              {/* Billing Period */}
              <div>
                <h2 className="text-[13px] font-bold text-[#4B5563] uppercase tracking-wider mb-3 ml-1">Billing Period</h2>
                <div className="space-y-3">
                  {MONTH_OPTIONS.map((months) => {
                    const isSelected = selectedMonths === months;
                    const price = getPriceForMonths(months);
                    return (
                      <div
                        key={months}
                        onClick={() => setSelectedMonths(months)}
                        className={`relative flex items-center justify-between p-5 rounded-[12px] border-2 cursor-pointer transition-all ${
                          isSelected ? "border-[#157a4f] bg-white shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#157a4f]' : 'border-[#D1D5DB]'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#157a4f]" />}
                          </div>
                          <div>
                            <div className="text-[16px] font-bold text-[#111827]">{months} Month</div>
                            <div className="text-[13px] text-[#6B7280] mt-0.5">Billed {months === 1 ? 'monthly' : 'every ' + months + ' months'}.</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[16px] font-bold text-[#111827]">₹{price.toLocaleString()}</span>
                            {months > 1 && <span className="text-[13px] text-[#6B7280]"> /{months} mo</span>}
                            {months === 1 && <span className="text-[13px] text-[#6B7280]"> /month</span>}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${isSelected ? 'bg-[#E6F4EA] text-[#157a4f]' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
                            {isSelected ? 'SELECTED' : 'SELECT'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Plan Details */}
              <div>
                <h2 className="text-[13px] font-bold text-[#4B5563] uppercase tracking-wider mb-3 ml-1">Plan Details</h2>
                <div className="bg-[#FAFAFA] border border-[#F3F4F6] rounded-[16px] p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-[14px] text-[#4B5563] font-medium">
                        <CheckCircle2 size={18} className="text-[#157a4f] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Order Summary */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-7">
                <div className="space-y-4 text-[14px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Plan</span>
                    <span className="font-bold text-[#111827] uppercase">{plan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Billing period</span>
                    <span className="font-bold text-[#111827]">{selectedMonths} Month{selectedMonths > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Monthly price</span>
                    <span className="font-bold text-[#111827]">₹{plan.monthlyPrice.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-[#F3F4F6] my-4" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827]">Subtotal</span>
                    <span className="font-bold text-[#111827]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6B7280]">
                    <span className="flex items-center gap-1">Taxes (GST 18%) <Info size={14} /></span>
                    <span className="font-bold text-[#111827]">₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6B7280]">
                    <span className="flex items-center gap-1">Payment Gateway Fees (2%) <Info size={14} /></span>
                    <span className="font-bold text-[#111827]">₹{pgFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-[#F3F4F6] my-4" />

                  <div className="flex items-center justify-between pb-4">
                    <span className="text-[28px] font-extrabold text-[#111827]">Total</span>
                    <span className="text-[28px] font-extrabold text-[#157a4f]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D1FADF] bg-[#ECFDF3] text-[10px] font-bold text-[#027A48]">
                    <CheckCircle2 size={12} /> 50-DAYS FREE TRIAL
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D1FADF] bg-[#ECFDF3] text-[10px] font-bold text-[#027A48]">
                    <CheckCircle2 size={12} /> NO HIDDEN CHARGES
                  </span>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-[#6B7280] mb-5 leading-relaxed">
                  <Lock size={14} className="shrink-0 mt-0.5" />
                  <p>Secure payment processed by GOLO. Cancel anytime before renewal.</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full h-[52px] rounded-lg text-white font-bold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-sm ${isProcessing ? 'bg-[#157a4f]/70 cursor-not-allowed' : 'bg-[#157a4f] hover:bg-[#12653e]'}`}
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </button>
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
    <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB]" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
