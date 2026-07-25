"use client";

import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { submitPlatformReview } from "../lib/api";

export default function PlatformReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already reviewed or dismissed
    const hasReviewed = localStorage.getItem("golo_platform_reviewed");
    const dismissedAt = localStorage.getItem("golo_platform_dismissed");
    
    if (hasReviewed) return;

    // If dismissed recently (within 24 hours), don't show
    if (dismissedAt) {
      const timeSinceDismissal = Date.now() - parseInt(dismissedAt, 10);
      if (timeSinceDismissal < 24 * 60 * 60 * 1000) return;
    }

    const checkTriggers = () => {
      // 1. Post-Redemption Trigger
      const pendingReviewTime = localStorage.getItem("golo_platform_review_pending");
      if (pendingReviewTime) {
        const timeToTrigger = parseInt(pendingReviewTime, 10);
        if (Date.now() >= timeToTrigger) {
          setIsOpen(true);
          localStorage.removeItem("golo_platform_review_pending");
          return;
        }
      }

      // 2. 15-Minute Session Trigger
      const sessionStart = localStorage.getItem("golo_session_start");
      if (!sessionStart) {
        localStorage.setItem("golo_session_start", Date.now().toString());
      } else {
        const timeOnSite = Date.now() - parseInt(sessionStart, 10);
        if (timeOnSite >= 15 * 60 * 1000) {
          setIsOpen(true);
          localStorage.removeItem("golo_session_start"); // Reset or clear to avoid immediate re-trigger if they dismiss
        }
      }
    };

    const interval = setInterval(checkTriggers, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("golo_platform_dismissed", Date.now().toString());
    // Reset session start so it doesn't trigger again immediately
    localStorage.setItem("golo_session_start", Date.now().toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    
    if (!content.trim()) {
      setError("Please provide some feedback.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userStr = localStorage.getItem('user');
      let userId = null;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userId = userObj._id || userObj.id;
        } catch (err) {}
      }

      const res = await submitPlatformReview({
        userId,
        rating,
        content,
        source: window.location.hostname.includes("choja") ? "choja" : "website",
      });

      if (res.success) {
        setSuccess(true);
        localStorage.setItem("golo_platform_reviewed", "true");
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setError(res.message || "Failed to submit review.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1e2228] mb-2">How are we doing?</h2>
            <p className="text-[#666] text-sm">
              We'd love to hear about your overall experience with GOLO. Your feedback helps us improve!
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="fill-current" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-500">Your feedback has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transform transition hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`transition-colors ${
                        (hoverRating || rating) >= star
                          ? "fill-[#f4a632] text-[#f4a632]"
                          : "fill-transparent text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Tell us more</label>
                <textarea
                  placeholder="What do you love? What could be better?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 h-28 resize-none focus:outline-none focus:border-[#157a4f] focus:ring-1 focus:ring-[#157a4f] text-sm transition"
                  disabled={loading}
                />
              </div>

              {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#157a4f] text-white py-3 rounded-xl font-bold hover:bg-[#10613f] transition mt-2 disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
