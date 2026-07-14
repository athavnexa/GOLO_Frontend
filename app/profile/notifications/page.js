"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Bell, CheckCircle2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getNotifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications } from "../../lib/api";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ limit: 50 });
      if (res?.success) {
        setNotifications(res.data?.notifications || []);
        setUnreadCount(res.data?.unreadCount || 0);
      }
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const filteredNotifications = activeTab === "All"
    ? notifications
    : notifications.filter((n) => !n.read);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, notifications.length]);

  return (
    <>
      <Navbar />

      <div className="relative z-10 min-h-screen bg-transparent pt-10 md:pt-14">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[34px] leading-none font-semibold text-[#1f1f1f]">Notifications</h1>
              <p className="mt-2 text-[13px] text-[#6f6f6f]">Stay up to date with your latest activity and alerts</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === "All" ? "bg-[#157a4f] text-white border-[#157a4f]" : "bg-white text-[#157a4f] border-[#d2e7de] hover:bg-[#f4f4f4]"}`}
                onClick={() => setActiveTab("All")}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === "Unread" ? "bg-[#157a4f] text-white border-[#157a4f]" : "bg-white text-[#157a4f] border-[#d2e7de] hover:bg-[#f4f4f4]"}`}
                onClick={() => setActiveTab("Unread")}
              >
                Unread {unreadCount > 0 && <span className="ml-1 inline-block bg-[#f4a632] text-white rounded-full px-2 py-0.5 text-xs font-bold">{unreadCount}</span>}
              </button>
            </div>
          </div>

          <div className="rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-xs font-semibold border border-[#d2e7de] text-[#157a4f] bg-white hover:bg-[#f4f4f4] disabled:opacity-50"
                >
                  <CheckCircle2 size={15} /> Mark all as read
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-xs font-semibold border border-[#e5e5e5] text-[#b91c1c] bg-white hover:bg-[#fbeaea]"
                >
                  <Trash2 size={15} /> Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="text-center text-[#157a4f] py-16 text-lg font-semibold flex flex-col items-center gap-2">
                <Bell size={40} className="mx-auto mb-2 animate-pulse" />
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center text-gray-400 py-20 flex flex-col items-center gap-2">
                <Bell size={48} className="mx-auto mb-2 opacity-60" />
                <span className="text-lg font-semibold">No notifications</span>
                <span className="text-sm text-gray-400">You're all caught up!</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {paginatedNotifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => {
                        if (!notif.read) handleMarkRead(notif._id);
                        if (notif.offerId) router.push(`/nearby-deals/deal?offerId=${notif.offerId}`);
                      }}
                      className={`flex items-start gap-4 px-5 py-4 border border-[#e5e5e5] rounded-xl shadow-sm transition cursor-pointer group ${notif.read ? "bg-white" : "bg-green-50 hover:bg-green-100"}`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5 ${notif.read ? "bg-[#e5e5e5]" : "bg-[#157a4f]/10"}`}>
                        <Bell size={18} className={notif.read ? "text-[#bdbdbd]" : "text-[#157a4f]"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[15px] font-semibold ${notif.read ? "text-gray-700" : "text-[#157a4f]"}`}>{notif.message}</span>
                          {!notif.read && <span className="inline-block w-2 h-2 rounded-full bg-[#f4a632] mt-1" />}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={e => { e.stopPropagation(); handleMarkRead(notif._id); }}
                          className="ml-2 px-2 py-1 rounded bg-[#157a4f] text-white text-xs font-semibold hover:bg-[#10613f] transition"
                        >Mark as read</button>
                      )}
                    </div>
                  ))}
                </div>

                {!loading && filteredNotifications.length > ITEMS_PER_PAGE && (
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[#e5e5e5] bg-white text-sm font-semibold text-[#666] hover:bg-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm text-[#666]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[#e5e5e5] bg-white text-sm font-semibold text-[#666] hover:bg-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
