"use client";

import { X, Crown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlanUpgradeModal({ isOpen, onClose, message }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[20px] bg-white p-8 text-center shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <Crown className="h-8 w-8 text-yellow-600" />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-gray-900">Plan Limit Reached</h3>
        
        <p className="mb-8 text-sm text-gray-600 leading-relaxed">
          {message || "You have reached the limit of your current plan. Please upgrade to a higher plan to unlock more features."}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={() => router.push("/merchant/upgrade")}
            className="group flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#157a4f] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#116642] transition-all hover:shadow-lg"
          >
            Upgrade Plan
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
