"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, Phone, MapPin, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import LocationPicker from "../../components/LocationPicker";

const MERCHANT_CATEGORIES = [
  { name: "Food & Restaurants", subcategories: ["Restaurants", "Cafes", "Cloud Kitchens", "Food Delivery Menus"] },
  { name: "Home Services", subcategories: ["Cleaning", "Plumbing", "Electrical", "Appliance Repair", "Maintenance"] },
  { name: "Beauty & Wellness", subcategories: ["Salon", "Spa", "Grooming", "Personal Care Services"] },
  { name: "Healthcare & Medical", subcategories: ["Hospitals", "Clinics", "Pharmacies", "Diagnostics"] },
  { name: "Hotels & Accommodation", subcategories: ["Hotels", "Lodges", "Stays", "Room Bookings"] },
  { name: "Shopping & Retail", subcategories: ["Local Shops", "Groceries", "Fashion", "Electronics", "Products"] },
  { name: "Education & Training", subcategories: ["Schools", "Coaching", "Institutes", "Skill Development"] },
  { name: "Real Estate", subcategories: ["Property Buying", "Property Selling", "Renting"] },
  { name: "Events & Entertainment", subcategories: ["Event Planners", "Photographers", "DJs", "Venues"] },
  { name: "Professional Services", subcategories: ["Legal", "CA", "Consulting", "Freelance Services"] },
  { name: "Automotive Services", subcategories: ["Car Repair", "Bike Repair", "Servicing", "Rentals"] },
  { name: "Home Improvement", subcategories: ["Interior Design", "Painting", "Carpentry", "Renovation"] },
  { name: "Fitness & Sports", subcategories: ["Gyms", "Yoga", "Personal Trainers", "Sports Facilities"] },
  { name: "Daily Needs & Utilities", subcategories: ["Laundry", "Water Supply", "Gas", "Essential Services"] },
  { name: "Local Businesses & Vendors", subcategories: ["General Business Listings", "B2B", "B2C", "Marketplace/IndiaMART Style"] },
];

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeLocationPayload(location) {
  const latitude = toFiniteNumber(location?.latitude ?? location?.lat ?? location?.coordinates?.lat);
  const longitude = toFiniteNumber(location?.longitude ?? location?.lng ?? location?.coordinates?.lng);
  const address = String(location?.address ?? location?.displayName ?? location?.name ?? "").trim();
  return { latitude, longitude, address };
}

function isValidStoreCoordinates({ latitude, longitude }) {
  return (
    Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

export default function MerchantRegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeSubCategory, setStoreSubCategory] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [storePassword, setStorePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [storeLocation, setStoreLocation] = useState("");
  const [storeCoordinates, setStoreCoordinates] = useState({ latitude: null, longitude: null });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categoryDropdownRef = useRef(null);
  const subCategoryDropdownRef = useRef(null);

  const selectedCategory = MERCHANT_CATEGORIES.find((c) => c.name === storeCategory);
  const availableSubcategories = selectedCategory?.subcategories || [];
  const categoryLabel = useMemo(() => storeCategory || "Select category", [storeCategory]);
  const subCategoryLabel = useMemo(() => {
    if (!storeCategory) return "Select category first";
    return storeSubCategory || "Select sub category";
  }, [storeCategory, storeSubCategory]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) setIsCategoryOpen(false);
      if (subCategoryDropdownRef.current && !subCategoryDropdownRef.current.contains(e.target)) setIsSubCategoryOpen(false);
    };
    const handleKeyDown = (e) => { if (e.key === "Escape") { setIsCategoryOpen(false); setIsSubCategoryOpen(false); } };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("mousedown", handlePointerDown); document.removeEventListener("keydown", handleKeyDown); };
  }, []);

  useEffect(() => {
    if (isAuthenticated) router.push("/merchant/dashboard");
  }, [isAuthenticated, router]);

  const handleLocationSelect = (location) => {
    const { latitude, longitude, address } = normalizeLocationPayload(location);
    if (!isValidStoreCoordinates({ latitude, longitude })) {
      setError("Could not capture valid coordinates. Please try again.");
      return;
    }
    setStoreLocation(address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    setStoreCoordinates({ latitude, longitude });
    setShowLocationPicker(false);
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!storeName.trim() || !storeEmail.trim() || !storeCategory || !storeSubCategory || !storePassword.trim()) {
      setError("Store name, email, category, sub category, and password are required.");
      return;
    }
    const normalizedCoords = normalizeLocationPayload(storeCoordinates);
    if (!storeLocation.trim() || !isValidStoreCoordinates(normalizedCoords)) {
      setError("Please select your store location from the map.");
      return;
    }
    if (storePassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!termsAccepted) { setError("Please accept the Terms and Privacy Policy."); return; }

    setIsLoading(true);
    try {
      const formatPhone = (p) => {
        if (!p) return undefined;
        const cleaned = p.replace(/\D/g, "");
        if (cleaned.length === 10) return `+91${cleaned}`;
        return p.startsWith("+") ? p : `+${cleaned}`;
      };
      await register({
        name: storeName,
        email: storeEmail,
        password: storePassword,
        phone: formatPhone(contactNumber),
        accountType: "merchant",
        storeName,
        storeEmail,
        storeCategory,
        storeSubCategory,
        contactNumber: formatPhone(contactNumber),
        storeLocation,
        storeLocationLatitude: normalizedCoords.latitude,
        storeLocationLongitude: normalizedCoords.longitude,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/merchant-login"), 1500);
    } catch (err) {
      setError(err.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {showLocationPicker && (
        <LocationPicker
          isOpen={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}

      <div className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-[38%] flex-col items-center justify-center bg-[#FCFAEB] shrink-0">
          <div className="flex flex-col items-center text-center max-w-xs px-6">
            <div className="mb-4 text-[#F8E1BA] text-6xl leading-none font-serif font-black">&rdquo;</div>
            <div className="w-20 h-20 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-7 shadow-md">
              <span className="text-white text-5xl font-bold">G</span>
            </div>
            <h1 className="text-[19px] font-bold text-[#763645] mb-9 leading-relaxed">
              The simplest way to<br />manage global ad<br />campaigns in one place.
            </h1>
            <div className="flex items-center gap-4">
              <button type="button" className="w-8 h-8 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] hover:text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold">&#8249;</span>
              </button>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FDE68A]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FDE68A]"></span>
              </div>
              <button type="button" className="w-8 h-8 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] hover:text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold">&#8250;</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[62%] flex items-center justify-center bg-white px-4 py-4 lg:px-10">
          <div className="w-full max-w-[560px] bg-white rounded-[22px] border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.07)] px-8 py-6">

            <h2 className="text-[22px] font-extrabold text-center text-gray-900 mb-1">Register Your Store</h2>
            <p className="text-center text-gray-400 text-[12px] mb-4">Expand Your Business With GOLO</p>

            {/* Social Buttons */}
            <div className="flex gap-3 mb-4">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                <span className="text-[12px] font-semibold text-gray-700">Google</span>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-4 h-4" />
                <span className="text-[12px] font-semibold text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest">
                <span className="bg-white px-3 text-gray-400">OR SIGN UP WITH</span>
              </div>
            </div>

            <form onSubmit={handleRegister}>
              {error && <p className="text-red-500 text-[11px] mb-2 text-center font-semibold">{error}</p>}
              {success && <p className="text-[#157A4F] text-[11px] mb-2 text-center font-semibold">{success}</p>}

              {/* Row 1: Store Name + Email */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Store Name</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <input type="text" placeholder="Enter store name"
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:border-[#F59E0B] transition-colors text-gray-800"
                      value={storeName} onChange={(e) => { setStoreName(e.target.value); setError(""); }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input type="email" placeholder="Enter store email"
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:border-[#F59E0B] transition-colors text-gray-800"
                      value={storeEmail} onChange={(e) => { setStoreEmail(e.target.value); setError(""); }} />
                  </div>
                </div>
              </div>

              {/* Row 2: Category + Sub Category */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Category</label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <button type="button"
                      onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsSubCategoryOpen(false); }}
                      className="w-full flex items-center gap-1.5 pl-3 pr-2 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] hover:border-gray-300 transition-colors text-left cursor-pointer"
                    >
                      <svg className="text-gray-400 shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      <span className={`flex-1 truncate ${storeCategory ? "text-gray-800" : "text-gray-400"}`}>{categoryLabel}</span>
                      <ChevronDown size={12} className={`text-gray-400 transition-transform shrink-0 ${isCategoryOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isCategoryOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
                        {MERCHANT_CATEGORIES.map((cat) => (
                          <button key={cat.name} type="button"
                            onClick={() => { setStoreCategory(cat.name); setStoreSubCategory(""); setIsCategoryOpen(false); setError(""); }}
                            className={`w-full text-left px-3 py-2 text-[11px] hover:bg-[#FEF9EE] transition-colors ${storeCategory === cat.name ? "bg-[#FEF9EE] text-[#F59E0B] font-bold" : "text-gray-700"}`}>
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Sub Category</label>
                  <div className="relative" ref={subCategoryDropdownRef}>
                    <button type="button"
                      disabled={!storeCategory}
                      onClick={() => { if (storeCategory) { setIsSubCategoryOpen(!isSubCategoryOpen); setIsCategoryOpen(false); } }}
                      className="w-full flex items-center gap-1.5 pl-3 pr-2 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] hover:border-gray-300 transition-colors text-left disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <svg className="text-gray-400 shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      <span className={`flex-1 truncate ${storeSubCategory ? "text-gray-800" : "text-gray-400"}`}>{subCategoryLabel}</span>
                      <ChevronDown size={12} className={`text-gray-400 transition-transform shrink-0 ${isSubCategoryOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isSubCategoryOpen && availableSubcategories.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
                        {availableSubcategories.map((sub) => (
                          <button key={sub} type="button"
                            onClick={() => { setStoreSubCategory(sub); setIsSubCategoryOpen(false); setError(""); }}
                            className={`w-full text-left px-3 py-2 text-[11px] hover:bg-[#FEF9EE] transition-colors ${storeSubCategory === sub ? "bg-[#FEF9EE] text-[#F59E0B] font-bold" : "text-gray-700"}`}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Number + Password */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input type="tel" placeholder="Enter contact number"
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:border-[#F59E0B] transition-colors text-gray-800"
                      value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                      className="w-full pl-8 pr-8 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:border-[#F59E0B] transition-colors text-gray-800"
                      value={storePassword} onChange={(e) => { setStorePassword(e.target.value); setError(""); }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 cursor-pointer">
                      {showPassword ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Location (full width) */}
              <div className="mb-1">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Location</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input type="text" placeholder="Select store location from map" readOnly
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[12px] focus:outline-none text-gray-800 cursor-pointer"
                      value={storeLocation} onClick={() => setShowLocationPicker(true)} />
                  </div>
                  <button type="button" onClick={() => setShowLocationPicker(true)}
                    className="bg-[#1a5c3e] hover:bg-[#0f4a2e] text-white font-bold text-[11px] px-4 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0">
                    Pick on Map
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 italic mt-1">This location will be used to show your offers in nearby deals.</p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 mb-3 mt-2.5">
                <input type="checkbox" id="merchant-terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 border-gray-300 rounded text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer shrink-0" />
                <label htmlFor="merchant-terms" className="text-gray-500 text-[10px] leading-tight cursor-pointer">
                  By clicking on &quot;Continue&quot;, I agree{" "}
                  <span className="text-[#F59E0B] font-bold hover:underline">Terms</span>{" "}and{" "}
                  <span className="text-[#F59E0B] font-bold hover:underline">Privacy Policy</span>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full bg-[#F59E0B] hover:bg-[#E69309] text-white font-bold py-3 rounded-xl transition-colors text-[13px] shadow-sm cursor-pointer"
                style={{ opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? "Creating account..." : "Continue"}
              </button>
            </form>

            <div className="mt-3 text-center text-[11px] text-gray-500">
              Already have an account?{" "}
              <Link href="/merchant-login" className="text-[#F59E0B] font-bold hover:underline">Sign In</Link>
            </div>

          </div>
        </div>

      </div>
    </AuthLayout>
  );
}
