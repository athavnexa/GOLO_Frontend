"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Bell, Sparkles, RotateCcw, CheckCircle2, X } from "lucide-react";
import { createItemDemandRequest } from "../lib/api/ads";

// Real platform categories as defined across the system
const TRENDING_CATEGORIES = [
  { name: "Food & Restaurants" },
  { name: "Shopping & Retail" },
  { name: "Daily Needs & Utilities" },
  { name: "Beauty & Wellness" },
  { name: "Healthcare & Medical" },
  { name: "Home Services" },
  { name: "Fitness & Sports" },
  { name: "Automotive Services" },
  { name: "Events & Entertainment" },
  { name: "Hotels & Accommodation" },
  { name: "Home Improvement" },
  { name: "Education & Training" },
  { name: "Real Estate" },
  { name: "Professional Services" },
  { name: "Local Businesses & Vendors" },
];

const TRENDING_SEARCHES = [
  "Paneer",
  "Milk",
  "Pizza",
  "Cotton Kurti",
  "Shoes",
  "Snacks",
  "Tea",
  "Oil",
];

export default function SearchEmptyState({
  query = "",
  location = "",
  onClearFilters,
  onSelectQuery,
  onSelectCategory,
}) {
  const [showModal, setShowModal] = useState(false);
  const auth = useAuth();
  const user = auth?.user;
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [userContact, setUserContact] = useState("");
  const [userName, setUserName] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user && showModal) {
      if (!userName && (user.fullName || user.name)) {
        setUserName(user.fullName || user.name);
      }
      if (!userContact && (user.email || user.phone || user.phoneNumber)) {
        setUserContact(user.email || user.phone || user.phoneNumber);
      }
    }
  }, [user, showModal]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!userContact.trim()) {
      setSubmitError("Please enter your phone number or email address.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await createItemDemandRequest({
        keyword: query,
        originalQuery: query,
        userContact: userContact.trim(),
        userName: userName.trim(),
        location: location || "",
        notes: userNotes.trim(),
        userId: user?.id || user?._id || undefined,
      });

      if (res?.success) {
        setSubmitted(true);
        setTimeout(() => {
          setShowModal(false);
          setSubmitted(false);
          setUserContact("");
          setUserNotes("");
        }, 2500);
      } else {
        setSubmitError(res?.message || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="col-span-full mx-auto w-full max-w-3xl py-8 px-4 text-center">
      {/* Friendly Empty State Illustration / Badge */}
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-inner ring-8 ring-amber-50/50">
        <Search size={36} className="stroke-[1.75]" />
      </div>

      {/* Main Friendly Copy */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
        {query ? (
          <>
            No exact matches for &ldquo;<span className="text-[#157A4F]">{query}</span>&rdquo;
          </>
        ) : (
          "No results found"
        )}
      </h3>

      <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
        We couldn&rsquo;t find anything matching your search right now, but local stores and offers are added daily!
      </p>

      {/* 2-3 High-Converting Next Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 active:scale-95"
          >
            <RotateCcw size={16} className="text-gray-500" />
            Clear all filters
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#157A4F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#126642] active:scale-95"
        >
          <Bell size={16} />
          Notify me when available
        </button>
      </div>

      {/* Popular Categories Action */}
      <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50/70 p-6 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
          <Sparkles size={14} className="text-[#157A4F]" />
          Explore Popular Categories
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {(showAllCategories ? TRENDING_CATEGORIES : TRENDING_CATEGORIES.slice(0, 8)).map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory ? onSelectCategory(cat.name) : onSelectQuery && onSelectQuery(cat.name)}
              className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#157A4F] hover:bg-emerald-50/50 hover:text-[#157A4F] active:scale-95 shadow-2xs"
            >
              {cat.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="rounded-full border border-dashed border-[#157A4F]/60 bg-emerald-50/40 px-3 py-1.5 text-xs font-semibold text-[#157A4F] hover:bg-emerald-100/60 transition active:scale-95"
          >
            {showAllCategories ? "Show less" : `+${TRENDING_CATEGORIES.length - 8} More`}
          </button>
        </div>

        {/* Trending Searches Chips */}
        <div className="mt-5 pt-4 border-t border-gray-200/60">
          <span className="text-xs text-gray-400 mr-2 font-medium">Trending searches:</span>
          <div className="inline-flex flex-wrap justify-center gap-1.5 mt-2 sm:mt-0">
            {TRENDING_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelectQuery && onSelectQuery(item)}
                className="inline-block rounded-md bg-white border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:text-[#157A4F] hover:border-[#157A4F] transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notify Me / Demand Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#157A4F]">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Request Received!</h4>
                <p className="mt-1.5 text-sm text-gray-600">
                  We&rsquo;ve recorded your demand for <strong>&ldquo;{query}&rdquo;</strong>. You will be automatically notified as soon as this product or a related item becomes available!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#157A4F]">
                  <Bell size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Demand Capture</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Can&rsquo;t find &ldquo;{query}&rdquo;?
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Leave your details and we will notify you immediately once a local merchant offers this item.
                </p>

                <form onSubmit={handleSubmitRequest} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number or Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210 or name@example.com"
                      value={userContact || ""}
                      onChange={(e) => setUserContact(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-[#157A4F] focus:outline-none focus:ring-2 focus:ring-[#157A4F]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh"
                      value={userName || ""}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-[#157A4F] focus:outline-none focus:ring-2 focus:ring-[#157A4F]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Any specific brand, size or quantity?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need 500g Amul butter or specific brand..."
                      value={userNotes || ""}
                      onChange={(e) => setUserNotes(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-[#157A4F] focus:outline-none focus:ring-2 focus:ring-[#157A4F]/20"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-600">{submitError}</p>
                  )}

                  <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-[#157A4F] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#126642] disabled:opacity-50 transition"
                    >
                      {submitting ? "Saving..." : "Notify Me"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
