'use client';

import { ImageOff, X } from 'lucide-react';

export default function ImageLimitModal({ isOpen, onClose }) {
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
            <div className="w-8 h-8 rounded-lg bg-[#fff8e6] text-[#e8ad2f] flex items-center justify-center shrink-0 mt-0.5">
              <ImageOff size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight sm:text-lg">Upload Limit Reached</h2>
              <p className="text-[11px] text-gray-500 mt-0.5 sm:text-xs">Maximum image allowance exceeded.</p>
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
          <div className="w-16 h-16 bg-[#fff8e6] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <ImageOff className="w-8 h-8 text-[#e8ad2f]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 sm:text-xl">Limit Exceeded</h3>
          <p className="text-sm text-gray-600 sm:text-base mb-6 leading-relaxed">
            You can only upload a maximum of 5 images per product. Please review your selection and try again.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#e8ad2f] hover:bg-[#d49b22] text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-sm hover:shadow text-sm sm:text-base"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
