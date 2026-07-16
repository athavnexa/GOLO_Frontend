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
      <div
        className="flex h-screen w-full overflow-hidden bg-white"
        style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      >
        {/* ─── LEFT PANEL ─── */}
        <div
          className="hidden lg:flex w-[46%] flex-col items-center justify-center relative"
          style={{ background: "#E8F5EE" }}
        >
          <div className="flex flex-col items-center gap-8 px-10 text-center relative w-full max-w-md">
            
            {/* White illustration card */}
            <div
              className="rounded-[28px] bg-white shadow-sm flex flex-col items-center px-10 py-8 relative mx-auto w-full max-w-[340px]"
            >
              {/* GOLO Logo row */}
              <div className="flex items-center gap-2 self-end mb-6">
                {/* Diamond logo icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 9l10 13 10-13L12 2z" fill="#157A4F" fillOpacity="0.15" stroke="#157A4F" strokeWidth="1.5"/>
                  <path d="M12 2L2 9h20L12 2z" fill="#157A4F" fillOpacity="0.35"/>
                </svg>
                <span className="text-[15px] font-bold text-gray-800 tracking-wide">GOLO</span>
              </div>

              {/* Phone illustration */}
              <div className="relative flex items-center justify-center w-full" style={{ height: 260 }}>
                {/* Floating Avatar (Left) */}
                <div className="absolute left-[-20px] top-[40px] w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200 z-20">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" className="w-full h-full object-cover" />
                </div>
                
                {/* Floating Badge (Left Bottom) */}
                <div className="absolute left-[-40px] bottom-[40px] bg-white rounded-xl py-2 px-3 shadow-lg flex flex-col items-center justify-center z-20 border border-gray-100 min-w-[100px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800">Verified</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Secure Signup</span>
                </div>

                {/* Floating Tomatoes (Right) */}
                <div className="absolute right-[-15px] top-[120px] w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200 z-20">
                  <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80" alt="tomatoes" className="w-full h-full object-cover" />
                </div>

                {/* The Phone */}
                <div className="relative bg-[#1A2530] rounded-[32px] p-2 w-[160px] h-[260px] shadow-lg z-10">
                  <div className="bg-[#FEFAEF] w-full h-full rounded-[26px] overflow-hidden relative flex flex-col pt-6 px-3">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1A2530] rounded-b-xl"></div>
                    
                    {/* Screen Content */}
                    <div className="mt-4 flex flex-col gap-4">
                      {/* Search Bar */}
                      <div className="w-full bg-white rounded-full p-2 flex items-center gap-2 shadow-sm">
                        <div className="w-6 h-6 bg-[#FEF3C7] rounded-full flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full w-12"></div>
                      </div>

                      {/* Heart Card */}
                      <div className="w-full bg-white rounded-xl p-4 flex items-center justify-center shadow-sm border border-[#FEF3C7] relative overflow-hidden">
                        {/* Circle pattern */}
                        <div className="absolute w-24 h-24 border border-[#FDE68A] rounded-full opacity-50" style={{ borderStyle: 'dashed' }}></div>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" className="relative z-10"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </div>

                      {/* Two Pills */}
                      <div className="flex gap-2">
                        <div className="h-6 flex-1 bg-white rounded-full shadow-sm"></div>
                        <div className="h-6 flex-1 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text below card */}
            <div className="flex flex-col items-center gap-2 max-w-[300px]">
              {/* Secure platform label */}
              <div className="flex items-center gap-2 text-[#157A4F] mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#157A4F" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-[#157A4F]">
                  Secure Platform
                </span>
              </div>

              <h2 className="text-[22px] font-extrabold text-gray-900 leading-tight">
                Join GOLO Network
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed px-4">
                Create your free account to shop from trusted local businesses, earn rewards and enjoy seamless shopping.
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-[500px]">
            {/* Title */}
            <h1 className="text-[26px] font-extrabold text-gray-900 text-center mb-1">
              Join GOLO Network Group
            </h1>
            <p className="text-center text-[13px] text-gray-500 mb-8">
              Grow Smarter With Every Ad. Join Free.
            </p>

            {/* Social Buttons */}
            <div className="flex gap-3 mb-6">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white text-[13px] font-semibold text-gray-700">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.5-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5c-7.7 0-14.4 4.3-17.7 9.7z"/>
                  <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.5-5.2l-6.2-5.3C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.2-11.3-7.7l-6.5 5C9.5 40.7 16.2 45 24 45z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.3C36.9 40.2 44 35 44 25c0-1.3-.2-2.5-.4-3.9z"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white text-[13px] font-semibold text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  OR SIGN UP WITH
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} noValidate>
              {/* Error / Success Messages */}
              {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
              {success && <p className="text-[#157A4F] text-xs mb-4 text-center">{success}</p>}

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-5">
                {/* Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors text-gray-800 placeholder-gray-400"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors text-gray-800 placeholder-gray-400"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Number */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors text-gray-800 placeholder-gray-400"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                  <div className="relative" onClick={() => { dateOfBirthInputRef.current?.showPicker?.(); dateOfBirthInputRef.current?.focus(); }}>
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                    <input
                      ref={dateOfBirthInputRef}
                      type="date"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors cursor-pointer placeholder-gray-400"
                      style={{ color: dateOfBirth ? "#1F2937" : "#9CA3AF" }}
                      value={dateOfBirth}
                      onChange={(e) => { setDateOfBirth(e.target.value); setError(""); }}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Gender</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                    <select
                      className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
                      style={{ color: gender ? "#1F2937" : "#9CA3AF" }}
                      value={gender}
                      onChange={(e) => { setGender(e.target.value); setError(""); }}
                    >
                      <option value="" disabled hidden>Select gender</option>
                      {GENDER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ color: "#1F2937" }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors text-gray-800 placeholder-gray-400"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 mb-6">
                <input type="checkbox" id="terms" className="w-3.5 h-3.5 mt-0.5 border-gray-300 rounded text-[#157A4F] focus:ring-[#157A4F] cursor-pointer accent-[#157A4F]" />
                <label htmlFor="terms" className="text-gray-500 text-[11px] leading-tight flex-1">
                  By clicking on &quot;Continue&quot;, I agree to the <span className="text-gray-700 font-bold cursor-pointer hover:underline">Terms</span> and <span className="text-gray-700 font-bold cursor-pointer hover:underline">Privacy Policy</span>. We ensure your data is secure and never shared without your consent.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#157A4F] hover:bg-[#116340] text-white font-bold py-3.5 rounded-xl transition-colors text-[14px] shadow-sm cursor-pointer"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Creating account..." : "Continue"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 text-center text-[12px] text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-gray-900 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
