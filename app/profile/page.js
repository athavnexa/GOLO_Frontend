"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Star,
  Award,
  BadgeCheck,
  Ticket,
  Plus,
  Pencil,
  X,
  Trash2,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Camera,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useRoleProtection, LoadingScreen } from "../components/RoleBasedRedirect";
import { getProfile, getMyAds, updateProfile, getUserDealStatistics, getLoyaltyHistory, deleteUserAccount } from "../lib/api";
import { reverseGeocode } from "../services/leafletService";

function getRenderableImageSrc(src) {
  if (typeof src !== "string") {
    return "";
  }

  const value = src.trim();
  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/") ||
    value.startsWith("blob:") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return "";
}

export default function ProfilePage() {
  const { user, isAuthenticated, refreshProfile, logout } = useAuth();
  const router = useRouter();
  const { isLoading, isAuthorized } = useRoleProtection("user");
  const [profile, setProfile] = useState(null);
  const [activeAdsCount, setActiveAdsCount] = useState(0);
  const [dealsRedeemed, setDealsRedeemed] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [loyaltyHistory, setLoyaltyHistory] = useState([]);
  const [loadingLoyalty, setLoadingLoyalty] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    categories: ["Art & Culture", "Local Dining", "Sustainable Living"],
  });
  const [gpsLocation, setGpsLocation] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const avatarInputRef = useRef(null);

  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: Reason, 2: Warning, 3: Keyword confirmation, 4: Success
  const [deleteReason, setDeleteReason] = useState("");
  const [customDeleteReason, setCustomDeleteReason] = useState("");
  const [deleteKeyword, setDeleteKeyword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");

  const USER_DELETE_REASONS = [
    "I no longer use GOLO",
    "Privacy and data security concerns",
    "Too many emails or notifications",
    "Created another / duplicate account",
    "Found a better alternative",
    "Other",
  ];

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [profileRes, adsRes, dealStatsRes] = await Promise.all([
          getProfile(),
          getMyAds({ page: 1, limit: 1 }),
          getUserDealStatistics(),
        ]);

        if (profileRes.success) {
          setProfile(profileRes.data);
        }
        if (adsRes.success) {
          setActiveAdsCount(adsRes.pagination?.total || 0);
        }
        if (dealStatsRes) {
          setDealsRedeemed(dealStatsRes.dealsRedeemed || 0);
          setTotalSavings(dealStatsRes.totalSavings || 0);
        }
      } catch {
        setProfile(user);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) return;

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await reverseGeocode(position.coords.longitude, position.coords.latitude);
          if (result?.displayName) {
            const parts = result.displayName.split(",");
            setGpsLocation(parts.slice(0, 3).join(",").trim());
          }
        } catch {
          // ignore geocode failure
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    if (!showEditModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showEditModal]);

  if (isLoading || loading) {
    return isLoading ? <LoadingScreen /> : (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const displayUser = profile || user;
  const profileLocationText =
    displayUser?.profile?.city || displayUser?.profile?.state
      ? `${displayUser?.profile?.city || ""}${displayUser?.profile?.city && displayUser?.profile?.state ? ", " : ""}${displayUser?.profile?.state || ""}`
      : "";
  const locationText = gpsLocation || profileLocationText || (gpsLoading ? "Detecting location..." : "Location not set");

  const loyaltyPoints = displayUser?.loyaltyPoints ?? Math.max(12450, activeAdsCount * 140);
  const loyaltyTier = displayUser?.loyaltyTier || 'Bronze';

  const TIER_THRESHOLDS = [
    { tier: 'Bronze', min: 0 },
    { tier: 'Silver', min: 1000 },
    { tier: 'Gold', min: 5000 },
    { tier: 'Platinum', min: 20000 },
  ];

  const nextTierInfo = (() => {
    const current = TIER_THRESHOLDS.find(t => t.tier === loyaltyTier) || TIER_THRESHOLDS[0];
    const currentIndex = TIER_THRESHOLDS.indexOf(current);
    if (currentIndex < TIER_THRESHOLDS.length - 1) {
      const next = TIER_THRESHOLDS[currentIndex + 1];
      return { nextTier: next.tier, pointsGoal: next.min };
    }
    return { nextTier: null, pointsGoal: current.min };
  })();

  const pointsGoal = nextTierInfo.pointsGoal;
  const nextTierLabel = nextTierInfo.nextTier
    ? `Next Milestone: ${nextTierInfo.nextTier}`
    : `Maximum Tier Reached`;
  const progressPct = Math.min(100, Math.round((loyaltyPoints / pointsGoal) * 100));
  const neededPoints = Math.max(0, pointsGoal - loyaltyPoints);
  const profilePhotoSrc = getRenderableImageSrc(displayUser?.profilePhoto);
  const formattedPhone = displayUser?.profile?.phone || displayUser?.phone || "+91 9876543212";
  const interests = (displayUser?.preferredCategories && displayUser.preferredCategories.length > 0)
    ? displayUser.preferredCategories
    : (displayUser?.profile?.interests && displayUser.profile.interests.length > 0)
      ? displayUser.profile.interests
      : (displayUser?.interests && displayUser.interests.length > 0)
        ? displayUser.interests
        : [];
  const modalCategories = [
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

  const openEditModal = () => {
    const source = profile || user || {};
    const existingLocation =
      source?.profile?.city || source?.profile?.state
        ? `${source?.profile?.city || ""}${source?.profile?.city && source?.profile?.state ? ", " : ""}${source?.profile?.state || ""}`
        : "";

    setEditForm({
      name: source?.name || "",
      email: source?.email || "",
      phone: source?.profile?.phone || source?.phone || "+91 9876543212",
      location: existingLocation,
      categories: interests,
    });
    setEditError("");
    setEditSuccess("");
    setAvatarPreview("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (savingEdit) return;
    setShowEditModal(false);
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category) => {
    setEditForm((prev) => {
      const exists = prev.categories.includes(category);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((item) => item !== category) };
      }
      return { ...prev, categories: [...prev.categories, category] };
    });
  };

  const handleAvatarPick = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > 600 || height > 600) {
          const ratio = Math.min(600 / width, 600 / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedData = canvas.toDataURL("image/jpeg", 0.8);
        const compressedSize = Buffer.byteLength(compressedData, "utf8") / 1024 / 1024;

        if (compressedSize > 2) {
          setEditError(`Image too large even after compression. Current: ${compressedSize.toFixed(2)}MB, Max: 2MB`);
          return;
        }

        setAvatarPreview(compressedData);
        setEditError("");
      };
      img.onerror = () => {
        setEditError("Failed to load image file");
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setEditError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileFromModal = async () => {
    if (!editForm.name.trim()) {
      setEditError("Full name is required");
      return;
    }
    if (!editForm.email.trim()) {
      setEditError("Email is required");
      return;
    }
    if (!editForm.phone.trim()) {
      setEditError("Phone number is required");
      return;
    }


    setSavingEdit(true);
    setEditError("");

    try {
      const locationParts = String(editForm.location || "").split(",").map((item) => item.trim());
      const city = locationParts[0] || editForm.location;
      const state = locationParts[1] || "IN";

      const profileData = {
        name: editForm.name.trim(),
        preferredCategories: editForm.categories,
        profile: {
          phone: editForm.phone.trim(),
          city: city,
          state: state,
          interests: editForm.categories,
        },
      };

      if (editForm.email.trim() !== (displayUser?.email || "")) {
        profileData.email = editForm.email.trim();
      }

      if (avatarPreview && avatarPreview.startsWith("data:image")) {
        profileData.profilePhoto = avatarPreview;
      }

      const res = await updateProfile(profileData);

      if (!res?.success) {
        setEditError(res?.message || "Failed to update profile. Please try again.");
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        const refreshed = await getProfile();
        if (refreshed?.success && refreshed?.data) {
          setProfile(refreshed.data);
          setProfile(prev => ({ ...prev }));
        }
      } catch (refreshError) {
        console.warn("[Profile] Error refreshing profile:", refreshError);
      }

      try {
        if (typeof refreshProfile === "function") {
          await refreshProfile();
        }
      } catch (authError) {
        console.warn("[Profile] Error refreshing auth context:", authError);
      }

      setShowEditModal(false);
      setAvatarPreview("");
      setEditSuccess("Profile updated successfully!");
      setEditError("");
      setTimeout(() => setEditSuccess(""), 3000);
    } catch (error) {
      console.error("[Profile] Save error:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to update profile";
      setEditError(errorMessage);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleOpenLoyaltyModal = async () => {
    setShowLoyaltyModal(true);
    setLoadingLoyalty(true);
    try {
      const res = await getLoyaltyHistory();
      if (res.success) {
        setLoyaltyHistory(res.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch loyalty history", e);
    } finally {
      setLoadingLoyalty(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative z-10 min-h-screen bg-transparent pt-10 md:pt-14">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col gap-6">
            {editSuccess && (
              <div className="rounded-[12px] border border-[#86efac] bg-[#dcfce7] px-4 py-3 text-[#166534] font-semibold text-sm">
                {editSuccess}
              </div>
            )}

            <div className="rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div
                    onClick={openEditModal}
                    className="relative group cursor-pointer shrink-0"
                    title="Click to change profile picture"
                  >
                    {profilePhotoSrc ? (
                      <img
                        src={profilePhotoSrc}
                        alt={displayUser?.name || "Profile"}
                        className="h-[84px] w-[84px] shrink-0 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-gray-100 group-hover:ring-[#157a4f] transition-all"
                      />
                    ) : (
                      <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-4xl font-medium text-white shadow-sm overflow-hidden border border-gray-200 group-hover:ring-2 group-hover:ring-[#157a4f] transition-all">
                        <img src="/images/default-user-avatar.jpg" alt="Default Avatar" className="w-full h-full object-cover" />
                        <span className="absolute right-1 bottom-1 w-5 h-5 rounded-full bg-[#157a4f] border-2 border-white flex items-center justify-center text-[10px] text-white">
                          <User size={10} />
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5">
                      <Camera size={18} />
                      <span>Edit</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-[34px] leading-none font-semibold text-[#1f1f1f]">{displayUser?.name || "Kaustubh Khamkar"}</h1>
                    <div className="mt-2 space-y-1 text-[13px] text-[#6f6f6f]">
                      <p className="flex items-center gap-2"><Mail size={13} className="text-[#157a4f]" /> {displayUser?.email || "kutubkamkar@gmail.com"}</p>
                      <p className="flex items-center gap-2"><MapPin size={13} className="text-[#157a4f]" /> {locationText}</p>
                    </div>
                    <p className="text-xs text-[#8d8d8d] mt-2 max-w-[520px]">
                      Keep your profile updated for better recommendations. Your local journey started in June 2023.
                    </p>
                  </div>
                </div>
                <button
                  onClick={openEditModal}
                  className="self-start rounded-lg bg-[#157a4f] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#10613f] transition"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-5 pt-5 border-t border-[#efefef]">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  <div 
                    onClick={handleOpenLoyaltyModal}
                    className="rounded-[10px] border border-[#d8d8d8] bg-[#f8f8f8] px-5 py-5 min-h-[90px] shadow-[0_1px_0_rgba(0,0,0,0.03)] cursor-pointer hover:bg-white hover:border-[#157a4f] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#157a4f] text-white shrink-0">
                        <Star size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777]">Total Points</p>
                        <p className="text-[20px] leading-none font-semibold text-[#1b1b1b] mt-1">{loyaltyPoints?.toLocaleString() ?? 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[10px] border border-[#b6e7d0] bg-[#c9f1df] px-5 py-5 min-h-[90px] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#157a4f] text-white shrink-0">
                        <Award size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#157a4f]">Current Tier</p>
                        <p className="text-[20px] leading-none font-semibold text-[#1b1b1b] mt-1">{loyaltyTier} Local</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[10px] border border-[#d8d8d8] bg-[#f8f8f8] px-5 py-5 min-h-[90px] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#157a4f] text-white shrink-0">
                        <Ticket size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777]">Deals Redeemed</p>
                        <p className="text-[20px] leading-none font-semibold text-[#1b1b1b] mt-1">{dealsRedeemed || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[10px] border border-[#d8d8d8] bg-[#f8f8f8] px-5 py-5 min-h-[90px] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4b128] text-white shrink-0">
                        <BadgeCheck size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777]">Active Ads</p>
                        <p className="text-[20px] leading-none font-semibold text-[#1b1b1b] mt-1">{activeAdsCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="inline-block text-[11px] rounded-full bg-[#f2bf42] text-[#2d2d2d] px-3 py-1 font-semibold">{nextTierLabel}</span>
                  <h2 className="text-[31px] leading-tight font-semibold text-[#1f1f1f] mt-2">Progress to Elite Tier</h2>
                  <p className="text-[13px] text-[#666] mt-1">Reach {pointsGoal.toLocaleString()} points to unlock exclusive 24h early access to flash deals.</p>
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-[#3f3f3f]">{loyaltyPoints.toLocaleString()} / {pointsGoal.toLocaleString()} Points</div>
              <div className="w-full h-2.5 rounded-full bg-[#f2e5c6] mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-[#157a4f]" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-[#7b7b7b]">Platinum Status</span>
                <span className="text-[#157a4f] font-semibold">{neededPoints.toLocaleString()} points needed to level up</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
                <h3 className="text-[22px] font-semibold text-[#232323] flex items-center gap-2">
                  <BadgeCheck size={18} className="text-[#157a4f]" />
                  Your Interests
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-[#157a4f] text-white text-xs font-semibold px-3 py-1.5">
                      {interest}
                    </span>
                  ))}
                  <button 
                    onClick={openEditModal}
                    className="rounded-full bg-[#f0e7cf] text-[#574f3e] text-xs font-semibold px-3 py-1.5 inline-flex items-center gap-1"
                  >
                    <Plus size={12} />
                    Add Category
                  </button>
                </div>
                <div className="mt-10 border-t border-[#efefef] pt-3 text-xs text-[#8f8f8f] text-center">
                  Your chosen interests allow us to personalize your experience with nearby services and offers.
                </div>

                {/* Account Management: Delete Account */}
                <div className="mt-6 border-t border-[#f0f0f0] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f9fafb] p-3.5 rounded-xl border border-[#e5e7eb] hover:border-[#d1d5db] transition">
                  <div>
                    <p className="text-[13px] font-bold text-[#1f2937] flex items-center gap-1.5">
                      <User size={14} className="text-[#6b7280]" /> Account Settings
                    </p>
                    <p className="text-[11px] text-[#6b7280] mt-0.5">
                      Permanently remove your personal profile and account data
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDeleteStep(1);
                      setDeleteReason("");
                      setCustomDeleteReason("");
                      setDeleteKeyword("");
                      setDeleteError("");
                      setDeleteSuccessMsg("");
                      setShowDeleteModal(true);
                    }}
                    className="h-9 px-4 rounded-lg border border-[#fca5a5] bg-white text-[#dc2626] text-xs font-semibold hover:bg-[#fef2f2] hover:border-[#f87171] transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm self-start sm:self-auto"
                  >
                    <Trash2 size={13} className="text-[#dc2626]" />
                    Delete Account
                  </button>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
                <h3 className="text-[22px] font-semibold text-[#232323] flex items-center gap-2">
                  <User size={18} className="text-[#157a4f]" />
                  Account Details
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="pb-3 border-b border-[#efefef]">
                    <p className="text-[10px] tracking-[0.08em] uppercase text-[#a0a0a0]">Full Name</p>
                    <p className="mt-1 text-[15px] text-[#202020]">{displayUser?.name || "Ram Patil"}</p>
                  </div>
                  <div className="pb-3 border-b border-[#efefef]">
                    <p className="text-[10px] tracking-[0.08em] uppercase text-[#a0a0a0]">Email Address</p>
                    <p className="mt-1 text-[15px] text-[#202020]">{displayUser?.email || "rampatil1200@gmail.com"}</p>
                  </div>
                  <div className="pb-3 border-b border-[#efefef]">
                    <p className="text-[10px] tracking-[0.08em] uppercase text-[#a0a0a0]">Phone Number</p>
                    <p className="mt-1 text-[15px] text-[#202020] flex items-center gap-2"><Phone size={14} className="text-[#7a7a7a]" /> {formattedPhone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.08em] uppercase text-[#a0a0a0]">Primary Location</p>
                    <p className="mt-1 text-[15px] text-[#202020]">{locationText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-[10020] bg-black/55 flex items-center justify-center p-4">
          <div className="w-full max-w-[640px] max-h-[88vh] rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#dfe5e2] flex flex-col">
            <div className="bg-[#e9f4ef] px-5 py-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-[#157a4f] text-white flex items-center justify-center shadow-sm">
                  <Pencil size={16} />
                </span>
                <div>
                  <h2 className="text-[22px] leading-none font-semibold text-[#157a4f]">Edit Your Profile</h2>
                  <p className="text-[#74a590] text-[13px] leading-tight mt-1.5">Update your details and preferences to stay connected local.</p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="text-[#157a4f] hover:opacity-80 transition"
                aria-label="Close edit profile modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 py-5 border-t border-[#edf1ef] overflow-y-auto">
              <div className="flex items-center gap-4 pb-5 border-b border-[#ececec]">
                <div className="w-16 h-16 rounded-full bg-[#edb744] text-white flex items-center justify-center text-3xl font-medium overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : profilePhotoSrc ? (
                    <img src={profilePhotoSrc} alt="Current profile" className="w-full h-full object-cover" />
                  ) : (
                    editForm.name?.charAt(0)?.toUpperCase() || "A"
                  )}
                </div>
                <div>
                  <p className="text-[22px] font-semibold text-[#2c2c2c]">Profile Picture</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="border border-[#d8ddd9] bg-[#f5f8f6] hover:bg-[#edf3ef] text-[#157a4f] text-[15px] font-semibold rounded-xl px-3 py-1.5"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={() => setAvatarPreview("")}
                      className="text-[15px] text-[#ef6f6f] font-semibold"
                    >
                      Remove
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarPick}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="block text-xs font-bold tracking-wide text-[#4c4c4c] uppercase mb-2">Full Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => handleEditFieldChange("name", e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#e5e5e5] bg-[#f8f8f8] px-4 text-[15px] text-[#2d2d2d] outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-[#4c4c4c] uppercase mb-2">Email Address</label>
                  <input
                    value={editForm.email}
                    onChange={(e) => handleEditFieldChange("email", e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#e5e5e5] bg-[#f8f8f8] px-4 text-[15px] text-[#2d2d2d] outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-[#4c4c4c] uppercase mb-2">Phone Number</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => handleEditFieldChange("phone", e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#e5e5e5] bg-[#f8f8f8] px-4 text-[15px] text-[#2d2d2d] outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-[#4c4c4c] uppercase mb-2">Primary Location</label>
                  <input
                    value={editForm.location}
                    onChange={(e) => handleEditFieldChange("location", e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#e5e5e5] bg-[#f8f8f8] px-4 text-[15px] text-[#2d2d2d] outline-none focus:border-[#157a4f]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold tracking-wide text-[#4c4c4c] uppercase">Category Preferences</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {modalCategories.map((category) => {
                    const selected = editForm.categories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          selected
                            ? "border-[#6ebc9f] bg-[#e8f7ef] text-[#1a8a60]"
                            : "border-[#d7ddd9] bg-white text-[#7a7a7a]"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {editError && (
                <div className="mt-4 p-3 rounded-lg bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] text-sm font-semibold">
                  {editError}
                </div>
              )}

              {editSuccess && (
                <div className="mt-4 p-3 rounded-lg bg-[#dcfce7] border border-[#86efac] text-[#166534] text-sm font-semibold">
                  {editSuccess}
                </div>
              )}
            </div>

            <div className="border-t border-[#ececec] px-6 py-4 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={closeEditModal}
                className="h-11 min-w-[108px] rounded-xl border border-[#e2e2e2] text-[#3f3f3f] text-[15px] font-semibold bg-[#f8f8f8]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfileFromModal}
                disabled={savingEdit}
                className="h-11 min-w-[170px] rounded-xl bg-[#157a4f] text-white text-[15px] font-semibold shadow-md hover:bg-[#10613f] transition disabled:opacity-70"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoyaltyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="text-[#157a4f]" size={20} /> Loyalty Points History
              </h3>
              <button
                onClick={() => setShowLoyaltyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              {loadingLoyalty ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#157a4f] border-t-transparent" />
                </div>
              ) : loyaltyHistory.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm min-w-[500px]">
                      <thead className="bg-gray-50 text-gray-500 font-semibold text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 border-b border-gray-100 w-1/4">Date</th>
                          <th className="px-4 py-3 border-b border-gray-100 w-1/4">Store</th>
                          <th className="px-4 py-3 border-b border-gray-100 w-1/3">Offer</th>
                          <th className="px-4 py-3 border-b border-gray-100 w-1/6 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {loyaltyHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition">
                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900 break-words">
                              {item.storeName}
                            </td>
                            <td className="px-4 py-3 text-gray-600 break-words">
                              {item.offerName}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 font-bold text-[#157a4f] bg-[#e8f5e9] px-2 py-1 rounded-md text-xs">
                                <Plus size={12} /> {item.points}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="text-gray-300" size={28} />
                  </div>
                  <p className="text-gray-500 font-medium">No loyalty points earned yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Claim and redeem offers to start earning!</p>
                </div>
              )}
            </div>
            
            <div className="pt-4 mt-auto border-t border-gray-100">
              <button
                onClick={() => setShowLoyaltyModal(false)}
                className="w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[10030] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#fecaca] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#fff1f2] border-b border-[#ffe4e6] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#fecdd3] text-[#e11d48] flex items-center justify-center shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#881337]">Delete Your Account</h3>
                  <p className="text-[11px] text-[#9f1239]">
                    {deleteStep === 1 && "Step 1 of 3: Reason for leaving"}
                    {deleteStep === 2 && "Step 2 of 3: Permanent deletion warning"}
                    {deleteStep === 3 && "Step 3 of 3: Confirmation keyword"}
                    {deleteStep === 4 && "Account Deletion Complete"}
                  </p>
                </div>
              </div>
              {deleteStep !== 4 && (
                <button
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="h-8 w-8 rounded-full bg-white/80 text-[#9f1239] flex items-center justify-center hover:bg-white transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* STEP 1: SELECT REASON */}
              {deleteStep === 1 && (
                <div>
                  <p className="text-[14px] font-semibold text-[#1f2937] mb-1">
                    We're sorry to see you go!
                  </p>
                  <p className="text-[12px] text-[#6b7280] mb-4">
                    Please let us know why you are deleting your account to help us improve:
                  </p>

                  <div className="space-y-2 mb-4 max-h-[260px] overflow-y-auto pr-1">
                    {USER_DELETE_REASONS.map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition text-[13px] ${
                          deleteReason === r
                            ? "border-[#e11d48] bg-[#fff1f2] font-semibold text-[#9f1239]"
                            : "border-[#e5e7eb] bg-[#f9fafb] text-[#374151] hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="userDeleteReason"
                          checked={deleteReason === r}
                          onChange={() => setDeleteReason(r)}
                          className="h-4 w-4 text-[#e11d48] focus:ring-[#e11d48] accent-[#e11d48]"
                        />
                        <span>{r}</span>
                      </label>
                    ))}
                  </div>

                  {deleteReason === "Other" && (
                    <div className="mb-4">
                      <textarea
                        value={customDeleteReason}
                        onChange={(e) => setCustomDeleteReason(e.target.value)}
                        placeholder="Please tell us more details..."
                        rows={3}
                        className="w-full rounded-xl border border-[#d1d5db] p-3 text-[13px] text-[#1f2937] outline-none focus:border-[#e11d48] resize-none"
                      />
                    </div>
                  )}

                  {deleteError && (
                    <p className="text-[12px] font-semibold text-[#dc2626] mb-3 flex items-center gap-1.5">
                      <AlertCircle size={14} /> {deleteError}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="h-10 px-4 rounded-xl border border-[#d1d5db] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!deleteReason || (deleteReason === "Other" && !customDeleteReason.trim())}
                      onClick={() => {
                        setDeleteError("");
                        setDeleteStep(2);
                      }}
                      className="h-10 px-5 rounded-xl bg-[#e11d48] text-white text-sm font-semibold hover:bg-[#be123c] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: WARNING & DATA IMPACT */}
              {deleteStep === 2 && (
                <div>
                  <div className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert size={20} className="text-[#dc2626] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[14px] font-bold text-[#991b1b]">
                          Permanent Deletion Warning
                        </h4>
                        <p className="text-[12px] text-[#b91c1c] mt-1 leading-relaxed">
                          This action is irreversible. Once confirmed, all your data will be permanently wiped from GOLO databases:
                        </p>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1.5 text-[12px] text-[#7f1d1d] pl-7 list-disc">
                      <li>Your user profile, name, phone, and email records</li>
                      <li>All claimed vouchers and active deal redemptions</li>
                      <li>All accumulated loyalty points and tier milestones</li>
                      <li>Your saved favorites, wishlist items, and preferences</li>
                    </ul>
                  </div>

                  <p className="text-[13px] font-semibold text-[#374151] mb-4">
                    Are you sure you want to proceed with permanently deleting your account?
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setDeleteStep(1)}
                      className="h-10 px-4 rounded-xl border border-[#d1d5db] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteStep(3)}
                      className="h-10 px-5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] transition shadow-sm"
                    >
                      I Understand, Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: TYPE DELETE KEYWORD */}
              {deleteStep === 3 && (
                <div>
                  <p className="text-[13px] text-[#374151] mb-2 leading-relaxed">
                    To prevent accidental deletion, please type <span className="font-bold text-[#dc2626] bg-[#fee2e2] px-1.5 py-0.5 rounded font-mono">DELETE</span> in the confirmation field below:
                  </p>

                  <div className="my-4">
                    <input
                      type="text"
                      value={deleteKeyword}
                      onChange={(e) => {
                        setDeleteKeyword(e.target.value);
                        setDeleteError("");
                      }}
                      placeholder="Type DELETE to confirm"
                      className="w-full h-11 px-4 rounded-xl border-2 border-[#d1d5db] font-mono text-[15px] font-bold text-[#111827] outline-none focus:border-[#dc2626] transition tracking-wider uppercase"
                    />
                  </div>

                  {deleteError && (
                    <div className="mb-4 p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[12px] font-semibold text-[#b91c1c] flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{deleteError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setDeleteStep(2)}
                      className="h-10 px-4 rounded-xl border border-[#d1d5db] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      disabled={deleteKeyword !== "DELETE" || isDeleting}
                      onClick={async () => {
                        if (deleteKeyword !== "DELETE") {
                          setDeleteError("Please type DELETE exactly to confirm.");
                          return;
                        }

                        setIsDeleting(true);
                        setDeleteError("");

                        try {
                          const res = await deleteUserAccount({
                            reason: deleteReason,
                            customReason: customDeleteReason,
                            confirmation: "DELETE",
                          });

                          if (res?.success || res) {
                            setDeleteSuccessMsg(res?.message || "Your account has been permanently deleted.");
                            setDeleteStep(4);
                            setTimeout(async () => {
                              await logout();
                              router.push("/login");
                            }, 3000);
                          } else {
                            setDeleteError(res?.message || "Failed to delete account. Please try again.");
                          }
                        } catch (err) {
                          console.error("Account deletion failed:", err);
                          setDeleteError(err?.response?.data?.message || err?.message || "Failed to delete account. Please try again.");
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      className="h-10 px-5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Deleting Account...</span>
                        </>
                      ) : (
                        <span>Confirm Delete</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: COMPLETION */}
              {deleteStep === 4 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-[20px] font-bold text-[#1f2937] mb-2">
                    Account Deleted Successfully
                  </h4>
                  <p className="text-[13px] text-[#4b5563] max-w-sm mx-auto mb-6">
                    {deleteSuccessMsg || "Your account and all associated data have been permanently removed."}
                  </p>
                  <p className="text-[12px] text-[#9ca3af]">
                    Redirecting to homepage...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
