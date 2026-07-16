"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, Phone, MapPin, Eye, EyeOff, ChevronDown, Store, Grid, Layers, Briefcase, Calendar, AlignLeft, Info, Upload, ShieldCheck, Check, FileText, AlertCircle, RefreshCw, Download, Clock, Search, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import LocationPicker from "../../components/LocationPicker";
import { API_BASE_URL, validateMerchantStep } from "../../lib/api";
import { uploadToCloudinary } from "../../services/cloudinaryConfig";

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

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Account
  const [fullName, setFullName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [storePassword, setStorePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 2: Business
  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeSubCategory, setStoreSubCategory] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isBusinessTypeOpen, setIsBusinessTypeOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const subCategoryDropdownRef = useRef(null);
  const businessTypeDropdownRef = useRef(null);
  
  const BUSINESS_TYPES = ["Sole Proprietorship", "Partnership", "Private Limited", "Public Limited", "LLP", "Other"];

  // Step 3: Address
  const [storeLocation, setStoreLocation] = useState("");
  const [storeCoordinates, setStoreCoordinates] = useState({ latitude: null, longitude: null });
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Step 4: Documents
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [certifyChecked, setCertifyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  
  const [aadhaarDoc, setAadhaarDoc] = useState(null);
  const [panDoc, setPanDoc] = useState(null);
  const [businessDocs, setBusinessDocs] = useState({});

  const handleFileUpload = (e, type, docName = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError(`File size should not exceed 5MB.`);
      return;
    }
    
    setError("");
    if (type === "aadhaar") {
      setAadhaarDoc(file);
    } else if (type === "pan") {
      setPanDoc(file);
    } else if (type === "business") {
      setBusinessDocs(prev => ({ ...prev, [docName]: file }));
    }
  };

  // Common
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      if (businessTypeDropdownRef.current && !businessTypeDropdownRef.current.contains(e.target)) setIsBusinessTypeOpen(false);
    };
    const handleKeyDown = (e) => { if (e.key === "Escape") { setIsCategoryOpen(false); setIsSubCategoryOpen(false); setIsBusinessTypeOpen(false); } };
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


  const handleNextStep = async () => {
    setError("");
    if (currentStep === 1) {
      if (!fullName.trim() || !storeEmail.trim() || !contactNumber.trim() || !storePassword.trim()) {
        setError("Please fill in all account fields.");
        return;
      }
      if (storePassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (storePassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      
      setIsLoading(true);
      try {
        await validateMerchantStep({ step: 1, email: storeEmail, phone: contactNumber });
        setCurrentStep(2);
      } catch (err) {
        setError(err?.data?.message || err?.message || "Validation failed.");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      if (!storeName.trim() || !storeCategory || !storeSubCategory || !businessType) {
        setError("Please fill in required business details.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const normalizedCoords = normalizeLocationPayload(storeCoordinates);
      if (!storeLocation.trim() || !isValidStoreCoordinates(normalizedCoords)) {
        setError("Please select your store location from the map.");
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    
    setIsLoading(true);
    try {
      const formatPhone = (p) => {
        if (!p) return undefined;
        const cleaned = p.replace(/\D/g, "");
        if (cleaned.length === 10) return `+91${cleaned}`;
        return p.startsWith("+") ? p : `+${cleaned}`;
      };
      
      const normalizedCoords = normalizeLocationPayload(storeCoordinates);
      
      let uploadedDocs = { aadhaarUrl: undefined, panUrl: undefined, businessDocs: {} };
      
      if (aadhaarDoc) {
        const res = await uploadToCloudinary(aadhaarDoc);
        uploadedDocs.aadhaarUrl = res.url;
      }
      if (panDoc) {
        const res = await uploadToCloudinary(panDoc);
        uploadedDocs.panUrl = res.url;
      }
      for (const [docName, file] of Object.entries(businessDocs)) {
        const res = await uploadToCloudinary(file);
        uploadedDocs.businessDocs[docName] = res.url;
      }
      
      await register({
        name: fullName,
        email: storeEmail,
        password: storePassword,
        phone: formatPhone(contactNumber),
        accountType: "merchant",
        storeName,
        storeEmail,
        storeCategory,
        storeSubCategory,
        businessType,
        yearsInBusiness: yearsInBusiness ? Number(yearsInBusiness) : undefined,
        businessDescription,
        contactNumber: formatPhone(contactNumber),
        storeLocation,
        storeLocationLatitude: normalizedCoords.latitude,
        storeLocationLongitude: normalizedCoords.longitude,
        documents: uploadedDocs,
      });
      setCurrentStep(5);
    } catch (err) {
      setError(err.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden w-full bg-[#F5F7FA] font-sans text-gray-900" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {showLocationPicker && (
        <LocationPicker
          isOpen={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}

      {/* ─── TOP HEADER ─── */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-10 sticky top-0 shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
          <div className="w-8 h-8 bg-[#157A4F] rounded flex items-center justify-center font-bold text-white text-[16px]">
            G
          </div>
          <span className="text-[16px] font-bold text-[#157A4F] tracking-tight">GOLO Merchant Registration</span>
        </div>

        {/* Center: Stepper */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-center max-w-2xl">
          {/* Step 1: Account */}
          <div className="flex flex-col items-center gap-1.5 w-16">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-400'} shadow-sm transition-colors`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${currentStep >= 1 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>Account</span>
          </div>
          <div className={`h-[1px] w-12 ${currentStep >= 2 ? 'bg-[#F59E0B]' : 'bg-gray-200'} -mt-4`}></div>
          
          {/* Step 2: Business */}
          <div className="flex flex-col items-center gap-1.5 w-16">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-500'} transition-colors`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${currentStep >= 2 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>Business</span>
          </div>
          <div className={`h-[1px] w-12 ${currentStep >= 3 ? 'bg-[#F59E0B]' : 'bg-gray-200'} -mt-4`}></div>

          {/* Step 3: Address */}
          <div className="flex flex-col items-center gap-1.5 w-16">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-500'} transition-colors`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${currentStep >= 3 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>Address</span>
          </div>
          <div className={`h-[1px] w-12 ${currentStep >= 4 ? 'bg-[#F59E0B]' : 'bg-gray-200'} -mt-4`}></div>

          {/* Step 4: Documents */}
          <div className="flex flex-col items-center gap-1.5 w-16">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-500'} transition-colors`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${currentStep >= 4 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>Documents</span>
          </div>
        </div>

        {/* Right: Progress */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-[11px] text-gray-500">Step {currentStep} of 4</div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-extrabold text-gray-900">{currentStep * 25}% Complete</span>
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 rounded-full transition-all duration-300" style={{ width: `${currentStep * 25}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex flex-1 w-full overflow-hidden">
        
        {/* LEFT PANEL: Cream Background + Illustration */}
        <div className="hidden lg:flex w-[40%] flex-col items-center justify-center bg-[#FCFAEB] p-10 relative border-r border-gray-100">
          <div className="w-full max-w-[400px] flex flex-col items-center text-center">
            
            {/* Custom SVG Illustration replacing the 3D graphic */}
            <div className="w-[320px] h-[320px] bg-white rounded-2xl shadow-sm mb-8 relative flex items-center justify-center overflow-hidden border border-gray-50">
              
              {/* Background abstract shapes */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#157A4F_0%,_transparent_70%)]"></div>
              
              {/* Floating Shield (Top Left) */}
              <div className="absolute top-[40px] left-[30px] w-14 h-16 bg-[#4285F4] rounded-lg rotate-[-15deg] shadow-lg flex items-center justify-center z-20" style={{ clipPath: 'polygon(50% 100%, 100% 80%, 100% 0, 0 0, 0 80%)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="absolute top-[30px] left-[80px] w-6 h-6 bg-[#34A853] rounded-full flex items-center justify-center shadow-md z-20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>

              {/* Floating Cloud (Top Right) */}
              <div className="absolute top-[30px] right-[40px] w-20 h-14 bg-[#4285F4] rounded-full shadow-lg flex items-center justify-center z-20">
                <div className="absolute -bottom-1 -left-2 w-10 h-10 bg-[#4285F4] rounded-full"></div>
                <div className="absolute -top-4 left-4 w-12 h-12 bg-[#4285F4] rounded-full"></div>
                <svg className="relative z-10" width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>

              {/* Floating OTP Ticket (Right) */}
              <div className="absolute top-[120px] right-[20px] bg-[#F59E0B] text-white font-bold text-[14px] px-3 py-2 rounded-lg rotate-[15deg] shadow-lg z-20">
                OTP
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#F59E0B] rotate-45"></div>
              </div>

              {/* Floating Envelope (Left) */}
              <div className="absolute bottom-[80px] left-[20px] w-16 h-12 bg-[#F59E0B] rounded-md shadow-lg rotate-[-10deg] z-20 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full border-t-[24px] border-t-[#FDE68A] border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent"></div>
              </div>
              <div className="absolute bottom-[70px] left-[15px] w-5 h-5 bg-[#34A853] rounded-full flex items-center justify-center shadow-md z-20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>

              {/* Main Desk and Person */}
              <svg viewBox="0 0 200 200" width="220" height="220" className="relative z-10 mt-10">
                {/* Desk Isometric */}
                <path d="M20 120 L100 80 L180 120 L100 160 Z" fill="#E2E8F0" />
                <path d="M20 120 L100 160 L100 170 L20 130 Z" fill="#CBD5E1" />
                <path d="M180 120 L100 160 L100 170 L180 130 Z" fill="#94A3B8" />
                {/* Legs */}
                <rect x="30" y="125" width="6" height="50" fill="#94A3B8" />
                <rect x="95" y="165" width="6" height="30" fill="#94A3B8" />
                <rect x="160" y="125" width="6" height="40" fill="#94A3B8" />

                {/* Chair */}
                <path d="M40 70 L60 60 L65 95 L45 105 Z" fill="#475569" />
                <rect x="45" y="100" width="20" height="5" fill="#334155" />
                <rect x="52" y="105" width="4" height="25" fill="#94A3B8" />

                {/* Person */}
                {/* Body */}
                <path d="M50 70 Q70 60 75 90 L55 100 Z" fill="#64748B" />
                {/* Head */}
                <circle cx="65" cy="55" r="12" fill="#8B5A2B" />
                {/* Hair */}
                <path d="M53 55 Q65 40 77 55 Q70 45 53 55" fill="#1A1A1A" />
                {/* Arm */}
                <path d="M65 75 Q85 80 90 95" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Legs */}
                <path d="M60 100 L75 140" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
                <path d="M65 95 L85 130" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
                <ellipse cx="75" cy="142" rx="8" ry="4" fill="#5D4037" />
                <ellipse cx="85" cy="132" rx="8" ry="4" fill="#5D4037" />

                {/* Laptop */}
                <path d="M85 105 L110 85 L130 95 L105 115 Z" fill="#4285F4" />
                <path d="M85 105 L105 115 L105 120 L85 110 Z" fill="#1967D2" />
                {/* Screen Chart */}
                <rect x="100" y="95" width="4" height="10" fill="#FFF" transform="rotate(-35 100 95)" />
                <rect x="106" y="92" width="4" height="15" fill="#FFF" transform="rotate(-35 106 92)" />
                <rect x="112" y="89" width="4" height="20" fill="#FFF" transform="rotate(-35 112 89)" />
              </svg>
            </div>

            <p className="text-[14px] text-gray-500 leading-relaxed max-w-[280px]">
              Create your account to start your business journey with GOLO and join thousands of successful vendors.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="flex flex-1 justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-[600px] px-8 py-10">
            
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#157A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                  <h2 className="text-[22px] font-extrabold text-gray-900">Account Information</h2>
                </div>
                <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
                  Let&apos;s start by setting up your primary login credentials and contact details. This information will be used for important store notifications.
                </p>

                {error && <p className="text-red-500 text-[12px] mb-4 font-semibold">{error}</p>}

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <input type="text" placeholder="Enter your legal full name"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                        value={fullName} onChange={(e) => { setFullName(e.target.value); setError(""); }} />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" placeholder="you@business.com"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                        value={storeEmail} onChange={(e) => { setStoreEmail(e.target.value); setError(""); }} />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="tel" placeholder="00000-00000"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                        value={contactNumber} onChange={(e) => { setContactNumber(e.target.value); setError(""); }} />
                    </div>
                  </div>

                  {/* Passwords Grid */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                          value={storePassword} onChange={(e) => { setStorePassword(e.target.value); setError(""); }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer">
                          {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                          value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer">
                          {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms Alert Box */}
                  <div className="flex items-start gap-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4 mt-6 border-dashed">
                    <div className="w-5 h-5 rounded-full bg-[#157A4F] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white font-serif italic font-bold text-[12px]">i</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      By continuing, you agree to our <span className="text-[#157A4F] font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#157A4F] font-bold cursor-pointer hover:underline">Privacy Policy</span>. You will receive transactional SMS and email updates regarding your application.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-[22px] font-extrabold text-gray-900">Business Details</h2>
                  <Info size={16} className="text-gray-400 mt-0.5" />
                </div>
                <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
                  Provide information about your store as it should appear to customers.
                </p>

                {error && <p className="text-red-500 text-[12px] mb-4 font-semibold">{error}</p>}

                <div className="space-y-5">
                  {/* Store Name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Store Name</label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="e.g. Golden Harvest Organics"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                        value={storeName} onChange={(e) => { setStoreName(e.target.value); setError(""); }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Category */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Business Category</label>
                      <div className="relative" ref={categoryDropdownRef}>
                        <button type="button"
                          onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsSubCategoryOpen(false); setIsBusinessTypeOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] hover:border-gray-300 transition-colors text-left cursor-pointer focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F]"
                        >
                          <Grid size={16} className="text-gray-400 shrink-0" />
                          <span className={`flex-1 truncate ${storeCategory ? "text-gray-800" : "text-gray-400"}`}>{categoryLabel}</span>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isCategoryOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
                            {MERCHANT_CATEGORIES.map((cat) => (
                              <button key={cat.name} type="button"
                                onClick={() => { setStoreCategory(cat.name); setStoreSubCategory(""); setIsCategoryOpen(false); setError(""); }}
                                className={`w-full text-left px-4 py-2.5 text-[12px] transition-colors ${storeCategory === cat.name ? "bg-[#F0FDF4] text-[#157A4F] font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Subcategory</label>
                      <div className="relative" ref={subCategoryDropdownRef}>
                        <button type="button"
                          disabled={!storeCategory}
                          onClick={() => { if (storeCategory) { setIsSubCategoryOpen(!isSubCategoryOpen); setIsCategoryOpen(false); setIsBusinessTypeOpen(false); } }}
                          className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] hover:border-gray-300 transition-colors text-left disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F]"
                        >
                          <Layers size={16} className="text-gray-400 shrink-0" />
                          <span className={`flex-1 truncate ${storeSubCategory ? "text-gray-800" : "text-gray-400"}`}>{subCategoryLabel}</span>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ${isSubCategoryOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isSubCategoryOpen && availableSubcategories.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
                            {availableSubcategories.map((sub) => (
                              <button key={sub} type="button"
                                onClick={() => { setStoreSubCategory(sub); setIsSubCategoryOpen(false); setError(""); }}
                                className={`w-full text-left px-4 py-2.5 text-[12px] transition-colors ${storeSubCategory === sub ? "bg-[#F0FDF4] text-[#157A4F] font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                                {sub}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Business Type */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Business Type</label>
                      <div className="relative" ref={businessTypeDropdownRef}>
                        <button type="button"
                          onClick={() => { setIsBusinessTypeOpen(!isBusinessTypeOpen); setIsCategoryOpen(false); setIsSubCategoryOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] hover:border-gray-300 transition-colors text-left cursor-pointer focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F]"
                        >
                          <Briefcase size={16} className="text-gray-400 shrink-0" />
                          <span className={`flex-1 truncate ${businessType ? "text-gray-800" : "text-gray-400"}`}>{businessType || "e.g. Sole Proprietorship"}</span>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ${isBusinessTypeOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isBusinessTypeOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
                            {BUSINESS_TYPES.map((bt) => (
                              <button key={bt} type="button"
                                onClick={() => { setBusinessType(bt); setIsBusinessTypeOpen(false); setError(""); }}
                                className={`w-full text-left px-4 py-2.5 text-[12px] transition-colors ${businessType === bt ? "bg-[#F0FDF4] text-[#157A4F] font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                                {bt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Years in Business */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Years in Business</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="number" placeholder="e.g. 5" min="0" max="200"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                          value={yearsInBusiness} onChange={(e) => { setYearsInBusiness(e.target.value); setError(""); }} />
                      </div>
                    </div>
                  </div>

                  {/* Business Description */}
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Business Description</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                      <textarea placeholder="Tell us a bit about what you sell and your shop's mission..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400 resize-none"
                        rows="4" maxLength={500}
                        value={businessDescription} onChange={(e) => { setBusinessDescription(e.target.value); setError(""); }}></textarea>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 mt-1">{businessDescription.length} / 500 characters</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address Information */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#157A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <h2 className="text-[22px] font-extrabold text-gray-900">Store Address</h2>
                </div>
                <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
                  Pinpoint your store location on the map. This helps nearby customers discover your deals and promotions.
                </p>

                {error && <p className="text-red-500 text-[12px] mb-4 font-semibold">{error}</p>}

                <div className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Location</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Select store location from map" readOnly
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] text-gray-800 cursor-pointer shadow-sm"
                          value={storeLocation} onClick={() => setShowLocationPicker(true)} />
                      </div>
                      <button type="button" onClick={() => setShowLocationPicker(true)}
                        className="bg-[#157A4F] hover:bg-[#116340] text-white font-bold text-[12px] px-6 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-2">
                        <MapPin size={14} /> Open Map
                      </button>
                    </div>
                  </div>
                  
                  {/* Dummy Map Preview */}
                  {storeLocation && (
                    <div className="w-full h-48 bg-gray-100 rounded-2xl border border-gray-200 mt-4 overflow-hidden relative flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="flex flex-col items-center gap-2 z-10">
                        <div className="w-10 h-10 bg-[#157A4F] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <MapPin size={20} color="white" />
                        </div>
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold text-[#157A4F] shadow-sm">Location Selected</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 4: Documents (Submit) */}
            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-[22px] font-extrabold text-gray-900">Verify Your Business</h2>
                </div>
                <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
                  Choose the level of verification you want for your business. Higher tiers unlock premium features and increase your visibility on the GOLO marketplace.
                </p>

                {error && <p className="text-red-500 text-[12px] mb-4 font-semibold">{error}</p>}
                {success && <p className="text-[#157A4F] text-[12px] mb-4 font-semibold">{success}</p>}

                {/* Identity Verification */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-[#157A4F]" size={18} />
                    <h3 className="text-[15px] font-bold text-gray-900">Identity Verification</h3>
                  </div>
                  <p className="text-[12px] text-gray-500 mb-4">Upload your personal identification documents for verification.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">Aadhaar Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type="text" placeholder="0000 0000 0000" className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-[12px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 placeholder-gray-400"
                          value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} />
                        {aadhaarNumber.length >= 12 && <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#157A4F]" size={16} />}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">PAN Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type="text" placeholder="ABCDE1234F" className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-[12px] focus:outline-none focus:border-[#157A4F] focus:ring-1 focus:ring-[#157A4F] transition-all text-gray-800 uppercase placeholder-gray-400"
                          value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
                        {panNumber.length >= 10 && <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#157A4F]" size={16} />}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`border ${aadhaarDoc ? 'border-[#157A4F] bg-[#F0FDF4]' : 'border-dashed border-gray-300 bg-gray-50/50'} rounded-xl p-4 flex items-center justify-between transition-colors`}>
                      <div className="flex-1 overflow-hidden pr-3">
                        <p className="text-[11px] font-semibold text-gray-800 mb-0.5">Upload Aadhaar <span className="text-red-500">*</span></p>
                        <p className={`text-[10px] truncate ${aadhaarDoc ? 'text-[#157A4F] font-medium' : 'text-gray-400'}`}>{aadhaarDoc ? aadhaarDoc.name : 'PDF, JPG, PNG (Max 5MB)'}</p>
                      </div>
                      <label className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-[11px] font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm shrink-0">
                        {aadhaarDoc ? <RefreshCw size={12} /> : <Upload size={12} />}
                        {aadhaarDoc ? 'Re-upload' : 'Upload'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "aadhaar")} accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                    <div className={`border ${panDoc ? 'border-[#157A4F] bg-[#F0FDF4]' : 'border-dashed border-gray-300 bg-gray-50/50'} rounded-xl p-4 flex items-center justify-between transition-colors`}>
                      <div className="flex-1 overflow-hidden pr-3">
                        <p className="text-[11px] font-semibold text-gray-800 mb-0.5">Upload PAN Card <span className="text-red-500">*</span></p>
                        <p className={`text-[10px] truncate ${panDoc ? 'text-[#157A4F] font-medium' : 'text-gray-400'}`}>{panDoc ? panDoc.name : 'PDF, JPG, PNG (Max 5MB)'}</p>
                      </div>
                      <label className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-[11px] font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm shrink-0">
                        {panDoc ? <RefreshCw size={12} /> : <Upload size={12} />}
                        {panDoc ? 'Re-upload' : 'Upload'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "pan")} accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 my-6" />

                {/* Business Documents */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-[#157A4F]" size={18} />
                    <h3 className="text-[15px] font-bold text-gray-900">Business Documents</h3>
                  </div>
                  <p className="text-[12px] text-gray-500 mb-4">Upload business proof. At least one valid document is required.</p>

                  <div className="space-y-3 mb-5">
                    {[
                      { name: "Shop Photo", required: true },
                      { name: "GST Certificate", required: false },
                      { name: "Udyam Registration", required: false },
                      { name: "Trade License", required: false },
                      ...(storeCategory === "Food & Restaurants" ? [{ name: "FSSAI License", required: true }] : [])
                    ].map((doc, idx) => {
                      const uploadedFile = businessDocs[doc.name];
                      
                      if (uploadedFile) {
                        return (
                          <div key={idx} className="bg-[#157A4F] rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex-1">
                              <p className="text-[10px] text-white/80 font-bold mb-1 tracking-wider uppercase">Document Name</p>
                              <div className="flex items-center gap-2">
                                <FileText size={14} className="text-white" />
                                <p className="text-[13px] font-bold text-white">{doc.name} {doc.required && <span className="text-red-300">*</span>}</p>
                              </div>
                            </div>
                            <div className="text-center flex flex-col items-center flex-1">
                              <p className="text-[10px] text-white/80 font-bold mb-1 tracking-wider uppercase">Status</p>
                              <div className="flex items-center gap-2 justify-center max-w-full">
                                <span className="text-[11px] text-white font-medium truncate max-w-[120px]" title={uploadedFile.name}>{uploadedFile.name}</span>
                                <Eye size={12} className="text-white/80 cursor-pointer hover:text-white shrink-0" />
                                <Download size={12} className="text-white/80 cursor-pointer hover:text-white shrink-0" />
                              </div>
                              <p className="text-[9px] text-white/60 mt-0.5">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Just now</p>
                            </div>
                            <div className="flex-1 flex justify-end">
                              <label className="flex items-center gap-1.5 bg-white text-[#157A4F] px-4 py-2 rounded-full text-[11px] font-bold hover:bg-gray-50 cursor-pointer shadow-sm">
                                <RefreshCw size={12} /> Re-upload
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "business", doc.name)} accept=".pdf,.jpg,.jpeg,.png" />
                              </label>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={idx} className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors">
                          <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-bold mb-1 tracking-wider uppercase">Document Name</p>
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-[#157A4F]" />
                              <p className="text-[13px] font-bold text-gray-800">{doc.name} {doc.required && <span className="text-red-500">*</span>}</p>
                            </div>
                          </div>
                          <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-400 font-bold mb-1 tracking-wider uppercase">Status</p>
                            <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">Not Uploaded</span>
                          </div>
                          <div className="flex-1 flex justify-end">
                            <label className="flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-2 rounded-full text-[11px] font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
                              <Upload size={12} /> Upload
                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "business", doc.name)} accept=".pdf,.jpg,.jpeg,.png" />
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {storeCategory === "Food & Restaurants" && (
                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6">
                      <AlertCircle size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-gray-600 font-medium">Based on your "Food & Restaurants" business category, an FSSAI License is mandatory.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-800 mb-2">Upload Tips</h4>
                      <ul className="text-[11px] text-gray-500 space-y-1.5 list-disc pl-4 marker:text-gray-400">
                        <li>Supported Formats: PDF, JPG, JPEG, PNG</li>
                        <li>Upload original document (max 5 MB)</li>
                        <li>Entire document must be visible</li>
                        <li>No blurry or cropped images</li>
                        <li>Color scan preferred</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-gray-100">
                      <Lock size={16} className="text-gray-400 mb-2" />
                      <h4 className="text-[11px] font-bold text-gray-800 mb-1">Security Notice</h4>
                      <p className="text-[9px] text-gray-500 leading-relaxed">Your files are encrypted using AES-256 encryption and securely stored for merchant verification.</p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 my-6" />

                {/* Secure Data Processing & Terms */}
                <div className="bg-[#F0FDF4] border border-[#bbf7d0] rounded-xl p-5 mb-6 flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                    <Lock size={18} className="text-[#157A4F]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">Secure Data Processing</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Your documents are protected using AES-256 bank-grade encryption. Only the authorized GOLO Verification Team can access your private data.
                      <span className="text-[#157A4F] font-semibold cursor-pointer hover:underline ml-1">Learn more about our security practices.</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 pl-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 accent-[#157A4F] w-3.5 h-3.5 cursor-pointer" checked={certifyChecked} onChange={(e) => setCertifyChecked(e.target.checked)} />
                    <span className="text-[11px] text-gray-700 font-medium group-hover:text-gray-900 transition-colors">I certify that all information and documents provided are true and accurate to my knowledge.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 accent-[#157A4F] w-3.5 h-3.5 cursor-pointer" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} />
                    <span className="text-[11px] text-gray-700 font-medium group-hover:text-gray-900 transition-colors">I agree to the GOLO Merchant Terms of Service and Verification Policy. <span className="text-[#157A4F] font-bold hover:underline">Read Document</span></span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 accent-[#157A4F] w-3.5 h-3.5 cursor-pointer" checked={privacyChecked} onChange={(e) => setPrivacyChecked(e.target.checked)} />
                    <span className="text-[11px] text-gray-700 font-medium group-hover:text-gray-900 transition-colors">I agree to the Privacy Policy regarding the storage of my sensitive business data. <span className="text-[#157A4F] font-bold hover:underline">Read Document</span></span>
                  </label>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center pt-8">
                <div className="w-16 h-16 bg-[#e6f4ea] border-2 border-white shadow-[0_0_0_4px_rgba(21,122,79,0.1)] rounded-full flex items-center justify-center mb-6">
                  <Check size={32} className="text-[#157A4F]" strokeWidth={3} />
                </div>
                <h2 className="text-[24px] font-bold text-gray-900 mb-3 text-center">Registration Submitted Successfully</h2>
                <p className="text-[14px] text-gray-500 text-center max-w-[400px] leading-relaxed mb-8">
                  Thank you for choosing GOLO. Our compliance team has received your documents and is currently reviewing your application.
                </p>

                <div className="flex w-full gap-4 mb-8">
                  <div className="flex-1 bg-[#fcfcfc] border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e78b60] rounded-full shrink-0 shadow-sm"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-0.5">CURRENT STATUS</p>
                      <p className="text-[13px] font-bold text-gray-800">Pending Verification</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#f8fafc] border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e0e7ff] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Clock size={18} className="text-[#4f46e5]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-0.5">ESTIMATED APPROVAL</p>
                      <p className="text-[13px] font-bold text-gray-800">24-48 Hours</p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white border border-gray-100 rounded-[32px] py-8 px-10 mb-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                  <h3 className="text-[11px] text-gray-400 font-bold tracking-wider text-center mb-8">YOUR ONBOARDING ROADMAP</h3>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-[10%] right-[10%] h-[1px] border-t-2 border-dashed border-gray-200 -z-10"></div>
                    
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#bfdbfe] flex items-center justify-center border-[5px] border-white shadow-sm relative z-10">
                        <Search size={16} className="text-[#2563eb]" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">Review</span>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center relative z-10">
                        <ShieldCheck size={16} className="text-gray-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400">Verification</span>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center relative z-10">
                        <Store size={16} className="text-gray-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400">Approval</span>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center relative z-10">
                        <Grid size={16} className="text-gray-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400">Dashboard</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mb-10">
                  <h3 className="text-[12px] font-bold text-gray-700 mb-4 tracking-wide">WHAT HAPPENS NEXT?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <Mail size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-gray-800 mb-1 flex items-center justify-between">
                          Check your email
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed">We've sent a confirmation email with your application reference number #GOLO-88294-2026.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-gray-800 mb-1 flex items-center justify-between">
                          Document Verification
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed">Our verification team is cross-referencing your legal documents for platform security.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <Grid size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-gray-800 mb-1 flex items-center justify-between">
                          Access Dashboard
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed">Once approved, you'll get full access to set up your store profile and inventory.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/merchant-login" className="px-10 py-3.5 bg-[#157A4F] hover:bg-[#116340] text-white font-bold rounded-[32px] transition-colors text-[14px] flex items-center gap-2 shadow-sm w-full justify-center">
                  Go to Merchant Dashboard
                  <ArrowRight size={16} />
                </Link>
                <p className="text-[10px] text-gray-400 mt-4 text-center">Application ID: PH-88294-2026</p>
              </div>
            )}

            {currentStep < 5 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                {currentStep < 4 ? (
                  <div className="text-[13px] text-gray-500">
                    Already have an account?{" "}
                    <Link href="/merchant-login" className="text-[#157A4F] font-bold hover:underline">
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <div />
                )}
                
                <div className={`flex gap-3 ${currentStep === 4 ? 'w-full justify-between' : ''}`}>
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors text-[13px] cursor-pointer flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
                      Back
                    </button>
                  )}
                  
                  {currentStep < 4 ? (
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-[#157A4F] hover:bg-[#116340] text-white font-bold rounded-full transition-colors text-[13px] flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Checking..." : "Save & Continue"}
                      {!isLoading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={handleRegister}
                        disabled={isLoading || !certifyChecked || !termsChecked || !privacyChecked}
                        className="px-8 py-2.5 bg-[#157A4F] hover:bg-[#116340] text-white font-bold rounded-full transition-colors text-[13px] flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Uploading..." : "Submit Registration"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* ─── BOTTOM FOOTER ─── */}
      <footer className="w-full bg-white border-t border-gray-200 px-8 py-5 flex items-center justify-between shrink-0 z-10 text-[11px] text-gray-400">
        <div>
          © 2026 <strong className="text-gray-600">GOLO Merchant Registration</strong> . All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
