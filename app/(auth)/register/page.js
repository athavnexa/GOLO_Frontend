"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ChevronDown, Check, CalendarDays } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import SocialButtons from "../../components/SocialButtons";
import LocationPicker from "../../components/LocationPicker";
import StoreLocationMap from "../../components/StoreLocationMap";

const MERCHANT_CATEGORIES = [
  {
    name: "Food & Restaurants",
    subcategories: ["Restaurants", "Cafes", "Cloud Kitchens", "Food Delivery Menus"],
    description: "Restaurants, cafes, cloud kitchens, and delivery menus",
  },
  {
    name: "Home Services",
    subcategories: ["Cleaning", "Plumbing", "Electrical", "Appliance Repair", "Maintenance"],
    description: "Cleaning, plumbing, electrical, repair, and upkeep",
  },
  {
    name: "Beauty & Wellness",
    subcategories: ["Salon", "Spa", "Grooming", "Personal Care Services"],
    description: "Salon, spa, grooming, and personal care services",
  },
  {
    name: "Healthcare & Medical",
    subcategories: ["Hospitals", "Clinics", "Pharmacies", "Diagnostics"],
    description: "Hospitals, clinics, pharmacies, and diagnostics",
  },
  {
    name: "Hotels & Accommodation",
    subcategories: ["Hotels", "Lodges", "Stays", "Room Bookings"],
    description: "Hotels, lodges, stays, and room bookings",
  },
  {
    name: "Shopping & Retail",
    subcategories: ["Local Shops", "Groceries", "Fashion", "Electronics", "Products"],
    description: "Local shops, groceries, fashion, electronics, and products",
  },
  {
    name: "Education & Training",
    subcategories: ["Schools", "Coaching", "Institutes", "Skill Development"],
    description: "Schools, coaching, institutes, and skill development",
  },
  {
    name: "Real Estate",
    subcategories: ["Property Buying", "Property Selling", "Renting"],
    description: "Property buying, selling, and renting",
  },
  {
    name: "Events & Entertainment",
    subcategories: ["Event Planners", "Photographers", "DJs", "Venues"],
    description: "Event planners, photographers, DJs, and venues",
  },
  {
    name: "Professional Services",
    subcategories: ["Legal", "CA", "Consulting", "Freelance Services"],
    description: "Legal, CA, consulting, and freelance services",
  },
  {
    name: "Automotive Services",
    subcategories: ["Car Repair", "Bike Repair", "Servicing", "Rentals"],
    description: "Car and bike repair, servicing, and rentals",
  },
  {
    name: "Home Improvement",
    subcategories: ["Interior Design", "Painting", "Carpentry", "Renovation"],
    description: "Interior design, painting, carpentry, and renovation",
  },
  {
    name: "Fitness & Sports",
    subcategories: ["Gyms", "Yoga", "Personal Trainers", "Sports Facilities"],
    description: "Gyms, yoga, personal trainers, and sports facilities",
  },
  {
    name: "Daily Needs & Utilities",
    subcategories: ["Laundry", "Water Supply", "Gas", "Essential Services"],
    description: "Laundry, water supply, gas, and essential services",
  },
  {
    name: "Local Businesses & Vendors",
    subcategories: ["General Business Listings", "B2B", "B2C", "Marketplace/IndiaMART Style"],
    description: "General business listings and marketplace-style vendors",
  },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "others", label: "Others" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
}

function normalizeLocationPayload(location) {
  const latitude = toFiniteNumber(
    location?.latitude ?? location?.lat ?? location?.coordinates?.lat
  );
  const longitude = toFiniteNumber(
    location?.longitude ?? location?.lng ?? location?.coordinates?.lng
  );
  const address = String(
    location?.address ?? location?.displayName ?? location?.name ?? ""
  ).trim();

  return { latitude, longitude, address };
}

function isValidStoreCoordinates({ latitude, longitude }) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export default function RegisterPage() {
  const quotes = [
    "Maximize your ROI with our AI-driven ad placement strategy.",
    "Real-time analytics that give you the edge over competitors.",
    "The simplest way to manage global ad campaigns in one place."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accountType, setAccountType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  // Merchant form fields
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeSubCategory, setStoreSubCategory] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [storeCoordinates, setStoreCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [storePassword, setStorePassword] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const subCategoryDropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);
  const dateOfBirthInputRef = useRef(null);

  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const selectedCategory = MERCHANT_CATEGORIES.find((category) => category.name === storeCategory);
  const availableSubcategories = selectedCategory?.subcategories || [];
  const categoryLabel = useMemo(() => {
    if (!storeCategory) return "Select category";
    return storeCategory;
  }, [storeCategory]);
  const subCategoryLabel = useMemo(() => {
    if (!storeCategory) return "Select category first";
    if (!storeSubCategory) return "Select sub category";
    return storeSubCategory;
  }, [storeCategory, storeSubCategory]);
  const genderLabel = useMemo(() => {
    return GENDER_OPTIONS.find((item) => item.value === gender)?.label || "Select gender";
  }, [gender]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }
      if (subCategoryDropdownRef.current && !subCategoryDropdownRef.current.contains(target)) {
        setIsSubCategoryOpen(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(target)) {
        setIsGenderOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
        setIsSubCategoryOpen(false);
        setIsGenderOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type");
      if (typeParam === "merchant" || typeParam === "user") {
        setAccountType(typeParam);
      }
    }
  }, []);

  const handleAccountTypeChange = (nextAccountType) => {
    setAccountType(nextAccountType);
    setError("");
    setSuccess("");
    setIsCategoryOpen(false);
    setIsSubCategoryOpen(false);
    setIsGenderOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("type", nextAccountType);
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  };

  const handleAccountToggleClick = (event) => {
    const option = event.target.closest("[data-account-type]");
    if (!option) return;
    handleAccountTypeChange(option.dataset.accountType);
  };

  const handleAccountToggleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      handleAccountTypeChange(accountType === "user" ? "merchant" : "user");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate based on account type
    if (accountType === "user") {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Name, email, and password are required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    } else {
      const normalizedCoordinates = normalizeLocationPayload(storeCoordinates);
      const hasValidCoordinates = isValidStoreCoordinates(normalizedCoordinates);

      if (!storeName.trim() || !storeEmail.trim() || !storeCategory || !storeSubCategory || !storePassword.trim()) {
        setError("Store name, email, category, sub category, and password are required.");
        return;
      }
      if (!storeLocation.trim() || !hasValidCoordinates) {
        setError("Please select your store location from the map.");
        return;
      }
      if (storePassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setIsLoading(true);
    try {
      // Helper to format phone number to E.164 (satisfy backend IsPhoneNumber)
      const formatPhone = (p) => {
        if (!p) return undefined;
        let cleaned = p.replace(/\D/g, ''); // Remove non-digits
        if (cleaned.length === 10) return `+91${cleaned}`; // Default to India 
        return p.startsWith('+') ? p : `+${cleaned}`; // Ensure it starts with +
      };

      const normalizedStoreCoordinates = normalizeLocationPayload(storeCoordinates);
      const registrationData = accountType === "user"
        ? {
          name,
          email,
          password,
          phone: formatPhone(phone),
          dateOfBirth,
          gender,
          accountType: "user",
        }
        : {
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
          storeLocationLatitude: normalizedStoreCoordinates.latitude,
          storeLocationLongitude: normalizedStoreCoordinates.longitude,
        };

      await register(registrationData);
      if (accountType === "user" && typeof window !== "undefined") {
        localStorage.setItem("golo_pending_first_login_email", email.trim().toLowerCase());
      }
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      if (err.data?.message?.includes("phone")) {
        setError("Invalid phone number format. Please include country code (e.g., +91).");
      } else {
        setError(
          err.data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout>
      <div className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900">
        
        {/* LEFT SIDE - Cream Background */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-[#FCFAEB] relative">
          <div className="flex flex-col items-center justify-center text-center max-w-sm px-4">
            {/* Double Quote icon */}
            <div className="mb-6 text-[#F8E1BA] text-7xl leading-none font-serif font-black">&rdquo;</div>
            
            {/* Logo Square */}
            <div className="w-20 h-20 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-10 shadow-sm">
              <span className="text-white text-5xl font-bold">G</span>
            </div>
            
            {/* Text */}
            <h1 className="text-[22px] font-bold text-[#763645] mb-12 leading-relaxed">
              The simplest way to<br/>manage global ad<br/>campaigns in one place.
            </h1>
            
            {/* Pagination */}
            <div className="flex items-center gap-4">
              <button type="button" className="w-8 h-8 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] hover:text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold">‹</span>
              </button>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FDE68A]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FDE68A]"></span>
              </div>
              <button type="button" className="w-8 h-8 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] hover:text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - White Background */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 relative">
          
          {/* The Card */}
          <div className="w-full max-w-[580px] bg-white rounded-[24px] p-8 lg:p-10 border border-gray-200 shadow-[0_12px_40px_rgb(0,0,0,0.06)] relative z-10 overflow-y-auto max-h-full">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
              Join GOLO Network Group
            </h2>
            <p className="text-center text-gray-500 text-[14px] mb-8">
              Grow Smarter With Every Ad. Join Free.
            </p>
            
            {/* Social Buttons */}
            <div className="flex gap-4 mb-7">
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-semibold text-gray-700">Google</span>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="" className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-semibold text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-white px-3 text-gray-400">
                  OR SIGN UP WITH
                </span>
              </div>
            </div>

            <form onSubmit={handleRegister}>
              {/* Error / Success Messages */}
              {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
              {success && <p className="text-[#157A4F] text-xs mb-4 text-center">{success}</p>}

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
                {/* Name Input */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors text-gray-800"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors text-gray-800"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Number Input */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors text-gray-800"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Date of Birth</label>
                  <div className="relative" onClick={() => { dateOfBirthInputRef.current?.showPicker?.(); dateOfBirthInputRef.current?.focus(); }}>
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <input
                      ref={dateOfBirthInputRef}
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors cursor-pointer"
                      style={{ color: dateOfBirth ? "#111827" : "#9CA3AF" }}
                      value={dateOfBirth}
                      onChange={(e) => { setDateOfBirth(e.target.value); setError(""); }}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Gender</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <select
                      className="w-full pl-10 pr-8 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors appearance-none cursor-pointer"
                      style={{ color: gender ? "#111827" : "#9CA3AF" }}
                      value={gender}
                      onChange={(e) => { setGender(e.target.value); setError(""); }}
                    >
                      <option value="" disabled hidden>Select gender</option>
                      {GENDER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ color: "#111827" }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors text-gray-800"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 mb-5">
                <input type="checkbox" id="terms" className="w-3.5 h-3.5 mt-0.5 border-gray-300 rounded text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                <label htmlFor="terms" className="text-gray-500 text-[10px] leading-tight">
                  By clicking on &quot;Continue&quot;, I agree to the <span className="text-[#F59E0B] font-bold cursor-pointer hover:underline">Terms</span> and <span className="text-[#F59E0B] font-bold cursor-pointer hover:underline">Privacy Policy</span>. We ensure your data is secure and never shared without your consent.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F59E0B] hover:bg-[#E69309] text-white font-bold py-3 rounded-xl transition-colors text-[14px] shadow-sm cursor-pointer"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Creating account..." : "Continue"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 text-center text-[12px] text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#F59E0B] font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
