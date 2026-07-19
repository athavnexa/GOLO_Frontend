import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function ModerationWarningModal({ isOpen, onClose, message, restrictedUntil }) {
  if (!isOpen) return null;

  let durationHours = 3;
  if (restrictedUntil) {
    const diffHours = Math.round((new Date(restrictedUntil).getTime() - Date.now()) / (1000 * 60 * 60));
    durationHours = [3, 8, 24].reduce((prev, curr) => Math.abs(curr - diffHours) < Math.abs(prev - diffHours) ? curr : prev, 3);
  }

  const penaltyText = restrictedUntil 
    ? `You are restricted for ${durationHours} hours for posting inappropriate images. Further violations will result in escalating penalties of 3 hours, 8 hours, and then 24 hours.`
    : message || "Repeated uploads that violate GOLO's content policy may temporarily restrict your ability to upload images.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Content Moderation Alert
          </h3>

          <p className="text-gray-600 mb-2 text-sm leading-relaxed">
            {penaltyText}
          </p>

          <p className="text-gray-500 mb-4 text-xs italic">
            Repeated uploads that violate GOLO's content policy may temporarily restrict your ability to upload images.
          </p>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-red-800 mb-1">Restriction Details:</h4>
            {restrictedUntil && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-red-800">Restricted Until:</span>
                <span className="ml-2 text-xs text-red-700 font-mono bg-red-100 px-2 py-1 rounded">
                  {new Date(restrictedUntil).toLocaleString()}
                </span>
              </div>
            )}
            {!restrictedUntil && (
               <p className="text-xs text-red-600">
                 Please ensure your images follow our community guidelines to avoid account restrictions.
               </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
