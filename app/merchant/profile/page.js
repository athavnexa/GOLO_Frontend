"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Camera,
  Edit3,
  User,
  Bell,
  Lock,
  Mail,
  Phone,
  CalendarDays,
  Store,
  MapPin,
  Trash2,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import MerchantPlanBanner from "../MerchantPlanBanner";
import { useRoleProtection, LoadingScreen } from "../../components/RoleBasedRedirect";
import LocationPicker from "../../components/LocationPicker";
import StoreLocationMap from "../../components/StoreLocationMap";
import {
  updateMerchantStoreLocation,
  getMerchantStoreLocation,
  getMerchantProfile,
  updateProfile,
  updateMerchantProfile,
  changePassword,
  getMerchantLoyaltyLeaderboard,
  deleteMerchantAccount,
} from "../../lib/api";

const MERCHANT_CATEGORIES = [
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

export default function MerchantProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <MerchantProfilePageContent />
    </Suspense>
  );
}

function MerchantProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, logout } = useAuth();
  const { isLoading: roleLoading, isAuthorized } = useRoleProtection("merchant");
  const requestedTab = searchParams.get("tab");
  const initialTab =
    requestedTab === "settings"
      ? "Settings"
      : requestedTab === "loyalty"
      ? "Loyalty Rewards"
      : "Profile Settings";

  if (roleLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return null;
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  if (user.accountType !== "merchant") {
    return null;
  }

  return (
    <MerchantProfileContent
      user={user}
      logout={logout}
      router={router}
      initialTab={initialTab}
    />
  );
}

function MerchantProfileContent({ user, logout, router, initialTab = "Profile Settings" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    shopName: "",
    storeCategory: "",
    storeSubCategory: "",
    location: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialMerchantPhoto, setInitialMerchantPhoto] = useState("");
  const [initialShopPhoto, setInitialShopPhoto] = useState("");
  const [merchantPhoto, setMerchantPhoto] = useState("");
  const [shopPhoto, setShopPhoto] = useState("");
  const [merchantPhotoFile, setMerchantPhotoFile] = useState(null);
  const [shopPhotoFile, setShopPhotoFile] = useState(null);
  const [storeLocation, setStoreLocation] = useState({
    address: "",
    latitude: 0,
    longitude: 0,
  });
  const [loyaltyRows, setLoyaltyRows] = useState([]);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [loyaltyPage, setLoyaltyPage] = useState(1);
  const LOYALTY_PAGE_SIZE = 15;

  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: Initial Warning, 2: Select Reason, 3: Impact Confirmation, 4: Enter Keyword, 5: Success
  const [deleteReason, setDeleteReason] = useState("");
  const [customDeleteReason, setCustomDeleteReason] = useState("");
  const [deleteKeyword, setDeleteKeyword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");

  const MERCHANT_DELETE_REASONS = [
    "Closing my business / store permanently",
    "Not receiving enough customers or sales from the platform",
    "Platform fees or business costs are too high",
    "Switching to another platform or marketing channel",
    "Too difficult or time-consuming to manage store & offers",
    "Temporary hiatus / taking a break",
    "Other",
  ];

  const merchantDisplayName = formData.username || user?.name || "Merchant";
  const merchantEmail = formData.email || user?.email || "No email available";
  const merchantPhone = formData.phone || user?.profile?.phone || "No phone number";
  const memberSinceLabel = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";
  const shopDisplayName = formData.shopName || "Your Shop";
  const merchantPhotoSrc = getRenderableImageSrc(merchantPhoto);
  const shopPhotoSrc = getRenderableImageSrc(shopPhoto);

  const loadLoyaltyLeaderboard = () => {
    setLoyaltyLoading(true);
    getMerchantLoyaltyLeaderboard()
      .then((res) => {
        const payload = Array.isArray(res) ? res : res?.data;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.rows)
          ? payload.rows
          : [];

        const normalizedRows = rows.map((row) => ({
          ...row,
          totalPoints: Number(row?.totalPoints ?? row?.points ?? row?.rewardPoints ?? 0),
          offersClaimed: Number(row?.offersClaimed ?? row?.claimedOffers ?? row?.claims ?? 0),
        }));

        setLoyaltyRows(normalizedRows);
      })
      .catch(() => {
        setLoyaltyRows([]);
      })
      .finally(() => setLoyaltyLoading(false));
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab !== "Loyalty Rewards") return;

    loadLoyaltyLeaderboard();
    const interval = setInterval(loadLoyaltyLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    const loadMerchantData = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await getMerchantProfile();
        const merchantData = profileResponse?.data;

        if (merchantData) {
          setMerchantProfile(merchantData);
          const nextFormData = {
            username: user?.name || "",
            phone: user?.profile?.phone || "",
            email: user?.email || "",
            shopName: merchantData.storeName || "",
            storeCategory:
              merchantData.storeCategory ||
              user?.merchantProfile?.storeCategory ||
              user?.storeCategory ||
              "",
            storeSubCategory:
              merchantData.storeSubCategory ||
              user?.merchantProfile?.storeSubCategory ||
              user?.storeSubCategory ||
              "",
            location: merchantData.storeLocation || "",
          };
          setFormData(nextFormData);
          setInitialFormData(nextFormData);

          if (merchantData.profilePhoto) {
            const safeMerchantPhoto = getRenderableImageSrc(merchantData.profilePhoto);
            setMerchantPhoto(safeMerchantPhoto);
            setInitialMerchantPhoto(safeMerchantPhoto);
          }
          if (merchantData.shopPhoto) {
            const safeShopPhoto = getRenderableImageSrc(merchantData.shopPhoto);
            setShopPhoto(safeShopPhoto);
            setInitialShopPhoto(safeShopPhoto);
          }
        }
      } catch (error) {
        console.error("Error loading merchant profile:", error);
        setSaveMessage("Error loading profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadMerchantData();
  }, [user]);

  useEffect(() => {
    const loadStoreLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const response = await getMerchantStoreLocation();
        if (response?.data) {
          const { address, latitude, longitude } = response.data;
          setStoreLocation({
            address: address || "",
            latitude: latitude || 0,
            longitude: longitude || 0,
          });
        }
      } catch (error) {
        console.error("Error loading store location:", error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    loadStoreLocation();
  }, []);

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/merchant-login");
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await handleMerchantLogout();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file, isShopPhoto = false) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveMessage("Please upload a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target.result;
      if (isShopPhoto) {
        setShopPhoto(previewUrl);
        setShopPhotoFile(file);
      } else {
        setMerchantPhoto(previewUrl);
        setMerchantPhotoFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoClick = (isShopPhoto = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handlePhotoChange(e.target.files[0], isShopPhoto);
    input.click();
  };

  const handleDiscard = () => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
    setMerchantPhoto(initialMerchantPhoto);
    setShopPhoto(initialShopPhoto);
    setMerchantPhotoFile(null);
    setShopPhotoFile(null);
    setIsEditMode(false);
    setSaveMessage("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.username,
        email: formData.email,
        profile: {
          phone: formData.phone,
        },
      });

      const merchantData = {
        storeName: formData.shopName,
        storeCategory: formData.storeCategory,
        storeLocation: formData.location,
      };

      if (merchantPhotoFile) {
        const reader = new FileReader();
        const merchantPhotoBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(merchantPhotoFile);
        });
        merchantData.profilePhoto = merchantPhotoBase64;
      }

      if (shopPhotoFile) {
        const reader = new FileReader();
        const shopPhotoBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(shopPhotoFile);
        });
        merchantData.shopPhoto = shopPhotoBase64;
      }

      await updateMerchantProfile(merchantData);
      setSaveMessage("Profile updated successfully!");

      if (storeLocation && storeLocation.latitude && storeLocation.longitude) {
        await updateMerchantStoreLocation({
          address: storeLocation.address,
          latitude: storeLocation.latitude,
          longitude: storeLocation.longitude,
        });
      }

      setMerchantPhotoFile(null);
      setShopPhotoFile(null);
      setInitialFormData(formData);
      setInitialMerchantPhoto(merchantPhoto);
      setInitialShopPhoto(shopPhoto);
      setTimeout(() => setSaveMessage(""), 3000);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage(error?.data?.message || "Failed to save profile. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocationSelect = (location) => {
    const address =
      location.address ||
      `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;

    setStoreLocation({
      address,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setFormData((prev) => ({ ...prev, location: address }));
    setShowLocationPicker(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setSettingsMessage("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setSettingsMessage("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSettingsMessage("Passwords do not match.");
      return;
    }

    try {
      setSettingsLoading(true);
      setSettingsMessage("");
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSettingsMessage("Password changed successfully.");
    } catch (error) {
      setSettingsMessage(
        error?.data?.message || error?.message || "Failed to change password."
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]">
        <MerchantNavbar activeKey="profile" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="profile" />

      <main className="w-full px-8 py-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          {merchantProfile && <MerchantPlanBanner merchantProfile={merchantProfile} />}

          {activeTab === "Loyalty Rewards" ? (
            <div className="mx-auto max-w-[1260px] space-y-5">
              <div className="flex gap-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="flex h-[62px] flex-1 min-w-0 flex-col justify-center rounded-[8px] border border-[#b8bdc6] bg-white px-2 sm:h-[56px] sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <p className="text-[9px] font-semibold text-[#1f9b57] sm:text-[13px]">Total Customers</p>
                  <p className="text-[22px] font-semibold leading-none text-[#1f1f1f] sm:text-[30px]">{loyaltyRows.length}</p>
                </div>
                <div className="flex h-[62px] flex-1 min-w-0 flex-col justify-center rounded-[8px] border border-[#b8bdc6] bg-white px-2 sm:h-[56px] sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <p className="text-[9px] font-semibold text-[#f1a61b] sm:text-[13px]">Reward Champs</p>
                  <p className="text-[22px] font-semibold leading-none text-[#1f1f1f] sm:text-[30px]">{loyaltyRows.slice(0, 3).length}</p>
                </div>
                <div className="flex h-[62px] flex-1 min-w-0 flex-col justify-center rounded-[8px] border border-[#b8bdc6] bg-white px-2 sm:h-[56px] sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <p className="text-[9px] font-semibold text-[#323232] sm:text-[13px]">Reward Points</p>
                  <p className="text-[22px] font-semibold leading-none text-[#1f1f1f] sm:text-[30px]">
                    {loyaltyRows.reduce((acc, row) => acc + (row.totalPoints || 0), 0)}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[8px] border border-[#bfc3cb] bg-white">
                <div className="px-6 py-4 text-[28px] font-semibold leading-none text-[#202020]">
                  Loyalty Rewards
                </div>
                <div className="grid grid-cols-3 border-b border-[#bfc3cb] px-6 py-3 text-[13px] font-medium text-[#2c2c2c]">
                  <p>Active Customers</p>
                  <p className="text-center">Number of Offers Claimed</p>
                  <p className="text-right">Loyalty Rewards</p>
                </div>
                {loyaltyLoading ? (
                  <div className="py-6 text-center text-[#888]">Loading leaderboard...</div>
                ) : loyaltyRows.length === 0 ? (
                  <div className="py-6 text-center text-[#888]">No loyalty data yet.</div>
                ) : (
                  <>
                    {loyaltyRows
                      .slice((loyaltyPage - 1) * LOYALTY_PAGE_SIZE, loyaltyPage * LOYALTY_PAGE_SIZE)
                      .map((row, index) => {
                        const globalIndex = (loyaltyPage - 1) * LOYALTY_PAGE_SIZE + index;
                        return (
                          <div
                            key={row.email || globalIndex}
                            className="grid grid-cols-3 border-b border-[#bfc3cb] px-6 py-3 text-[13px] text-[#2f2f2f] last:border-b-0"
                          >
                            <p className="pl-6">
                              <span className="mr-2 font-bold">{globalIndex + 1}.</span>
                              {row.name || row.email || "Customer"}
                            </p>
                            <p className="text-center">{row.offersClaimed ?? "-"}</p>
                            <p className="pr-6 text-right">
                              {globalIndex < 3 ? <span className="text-[#e5ad1d]">★</span> : null}
                              {globalIndex < 3 ? " / " : ""}
                              {row.totalPoints}
                            </p>
                          </div>
                        );
                      })}

                    <div className="flex items-center justify-end gap-3 border-t border-[#bfc3cb] bg-[#f9f9f9] px-6 py-4">
                      <button
                        className="rounded bg-[#ececec] px-4 py-2 text-[13px] font-semibold text-[#222] disabled:opacity-60"
                        onClick={() => setLoyaltyPage((p) => Math.max(1, p - 1))}
                        disabled={loyaltyPage === 1}
                      >
                        Previous
                      </button>
                      <span className="text-[13px] font-semibold text-[#666]">
                        Page {loyaltyPage} of {Math.max(1, Math.ceil(loyaltyRows.length / LOYALTY_PAGE_SIZE))}
                      </span>
                      <button
                        className="rounded bg-[#ececec] px-4 py-2 text-[13px] font-semibold text-[#222] disabled:opacity-60"
                        onClick={() =>
                          setLoyaltyPage((p) =>
                            Math.min(Math.ceil(loyaltyRows.length / LOYALTY_PAGE_SIZE), p + 1)
                          )
                        }
                        disabled={loyaltyPage >= Math.ceil(loyaltyRows.length / LOYALTY_PAGE_SIZE)}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : activeTab === "Settings" ? (
            <div className="mx-auto max-w-[1260px] space-y-5">
              <div className="rounded-[8px] border border-[#d5d5d5] bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Bell size={18} style={{ color: "#157a4f" }} />
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">Notifications</h2>
                </div>
                <div className="flex items-center justify-between rounded-[6px] bg-[#f9f9f9] p-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[#1f1f1f]">Order Alerts</p>
                    <p className="mt-0.5 text-[11px] text-[#999]">
                      Get notified when a customer claims your offer
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={orderNotifications}
                      onChange={(e) => setOrderNotifications(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-[#d5d5d5] peer-checked:bg-[#157a4f] peer-checked:after:translate-x-full after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-[#d5d5d5] after:bg-white after:transition-all after:content-['']" />
                  </label>
                </div>
              </div>

              <div className="rounded-[8px] border border-[#d5d5d5] bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Lock size={18} style={{ color: "#157a4f" }} />
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">Change Password</h2>
                </div>

                <div className="space-y-3">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    autoComplete="current-password"
                    className="w-full rounded-[6px] border border-[#d5d5d5] bg-white px-3 py-2 text-[12px] focus:border-[#157a4f] focus:outline-none"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    autoComplete="new-password"
                    className="w-full rounded-[6px] border border-[#d5d5d5] bg-white px-3 py-2 text-[12px] focus:border-[#157a4f] focus:outline-none"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className="w-full rounded-[6px] border border-[#d5d5d5] bg-white px-3 py-2 text-[12px] focus:border-[#157a4f] focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={settingsLoading}
                    className="h-9 rounded-[8px] bg-[#efb02e] px-4 text-[12px] font-semibold text-[#1b1b1b] disabled:opacity-70"
                  >
                    {settingsLoading ? "Processing..." : "Update Password"}
                  </button>
                </div>
              </div>

              {settingsMessage ? (
                <div
                  className={`rounded-[8px] p-3 text-[12px] font-semibold ${
                    settingsMessage.toLowerCase().includes("success") ||
                    settingsMessage.toLowerCase().includes("verified")
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#fee2e2] text-[#b91c1c]"
                  }`}
                >
                  {settingsMessage}
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <div className="mx-auto max-w-[1260px]">
                <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
                  <section className="lg:sticky lg:top-[96px] lg:border-r lg:border-[#cfd5df] lg:self-start lg:pr-10">
                    <h1 className="mb-6 text-[21px] font-bold text-[#20232b] lg:text-[26px]">
                      Profile Overview
                    </h1>

                    <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                      <div className="h-[106px] bg-gradient-to-r from-[#ff8a2f] to-[#ffd07a]" />

                      <div className="relative px-7 pb-7 pt-14">
                        <div
                          className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
                          onClick={() => isEditMode && handlePhotoClick(false)}
                        >
                          {merchantPhotoSrc ? (
                            <img src={merchantPhotoSrc} alt="Merchant profile" className="h-full w-full object-cover" />
                          ) : (
                            <img src="/images/default-user-avatar.jpg" alt="Default Avatar" className="h-full w-full object-cover" />
                          )}
                        </div>

                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handlePhotoClick(false)}
                            className="absolute left-1/2 top-0 flex h-8 w-8 translate-x-8 -translate-y-2 items-center justify-center rounded-full bg-[#ff8e28] text-white shadow-md"
                          >
                            <Camera size={14} />
                          </button>
                        )}

                        <h2 className="text-center text-[23px] font-bold text-[#20232b]">
                          {merchantDisplayName}
                        </h2>

                        <div className="mt-8 rounded-[14px] bg-[#fcfcfd]">
                          {[
                            { icon: Mail, label: "Email Address", value: merchantEmail },
                            { icon: Phone, label: "Phone Number", value: merchantPhone },
                            { icon: CalendarDays, label: "Member Since", value: memberSinceLabel },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-start gap-4 border-b border-[#edf0f4] px-1 py-5 last:border-b-0"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7ed] text-[#ff8b1f]">
                                <item.icon size={16} />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                                  {item.label}
                                </p>
                                <p className="mt-1 text-[14px] font-semibold text-[#20232b]">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[22px] bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4e8] text-[#ff8a24]">
                          <Store size={20} />
                        </div>
                        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#20232b]">
                          {shopDisplayName}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditMode(true)}
                        className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[12px] bg-[#ff922d] px-4 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(255,146,45,0.24)]"
                      >
                        <Edit3 size={14} />
                        Edit Shop Details
                      </button>
                    </div>

                    <div className="relative mb-6 h-[260px] overflow-hidden rounded-[18px] bg-[#f3f4f6]">
                      {shopPhotoSrc ? (
                        <img src={shopPhotoSrc} alt={shopDisplayName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fff4dd] to-[#f5f5f5] text-[#9ca3af]">
                          <Store size={56} />
                        </div>
                      )}

                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handlePhotoClick(true)}
                          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#ff8b1f] shadow-lg"
                        >
                          <Camera size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                          Shop Name
                        </label>
                        <input
                          value={formData.shopName}
                          onChange={(e) => handleInputChange("shopName", e.target.value)}
                          disabled={!isEditMode}
                          className="h-11 w-full rounded-[12px] border border-[#d7dce3] bg-white px-4 text-[14px] text-[#20232b] outline-none transition focus:border-[#ff922d] disabled:bg-[#fafafa]"
                        />
                      </div>

                      <div>
                        <label className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                          Shop Category
                        </label>
                        <select
                          value={formData.storeCategory}
                          onChange={(e) => handleInputChange("storeCategory", e.target.value)}
                          disabled={!isEditMode}
                          className="h-11 w-full rounded-[12px] border border-[#d7dce3] bg-white px-4 text-[14px] text-[#20232b] outline-none transition focus:border-[#ff922d] disabled:bg-[#fafafa]"
                        >
                          <option value="" disabled>
                            Select shop category
                          </option>
                          {MERCHANT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.storeSubCategory && (
                        <div>
                          <label className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                            Store Subcategory
                          </label>
                          <input
                            value={formData.storeSubCategory}
                            disabled={true}
                            className="h-11 w-full rounded-[12px] border border-[#d7dce3] bg-[#fafafa] px-4 text-[14px] text-[#20232b] outline-none"
                          />
                          <p className="mt-1 text-[11px] text-[#888]">Selected during registration.</p>
                        </div>
                      )}

                      <div>
                        <label className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                          Store Location
                          <MapPin size={14} className="text-[#ff8b1f]" />
                        </label>

                        {isLoadingLocation ? (
                          <div className="flex h-[190px] items-center justify-center rounded-[18px] border border-[#e5e7eb] bg-[#f8fafc] text-[14px] text-[#6b7280]">
                            Loading location...
                          </div>
                        ) : (
                          <>
                            <div className="overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-[#f8fafc]">
                              <StoreLocationMap
                                location={storeLocation}
                                onMapClick={() => (isEditMode ? setShowLocationPicker(true) : setIsEditMode(true))}
                                isLoading={isSaving}
                              />
                            </div>

                            <div className="mt-5 rounded-[16px] border border-[#dfe3ea] bg-[#fafafa] p-5">
                              <p className="text-[14px] font-semibold text-[#30343c]">
                                {storeLocation.address || formData.location || "Store address not set"}
                              </p>
                              <p className="mt-2 text-[12px] text-[#6b7280]">
                                {isEditMode ? "Tap the map to update your store location." : "Your store location is shown on the map above."}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                            Username
                          </label>
                          <input
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            disabled={!isEditMode}
                            className="h-11 w-full rounded-[12px] border border-[#d7dce3] bg-white px-4 text-[14px] text-[#20232b] outline-none transition focus:border-[#ff922d] disabled:bg-[#fafafa]"
                          />
                        </div>

                        <div>
                          <label className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                            Phone Number
                          </label>
                          <input
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={!isEditMode}
                            className="h-11 w-full rounded-[12px] border border-[#d7dce3] bg-white px-4 text-[14px] text-[#20232b] outline-none transition focus:border-[#ff922d] disabled:bg-[#fafafa]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#30343c]">
                          Email Address
                        </label>
                        <input
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditMode}
                          className="h-11 w-full rounded-[12px] border border-[#d7dce3] bg-white px-4 text-[14px] text-[#20232b] outline-none transition focus:border-[#ff922d] disabled:bg-[#fafafa]"
                        />
                      </div>

                      {/* Account & Store Actions */}
                      <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
                        <div className="rounded-[16px] border border-[#e5e7eb] bg-[#f9fafb] p-5 hover:border-[#d1d5db] transition">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-[#1f2937] font-bold text-[14px]">
                                <Store size={16} className="text-[#6b7280]" />
                                Account & Store Actions
                              </div>
                              <p className="text-[12px] text-[#6b7280] mt-1">
                                Permanently close this store profile, products, and merchant account.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteStep(1);
                                setDeleteReason("");
                                setCustomDeleteReason("");
                                setDeleteKeyword("");
                                setDeleteError("");
                                setDeleteSuccessMsg("");
                                setShowDeleteModal(true);
                              }}
                              className="h-10 px-5 rounded-[10px] border border-[#fca5a5] bg-white text-[#dc2626] text-[13px] font-semibold hover:bg-[#fef2f2] hover:border-[#f87171] transition flex items-center justify-center gap-2 shrink-0 shadow-sm self-start sm:self-auto"
                            >
                              <Trash2 size={14} className="text-[#dc2626]" />
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {isEditMode && (
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleDiscard}
                      className="h-9 rounded-[12px] bg-[#d8dbe2] px-4 text-[13px] font-semibold text-[#222]"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-9 rounded-[12px] bg-[#ff922d] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}

                {saveMessage && (
                  <div
                    className={`mt-5 rounded-[12px] p-3 text-[12px] font-semibold ${
                      saveMessage.includes("success")
                        ? "bg-[#dcfce7] text-[#166534]"
                        : "bg-[#fee2e2] text-[#b91c1c]"
                    }`}
                  >
                    {saveMessage}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={
          storeLocation && storeLocation.latitude
            ? {
                lat: storeLocation.latitude,
                lng: storeLocation.longitude,
              }
            : null
        }
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] overflow-hidden rounded-[14px] border border-[#e5e5e5] bg-white shadow-2xl">
            <div className="border-b border-[#ececec] px-6 py-5">
              <h3 className="text-[18px] font-semibold text-[#1b1b1b]">Confirm Logout</h3>
              <p className="mt-2 text-[13px] text-[#666]">
                Are you sure you want to log out of your merchant account?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 bg-[#fafafa] px-6 py-4">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="h-9 rounded-[8px] border border-[#cfd5dc] bg-white px-4 text-[12px] font-semibold text-[#555]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="h-9 rounded-[8px] bg-[#ef4d4d] px-4 text-[12px] font-semibold text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Merchant Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[10030] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[540px] rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#fecaca] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#fff1f2] border-b border-[#ffe4e6] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#fecdd3] text-[#e11d48] flex items-center justify-center shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#881337]">Delete Merchant Account</h3>
                  <p className="text-[11px] text-[#9f1239]">
                    {deleteStep === 1 && "Step 1 of 4: Important Data Warning"}
                    {deleteStep === 2 && "Step 2 of 4: Select Reason"}
                    {deleteStep === 3 && "Step 3 of 4: Store Data Deletion Impact"}
                    {deleteStep === 4 && "Step 4 of 4: Confirmation Keyword"}
                    {deleteStep === 5 && "Merchant Account Deleted"}
                  </p>
                </div>
              </div>
              {deleteStep !== 5 && (
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
              {/* STEP 1: INITIAL DATA WARNING */}
              {deleteStep === 1 && (
                <div>
                  <div className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-4 mb-5">
                    <div className="flex items-start gap-3">
                      <ShieldAlert size={22} className="text-[#dc2626] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[15px] font-bold text-[#991b1b]">
                          Important Data Warning
                        </h4>
                        <p className="text-[13px] text-[#b91c1c] mt-1.5 leading-relaxed">
                          Deleting your merchant account will permanently remove your store information, products and offers. This information will no longer be available.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-[#374151] mb-5">
                    Are you sure you want to continue?
                  </p>

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
                      onClick={() => setDeleteStep(2)}
                      className="h-10 px-5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] transition shadow-sm"
                    >
                      I Understand, Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT REASON */}
              {deleteStep === 2 && (
                <div>
                  <p className="text-[14px] font-semibold text-[#1f2937] mb-1">
                    Please select the reason for deleting your account:
                  </p>
                  <p className="text-[12px] text-[#6b7280] mb-4">
                    Your feedback helps us understand how we can improve the platform for businesses:
                  </p>

                  <div className="space-y-2 mb-4 max-h-[250px] overflow-y-auto pr-1">
                    {MERCHANT_DELETE_REASONS.map((r) => (
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
                          name="merchantDeleteReason"
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
                      disabled={!deleteReason || (deleteReason === "Other" && !customDeleteReason.trim())}
                      onClick={() => {
                        setDeleteError("");
                        setDeleteStep(3);
                      }}
                      className="h-10 px-5 rounded-xl bg-[#e11d48] text-white text-sm font-semibold hover:bg-[#be123c] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DELETION CONFIRMATION & STORE DATA REMOVAL */}
              {deleteStep === 3 && (
                <div>
                  <div className="rounded-xl bg-[#fef2f2] border border-[#fecaca] p-4 mb-4">
                    <h4 className="text-[14px] font-bold text-[#991b1b] flex items-center gap-2">
                      <AlertTriangle size={18} />
                      Store & Listing Data Will Be Wiped
                    </h4>
                    <p className="text-[12px] text-[#b91c1c] mt-1 leading-relaxed">
                      Confirming will completely remove your merchant presence across all GOLO platforms:
                    </p>

                    <ul className="mt-3 space-y-1.5 text-[12px] text-[#7f1d1d] pl-5 list-disc">
                      <li><strong>{shopDisplayName}</strong> storefront & profile will be removed</li>
                      <li>All listed products, inventory items, and pricing</li>
                      <li>All active deals, promotions, and banner advertisements</li>
                      <li>Customer reviews, merchant ratings, and follower links</li>
                      <li>Pending voucher redemptions and store analytics history</li>
                    </ul>
                  </div>

                  <p className="text-[13px] font-semibold text-[#374151] mb-4">
                    Are you sure you want to permanently delete your merchant account?
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setDeleteStep(2)}
                      className="h-10 px-4 rounded-xl border border-[#d1d5db] text-sm font-semibold text-[#4b5563] hover:bg-gray-50 transition flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteStep(4)}
                      className="h-10 px-5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] transition shadow-sm"
                    >
                      Proceed to Final Step
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: TYPE DELETE KEYWORD */}
              {deleteStep === 4 && (
                <div>
                  <p className="text-[13px] text-[#374151] mb-2 leading-relaxed">
                    To authorize deletion of <strong>{shopDisplayName}</strong>, please type <span className="font-bold text-[#dc2626] bg-[#fee2e2] px-1.5 py-0.5 rounded font-mono">DELETE</span> in the box below:
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
                      onClick={() => setDeleteStep(3)}
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
                          const res = await deleteMerchantAccount({
                            reason: deleteReason,
                            customReason: customDeleteReason,
                            confirmation: "DELETE",
                          });

                          if (res?.success || res) {
                            setDeleteSuccessMsg(res?.message || "Your merchant account has been permanently deleted.");
                            setDeleteStep(5);
                            setTimeout(async () => {
                              await logout();
                              router.push("/merchant-login");
                            }, 3000);
                          } else {
                            setDeleteError(res?.message || "Failed to delete account. Please try again.");
                          }
                        } catch (err) {
                          console.error("Merchant account deletion failed:", err);
                          setDeleteError(err?.response?.data?.message || err?.message || "Failed to delete merchant account. Please try again.");
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      className="h-10 px-5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Deleting Store...</span>
                        </>
                      ) : (
                        <span>Confirm Delete</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: COMPLETION */}
              {deleteStep === 5 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-[20px] font-bold text-[#1f2937] mb-2">
                    Merchant Account Deleted
                  </h4>
                  <p className="text-[13px] text-[#4b5563] max-w-sm mx-auto mb-6">
                    {deleteSuccessMsg || "Your merchant account and store data have been permanently removed."}
                  </p>
                  <p className="text-[12px] text-[#9ca3af]">
                    Redirecting to merchant login...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-4 bg-[#e8ad2f] border-t border-[#d49b22] px-4 py-4 text-[#1b1b1b] lg:mt-6 lg:bg-[#f0b330] lg:px-8 lg:py-7">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-4 lg:flex-row lg:gap-12">
          <div className="max-w-[240px]">
            <div className="mb-2 flex items-center gap-2 lg:mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white font-bold text-[#157a4f]">
                G
              </div>
              <span className="text-[18px] font-semibold text-[#157a4f]">GOLO</span>
            </div>
            <p className="max-w-[150px] text-[10px] leading-[1.35] text-[#fff8de]">
              The all-in-one management platform for modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-[10px] text-[#6b520f] lg:gap-20 lg:gap-y-14">
            <div>
              <p className="mb-2 font-semibold text-[#1b1b1b] lg:mb-3">Links</p>
              <ul className="space-y-1 lg:space-y-2">
                <li>Overview</li>
                <li>Inventory</li>
                <li>Posts</li>
                <li>Profile</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold text-[#1b1b1b] lg:mb-3">&nbsp;</p>
              <ul className="space-y-1 lg:space-y-2">
                <li>Analytics</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold text-[#1b1b1b] lg:mb-3">Support</p>
              <ul className="space-y-1 lg:space-y-2">
                <li>Help Center</li>
                <li>Security</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="mt-auto flex gap-3 text-[#1877f2] lg:gap-4 lg:pb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f3ba3b] text-[10px] font-bold text-[#1877f2]">f</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#f3ba3b] text-[9px] font-bold text-[#0a66c2]">in</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f3ba3b] text-[10px] font-bold text-[#e1306c]">ig</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#f3ba3b] text-[10px] font-bold text-[#ff0000]">▶</span>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-[1500px] items-center justify-between text-[9px] text-[#5f4710] lg:mt-6">
          <p>© 2026 GOLO Dashboard. All rights reserved.</p>
          <p>Made with ♥ by V</p>
        </div>
      </footer>
    </div>
  );
}

