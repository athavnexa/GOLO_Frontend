"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Megaphone, Plus, Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import { getMyBannerPromotions, payForBannerPromotion } from "../../lib/api";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeStatus(status) {
  const map = {
    under_review: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    active: "Active",
    expired: "Expired",
    upcoming: "Upcoming",
  };
  return map[status] || status;
}

function parseDateValue(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getBannerDisplayStatus(row) {
  const rawStatus = String(row?.status || "").trim().toLowerCase();
  if (rawStatus === "rejected") return "rejected";
  if (rawStatus === "under_review" || rawStatus === "pending") return "under_review";

  const startDate = parseDateValue(row?.startDate || row?.start || row?.start_date);
  const endDate = parseDateValue(row?.endDate || row?.end || row?.end_date);
  const now = new Date();

  if (startDate && now < startDate) return "upcoming";
  if (endDate && now > endDate) return "expired";
  if (rawStatus === "active" || rawStatus === "approved") return "active";
  if (!startDate && !endDate) return rawStatus || "active";
  return "active";
}

function isBannerActive(row) {
  return getBannerDisplayStatus(row) === "active";
}

function downloadCsv(filename, rows) {
  if (!rows?.length) return;

  const headers = ["Banner Title", "Category", "Posted Date", "Visibility Dates", "Status", "Budget"];
  const escapeCell = (value) => {
    const stringValue = String(value ?? "");
    return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
  };

  const csvContent = [headers.join(","), ...rows.map((row) => [
    escapeCell(row.bannerTitle),
    escapeCell(row.bannerCategory),
    escapeCell(formatDate(row.createdAt)),
    escapeCell(`${formatDate(row.startDate)} - ${formatDate(row.endDate)}`),
    escapeCell(normalizeStatus(row.status)),
    escapeCell(`Rs. ${row.totalPrice || 0}`),
  ].join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function MerchantBannersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const loadRequests = async () => {
    setListLoading(true);
    setActionError("");
    try {
      const res = await getMyBannerPromotions();
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      setActionError(error?.data?.message || "Failed to load banner requests.");
      setRows([]);
    } finally {
      setListLoading(false);
    }
  };

  const handlePayNow = async (requestId) => {
    setActionMessage("");
    setActionError("");
    try {
      await payForBannerPromotion(requestId, `MOCK_PAY_${Date.now()}`);
      setRows((prev) => prev.map((row) => (row._id === requestId ? { ...row, paymentStatus: "paid" } : row)));
      setActionMessage("Payment completed successfully.");
    } catch (error) {
      setActionError(error?.data?.message || "Failed to process payment.");
    }
  };

  const handleExportCsv = () => {
    const exportRows = (filteredRows.length > 0 ? filteredRows : rows).map((row) => ({
      bannerTitle: row.bannerTitle,
      bannerCategory: row.bannerCategory,
      postedDate: formatDate(row.createdAt),
      visibilityDates: `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`,
      status: normalizeStatus(getBannerDisplayStatus(row)),
      budget: `Rs. ${row.totalPrice || 0}`,
    }));

    downloadCsv("merchant-banners.csv", exportRows);
  };

  const summary = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((row) => isBannerActive(row)).length;
    const spend = rows.reduce((sum, row) => sum + Number(row.totalPrice || 0), 0);
    return { total, active, spend };
  }, [rows]);

  const filteredRows = (() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => {
      return [row.bannerTitle, row.bannerCategory, getBannerDisplayStatus(row)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  })();

  useEffect(() => {
    if (!loading && user && user.accountType === "merchant") {
      loadRequests();
    }
  }, [loading, user]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#ececec]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="banners" />

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <section>
            <h1 className="text-[42px] font-semibold leading-none text-[#1e1e1e]">Banner Promotions</h1>
            <p className="mt-3 text-[13px] text-[#6f6f6f] max-w-[540px]">
              Track your paid homepage banners, visibility windows, and campaign performance in one place.
            </p>
          </section>

          <section className="flex gap-2 md:grid md:grid-cols-3 md:gap-5">
            <div className="flex-1 rounded-[12px] border border-[#e2e2e2] bg-white px-2 py-3 flex min-w-0 items-center justify-between md:px-4 md:py-4">
              <div>
                <p className="text-[9px] text-[#666] md:text-[11px]">Total Banners</p>
                <p className="text-[22px] font-semibold leading-none mt-1 md:text-[34px]">{summary.total}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#fef5e2] text-[#efb02e] flex items-center justify-center">
                <Megaphone size={17} />
              </div>
            </div>

            <div className="flex-1 rounded-[12px] border border-[#e2e2e2] bg-white px-2 py-3 flex min-w-0 items-center justify-between md:px-4 md:py-4">
              <div>
                <p className="text-[9px] text-[#666] md:text-[11px]">Active Promotions</p>
                <p className="text-[22px] font-semibold leading-none mt-1 md:text-[34px]">{summary.active}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#ecf8f0] text-[#2cb56e] flex items-center justify-center text-[16px]">◎</div>
            </div>

            <div className="flex-1 rounded-[12px] border border-[#e2e2e2] bg-white px-2 py-3 flex min-w-0 items-center justify-between md:px-4 md:py-4">
              <div>
                <p className="text-[9px] text-[#666] md:text-[11px]">Promotion Spend</p>
                <p className="text-[16px] font-semibold leading-none mt-1 md:text-[34px]">Rs. {summary.spend}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#f0aa19] flex items-center justify-center text-[20px]">Rs</div>
            </div>
          </section>

          <section className="rounded-[12px] border border-[#e5e5e5] bg-[#f9f9f9] p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full max-w-[620px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a4a4]" />
                <input
                  className="h-9 w-full rounded-[8px] border border-[#e2e2e2] bg-white pl-8 pr-3 text-[12px] outline-none"
                  placeholder="Search by banner title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="h-9 rounded-[8px] border border-[#e2e2e2] bg-white px-4 text-[11px] text-[#666] inline-flex items-center gap-1.5" onClick={handleExportCsv}>
                  <Download size={12} /> Export CSV
                </button>
                <button onClick={() => router.push("/merchant/banners/promote")} className="h-9 rounded-[8px] bg-[#2f9e58] px-4 text-[11px] font-semibold text-white inline-flex items-center gap-1.5">
                  <Plus size={12} /> Promote Your Banner
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[10px] border border-[#ececec] bg-white">
              {actionError ? <p className="px-4 py-2 text-[11px] text-[#dc2626]">{actionError}</p> : null}
              {actionMessage ? <p className="px-4 py-2 text-[11px] text-[#157a4f]">{actionMessage}</p> : null}
              <table className="w-full text-[12px]">
                <thead className="bg-[#f2f3f5] text-[#666]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Banner Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Posted Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Visibility Dates</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Budget</th>
                    <th className="px-4 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center text-[#666]">Loading banners...</td>
                    </tr>
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center text-[#666]">No banner requests found.</td>
                    </tr>
                  ) : filteredRows.map((row) => {
                    const displayStatus = getBannerDisplayStatus(row);
                    return (
                    <tr key={row.requestId} className="border-t border-[#f0f0f0]">
                      <td className="px-4 py-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-[#ececec]">
                          <Image src={row.imageUrl || "/images/banner3.avif"} alt={row.bannerTitle} width={32} height={32} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#2a2a2a]">{row.bannerTitle}</td>
                      <td className="px-4 py-3 text-[#2c2c2c]">{row.bannerCategory}</td>
                      <td className="px-4 py-3 text-[#2c2c2c]">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-3 text-[#2c2c2c]">{formatDate(row.startDate)} - {formatDate(row.endDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          displayStatus === "active"
                            ? "bg-[#e7f7ec] text-[#2f9e58]"
                            : displayStatus === "rejected"
                              ? "bg-[#fee2e2] text-[#dc2626]"
                              : displayStatus === "expired"
                                ? "bg-[#fef2f2] text-[#b91c1c]"
                                : displayStatus === "upcoming"
                                  ? "bg-[#eef2ff] text-[#4338ca]"
                                  : "bg-[#f3f4f6] text-[#4b5563]"
                        }`}
                        >
                          {normalizeStatus(displayStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-semibold text-[#1f1f1f]">Rs. {row.totalPrice || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => router.push(`/merchant/banners/edit?id=${encodeURIComponent(row.requestId || row._id || "")}`)}
                            className="h-7 rounded-[6px] border border-[#d7dce4] px-3 text-[10px] font-semibold text-[#374151]"
                          >
                            Edit
                          </button>
                          {row.status === "approved" && row.paymentStatus !== "paid" ? (
                            <button
                              onClick={() => handlePayNow(row.requestId)}
                              className="h-7 rounded-[6px] bg-[#157a4f] px-3 text-[10px] font-semibold text-white"
                            >
                              Pay Now
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="bg-[#d6d9df] px-6 py-4 text-[12px] text-[#565656]">Showing {filteredRows.length} of {rows.length} banners</div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#e8ad2f] border-t border-[#d49b22] text-[#1b1b1b] px-4 py-4 lg:bg-[#f0b330] lg:px-8 lg:py-7 mt-4 lg:mt-6">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-12 items-start justify-between">
          <div className="max-w-[240px]">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center font-bold text-[#157a4f]">G</div>
              <span className="text-[18px] font-semibold text-[#157a4f]">GOLO</span>
            </div>
            <p className="text-[10px] leading-[1.35] text-[#fff8de] max-w-[150px]">
              The all-in-one management platform for modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 lg:gap-20 text-[10px] text-[#6b520f]">
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-2 lg:mb-3">Links</p>
              <ul className="space-y-1 lg:space-y-2">
                <li>Overview</li>
                <li>Inventory</li>
                <li>Posts</li>
                <li>Profile</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-2 lg:mb-3">&nbsp;</p>
              <ul className="space-y-1 lg:space-y-2">
                <li>Analytics</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-2 lg:mb-3">Support</p>
              <ul className="space-y-1 lg:space-y-2">
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
