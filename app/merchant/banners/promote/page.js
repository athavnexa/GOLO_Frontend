"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, Upload, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { submitBannerPromotionRequest } from "../../../lib/api";
import { searchLocations } from "../../../services/leafletService";
import MerchantNavbar from "../../MerchantNavbar";
import InappropriateImageModal from "../../../components/InappropriateImageModal";
import PlanUpgradeModal from "../../../../components/PlanUpgradeModal";
import ModerationWarningModal from "../../../../components/ModerationWarningModal";

const bannerCategories = [
  "Food & Restaurants",
  "Home Services",
  "Beauty & Wellness",
  "Healthcare & Medical",
  "Hotels & Accommodation",
  "Shopping & Retail",
  "Education & Training",
  "Real Estate",
  "Events & Entertainment",
  "Professional Services",
  "Automotive Services",
  "Home Improvement",
  "Fitness & Sports",
  "Daily Needs & Utilities",
  "Local Businesses & Vendors",
];

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
}

function dateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PromoteBannerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerCategory, setBannerCategory] = useState("Fashion");
  const [selectedDates, setSelectedDates] = useState([]);
  
  // New: Coverage scale (Town, City, District)
  const [coverageScale, setCoverageScale] = useState(null);
  
  const [targetCities, setTargetCities] = useState([]);
  const [targetLocations, setTargetLocations] = useState([]);
  const [targetDailyRates, setTargetDailyRates] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upgradeModalInfo, setUpgradeModalInfo] = useState({ isOpen: false, message: "" });
  const [moderationWarningInfo, setModerationWarningInfo] = useState({ isOpen: false, message: "", restrictedUntil: null });

  const selectedDays = useMemo(() => selectedDates.length, [selectedDates]);
  const totalDailyRate = targetDailyRates.reduce((sum, rate) => sum + rate, 0);
  const subtotal = selectedDays * totalDailyRate;
  const pgCharge = subtotal * 0.025;
  const gst = (subtotal + pgCharge) * 0.18;
  const totalPrice = subtotal + pgCharge + gst;

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (cityInput.trim().length > 0 && coverageScale) {
        setIsSearchingCity(true);
        try {
          const results = await searchLocations(cityInput, { scale: coverageScale });
          const uniqueCityMap = new Map();
          results.forEach(item => {
            const name = item.name || item.displayName.split(',')[0];
            if (!uniqueCityMap.has(name)) {
              const displayStr = item.displayName || name;
              uniqueCityMap.set(name, { 
                name, 
                displayName: displayStr, 
                coordinates: item.coordinates,
                population: item.population,
                dailyRate: item.dailyRate 
              });
            }
          });
          setCitySuggestions(Array.from(uniqueCityMap.values()));
        } catch (error) {
          console.error("City search failed", error);
        } finally {
          setIsSearchingCity(false);
        }
      } else {
        setCitySuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [cityInput]);

  const addCity = (cityObj) => {
    const city = cityObj.name;
    if (targetCities.length >= 7) {
      alert("You can only select up to 7 cities.");
      return;
    }
    if (!targetCities.includes(city)) {
      setTargetCities([...targetCities, city]);
      if (cityObj.coordinates) {
        setTargetLocations([...targetLocations, { lat: cityObj.coordinates.lat, lng: cityObj.coordinates.lng }]);
      }
      setTargetDailyRates([...targetDailyRates, cityObj.dailyRate || 200]);
      setSubmitError("");
    }
    setCityInput("");
    setCitySuggestions([]);
  };

  const removeCity = (cityToRemove) => {
    const index = targetCities.indexOf(cityToRemove);
    if (index > -1) {
      setTargetCities(targetCities.filter((_, i) => i !== index));
      setTargetLocations(targetLocations.filter((_, i) => i !== index));
      setTargetDailyRates(targetDailyRates.filter((_, i) => i !== index));
    }
  };

  const handleSubmitBanner = async () => {
    setSubmitMessage("");
    setSubmitError("");

    if (!bannerTitle.trim()) {
      setSubmitError("Banner title is required.");
      return;
    }
    
    if (targetCities.length === 0) {
      setSubmitError("Please select at least 1 target city.");
      return;
    }

    if (!bannerPreview && !bannerFile) {
      setSubmitError("Please upload a banner image before submitting.");
      return;
    }

    if (selectedDates.length === 0) {
      setSubmitError("Please select at least one date.");
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = bannerPreview;

      if (bannerFile) {
        setSubmitMessage("Uploading banner securely...");
        const { uploadToCloudinary } = await import("../../../services/cloudinaryConfig");
        try {
          const uploadResult = await uploadToCloudinary(bannerFile);
          finalImageUrl = uploadResult.url;
        } catch (uploadError) {
          throw new Error("Failed to upload image securely to the cloud. Please try again.");
        }
      }

      setSubmitMessage("Analyzing banner for safety compliance...");
      
      const payload = {
        bannerTitle,
        bannerCategory,
        imageUrl: finalImageUrl,
        selectedDates: selectedDates,
        targetCities,
        targetLocations,
        dailyRate: totalDailyRate, 
        coverageType: coverageScale,
        coverageRegion: targetCities[0] || "",
        promotionType: "banner",
        totalPrice,
        recommendedSize: "1920 x 520 px",
      };
  
      const response = await submitBannerPromotionRequest(payload);

      if (response && response.success === false) {
        throw new Error(response.error || response.message || "Failed to submit banner.");
      }

      setSubmitMessage("Banner approved! Redirecting to payments...");
      setBannerTitle("");
      setSelectedDates([]);
      setBannerPreview("");
      
      setTimeout(() => {
        router.push("/merchant/banners");
      }, 1500);
    } catch (error) {
      const errorMsg = error?.data?.message || error?.message || "";
      const errorCode = error?.data?.errorCode || error?.data?.code;
      if (errorCode === 'CONTENT_UPLOAD_RESTRICTED' || errorCode === 'FINAL_MODERATION_WARNING' || errorCode === 'MODERATION_WARNING' || (typeof errorMsg === 'string' && (errorMsg.includes("temporarily restrict") || errorMsg.includes("temporarily disable image")))) {
        setModerationWarningInfo({ isOpen: true, message: errorMsg, restrictedUntil: error?.data?.restrictedUntil });
      } else if (typeof errorMsg === 'string' && errorMsg.includes("inappropriate content")) {
        setIsModalOpen(true);
      } else if (typeof errorMsg === 'string' && errorMsg.includes("Please upgrade")) {
        setUpgradeModalInfo({ isOpen: true, message: errorMsg });
      } else {
        setSubmitError(errorMsg || "Failed to submit banner request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/banners/promote");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#ececec]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="banners" />

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <button onClick={() => router.push("/merchant/banners")} className="text-[13px] text-[#5a5a5a] inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a9a9a9] text-[10px]">
              <ChevronLeft size={11} />
            </span>
            Back to Banners
          </button>

          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5">
            <div className="rounded-[12px] border border-[#e2e2e2] bg-white p-5">
              <h1 className="text-[38px] font-semibold leading-none text-[#1f1f1f]">Promote Your Banner</h1>
              <p className="mt-3 text-[13px] text-[#6f6f6f] max-w-[700px]">
                Upload your banner creative, pick category, choose visibility dates, and submit for admin approval.
              </p>
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2a2a2a] mb-2">Banner Title</label>
                    <input
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      placeholder="Enter banner title"
                      className="h-10 w-full rounded-[8px] border border-[#dddddd] bg-white px-3 text-[12px] text-[#2f2f2f] outline-none focus:border-[#2f9e58]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#2a2a2a] mb-2">Banner Category</label>
                    <select
                      value={bannerCategory}
                      onChange={(e) => setBannerCategory(e.target.value)}
                      className="h-10 w-full rounded-[8px] border border-[#dddddd] bg-white px-3 text-[12px] text-[#2f2f2f] outline-none focus:border-[#2f9e58]"
                    >
                      {bannerCategories.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white border border-[#e8e4db] rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Target Location</h2>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Coverage Scale <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        {['Town', 'City', 'District'].map((scale) => (
                          <label key={scale} className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all ${coverageScale === scale ? 'border-[#2f9e58] bg-[#e8f5e9] text-[#2f9e58]' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input 
                              type="radio" 
                              name="coverageScale" 
                              value={scale} 
                              checked={coverageScale === scale} 
                              onChange={() => {
                                setCoverageScale(scale);
                                setTargetCities([]);
                                setTargetLocations([]);
                                setTargetDailyRates([]);
                                setCityInput("");
                              }}
                              className="hidden" 
                            />
                            <span className="font-bold text-sm">{scale}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Prices vary based on the population of the selected scale.</p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Search Location <span className="text-gray-400 font-normal">(Max 7)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cityInput}
                          onChange={(e) => setCityInput(e.target.value)}
                          disabled={!coverageScale}
                          placeholder={coverageScale ? `Search for a ${coverageScale.toLowerCase()}...` : "Select a coverage scale first"}
                          className="w-full h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-[#2f9e58] focus:ring-1 focus:ring-[#2f9e58] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {isSearchingCity && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#2f9e58] rounded-full animate-spin" />
                          </div>
                        )}
                        {citySuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {citySuggestions.map((city, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => addCity(city)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center"
                              >
                                <div>
                                  <span className="block text-sm font-medium text-gray-900">{city.name}</span>
                                  <span className="block text-xs text-gray-500 mt-0.5">{city.displayName} {city.population ? `• Pop: ${city.population.toLocaleString()}` : ''}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[#2f9e58] font-bold text-sm">₹{city.dailyRate || 200}/day</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {targetCities.map((city, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1.5 py-1.5"
                        >
                          <span className="text-sm font-medium text-gray-700">{city}</span>
                          <button
                            type="button"
                            onClick={() => removeCity(city)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#2a2a2a] mb-2">Upload Banner</label>
                    <label className={`h-[176px] rounded-[12px] border border-dashed border-[#cfcfcf] bg-[#fbfbfb] flex flex-col items-center justify-center gap-2 transition ${targetCities.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#2f9e58]'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={targetCities.length === 0}
                        onChange={(e) => {
                          if (targetCities.length === 0) return;
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              setSubmitError("File size exceeds 5MB limit.");
                              return;
                            }
                            setBannerFile(file);
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setBannerPreview(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="h-10 w-10 rounded-full bg-[#ecf8f0] text-[#2f9e58] flex items-center justify-center">
                        <Upload size={16} />
                      </div>
                      <p className="text-[13px] font-semibold text-[#2a2a2a]">{targetCities.length === 0 ? "Select location first" : "Click to upload banner image"}</p>
                      <p className="text-[11px] text-[#757575]">Recommended 1920 x 520 px, max 5MB</p>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2a2a2a] mb-2">Promotion Calendar</label>
                    <div className="rounded-[10px] border border-[#e4e4e4] bg-[#fafafa] p-3 flex flex-col sm:p-4">
                      <div className="grid grid-cols-1 gap-3 flex-1 sm:gap-4 lg:grid-cols-2">
                        <div className="bg-white rounded-[8px] border border-[#e4e4e4] p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <button
                              onClick={() => {
                                if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else { setCurrentMonth(currentMonth - 1); }
                              }}
                              className="h-7 w-7 rounded-[4px] border border-[#ddd] bg-white text-[12px] flex items-center justify-center hover:bg-[#f5f5f5]"
                            >‹</button>
                            <p className="text-[12px] font-semibold text-[#1f1f1f] sm:text-[13px]">
                              {new Date(currentYear, currentMonth).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                            </p>
                            <button
                              onClick={() => {
                                if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else { setCurrentMonth(currentMonth + 1); }
                              }}
                              className="h-7 w-7 rounded-[4px] border border-[#ddd] bg-white text-[12px] flex items-center justify-center hover:bg-[#f5f5f5]"
                            >›</button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className="h-5 flex items-center justify-center text-[9px] font-semibold text-[#666] sm:h-6 sm:text-[10px]">
                                <span className="sm:hidden">{day.slice(0, 1)}</span>
                                <span className="hidden sm:inline">{day}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays(currentYear, currentMonth).map((day, idx) => {
                              const dateObj = day ? new Date(currentYear, currentMonth, day) : null;
                              const dateStr = dateObj ? dateToString(dateObj) : null;
                              const isSelected = dateStr && selectedDates.includes(dateStr);
                              const isToday = dateObj && dateObj.toDateString() === new Date().toDateString();
                              const isPast = dateObj && dateObj < new Date() && !isToday;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (!dateStr || isPast || targetCities.length === 0) return;
                                    if (isSelected) { setSelectedDates(selectedDates.filter((d) => d !== dateStr)); } else { setSelectedDates([...selectedDates, dateStr].sort()); }
                                  }}
                                  disabled={isPast || targetCities.length === 0}
                                  title={targetCities.length === 0 ? "Select location first" : ""}
                                  className={`h-8 rounded-[6px] text-[11px] font-medium transition sm:h-7 sm:rounded-[4px] ${!day ? "bg-transparent" : isPast ? "bg-[#f0f0f0] text-[#ccc] cursor-not-allowed" : targetCities.length === 0 ? "bg-[#f9f9f9] text-[#aaa] cursor-not-allowed" : isSelected ? "bg-[#2f9e58] text-white font-semibold" : isToday ? "bg-[#e8f5e9] text-[#2f9e58] border border-[#2f9e58]" : "bg-white border border-[#e4e4e4] text-[#2f2f2f] hover:bg-[#f9f9f9]"}`}
                                >{day}</button>
                              );
                            })}
                          </div>
                        </div>
 
                        <div className="space-y-3 flex flex-col min-h-0">
                          <div className="flex-1 space-y-2 min-h-0 flex flex-col">
                            <p className="text-[11px] text-[#6c6c6c] font-medium">Selected Dates ({selectedDates.length})</p>
                            <div className="bg-white rounded-[8px] border border-[#e4e4e4] p-3 space-y-2 max-h-[150px] overflow-y-auto">
                              {selectedDates.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedDates.map((dateStr) => (
                                    <div key={dateStr} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-[#e8f5e9] border border-[#2f9e58] w-full justify-between">
                                      <span className="text-[11px] font-semibold text-[#2f9e58]">{new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}</span>
                                      <button onClick={() => setSelectedDates(selectedDates.filter((d) => d !== dateStr))} className="text-[#2f9e58] hover:text-[#1a6b38] font-bold text-xs leading-none">✕</button>
                                    </div>
                                  ))}
                                </div>
                              ) : <p className="text-[11px] text-[#999] italic py-4 text-center">No dates selected yet</p>}
                            </div>
                          </div>
                          <div className="rounded-[8px] border border-[#ebebeb] bg-white px-3 py-2 text-[12px] text-[#2f2f2f] flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[#666]"><CalendarDays size={13} /> Total Days</span>
                            <span className="font-semibold">{selectedDays}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#2a2a2a] mb-2">Banner Preview</label>
                    <div className="relative h-[176px] rounded-[12px] border border-[#e4e4e4] overflow-hidden bg-[#f4f4f4]">
                      {bannerPreview ? <Image src={bannerPreview} alt="Banner preview" fill className="object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[12px] text-[#7a7a7a] px-4 text-center">Banner preview appears here after upload.</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-[12px] border border-[#e2e2e2] bg-white p-5 h-fit sticky top-24">
              <p className="text-[21px] font-semibold text-[#1f1f1f]">Pricing Summary</p>
              <div className="mt-5 space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#676767]">Rate per day</span>
                  <span className="text-gray-900 font-bold">₹{totalDailyRate.toLocaleString()} × {selectedDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#676767]">Subtotal</span>
                  <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                </div>
                {selectedDays > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[#676767]">Payment Gateway (2.5%)</span>
                      <span className="font-semibold">Rs. {pgCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#676767]">GST (18%)</span>
                      <span className="font-semibold">Rs. {gst.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="h-px bg-[#e8e8e8]" />
                <div className="flex items-center justify-between text-[16px]">
                  <span className="font-semibold text-[#1f1f1f]">Total Payable</span>
                  <span className="font-semibold text-[#2f9e58]">Rs. {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmitBanner}
                disabled={submitting}
                className="mt-6 h-10 w-full rounded-[8px] bg-[#2f9e58] disabled:bg-[#9fcfad] text-white text-[13px] font-semibold inline-flex items-center justify-center"
              >
                {submitting ? "Submitting..." : "Submit Banner"}
              </button>

              {submitError ? <p className="mt-3 text-[11px] text-[#dc2626]">{submitError}</p> : null}
              {submitMessage ? <p className="mt-3 text-[11px] text-[#157a4f]">{submitMessage}</p> : null}

              <p className="mt-3 text-[11px] text-[#7a7a7a] leading-[1.45]">
                Your banner will be instantly verified by AI. Once approved, you can proceed to payment immediately.
              </p>
            </aside>
          </section>
        </div>
      </main>
      
      <InappropriateImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <PlanUpgradeModal 
        isOpen={upgradeModalInfo.isOpen} 
        onClose={() => setUpgradeModalInfo({ isOpen: false, message: "" })} 
        message={upgradeModalInfo.message} 
      />
      <ModerationWarningModal
        isOpen={moderationWarningInfo.isOpen}
        onClose={() => setModerationWarningInfo({ isOpen: false, message: "", restrictedUntil: null })}
        message={moderationWarningInfo.message}
        restrictedUntil={moderationWarningInfo.restrictedUntil}
      />

      <footer className="bg-[#e8ad2f] border-t border-[#d49b22] text-[#1b1b1b] px-4 py-4 lg:bg-[#f0b330] lg:px-8 lg:py-7 mt-4 lg:mt-6">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
          <div className="max-w-[240px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center font-bold text-[#157a4f]">G</div>
              <span className="text-[18px] font-semibold text-[#157a4f]">GOLO</span>
            </div>
            <p className="text-[10px] leading-[1.35] text-[#fff8de] max-w-[150px]">
              The all-in-one management platform for modern businesses. Empowering growth through analytics and intuitive product management.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-14 lg:gap-20 text-[10px] text-[#6b520f]">
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-3">Links</p>
              <ul className="space-y-2">
                <li>Overview</li>
                <li>Inventory</li>
                <li>Posts</li>
                <li>Profile</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-3">&nbsp;</p>
              <ul className="space-y-2">
                <li>Analytics</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-3">Support</p>
              <ul className="space-y-2">
                <li>Help Center</li>
                <li>Security</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-auto lg:pb-2 text-[#1877f2]">
            <span className="h-5 w-5 rounded-full bg-[#f3ba3b] flex items-center justify-center text-[#1877f2] text-[10px] font-bold">f</span>
            <span className="h-5 w-5 rounded-[2px] bg-[#f3ba3b] flex items-center justify-center text-[#0a66c2] text-[9px] font-bold">in</span>
            <span className="h-5 w-5 rounded-full bg-[#f3ba3b] flex items-center justify-center text-[#e1306c] text-[10px] font-bold">ig</span>
            <span className="h-5 w-5 rounded-[2px] bg-[#f3ba3b] flex items-center justify-center text-[#ff0000] text-[10px] font-bold">▶</span>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto mt-6 flex items-center justify-between text-[9px] text-[#5f4710]">
          <p>© 2026 GOLO Dashboard. All rights reserved.</p>
          <p>Made with ♥ by V</p>
        </div>
      </footer>
    </div>
  );
}
