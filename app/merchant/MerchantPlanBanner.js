import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MerchantPlanBanner({ merchantProfile }) {
  const router = useRouter();

  if (!merchantProfile) return null;

  const subscription = merchantProfile.subscription || {};
  const trialEndsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const startedAt = subscription.startedAt
    ? new Date(subscription.startedAt)
    : merchantProfile.createdAt
    ? new Date(merchantProfile.createdAt)
    : new Date();

  const now = new Date();

  // Mutable copies so we can override on client when trial has expired
  let status = subscription.status || 'ACTIVE';
  let planName =
    subscription.plan?.name ||
    subscription.plan ||
    subscription.planId ||
    merchantProfile.planId ||
    merchantProfile.plan?.name ||
    merchantProfile.plan ||
    'Free Tier';

  // Client-side auto-expiry: if trial window is over, treat as Free Tier instantly
  // (no refresh needed – the backend will persist this on next API call)
  if (status === 'TRIAL' && trialEndsAt && trialEndsAt <= now) {
    status = 'ACTIVE';
    planName = 'Free Tier';
  }

  // ── Trial banner ────────────────────────────────────────────────────────────
  const trialActive = status === 'TRIAL' && trialEndsAt && trialEndsAt > now;

  let remainingText = '';
  let totalTrialText = '50-Day';

  if (trialActive) {
    const diffMs = trialEndsAt.getTime() - now.getTime();

    // Remaining time — use the smallest unit that makes sense
    if (diffMs >= 24 * 60 * 60 * 1000) {
      const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
      remainingText = `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (diffMs >= 60 * 60 * 1000) {
      const hours = Math.ceil(diffMs / (60 * 60 * 1000));
      remainingText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      const minutes = Math.max(1, Math.ceil(diffMs / (60 * 1000)));
      remainingText = `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
    }

    // Total trial duration label (for the title e.g. "2-Minute Free Trial")
    const totalMs = trialEndsAt.getTime() - startedAt.getTime();
    if (totalMs >= 24 * 60 * 60 * 1000) {
      const days = Math.ceil(totalMs / (24 * 60 * 60 * 1000));
      totalTrialText = `${days}-Day`;
    } else if (totalMs >= 60 * 60 * 1000) {
      const hours = Math.ceil(totalMs / (60 * 60 * 1000));
      totalTrialText = `${hours}-Hour`;
    } else {
      const minutes = Math.max(1, Math.ceil(totalMs / (60 * 1000)));
      totalTrialText = `${minutes}-Minute`;
    }
  }

  const handleUpgrade = () => {
    router.push('/merchant/upgrade');
  };

  if (trialActive) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 lg:py-5 lg:px-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0">
            <Gift className="text-[#10b981] w-6 h-6 lg:w-7 lg:h-7" />
          </div>
          <div>
            <h3 className="text-[17px] lg:text-[20px] font-semibold text-[#1f2937]">
              {totalTrialText} Free Trial
            </h3>
            <p className="text-[#6b7280] text-[13px] lg:text-[15px] mt-0.5">
              You have <span className="font-semibold text-[#10b981]">{remainingText}</span> remaining
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 lg:gap-10 mt-2 sm:mt-0">
          <div className="text-right">
            <p className="text-[10px] lg:text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
              Expiry Date
            </p>
            <p className="text-[14px] lg:text-[15px] font-medium text-[#1f2937] mt-0.5">
              {trialEndsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={handleUpgrade}
            className="flex-1 sm:flex-none h-10 lg:h-11 px-5 lg:px-6 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium text-[14px] lg:text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Upgrade Plan <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // ── Non-trial banner (Free Tier or paid plan) ────────────────────────────────
  // A merchant whose trial just expired will have planName = 'Free Tier' (set above)
  // so they will NEVER see the "Renew Premium" message here.
  const normalizedPlan = typeof planName === 'string' ? planName.toLowerCase() : '';
  let message = '';
  let buttonText = 'Upgrade Plan';

  if (normalizedPlan.includes('premium')) {
    // Only a currently ACTIVE paid Premium plan reaches here
    message = 'Renew your plan now or upgrade for a year';
    buttonText = 'Renew / Upgrade';
  } else {
    message =
      'Grow your business! Upgrade to premium and unlock unlimited product uploads to reach thousands of daily customers.';
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 lg:py-5 lg:px-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0">
          <Gift className="text-[#10b981] w-6 h-6 lg:w-7 lg:h-7" />
        </div>
        <div>
          <h3 className="text-[15px] lg:text-[17px] font-semibold text-[#1f2937]">
            {message}
          </h3>
          <p className="text-[#6b7280] text-[13px] lg:text-[14px] mt-0.5">
            Current Plan: <span className="font-semibold text-[#374151]">{typeof planName === 'string' ? planName : 'Free Tier'}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center mt-2 sm:mt-0">
        <button
          onClick={handleUpgrade}
          className="w-full sm:w-auto h-10 lg:h-11 px-5 lg:px-6 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium text-[14px] lg:text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {buttonText} <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
