"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { createAd } from "../lib/api";
import InappropriateImageModal from "./InappropriateImageModal";
import ModerationWarningModal from "../../components/ModerationWarningModal";

export default function FormSidebar({
  adTitleState,
  adDescriptionState,
  cities,
  cityDetails,
  uploadedImages,
  primaryContact,
  selectedCategory,
  mobilePrice,
  monthlyRent,
  propertyTypeRent,
  isReviewStarted,
  setIsReviewStarted,
  templateId,
  selectedDates,
  categoryDetails,
  detectedLatitude,
  detectedLongitude,
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moderationWarningInfo, setModerationWarningInfo] = useState({ isOpen: false, message: "", restrictedUntil: null });
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if ((templateId === 1 || !templateId) && uploadedImages && uploadedImages.length > 1) {
      const id = setInterval(() => {
        setCarouselIndex((p) =>
          uploadedImages.length ? (p + 1) % uploadedImages.length : 0
        );
      }, 3000);
      return () => clearInterval(id);
    }
  }, [templateId, uploadedImages]);

  // ====== DYNAMIC PRICING ======
  // Base prices per template (Tier 1 — population < 50k)
  const BASE_PRICES = { 1: 25, 2: 15, 3: 10 };

  // Population tiers and multipliers matching AdPricingService on the backend
  const getAdDailyRateForPop = (population, tplId) => {
    const base = BASE_PRICES[tplId] ?? 25;
    const tiers = [
      [0,       1.0],
      [50000,   1.5],
      [100000,  2.0],
      [200000,  3.0],
      [500000,  4.0],
      [1000000, 6.0],
      [5000000, 8.0],
    ];
    let mult = 1.0;
    for (const [minPop, m] of tiers) {
      if (population >= minPop) mult = m;
      else break;
    }
    return Math.round(base * mult);
  };

  // Sum of per-city rate for all selected cities. Fall back to base Tier 1 if no cities.
  const computeEffectiveDailyRate = () => {
    const tplId = templateId || 1;
    if (!cityDetails || cityDetails.length === 0) {
      return BASE_PRICES[tplId] ?? 25;
    }
    return cityDetails.reduce((sum, d) => {
      const rate = d.adDailyRates
        ? (tplId === 1 ? d.adDailyRates.t1 : tplId === 2 ? d.adDailyRates.t2 : d.adDailyRates.t3)
        : getAdDailyRateForPop(d.population || 0, tplId);
      return sum + rate;
    }, 0);
  };

  const effectiveDailyRate = computeEffectiveDailyRate();
  const daysCount = selectedDates && selectedDates.length > 0 ? selectedDates.length : 0;
  const daysCharge = daysCount * effectiveDailyRate;
  const featuredCharge = isFeatured ? 100 : 0;
  const subtotal = daysCharge + featuredCharge;
  const pgCharge = subtotal * 0.025;
  const gst = (subtotal + pgCharge) * 0.18;
  const total = subtotal + pgCharge + gst;

  // Primary city population (for metadata)
  const primaryCityDetail = cityDetails && cityDetails.length > 0 ? cityDetails[0] : null;

  const handlePostAd = async () => {
    setSubmitError("");

    // Check auth
    if (!isAuthenticated) {
      router.push("/login?redirect=/post-ad/form");
      return;
    }

    // Basic validation
    if (!adTitleState?.trim()) {
      setSubmitError("Please enter an ad title.");
      return;
    }
    if (!adDescriptionState?.trim()) {
      setSubmitError("Please enter a description.");
      return;
    }
    if (!selectedCategory) {
      setSubmitError("Please select a category.");
      return;
    }
    if (!cities || !Array.isArray(cities) || cities.filter((c) => c && String(c).trim().length > 0).length === 0) {
      setSubmitError("Please enter and select at least one location.");
      return;
    }
    if (!selectedDates || !Array.isArray(selectedDates) || selectedDates.length === 0) {
      setSubmitError("Please select at least one date from the calendar.");
      return;
    }

    setIsSubmitting(true);
    setIsReviewStarted(true);

    try {
      const rawCategoryName = typeof selectedCategory === 'string'
        ? selectedCategory
        : (selectedCategory?.name || 'Other');

      const categoryNameMap = {
        Electronics: 'Electronics & Home appliances',
        "Vehicle Rent": "Vehicle",
        "Vehicle Sell": "Vehicle"
      };

      const normalizedCategory = categoryNameMap[rawCategoryName] || rawCategoryName;

      const normalizePhone = (value) => {
        const digits = String(value || '').replace(/\D/g, '');
        if (!digits) return '';
        if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
        if (digits.length === 10) return `+91${digits}`;
        return value;
      };

      const normalizedPhone = normalizePhone(primaryContact);
      const resolvedPrice =
        Number(
          categoryDetails?.price ??
          categoryDetails?.rent ??
          categoryDetails?.askingPrice ??
          categoryDetails?.rentAmount ??
          categoryDetails?.pricePerPerson ??
          categoryDetails?.consultationFee ??
          categoryDetails?.charges ??
          categoryDetails?.reward ??
          categoryDetails?.salary ??
          mobilePrice ??
          monthlyRent ??
          0,
        ) || 0;

      // 1) First upload all files to Cloudinary
      const uploadedUrls = [];
      if (uploadedImages && uploadedImages.length > 0) {
        // Import Cloudinary utility for secure configuration
        const { uploadToCloudinary } = await import('../services/cloudinaryConfig');
        
        for (const img of uploadedImages) {
          if (img.file) {
            try {
              const uploadedData = await uploadToCloudinary(img.file);
              uploadedUrls.push(uploadedData.url);
            } catch (error) {
              console.error('Failed to upload image:', error);
              // Continue with other images even if one fails
            }
          } else if (typeof img === "string") {
            uploadedUrls.push(img);
          } else if (img.url && !img.url.startsWith("blob:")) {
            uploadedUrls.push(img.url);
          }
        }
      }

      // Build the ad data payload
      const adData = {
        title: adTitleState.trim(),
        description: adDescriptionState.trim(),
        category: normalizedCategory,
        subCategory:
          categoryDetails?.subCategory ||
          categoryDetails?.listingType ||
          categoryDetails?.type ||
          categoryDetails?.tributeType ||
          (typeof selectedCategory === 'string'
            ? "General"
            : (selectedCategory?.subCategory || rawCategoryName || "General")),
        // Swap out dummy logic with our permanently uploaded Cloudinary URLs
        images: uploadedUrls,
        price: resolvedPrice,
        location: cities?.[0] || "India",
        city: cities?.[0] || "",
        cities: cities || [],
        latitude: typeof detectedLatitude === 'number' ? detectedLatitude : undefined,
        longitude: typeof detectedLongitude === 'number' ? detectedLongitude : undefined,
        primaryContact: normalizedPhone || "",
        userType: "Customer",
        contactInfo: {
          name: user?.name || "User", // Required by backend ContactInfoDto
          phone: normalizedPhone || "",
          email: user?.email || "",
          preferredContactMethod: "phone"
        },
        templateId: templateId || 1,
        selectedDates: selectedDates || [],
        negotiable: Boolean(categoryDetails?.negotiable),
        tags: [typeof selectedCategory === 'string' ? selectedCategory : selectedCategory?.name].filter(Boolean),
        // Population-based pricing metadata
        adDailyRate: effectiveDailyRate,
        cityPopulation: primaryCityDetail?.population || 0,
        cityCoordinates: (cityDetails || []).filter(d => d.lat && d.lng).map(d => ({ lat: d.lat, lng: d.lng })),
      };

      // Add category-specific data
      if (rawCategoryName === "Property" && propertyTypeRent) {
        adData.propertyData = { propertyType: propertyTypeRent, rent: monthlyRent };
      }
      if (rawCategoryName === "Mobiles" && mobilePrice) {
        adData.mobileData = { price: mobilePrice };
      }

      // Add any additional category details
      if (categoryDetails) {
        adData.categorySpecificData = categoryDetails;

        const categoryKeyMap = {
          Education: "educationData",
          Matrimonial: "matrimonialData",
          Vehicle: "vehicleData",
          Business: "businessData",
          Travel: "travelData",
          Astrology: "astrologyData",
          Property: "propertyData",
          "Public Notice": "publicNoticeData",
          "Lost & Found": "lostFoundData",
          Service: "serviceData",
          Personal: "personalData",
          Employment: "employmentData",
          Pets: "petsData",
          Mobiles: "mobileData",
          Electronics: "electronicsData",
          "Electronics & Home appliances": "electronicsData",
          Furniture: "furnitureData",
          "Greetings & Tributes": "greetingsData",
          Other: "otherData",
        };

        const categoryKey = categoryKeyMap[normalizedCategory] || (normalizedCategory?.toLowerCase()?.replace(/\s*&\s*/g, "").replace(/\s+/g, "") + "Data");

        adData[categoryKey] = categoryDetails;
      }

      const response = await createAd(adData);
      
      // If the backend returned a 2xx status but success is false (e.g. image moderation failure)
      if (response && response.success === false) {
        throw new Error(response.error || response.message || "Failed to post ad.");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/my-ads');
      }, 1200);
    } catch (error) {
      const status = error.status || error.data?.statusCode;
      // Token expired — clear session and redirect to login
      if (status === 401) {
        logout().catch(() => {});
        router.push('/login?redirect=/post-ad/form&reason=session_expired');
        return;
      }
      const errorMsg = error.data?.message || error.message;
      if (error?.data?.code === 'CONTENT_UPLOAD_RESTRICTED' || error?.data?.code === 'FINAL_MODERATION_WARNING' || error?.data?.code === 'MODERATION_WARNING' || (typeof errorMsg === 'string' && errorMsg.includes("temporarily restricted"))) {
        setModerationWarningInfo({ isOpen: true, message: errorMsg, restrictedUntil: error?.data?.restrictedUntil });
      } else if (typeof errorMsg === 'string' && errorMsg.includes("inappropriate content")) {
        setIsModalOpen(true);
      } else if (Array.isArray(errorMsg)) {
        setSubmitError(errorMsg.join(", "));
      } else {
        setSubmitError(errorMsg || "Failed to post ad. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 sticky top-20">

      {/* Live Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <p className="text-xs text-[#157A4F] font-semibold mb-4 tracking-wide">
          LIVE PREVIEW
        </p>

        {/* Image Preview */}
        {templateId !== 3 && (
          <div className="rounded-2xl overflow-hidden bg-gray-200 h-48 flex items-center justify-center">
            {uploadedImages && uploadedImages.length > 0 ? (
              <img
                src={
                  templateId === 1 || !templateId
                    ? uploadedImages[carouselIndex]?.url
                    : uploadedImages[0]?.url
                }
                alt="preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm">
                No image uploaded
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h4 className="font-semibold mt-4 text-gray-800 line-clamp-2">
          {adTitleState || "Your ad title will appear here"}
        </h4>

        {/* Price */}
        <p className="font-bold text-xl mt-2 text-[#157A4F]">
          ₹{effectiveDailyRate}/day
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {adDescriptionState || "Description will appear here..."}
        </p>

        {/* Locations */}
        {cities && cities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {cities.map((city) => (
              <span
                key={city}
                className="px-2 py-1 text-xs bg-[#FFF3D6] text-gray-700 rounded-full"
              >
                {city}
              </span>
            ))}
          </div>
        )}

        {/* Category Badge */}
        {selectedCategory && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <span className="text-xs text-[#157A4F] font-medium">
              {selectedCategory.name || selectedCategory}
            </span>
          </div>
        )}
      </div>

      {/* Promotion & Pricing */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <h4 className="font-semibold text-lg text-gray-800">
          Promotion & Pricing
        </h4>

        {/* Featured Ad Checkbox */}
        <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#157A4F] cursor-pointer"
            />
            <div>
              <p className="font-semibold text-gray-800 text-sm">Featured Ad</p>
              <p className="text-xs text-gray-600">Boost visibility for ₹100 extra</p>
            </div>
          </label>
        </div>

        <div className="space-y-3 text-sm">

          {/* Rate per day */}
          <div className="flex justify-between">
            <span className="text-gray-600">Rate per day</span>
            <span className="font-medium">₹{effectiveDailyRate}/day</span>
          </div>

          {/* Days Count */}
          <div className="flex justify-between">
            <span className="text-gray-600">Days ({daysCount})</span>
            <span className="font-medium">₹{daysCharge.toFixed(2)}</span>
          </div>

          {/* Featured Charge */}
          {isFeatured && (
            <div className="flex justify-between">
              <span className="text-gray-600">Featured Ad Charge</span>
              <span className="font-medium">₹{featuredCharge.toFixed(2)}</span>
            </div>
          )}

          {/* Subtotal */}
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>

          {/* Payment Gateway (2.5%) */}
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Gateway (2.5%)</span>
            <span className="font-medium">₹{pgCharge.toFixed(2)}</span>
          </div>

          {/* GST (18%) */}
          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-medium">₹{gst.toFixed(2)}</span>
          </div>

        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex justify-between items-center mt-2">
          <span className="font-bold text-gray-800">Total Amount</span>
          <span className="font-bold text-2xl text-[#157A4F]">₹{total.toFixed(2)}</span>
        </div>

        {/* Error Message */}
        {submitError && (
          <p className="text-red-500 text-sm text-center">{submitError}</p>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-green-700 font-semibold">🎉 Ad posted successfully!</p>
            <p className="text-green-600 text-sm mt-1">Redirecting to My Ads...</p>
          </div>
        )}

        <button
          onClick={handlePostAd}
          disabled={isSubmitting || submitSuccess}
          className="w-full bg-[#157A4F] text-white py-3 rounded-xl hover:bg-[#0f5c3a] transition shadow-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Preparing..." : submitSuccess ? "✓ Posted!" : "Review & Post Ad"}
        </button>

        <button className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition font-medium">
          Save Draft
        </button>

        <InappropriateImageModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
        <ModerationWarningModal
          isOpen={moderationWarningInfo.isOpen}
          onClose={() => setModerationWarningInfo({ isOpen: false, message: "", restrictedUntil: null })}
          message={moderationWarningInfo.message}
          restrictedUntil={moderationWarningInfo.restrictedUntil}
        />
      </div>
    </div>
  );
}