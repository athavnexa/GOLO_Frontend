"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  X,
  CheckCheck,
  Crown,
  HelpCircle,
  LogOut,
  Settings,
  FileText,
  Gift,
  Menu,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  QrCode,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../lib/api/user";

const navItems = [
  { key: "dashboard", label: "Overview", href: "/merchant/dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", href: "/merchant/orders", icon: ShoppingBag },
  { key: "products", label: "Products", href: "/merchant/products", icon: Package },
  { key: "offers", label: "Offers", href: "/merchant/offers", icon: Tag },
  { key: "redeem", label: "Redeem QR", href: "/merchant/redeem", icon: QrCode },
  { key: "banners", label: "Banners", href: "/merchant/banners", icon: ImageIcon },
  { key: "analytics", label: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
  { key: "upgrade", label: "Upgrade", href: "/merchant/upgrade", icon: Crown },
];

export default function MerchantNavbar({ activeKey = "dashboard" }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const headerRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications({ page: 1, limit: 10 });
      const payload = response?.data || {};
      const notifs = Array.isArray(payload.notifications) ? payload.notifications : [];
      setNotifications(notifs);
      setUnreadCount(Number(payload.unreadCount || 0));
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch {}
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleNavigate = (href) => {
    setMobileMenuOpen(false);
    setShowNotifDropdown(false);
    setShowProfileDropdown(false);
    router.push(href);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[9999] border-b border-[#d49b22] bg-gradient-to-br from-[#f3ba3b] via-[#e8ad2f] to-[#d89b21] overflow-visible"
      style={{
        boxShadow: "0 4px 12px rgba(216, 155, 33, 0.15)",
      }}
    >
      {/* Primary Top Bar */}
      <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 xl:px-10">
        {/* Left: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((prev) => !prev);
              setShowNotifDropdown(false);
              setShowProfileDropdown(false);
            }}
            className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/95 text-[#157a4f] shadow-sm flex items-center justify-center transition hover:bg-white active:scale-95"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link
            href="/merchant/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 sm:h-11 shrink-0 items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 sm:px-3.5 shadow-sm transition hover:opacity-95"
          >
            <img
              src="/images/ajubaju-icon.png"
              alt="AjuBaju Icon"
              className="h-[18px] sm:h-[21px] w-auto shrink-0 object-contain"
              loading="eager"
              draggable={false}
            />
            <img
              src="/images/ajubaju-text.png"
              alt="AjuBaju"
              className="h-[15px] sm:h-[18px] w-auto shrink-0 object-contain"
              loading="eager"
              draggable={false}
            />
          </Link>
        </div>

        {/* Right: Desktop Nav Links + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 xl:gap-8 text-[12px] font-semibold text-[#5a4514]">
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 whitespace-nowrap">
            {navItems.map((item) => {
              const isActive = item.key === activeKey;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={
                    isActive
                      ? "relative h-16 px-0.5 text-[#157a4f] transition-colors"
                      : "relative h-16 px-0.5 text-[#5a4514] hover:text-[#157a4f] transition-colors"
                  }
                >
                  {item.label}
                  {isActive && <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-t bg-[#157a4f]" />}
                </button>
              );
            })}
          </nav>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifDropdown((prev) => !prev);
                setShowProfileDropdown(false);
                setMobileMenuOpen(false);
              }}
              className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell size={18} style={{ color: "#157a4f" }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="fixed left-3 right-3 top-[4rem] sm:left-auto sm:right-0 sm:top-14 sm:absolute sm:w-80 max-h-[420px] bg-white rounded-[12px] shadow-2xl border border-[#e5e5e5] overflow-hidden z-[10000]">
                <div className="px-4 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-[#1e1e1e]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-[11px] text-[#157a4f] font-semibold flex items-center gap-1">
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[340px]">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-[12px] text-[#999]">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          handleMarkRead(n._id);
                          setShowNotifDropdown(false);

                          let targetUrl = "/merchant/dashboard";

                          const isOfferNotif = ["order_placed", "order_accepted", "order_rejected", "new_offer", "expiring_offer"].includes(n.type);
                          const isAdNotif = ["wishlist_add", "wishlist_remove"].includes(n.type);
                          const referenceId = n.offerId || n.adId;

                          if (isOfferNotif && referenceId && referenceId !== "order") {
                            targetUrl = `/merchant/offers/details?id=${referenceId}`;
                          } else if (isAdNotif && n.adId) {
                            targetUrl = `/product/${n.adId}`;
                          } else if (n.adId && !isOfferNotif) {
                            targetUrl = `/product/${n.adId}`;
                          } else if (n.offerId) {
                            targetUrl = `/merchant/offers/details?id=${n.offerId}`;
                          }

                          router.push(targetUrl);
                        }}
                        className={`px-4 py-3 border-b border-[#f5f5f5] cursor-pointer hover:bg-[#f9f9f9] ${n.read ? "" : "bg-[#f0faf4]"}`}
                      >
                        <div className="flex-1 min-w-0">
                          {(n.title || n.adTitle) && (
                            <h4 className="font-bold text-[12px] text-[#157a4f] mb-0.5">
                              {n.title || n.adTitle}
                            </h4>
                          )}
                          <p className="text-[12px] text-[#1e1e1e] leading-snug">{n.message}</p>
                          <p className="text-[10px] text-[#999] mt-1">{formatTime(n.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfileDropdown((prev) => !prev);
                setShowNotifDropdown(false);
                setMobileMenuOpen(false);
              }}
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center overflow-hidden border border-gray-200"
              aria-label="Profile menu"
            >
              {user?.profilePhoto || user?.shopPhoto || user?.avatarUrl ? (
                <img
                  src={user?.profilePhoto || user?.shopPhoto || user?.avatarUrl}
                  alt={user?.shopName || user?.name || "Merchant"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={18} style={{ color: "#157a4f" }} />
              )}
            </button>

            {showProfileDropdown && (
              <div className="fixed left-3 right-3 top-[4rem] sm:left-auto sm:right-0 sm:top-14 sm:absolute sm:w-72 overflow-hidden rounded-[14px] border border-[#e5e5e5] bg-white py-2 text-[12px] font-semibold shadow-xl z-[10000]">
                <div className="px-4 py-3 border-b border-[#f0f0f0]">
                  <p className="text-[13px] font-bold text-[#1e1e1e] truncate">{user?.shopName || user?.name || "My Store"}</p>
                  <p className="text-[11px] text-[#666] truncate">{user?.email || "No email"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/profile")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
                >
                  <User size={15} /> Profile Settings
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/profile?tab=loyalty")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
                >
                  <Crown size={15} /> Loyalty Rewards
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/help")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
                >
                  <HelpCircle size={15} /> Help
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/settings")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
                >
                  <Settings size={15} /> Settings
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/upgrade")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f4fbf7] text-[#157a4f]"
                >
                  <Crown size={15} /> Upgrade
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/transactions")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
                >
                  <FileText size={15} /> Transactions
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/merchant/referrals")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
                >
                  <Gift size={15} /> Refer & Earn
                </button>
                <div className="border-t border-[#f0f0f0] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                      router.push("/merchant-login");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#fef2f2] text-[#ef4444]"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Mobile Navigation Drawer (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d49b22]/60 bg-white shadow-xl">
          <div className="px-4 py-3 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = item.key === activeKey;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                    isActive
                      ? "bg-[#ecfdf5] text-[#157a4f] ring-1 ring-[#157a4f]/20"
                      : "bg-[#fafafa] text-[#374151] hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#157a4f]" : "text-[#6b7280]"} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between text-[12px] font-semibold text-[#4b5563]">
            <button
              type="button"
              onClick={() => handleNavigate("/merchant/profile")}
              className="flex items-center gap-1.5 py-1 hover:text-[#157a4f]"
            >
              <User size={14} /> Account & Profile
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("/merchant/help")}
              className="flex items-center gap-1.5 py-1 hover:text-[#157a4f]"
            >
              <HelpCircle size={14} /> Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
