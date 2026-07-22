'use client';

import { ShieldAlert, X } from 'lucide-react';

export default function InappropriateImageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-[10000] p-3 sm:p-6">
      <div
        className="modal-scroll-hidden bg-white rounded-[28px] sm:rounded-[32px] max-w-sm w-full shadow-2xl border border-gray-200"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`.modal-scroll-hidden::-webkit-scrollbar { display: none; }`}</style>
        
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight sm:text-lg">Inappropriate Content</h2>
              <p className="text-[11px] text-gray-500 mt-0.5 sm:text-xs">Your image has been flagged by our safety system.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors shrink-0 sm:p-2"
            aria-label="Close modal"
          >
            <X size={18} className="text-gray-500 sm:hidden" />
            <X size={20} className="text-gray-500 hidden sm:block" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-6 sm:px-6 sm:py-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 sm:text-xl">Upload Rejected</h3>
          <p className="text-sm text-gray-600 sm:text-base mb-4 leading-relaxed">
            One or more of your uploaded images contains content that violates our community guidelines. Please remove the inappropriate images and try posting again.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-[12px] sm:text-sm text-orange-800 leading-snug">
              <strong>Note:</strong> Repeated uploads that violate GOLO's content policy may temporarily restrict your ability to upload images.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-sm hover:shadow text-sm sm:text-base"
          >
            I Understand, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
