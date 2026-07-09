'use client';

import { useState } from 'react';
import {
  X,
  AlertTriangle,
  Megaphone,
  ShieldAlert,
  Ban,
  Copy,
  CircleHelp,
} from 'lucide-react';
import { submitReport } from '@/app/lib/api';

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or Misleading', icon: Megaphone },
  { value: 'inappropriate', label: 'Inappropriate Content', icon: ShieldAlert },
  { value: 'fraud', label: 'Fraud or Scam', icon: Ban },
  { value: 'duplicate', label: 'Duplicate Posting', icon: Copy },
  { value: 'other', label: 'Other', icon: CircleHelp },
];

export default function ReportModal({ isOpen, onClose, adId, adTitle }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      setError('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await submitReport(adId, selectedReason, description);
      
      if (response.success) {
        setSubmitted(true);
        // Auto-close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(response.message || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDescription('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-[10000] p-3 sm:p-6">
      <div
        className="modal-scroll-hidden bg-white rounded-[28px] sm:rounded-[32px] max-w-md w-full max-h-[75vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`.modal-scroll-hidden::-webkit-scrollbar { display: none; }`}</style>
        <div className="flex items-start justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={14} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight sm:text-lg">Report This Ad</h2>
              <p className="text-[11px] text-gray-500 mt-0.5 sm:text-xs">Help us review suspicious or inappropriate listings.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors shrink-0 sm:p-2"
            disabled={isSubmitting}
            aria-label="Close report modal"
          >
            <X size={18} className="text-gray-500 sm:hidden" />
            <X size={20} className="text-gray-500 hidden sm:block" />
          </button>
        </div>

        {/* Body */}
        <div className="px-3 py-3 sm:px-4 sm:py-4">
          {submitted ? (
            <div className="text-center py-4 sm:py-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 text-green-500 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1.5 sm:text-lg sm:mb-2">Report Submitted!</h3>
              <p className="text-xs text-gray-600 sm:text-sm">Thank you for helping keep GOLO safe. Our team will review this ad shortly.</p>
            </div>
          ) : (
            <>
              {adTitle && (
                <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 sm:mb-4 sm:px-3.5 sm:py-3">
                  <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide sm:text-xs sm:mb-1.5">Reporting ad</p>
                  <p className="text-xs font-semibold text-gray-800 truncate leading-snug sm:text-sm">{adTitle}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3 sm:mb-5">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:mb-2.5">
                    Why are you reporting this ad? *
                  </label>
                  <div className="space-y-1.5 sm:space-y-2.5">
                    {REPORT_REASONS.map((reason) => (
                      (() => {
                        const Icon = reason.icon;
                        return (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => setSelectedReason(reason.value)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-150 sm:px-3.5 sm:py-3 sm:rounded-2xl ${
                          selectedReason === reason.value
                            ? 'border-red-500 bg-red-50 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 sm:w-8 sm:h-8 sm:rounded-xl ${selectedReason === reason.value ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                              <Icon size={13} />
                            </div>
                            <span className="font-medium text-gray-800 text-xs leading-snug truncate sm:text-sm">{reason.label}</span>
                          </div>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors sm:w-4 sm:h-4 ${
                              selectedReason === reason.value ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'
                            }`}
                          />
                        </div>
                      </button>
                        );
                      })()
                    ))}
                  </div>
                </div>

                <div className="mb-3 sm:mb-5">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 sm:text-sm sm:mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide more details about why you're reporting this ad..."
                    maxLength={500}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/30 focus:border-red-400 outline-none resize-none text-xs sm:px-4 sm:py-3 sm:rounded-2xl sm:text-sm"
                    disabled={isSubmitting}
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5 text-right sm:text-xs sm:mt-1">
                    {description.length}/500 characters
                  </p>
                </div>

                {error && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl sm:mb-4 sm:p-3">
                    <p className="text-xs text-red-700 sm:text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:px-4 sm:py-2.5 sm:rounded-2xl sm:text-sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedReason}
                    className={`w-full px-3 py-2 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-1.5 text-xs sm:px-4 sm:py-2.5 sm:rounded-2xl sm:gap-2 sm:text-sm ${
                      isSubmitting || !selectedReason
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
