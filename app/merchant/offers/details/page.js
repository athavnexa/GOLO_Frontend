"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Pencil, Sparkles, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import MerchantNavbar from "../../MerchantNavbar";
import { getMyOfferPromotions, updateMyOfferPromotion } from "../../../lib/api";
import { uploadToCloudinary } from "../../../services/cloudinaryConfig";

function getOfferActionId(offer) {
  return offer?.requestId || offer?.offerId || offer?._id || offer?.id || "";
}

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

function formatDateForDisplay(dateValue) {
  const normalized = toDateInputValue(dateValue);
  if (!normalized) return "-";

  const [year, month, day] = normalized.split("-").map(Number);
  if (!year || !month || !day) return normalized;

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return utcDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
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

function normalizeSelectedProducts(selectedProducts = []) {
  return Array.isArray(selectedProducts)
    ? selectedProducts.map((item) => ({
        productId: String(item?.productId || item?.id || ""),
        productName: String(item?.productName || item?.name || "Product"),
        imageUrl: String(item?.imageUrl || item?.image || item?.images?.[0] || ""),
        originalPrice: Number(item?.originalPrice || item?.price || 0),
        offerPrice: Number(item?.offerPrice || item?.price || 0),
        stockQuantity: Number(item?.stockQuantity || item?.stock || 0),
      })).filter((item) => item.productId)
    : [];
}

export default function MerchantOfferDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ececec]" />}>
      <MerchantOfferDetailsContent />
    </Suspense>
  );
}

function MerchantOfferDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("id");
  const { user, loading, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "Special",
    imageUrl: "",
    startDate: "",
    endDate: "",
    promotionExpiryText: "",
    loyaltyRewardEnabled: false,
    loyaltyPointsPerPurchase: "1",
    termsAndConditions: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  const totalOfferValue = useMemo(
    () => selectedProducts.reduce((sum, item) => sum + Number(item.offerPrice || 0), 0),
    [selectedProducts],
  );

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleEditClick = () => setIsEditMode(true);

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
      setSaveMessage("Offer image uploaded successfully.");
    } catch (error) {
      setFetchError(error?.message || "Failed to upload offer image");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const triggerImageUpload = () => fileInputRef.current?.click();

  const handleRemoveOfferImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setSaveMessage("Offer image removed from preview.");
  };

  const handleDiscardChanges = () => {
    if (originalData) {
      setFormData(originalData.formData);
      setSelectedProducts(originalData.selectedProducts || []);
    }
    setIsEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (!formData.id) return;

    try {
      setIsSaving(true);
      setFetchError("");
      setSaveMessage("");

      const selectedDates = buildSelectedDates(formData.startDate, formData.endDate || formData.startDate);
      const updatedSelectedProducts = selectedProducts.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.imageUrl || "",
        originalPrice: Number(item.originalPrice || 0),
        offerPrice: Number(item.offerPrice || 0),
        stockQuantity: Number(item.stockQuantity || 0),
      }));

      await updateMyOfferPromotion(formData.id, {
        title: formData.title,
        category: formData.category,
        imageUrl: formData.imageUrl,
        selectedDates,
        promotionExpiryText: formData.promotionExpiryText,
        loyaltyRewardEnabled: Boolean(formData.loyaltyRewardEnabled),
        loyaltyPointsPerPurchase: Math.max(1, Math.min(50, Number(formData.loyaltyPointsPerPurchase || 1))),
        termsAndConditions: formData.termsAndConditions,
        selectedProducts: updatedSelectedProducts,
      });

      const mapped = {
        formData: {
          id: formData.id,
          title: formData.title,
          category: formData.category,
          imageUrl: formData.imageUrl,
          startDate: formData.startDate,
          endDate: formData.endDate,
          promotionExpiryText: formData.promotionExpiryText,
          loyaltyRewardEnabled: Boolean(formData.loyaltyRewardEnabled),
          loyaltyPointsPerPurchase: String(formData.loyaltyPointsPerPurchase || 1),
          termsAndConditions: formData.termsAndConditions,
        },
        selectedProducts: updatedSelectedProducts,
      };

      setOriginalData(mapped);
      setIsEditMode(false);
      setSaveMessage("Offer updated successfully.");
    } catch (error) {
      setFetchError(error?.data?.message || error?.message || "Failed to update offer");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/offers/details");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.accountType !== "merchant") return;
    if (!offerId) {
      router.replace("/merchant/offers");
      return;
    }

    const loadOffer = async () => {
      try {
        setIsFetching(true);
        setFetchError("");
        const res = await getMyOfferPromotions();
        const offers = Array.isArray(res?.data) ? res.data : [];
        const offer = offers.find((item) => getOfferActionId(item) === offerId) || null;

        if (!offer) {
          setFetchError("Offer not found");
          return;
        }

        const mappedFormData = {
          id: getOfferActionId(offer),
          title: offer.title || "",
          category: offer.category || "Special",
          imageUrl: offer.imageUrl || "",
          startDate: toDateInputValue(offer.startDate),
          endDate: toDateInputValue(offer.endDate),
          promotionExpiryText: offer.promotionExpiryText || "",
          loyaltyRewardEnabled: Boolean(offer.loyaltyRewardEnabled),
          loyaltyPointsPerPurchase: String(offer.loyaltyPointsPerPurchase || 1),
          termsAndConditions: offer.termsAndConditions || "",
        };

        const mappedSelectedProducts = normalizeSelectedProducts(offer.selectedProducts);
        const mapped = { formData: mappedFormData, selectedProducts: mappedSelectedProducts };

        setOriginalData(mapped);
        setFormData(mappedFormData);
        setSelectedProducts(mappedSelectedProducts);
      } catch (error) {
        setFetchError(error?.message || "Failed to load offer details");
      } finally {
        setIsFetching(false);
      }
    };

    loadOffer();
  }, [user, offerId, router]);

  if (loading || !user) return <div className="min-h-screen bg-[#ececec]" />;
  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="offers" />

      <main className="w-full px-8 py-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px] space-y-4">
          <button
            onClick={() => router.push("/merchant/offers")}
            className="inline-flex items-center gap-2 text-[13px] text-[#5a5a5a]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a9a9a9] text-[10px]">‹</span>
            Back to Offers
          </button>

          <section className="rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0_18px_45px_-28px_rgba(15,28,44,0.35)]">
            {fetchError ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{fetchError}</div> : null}
            {saveMessage ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">{saveMessage}</div> : null}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8a5d00]">
                  <Sparkles size={12} /> Offer Studio
                </p>
                <h1 className="text-[32px] font-semibold leading-tight text-[#1e1e1e] lg:text-[38px]">Offer Details</h1>
                <p className="mt-2 text-[13px] text-[#667085]">View the full offer, update the offer image and pricing, and manage the linked products in one focused page.</p>
              </div>
              {!isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#157a4f] bg-white px-5 text-[13px] font-semibold text-[#157a4f] shadow-sm transition hover:bg-[#f4fbf7]"
                >
                  Edit Offer <Pencil size={13} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-[24px] border border-[#edf0f4] bg-gradient-to-br from-[#fffaf2] via-white to-[#f7fbf7] p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Overview</p>
                      <h2 className="mt-1 text-[18px] font-semibold text-[#1e1e1e]">Offer Highlights</h2>
                    </div>
                    <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-[11px] font-semibold text-[#157a4f]">Active offer</span>
                  </div>

                  <div className="grid gap-2.5 md:grid-cols-2">
                    <label className="block rounded-[14px] border border-[#edf0f4] bg-white p-2.5 shadow-sm">
                      <span className="mb-1 block text-[12px] font-semibold text-[#4a5565]">Offer Title</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          className="h-10 w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] px-3 py-2 text-[12px] text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1]"
                        />
                      ) : (
                        <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] text-[#1f2937]">{formData.title || "—"}</p>
                      )}
                    </label>

                    <label className="block rounded-[14px] border border-[#edf0f4] bg-white p-2.5 shadow-sm">
                      <span className="mb-1 block text-[12px] font-semibold text-[#4a5565]">Category</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          className="h-10 w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] px-3 py-2 text-[12px] text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1]"
                        />
                      ) : (
                        <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] text-[#1f2937]">{formData.category || "—"}</p>
                      )}
                    </label>

                    <label className="block rounded-[14px] border border-[#edf0f4] bg-white p-2.5 shadow-sm md:col-span-2">
                      <span className="mb-1.5 block text-[12px] font-semibold text-[#4a5565]">Terms & Conditions</span>
                      {isEditMode ? (
                        <textarea
                          value={formData.termsAndConditions}
                          onChange={(e) => handleInputChange("termsAndConditions", e.target.value)}
                          rows="4"
                          className="min-h-[92px] w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] p-2.5 text-[12px] leading-5 text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1] resize-none"
                        />
                      ) : (
                        <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] leading-6 text-[#475467]">{formData.termsAndConditions || "No offer terms added yet."}</p>
                      )}
                    </label>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf0f4] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Media</p>
                      <h2 className="mt-1 text-[18px] font-semibold text-[#1e1e1e]">Offer Image</h2>
                      <p className="mt-1 text-[12px] text-[#667085]">Replace the main promotion image and keep your campaign visuals fresh.</p>
                    </div>
                    {isEditMode ? (
                      <button
                        type="button"
                        onClick={triggerImageUpload}
                        className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#157a4f] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_16px_26px_-18px_rgba(21,122,79,0.95)] transition hover:bg-[#126b43]"
                      >
                        <Camera size={13} /> Upload Offer Image
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[22px] border border-[#edf0f4] bg-[#f8fbfa] p-3">
                      <div className="relative h-[320px] overflow-hidden rounded-[18px] border border-[#edf0f4] bg-white">
                        {formData.imageUrl ? (
                          <Image src={formData.imageUrl} alt={formData.title || "Offer"} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#f6f7f8] text-center text-[13px] text-[#667085]">
                            No offer image selected
                          </div>
                        )}
                        {isEditMode ? (
                          <button
                            type="button"
                            onClick={handleRemoveOfferImage}
                            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                            aria-label="Remove offer image"
                          >
                            <X size={12} strokeWidth={3} />
                          </button>
                        ) : null}
                        {formData.imageUrl ? (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 text-white">
                            <p className="text-[12px] uppercase tracking-[0.25em] text-amber-100">Promo image</p>
                            <h3 className="mt-1 text-[16px] font-semibold">{formData.title || "Offer Preview"}</h3>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-[#edf0f4] bg-[#f8fbfa] p-4">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Campaign details</p>
                      <div className="mt-3 space-y-3 text-[13px] text-[#475467]">
                        <div className="rounded-[14px] border border-[#edf0f4] bg-white p-3">Start date: <strong>{formatDateForDisplay(formData.startDate) || "—"}</strong></div>
                        <div className="rounded-[14px] border border-[#edf0f4] bg-white p-3">End date: <strong>{formatDateForDisplay(formData.endDate) || "—"}</strong></div>
                        <div className="rounded-[14px] border border-[#edf0f4] bg-white p-3">Expiry text: <strong>{formData.promotionExpiryText || "—"}</strong></div>
                        <div className="rounded-[14px] border border-[#edf0f4] bg-white p-3">Loyalty reward: <strong>{formData.loyaltyRewardEnabled ? `${formData.loyaltyPointsPerPurchase} pts` : "Off"}</strong></div>
                      </div>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                <div className="rounded-[24px] border border-[#edf0f4] bg-gradient-to-br from-[#fffaf2] via-white to-[#f4fbf6] p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Offer value</p>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#1e1e1e]">Promotion summary</h2>
                      <p className="mt-1 text-[13px] text-[#667085]">Keep the offer economics and linked products aligned in one streamlined view.</p>
                    </div>
                    <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-[11px] font-semibold text-[#157a4f]">₹{Math.round(totalOfferValue).toLocaleString()}</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-[18px] border border-[#edf0f4] bg-white p-3 shadow-sm">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-[#7a7a7a]">Total value</p>
                      <p className="mt-2 text-[18px] font-semibold text-[#1e1e1e]">₹{Math.round(totalOfferValue).toLocaleString()}</p>
                    </div>
                    <div className="rounded-[18px] border border-[#edf0f4] bg-white p-3 shadow-sm">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-[#7a7a7a]">Products</p>
                      <p className="mt-2 text-[18px] font-semibold text-[#1e1e1e]">{selectedProducts.length} linked</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf0f4] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Linked products</p>
                  <div className="mt-3 space-y-3">
                    {selectedProducts.length ? selectedProducts.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 rounded-[14px] border border-[#edf0f4] bg-[#f8fbfa] p-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-[12px] border border-[#edf0f4] bg-white">
                          <Image src={item.imageUrl || "/images/deal2.avif"} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-[#1e1e1e]">{item.productName}</p>
                          <p className="text-[12px] text-[#667085]">Offer ₹{Number(item.offerPrice || 0).toLocaleString()} · Stock {item.stockQuantity || 0}</p>
                        </div>
                      </div>
                    )) : <p className="rounded-[14px] border border-dashed border-[#d7dbe2] bg-[#fafbfc] p-4 text-[12px] text-[#667085]">No products are linked to this offer yet.</p>}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf0f4] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Quick tips</p>
                  <ul className="mt-3 space-y-2 text-[13px] text-[#475467]">
                    <li>• Update the promo image from the edit action above.</li>
                    <li>• Keep linked product pricing and stock consistent.</li>
                    <li>• Use the same clean merchant flow as product management.</li>
                  </ul>
                </div>
              </aside>
            </div>

            {isEditMode && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#edf0f4] pt-6 sm:flex-row sm:justify-end">
                <button
                  onClick={handleDiscardChanges}
                  className="h-11 rounded-[12px] border border-[#d4d9e1] bg-white px-5 text-[13px] font-semibold text-[#4b5563] transition hover:bg-[#f7f8fa]"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving || isUploading}
                  className="h-11 rounded-[12px] bg-[#efb02e] px-5 text-[13px] font-semibold text-[#19462a] shadow-[0_14px_24px_-18px_rgba(239,176,46,0.9)] transition hover:bg-[#e4a82a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-4 bg-[#e8ad2f] border-t border-[#d49b22] text-[#2f2a1f] lg:mt-6">
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-6 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[3px] bg-[#0f7d49] text-white text-[26px] font-bold flex items-center justify-center leading-none">G</div>
              <span className="text-[34px] leading-none font-semibold text-[#0f7d49]">GOLO</span>
            </div>
            <p className="mt-3 text-[12px] max-w-[250px]">The all-in-one management platform for modern businesses. Empowering growth through analytics and intuitive product management.</p>
          </div>
          <div>
            <p className="text-[20px] font-bold">Links</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Overview</p><p>Inventory</p><p>Posts</p><p>Profile</p></div>
          </div>
          <div className="pt-8 md:pt-9 space-y-2 text-[13px]"><p>Analytics</p><p>Contact</p></div>
          <div>
            <p className="text-[20px] font-bold">Support</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Help Center</p><p>Security</p><p>Terms of Service</p></div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-3 border-t border-[#d49b22] flex items-center justify-between gap-3 text-[11px]"><p>© 2026 GOLO Dashboard. All rights reserved.</p></div>
      </footer>
    </div>
  );
}
