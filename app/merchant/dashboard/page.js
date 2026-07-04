"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, ChevronRight, ShoppingBag, Box, Star, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import { getMerchantDashboardSummary, getMerchantProfile, getMerchantLoyaltyLeaderboard, getMerchantRealtimeAnalytics } from "../../lib/api";

const orders = [
  { id: "#2456", time: "Placed 12 hours ago", amount: "₹340", qty: "3 items" },
  { id: "#2451", time: "Placed 14 hours ago", amount: "₹523", qty: "5 items" },
  { id: "#2448", time: "Placed 1 day ago", amount: "₹890", qty: "8 items" },
  { id: "#2445", time: "Placed 1 day ago", amount: "₹120", qty: "1 items" },
  { id: "#2442", time: "Placed 2 days ago", amount: "₹450", qty: "4 items" },
];

const latestReviews = [
  {
    name: "Rahul K.",
    time: "Yesterday",
    text: "Best local store on Golo. Prices are reasonable and the food is always fresh!",
    avatar: "/images/banner3.avif",
  },
  {
    name: "Anjali S.",
    time: "2 days ago",
    text: "Love the Moon Cafe vibes. The packaging was neat and eco-friendly.",
    avatar: "/images/place2.avif",
  },
];

const PlanBanner = ({ plan }) => {
  if (!plan) return null;

  if (plan.planType === "TRIAL") {
    // Determine progress if possible, else 100%
    return (
      <div className="rounded-[12px] border border-[#a2d9b5] bg-[#eef8f1] p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 rounded-full bg-[#157a4f]"></span>
              <h3 className="text-[18px] font-bold text-[#157a4f]">Free Trial</h3>
            </div>
            <p className="text-[14px] text-[#2c5840] font-medium">✓ Unlimited access during trial</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[20px] font-bold text-[#157a4f]">{plan.trialRemainingDays} days remaining</p>
            {plan.expiresAt && <p className="text-[12px] text-[#3d7054] mt-1">Ends on: {new Date(plan.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full bg-[#c2ebd1] rounded-full overflow-hidden">
          <div className="h-full bg-[#157a4f] rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  if (plan.planType === "FREE") {
    const productsUsage = plan.usage?.products || 0;
    const maxProducts = plan.planFeatures?.maxProducts || 10;
    const productsPercent = Math.min(100, (productsUsage / maxProducts) * 100);

    const offersUsage = plan.usage?.monthlyOffers || 0;
    const maxOffers = plan.planFeatures?.maxMonthlyOffers || 2;
    const offersPercent = Math.min(100, (offersUsage / maxOffers) * 100);

    return (
      <div className="rounded-[12px] border border-[#b2cce6] bg-[#f0f6fc] p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-[#d0e0ef] pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#206bc4]"></span>
            <h3 className="text-[18px] font-bold text-[#206bc4]">Free Tier</h3>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#206bc4] text-white text-[13px] font-bold shadow-sm hover:bg-[#1b5cb0]" onClick={() => alert("Premium plans coming soon.")}>
            Upgrade Plan
          </button>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold text-[#456b92] uppercase tracking-wide mb-3">Current Limits</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="font-semibold text-[#1f3f62]">Products</span>
                <span className="text-[#3b638a] font-medium">{productsUsage} / {maxProducts}</span>
              </div>
              <div className="h-1.5 w-full bg-[#d0e0ef] rounded-full overflow-hidden">
                <div className="h-full bg-[#206bc4] rounded-full" style={{ width: `${productsPercent}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="font-semibold text-[#1f3f62]">Monthly Offers</span>
                <span className="text-[#3b638a] font-medium">{offersUsage} / {maxOffers}</span>
              </div>
              <div className="h-1.5 w-full bg-[#d0e0ef] rounded-full overflow-hidden">
                <div className="h-full bg-[#206bc4] rounded-full" style={{ width: `${offersPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="font-semibold text-[#1f3f62]">Offer Duration</span>
                <span className="text-[#3b638a] font-medium">{plan.planFeatures?.maxOfferDurationDays} Days Max</span>
              </div>
              <div className="h-1.5 w-full bg-[#d0e0ef] rounded-full overflow-hidden">
                <div className="h-full bg-[#206bc4] rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (plan.planType === "PREMIUM") {
    return (
      <div className="rounded-[12px] border border-[#f3d994] bg-[#fffcf3] p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-3 w-3 rounded-full bg-[#d18c00]"></span>
            <h3 className="text-[18px] font-bold text-[#d18c00]">Premium</h3>
          </div>
          <p className="text-[14px] text-[#8f6409] font-medium">✓ Unlimited Products • ✓ Unlimited Offers</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <p className="text-[14px] font-bold text-[#b07804]">Thank you for being a Premium Merchant.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default function MerchantDashboardPage() {
  const router = useRouter();
  const { user, loading, logout, getUserAccountType } = useAuth();
  const [summary, setSummary] = useState(null);
  const [realtimeAnalytics, setRealtimeAnalytics] = useState(null);
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [loyaltyLeaderboard, setLoyaltyLeaderboard] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/dashboard");
      return;
    }

    if (!loading && user) {
      const accountType = user?.accountType || getUserAccountType();
      if (accountType !== "merchant") {
        router.replace("/");
      }
    }
  }, [loading, user, router, getUserAccountType]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!user || (user?.accountType || getUserAccountType()) !== "merchant") return;
      try {
        const [summaryRes, realtimeRes, profileRes] = await Promise.allSettled([
          getMerchantDashboardSummary(),
          getMerchantRealtimeAnalytics(),
          getMerchantProfile(),
        ]);

        if (summaryRes.status === "fulfilled") {
          setSummary(summaryRes.value?.data || null);
        }

        if (realtimeRes.status === "fulfilled") {
          setRealtimeAnalytics(realtimeRes.value?.data || null);
        }

        if (profileRes && profileRes.status === "fulfilled") {
          setMerchantProfile(profileRes.value?.data || null);
        }

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to load dashboard summary:", err);
      }
    };

    loadSummary();

    // Poll for real-time updates every 10 seconds
    const interval = setInterval(loadSummary, 10000);

    return () => clearInterval(interval);
  }, [user, getUserAccountType]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#efefef]" />;
  }

  const accountType = user?.accountType || getUserAccountType();
  if (accountType !== "merchant") return null;

  const storeAvatar =
    merchantProfile?.profilePhoto ||
    merchantProfile?.shopPhoto ||
    user?.profilePhoto ||
    user?.shopPhoto ||
    "";

  const redemptionTrend = realtimeAnalytics?.redemptions || {};
  const redemptionLabels = redemptionTrend.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const redemptionValues = (redemptionTrend.values && redemptionTrend.values.length > 0)
    ? redemptionTrend.values
    : [0, 0, 0, 0, 0, 0, 0];
  const maxRedemptionValue = Math.max(1, ...redemptionValues);
  const chartWidth = 702;
  const chartHeight = 240;
  const chartPadding = 18;
  const redemptionPoints = redemptionValues
    .map((value, index) => {
      const x = chartPadding + ((chartWidth - chartPadding * 2) / Math.max(redemptionValues.length - 1, 1)) * index;
      const y = chartHeight - chartPadding - ((chartHeight - chartPadding * 2) * value) / maxRedemptionValue;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="dashboard" />

      <main className="w-full px-4 py-4 lg:px-10 lg:py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-4 lg:space-y-5">
          <section className="rounded-[12px] border border-[#d5d5d5] bg-white px-4 py-4 lg:px-6 lg:py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-[#dadada] lg:h-14 lg:w-14">
                  <Image src={storeAvatar || "/images/deal2.avif"} alt={merchantProfile?.shopName || merchantProfile?.storeName || user?.shopName || "My Store"} width={56} height={56} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-[#737373]">Open Now • Last updated {Math.floor((new Date() - lastUpdated) / 60000)} mins ago</p>
                  <h1 className="mt-1 truncate text-[28px] leading-none font-bold text-[#1f1f1f] lg:text-[44px]">{merchantProfile?.shopName || merchantProfile?.storeName || "My Store"}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-[#424242] lg:gap-6 lg:text-[14px]">
                    <span className="inline-flex items-center gap-1"><ShoppingBag size={14} className="text-[#157a4f]" /> <span className="font-bold text-[22px] leading-none lg:text-[30px]">{summary?.stats?.totalOrders || 0}</span> Total Orders</span>
                    <span className="inline-flex items-center gap-1"><Star size={14} className="text-[#e9aa1d]" /> <span className="font-bold text-[22px] leading-none lg:text-[30px]">{summary?.stats?.averageRating || 0}</span> Store Rating</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 mt-1 sm:w-auto">
                <button className="h-9 flex-1 px-3 rounded-[8px] border border-[#d5d5d5] bg-white text-[11px] font-semibold text-[#343434] inline-flex items-center justify-center gap-2 lg:h-10 lg:flex-none lg:px-4 lg:text-[12px]">
                  <Download size={13} /> Export Reports
                </button>
                <button onClick={() => router.push("/merchant/add-new-listing")} className="h-9 flex-1 px-3 rounded-[8px] bg-[#1f8f4f] text-white text-[11px] font-semibold inline-flex items-center justify-center gap-2 lg:h-10 lg:flex-none lg:px-4 lg:text-[12px]">
                  <Plus size={13} /> Add New Listing
                </button>
              </div>
            </div>
          </section>

          <PlanBanner plan={merchantProfile?.plan} />

          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-5">
            <div className="rounded-[12px] border border-[#d8d8d8] bg-white p-4 lg:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-[21px] font-bold leading-none lg:text-[28px]">Shop Redemptions ↗</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f7ee] px-2.5 py-1 text-[10px] font-semibold text-[#1f8f4f]">
                      <span className="h-2 w-2 rounded-full bg-[#1f8f4f]" /> Live
                    </span>
                  </div>
                  <p className="text-[12px] text-[#666] mt-1">
                    {(redemptionTrend.total ?? 0)} redemptions this week • updated every 10s
                  </p>
                </div>
                <div className="inline-flex rounded-[7px] border border-[#dddddd] overflow-hidden text-[10px]">
                  <button className="h-7 px-3 bg-[#f8f8f8] font-semibold">Weekly</button>
                  <button className="h-7 px-3 bg-white text-[#666]">Monthly</button>
                </div>
              </div>

              <div className="mt-4 rounded-[10px] bg-[#fbfbfb] border border-[#ececec] p-3">
                <div className="mb-3 flex items-center justify-between text-[11px] text-[#6b6b6b]">
                  <p>Live merchant-side redemption activity</p>
                  <p>Today: <span className="font-semibold text-[#1f8f4f]">{redemptionTrend.today ?? redemptionValues[redemptionValues.length - 1] ?? 0}</span></p>
                </div>
                <svg viewBox="0 0 760 320" className="h-[190px] w-full lg:h-[300px]">
                  {[280, 220, 160, 100, 40].map((y) => (
                    <g key={y}>
                      <line x1="38" y1={320 - y} x2="740" y2={320 - y} stroke="#d8d8d8" strokeDasharray="4 4" />
                      <text x="2" y={324 - y} fontSize="10" fill="#888">{Math.round((maxRedemptionValue * y) / 280)}</text>
                    </g>
                  ))}

                  <polyline
                    fill="none"
                    stroke="#219653"
                    strokeWidth="2.5"
                    points={redemptionPoints}
                  />

                  {redemptionValues.map((value, index) => {
                    const x = chartPadding + ((chartWidth - chartPadding * 2) / Math.max(redemptionValues.length - 1, 1)) * index;
                    const y = chartHeight - chartPadding - ((chartHeight - chartPadding * 2) * value) / maxRedemptionValue;
                    return (
                      <g key={`${redemptionLabels[index] || index}-${index}`}>
                        <circle cx={x} cy={y} r="3.5" fill="#219653" />
                        <text x={x} y="314" textAnchor="middle" fontSize="10" fill="#8a8a8a">{redemptionLabels[index] || ""}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[10px] border border-[#dce8dd] bg-[#eef6ef] p-4">
                <p className="text-[10px] uppercase tracking-wide text-[#79927c]">Order Placed</p>
                <p className="mt-1 text-[34px] font-extrabold leading-none text-[#223322] lg:text-[46px]">{summary?.stats?.totalOrders || 0}</p>
                <p className="text-[12px] text-[#4a5a4b] mt-1">Last 7 Days <span className="text-[#2e9f5a]">+12%</span></p>
              </div>

              <div className="rounded-[10px] border border-[#ebe3cf] bg-[#f8f4e8] p-4">
                <p className="text-[10px] uppercase tracking-wide text-[#98835a]">Revenue Earned</p>
                <p className="mt-1 text-[34px] font-extrabold leading-none text-[#4b3913] lg:text-[46px]">₹{summary?.stats?.revenue || 0}</p>
                <p className="text-[12px] text-[#7f6a42] mt-1">Last 7 Days <span className="text-[#9d6a1d]">+8.5%</span></p>
              </div>

              <div className="rounded-[10px] bg-[#f0ab19] p-4 text-white shadow-sm lg:p-5">
                <p className="text-[24px] font-extrabold leading-none lg:text-[34px]">See your shop as a customer</p>
                <p className="mt-2 text-[12px] text-[#fff4da]">Open the customer app to see your shop exactly how customers see it. Experience your brand firsthand.</p>
                <button className="mt-4 h-10 w-full rounded-[8px] bg-white text-[#d18c00] text-[12px] font-semibold">Tap to explore ↗</button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5">
            <div className="rounded-[12px] border border-[#d8d8d8] bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-[#ececec] flex items-center justify-between">
                <h3 className="text-[23px] font-bold leading-none lg:text-[31px]">Recent Orders</h3>
                <button className="text-[12px] font-semibold text-[#1e8b4f]">View All Orders</button>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {(summary?.recentOrders || orders).map((order) => (
                  <div key={order._id || order.id || order.orderNumber} className="px-3 py-3 border-b border-[#f0f0f0] last:border-b-0 flex items-center gap-3 lg:px-4">
                    <div className="h-8 w-8 rounded-full bg-[#ebf8ef] border border-[#cce9d4] text-[#1f8f4f] flex items-center justify-center">
                      <Box size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[#252525]">Order {order.id || `#${order.orderNumber || String(order._id || '').slice(-6)}`}</p>
                      <p className="text-[11px] text-[#858585]">{order.time || `Placed ${new Date(order.placedAt).toLocaleString()}`}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-[16px] font-bold text-[#202020]">{typeof order.amount === 'string' ? order.amount : `₹${order.amount || 0}`}</p>
                      <p className="text-[9px] uppercase text-[#8a8a8a]">Amount</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-[16px] font-bold text-[#202020]">{order.qty || `${order.itemsCount || 1} items`}</p>
                      <p className="text-[9px] uppercase text-[#8a8a8a]">Quantity</p>
                    </div>
                    <button className="text-[#9a9a9a] hover:text-[#333]"><ChevronRight size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-[#d8d8d8] bg-white p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[23px] font-bold leading-none lg:text-[31px]">Latest Reviews</h3>
                <button className="text-[#888]">⋮</button>
              </div>

              <div className="mt-3 max-h-[360px] overflow-y-auto space-y-3">
                {(summary?.latestReviews || latestReviews).map((review) => (
                  <article key={review._id || review.name || review.userName} className="rounded-[10px] border border-[#ececec] bg-[#fbfbfb] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full overflow-hidden border border-[#ddd]">
                          <Image src={review.avatar || "/images/place2.avif"} alt={review.name || "Customer"} width={28} height={28} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold">{review.name || review.userName || "Customer"}</p>
                          <p className="text-[10px] text-[#f0aa19]">{review.rating ? "★".repeat(review.rating) : "★★★★★"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#888]">{review.time || new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-[#5a5a5a]">"{review.text || review.content}"</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-4 bg-[#e8ad2f] border-t border-[#d49b22] text-[#2f2a1f] lg:mt-6">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 grid grid-cols-2 gap-4 text-[12px] md:grid-cols-4 lg:px-10 lg:py-6 lg:gap-8 lg:text-base">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-[3px] bg-[#0f7d49] text-white text-[20px] font-bold flex items-center justify-center leading-none lg:h-8 lg:w-8 lg:text-[26px]">G</div>
              <span className="text-[24px] leading-none font-semibold text-[#0f7d49] lg:text-[34px]">GOLO</span>
            </div>
            <p className="mt-2 text-[11px] max-w-[250px] lg:mt-3 lg:text-[12px]">The all-in-one management platform for modern businesses.</p>
          </div>
          <div>
            <p className="text-[15px] font-bold lg:text-[20px]">Links</p>
            <div className="mt-2 space-y-1 text-[12px] lg:mt-3 lg:space-y-2 lg:text-[13px]"><p>Overview</p><p>Inventory</p><p>Posts</p><p>Profile</p></div>
          </div>
          <div className="space-y-1 text-[12px] md:pt-9 lg:space-y-2 lg:text-[13px]"><p>Analytics</p><p>Contact</p></div>
          <div>
            <p className="text-[15px] font-bold lg:text-[20px]">Support</p>
            <div className="mt-2 space-y-1 text-[12px] lg:mt-3 lg:space-y-2 lg:text-[13px]"><p>Help Center</p><p>Security</p><p>Terms of Service</p></div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 py-2 border-t border-[#d49b22] flex items-center justify-between gap-3 text-[10px] lg:px-10 lg:py-3 lg:text-[11px]"><p>© 2026 GOLO Dashboard. All rights reserved.</p></div>
      </footer>
    </div>
  );
}
