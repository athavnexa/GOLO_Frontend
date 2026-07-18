"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Bell, X, CheckCheck, Crown, HelpCircle, LogOut, Settings, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../lib/api";

const navItems = [
  { key: "dashboard", label: "Overview", href: "/merchant/dashboard" },
  { key: "orders", label: "Orders", href: "/merchant/orders" },
  { key: "products", label: "Products", href: "/merchant/products" },
  { key: "offers", label: "Offers", href: "/merchant/offers" },
  { key: "redeem", label: "Redeem QR", href: "/merchant/redeem" },
  { key: "banners", label: "Banners", href: "/merchant/banners" },
  { key: "analytics", label: "Analytics", href: "/merchant/analytics" },
];

export default function MerchantNavbar({ activeKey = "dashboard" }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications({ page: 1, limit: 10 });
      const payload = response?.data || {};
      const notifs = Array.isArray(payload.notifications) ? payload.notifications : [];
      setNotifications(notifs);
      setUnreadCount(Number(payload.unreadCount || 0));
    } catch (err) {
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {}
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <header
      className="sticky top-0 z-[9999] min-h-16 border-b border-[#d7a02a] px-4 py-2 lg:h-16 lg:px-10 lg:py-0 flex items-center justify-between gap-3 overflow-visible"
      style={{
        background: "linear-gradient(180deg, #efb02e 0%, #f3c76d 100%)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2 lg:min-w-[180px] lg:gap-3">
        <button type="button" onClick={() => router.push("/merchant/dashboard")} className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold" style={{ color: "#157a4f" }}>
            G
          </div>
          <span className="text-lg font-semibold tracking-wide text-[#157a4f] lg:text-xl">GOLO</span>
        </button>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-2 text-[12px] font-semibold text-[#5a4514] lg:gap-8">
        <nav className="flex max-w-[50vw] items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap py-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-none lg:gap-8 lg:overflow-visible lg:py-0 [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className={
                  isActive
                    ? "relative h-9 px-2 text-[#157a4f] lg:h-16 lg:px-0"
                    : "h-9 px-2 hover:text-[#157a4f] lg:h-16 lg:px-0"
                }
              >
                {item.label}
                {isActive && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />}
              </button>
            );
          })}
          <button
            onClick={() => router.push("/merchant/upgrade")}
            className={`relative h-9 px-2 lg:h-16 lg:px-0 ${activeKey === "upgrade" ? "text-[#157a4f]" : "text-[#5a4514] hover:text-[#157a4f]"}`}
          >
            Upgrade
          </button>
        </nav>

        <div className="relative" ref={notifDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="relative h-10 w-10 min-w-[2.5rem] shrink-0 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center"
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
            <div className="absolute right-0 top-14 w-[calc(100vw-2rem)] max-w-80 max-h-[420px] bg-white rounded-[12px] shadow-2xl border border-[#e5e5e5] overflow-hidden z-[10000]">
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
                      onClick={() => handleMarkRead(n._id)}
                      className={`px-4 py-3 border-b border-[#f5f5f5] cursor-pointer hover:bg-[#f9f9f9] ${n.read ? "" : "bg-[#f0faf4]"}`}
                    >
                      <p className="text-[12px] text-[#1e1e1e] leading-snug">{n.message}</p>
                      <p className="text-[10px] text-[#999] mt-1">{formatTime(n.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="h-10 w-10 min-w-[2.5rem] shrink-0 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center"
            aria-label="Profile menu"
          >
            <User size={18} style={{ color: "#157a4f" }} />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-[14px] border border-[#e5e5e5] bg-white py-2 text-[12px] font-semibold shadow-xl z-[10000]">
              <div className="px-4 py-3 border-b border-[#f0f0f0]">
                <p className="text-[13px] font-bold text-[#1e1e1e] truncate">{user?.shopName || user?.name || "My Store"}</p>
                <p className="text-[11px] text-[#666] truncate">{user?.email || "No email"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push("/merchant/profile");
                  setShowProfileDropdown(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
              >
                <User size={15} /> Profile Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/merchant/profile?tab=loyalty");
                  setShowProfileDropdown(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
              >
                <Crown size={15} /> Loyalty Rewards
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/merchant/help");
                  setShowProfileDropdown(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
              >
                <HelpCircle size={15} /> Help
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/merchant/settings");
                  setShowProfileDropdown(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
              >
                <Settings size={15} /> Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/merchant/upgrade");
                  setShowProfileDropdown(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f4fbf7] text-[#157a4f]"
              >
                <Crown size={15} /> Upgrade
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/merchant/transactions");
                  setShowProfileDropdown(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f8f8f8] text-[#111]"
              >
                <FileText size={15} /> Transactions
              </button>
              <div className="border-t border-[#f0f0f0] mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                    router.push("/login");
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
    </header>
  );
}
