import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MerchantPlanBanner({ merchantProfile }) {
  const router = useRouter();

  if (!merchantProfile) return null;

  const subscription = merchantProfile.subscription || {};
  const status = subscription.status || 'ACTIVE';
  
  // Try subscription.plan.name, subscription.planId, or root merchantProfile.planId
  const planName = subscription.plan?.name || subscription.plan || subscription.planId || merchantProfile.planId || merchantProfile.plan?.name || merchantProfile.plan || 'Free Tier';
  
  const trialEndsAt = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const startedAt = subscription.startedAt ? new Date(subscription.startedAt) : (merchantProfile.createdAt ? new Date(merchantProfile.createdAt) : new Date());

  const now = new Date();
  
  let isTrial = false;
  let remainingDays = 0;
  let totalTrialDays = 50;

  if (status === 'TRIAL' && trialEndsAt && trialEndsAt > now) {
    isTrial = true;
    const diffTime = trialEndsAt.getTime() - now.getTime();
    remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    // Calculate total trial days from startedAt and trialEndsAt
    const totalDiff = trialEndsAt.getTime() - startedAt.getTime();
    totalTrialDays = Math.ceil(totalDiff / (1000 * 60 * 60 * 24));
    if (totalTrialDays <= 0 || isNaN(totalTrialDays)) totalTrialDays = 50;
  }

  const handleUpgrade = () => {
    router.push('/merchant/upgrade');
  };

  if (isTrial) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 lg:py-5 lg:px-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0">
            <Gift className="text-[#10b981] w-6 h-6 lg:w-7 lg:h-7" />
          </div>
          <div>
            <h3 className="text-[17px] lg:text-[20px] font-semibold text-[#1f2937]">
              {totalTrialDays}-Day Free Trial
            </h3>
            <p className="text-[#6b7280] text-[13px] lg:text-[15px] mt-0.5">
              You have <span className="font-semibold text-[#10b981]">{remainingDays} {remainingDays === 1 ? 'day' : 'days'}</span> remaining
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

  // Not in trial
  let message = "";
  let buttonText = "Upgrade Plan";

  // Normalize plan name for switch statement
  const normalizedPlan = typeof planName === 'string' ? planName.toLowerCase() : '';

  if (normalizedPlan.includes('premium')) {
    message = "Renew your plan now or upgrade for a year";
    buttonText = "Renew / Upgrade";
  } else {
    message = "Grow your business! Upgrade to premium and unlock unlimited product uploads to reach thousands of daily customers.";
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
