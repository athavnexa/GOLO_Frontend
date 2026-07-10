"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import MerchantNavbar from "../../MerchantNavbar";
import { getMyBannerPromotions, updateMyBannerPromotion } from "../../../lib/api";
import { uploadToCloudinary } from "../../../services/cloudinaryConfig";

const BANNER_CATEGORIES = [
  "Fashion",
  "Electronics",
  "Groceries",
  "Home Decor",
  "Beauty",
  "Healthcare",
  "Sports",
  "Books",
  "Toys",
  "Automotive",
  "Jewelry",
  "Food & Beverages",
  "Pet Supplies",
  "Stationery",
  "Services",
];

function toDateInputValue(dateValue) {
  if (!dateValue) return "";
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) return dateValue.slice(0, 10);

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSelectedDates(startDate, endDate) {
  if (!startDate) return [];

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate || startDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const dates = [];
  const cursor = new Date(start);
  let guard = 0;

  while (cursor <= end && guard < 366) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    guard += 1;
  }

  return dates;
}

export default function MerchantBannerEditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ececec]" />}>
      <MerchantBannerEditContent />
    </Suspense>
  );
}

function MerchantBannerEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams.get("id");
  const { user, loading, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    bannerTitle: "",
    bannerCategory: "Fashion",
    imageUrl: "",
    startDate: "",
    endDate: "",
    description: "",
    promotionExpiryText: "",
    termsAndConditions: "",
  });

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFetchError("");
      const response = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, imageUrl: response?.url || response?.secure_url || prev.imageUrl }));
      setSaveMessage("Banner image uploaded successfully.");
    } catch (error) {
      setFetchError(error?.message || "Failed to upload banner image");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const triggerImageUpload = () => fileInputRef.current?.click();

  const handleRemoveBannerImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setSaveMessage("Banner image removed from preview.");
  };

  const handleSave = async () => {
    if (!formData.id) return;

    try {
      setIsSaving(true);
      setFetchError("");
      setSaveMessage("");

      const selectedDates = buildSelectedDates(formData.startDate, formData.endDate || formData.startDate);

      await updateMyBannerPromotion(formData.id, {
        bannerTitle: formData.bannerTitle,
        bannerCategory: formData.bannerCategory,
        imageUrl: formData.imageUrl,
        description: formData.description,
        selectedDates,
        promotionExpiryText: formData.promotionExpiryText,
        termsAndConditions: formData.termsAndConditions,
      });

      setSaveMessage("Banner updated successfully.");
    } catch (error) {
      setFetchError(error?.data?.message || error?.message || "Failed to update banner");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/banners/edit");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.accountType !== "merchant") return;
    if (!bannerId) {
      router.replace("/merchant/banners");
      return;
    }

    const loadBanner = async () => {
      try {
        setIsFetching(true);
        setFetchError("");
        const res = await getMyBannerPromotions();
        const banners = Array.isArray(res?.data) ? res.data : [];
        const banner = banners.find((item) => item.requestId === bannerId || item._id === bannerId) || null;

        if (!banner) {
          setFetchError("Banner not found");
          return;
        }

        setFormData({
          id: banner.requestId || banner._id || "",
          bannerTitle: banner.bannerTitle || "",
          bannerCategory: banner.bannerCategory || "Fashion",
          imageUrl: banner.imageUrl || "",
          startDate: toDateInputValue(banner.startDate),
          endDate: toDateInputValue(banner.endDate),
          description: banner.description || "",
          promotionExpiryText: banner.promotionExpiryText || "",
          termsAndConditions: banner.termsAndConditions || "",
        });
      } catch (error) {
        setFetchError(error?.message || "Failed to load banner");
      } finally {
        setIsFetching(false);
      }
    };

    loadBanner();
  }, [user, bannerId, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#ececec]" />;
  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="banners" />

      <main className="w-full px-6 py-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <button onClick={() => router.push("/merchant/banners")} className="inline-flex items-center gap-2 text-[13px] text-[#5a5a5a]">
            <ArrowLeft size={14} /> Back to Banners
          </button>

          <section className="rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0_18px_45px_-28px_rgba(15,28,44,0.35)]">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8a5d00]">
                  <Sparkles size={12} /> Banner Studio
                </p>
                <h1 className="text-[32px] font-semibold leading-tight text-[#1e1e1e] lg:text-[38px]">Edit Banner</h1>
                <p className="mt-2 text-[13px] text-[#667085]">Update the promotion details, visibility dates, and supporting copy for this banner.</p>
              </div>
            </div>

            {fetchError ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{fetchError}</div> : null}
            {saveMessage ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">{saveMessage}</div> : null}

            {isFetching ? <div className="rounded-xl border border-[#e7e7e7] bg-[#fafafa] px-4 py-6 text-[13px] text-[#666]">Loading banner details...</div> : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <div className="rounded-[20px] border border-[#edf0f4] bg-[#fbfcff] p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="text-[12px] font-semibold text-[#374151]">
                        Banner title
                        <input value={formData.bannerTitle} onChange={(event) => handleInputChange("bannerTitle", event.target.value)} className="mt-2 h-11 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 text-[13px] outline-none" placeholder="Seasonal Sale" />
                      </label>
                      <label className="text-[12px] font-semibold text-[#374151]">
                        Category
                        <select
                          value={formData.bannerCategory}
                          onChange={(event) => handleInputChange("bannerCategory", event.target.value)}
                          className="mt-2 h-11 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 text-[13px] outline-none"
                        >
                          {BANNER_CATEGORIES.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-[12px] font-semibold text-[#374151] md:col-span-2">
                        Banner image
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <button type="button" onClick={triggerImageUpload} disabled={isUploading} className="inline-flex items-center rounded-[12px] border border-[#157a4f] bg-white px-4 py-2 text-[12px] font-semibold text-[#157a4f] transition hover:bg-[#f4fbf7] disabled:cursor-not-allowed disabled:opacity-70">
                            {isUploading ? "Uploading..." : "Upload image"}
                          </button>
                          {formData.imageUrl ? (
                            <button type="button" onClick={handleRemoveBannerImage} className="rounded-[12px] border border-[#d7dce4] bg-white px-4 py-2 text-[12px] font-semibold text-[#374151]">
                              Remove image
                            </button>
                          ) : null}
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                        <p className="mt-2 text-[11px] text-[#667085]">Select a local image to replace the current banner artwork.</p>
                      </label>
                      <label className="text-[12px] font-semibold text-[#374151]">
                        Start date
                        <input type="date" value={formData.startDate} onChange={(event) => handleInputChange("startDate", event.target.value)} className="mt-2 h-11 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 text-[13px] outline-none" />
                      </label>
                      <label className="text-[12px] font-semibold text-[#374151]">
                        End date
                        <input type="date" value={formData.endDate} onChange={(event) => handleInputChange("endDate", event.target.value)} className="mt-2 h-11 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 text-[13px] outline-none" />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-[#edf0f4] bg-white p-5">
                    <label className="text-[12px] font-semibold text-[#374151]">
                      Description
                      <textarea value={formData.description} onChange={(event) => handleInputChange("description", event.target.value)} rows={4} className="mt-2 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 py-3 text-[13px] outline-none" placeholder="Short campaign description" />
                    </label>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[20px] border border-[#edf0f4] bg-[#fffaf2] p-5">
                    <h2 className="text-[18px] font-semibold text-[#1f1f1f]">Preview</h2>
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-[#eadfb6] bg-white">
                      <div className="relative h-40 w-full bg-[#f7f4ea]">
                        {formData.imageUrl ? (
                          <Image src={formData.imageUrl} alt={formData.bannerTitle || "Banner preview"} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[12px] text-[#8a8a8a]">Add an image URL to preview the banner</div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a5d00]">{formData.bannerCategory || "Promotion"}</p>
                        <h3 className="mt-1 text-[18px] font-semibold text-[#1f1f1f]">{formData.bannerTitle || "Untitled banner"}</h3>
                        <p className="mt-2 text-[12px] leading-5 text-[#5f6368]">{formData.description || "Your banner message will appear here."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-[#edf0f4] bg-white p-5">
                    <label className="text-[12px] font-semibold text-[#374151]">
                      Expiry text
                      <input value={formData.promotionExpiryText} onChange={(event) => handleInputChange("promotionExpiryText", event.target.value)} className="mt-2 h-11 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 text-[13px] outline-none" placeholder="Offer ends soon" />
                    </label>
                    <label className="mt-4 block text-[12px] font-semibold text-[#374151]">
                      Terms & conditions
                      <textarea value={formData.termsAndConditions} onChange={(event) => handleInputChange("termsAndConditions", event.target.value)} rows={4} className="mt-2 w-full rounded-[12px] border border-[#d7dce4] bg-white px-3 py-3 text-[13px] outline-none" placeholder="Mention the offer constraints" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-[12px] bg-[#157a4f] px-5 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#12653e] disabled:cursor-not-allowed disabled:opacity-70">
                      <Save size={14} /> {isSaving ? "Saving..." : "Save Banner"}
                    </button>
                    <button onClick={() => router.push("/merchant/banners")} className="rounded-[12px] border border-[#d7dce4] bg-white px-5 py-3 text-[13px] font-semibold text-[#374151]">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
