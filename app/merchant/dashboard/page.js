"use client";

import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  IndianRupee,
  Users,
  Tag,
  Heart,
  Calendar,
  Gift,
  MousePointerClick,
  TrendingUp,
  ShoppingCart,
  MoreVertical,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import MerchantPlanBanner from "../MerchantPlanBanner";
import {
  getMerchantDashboardSummary,
  getMerchantProfile,
  getMerchantRealtimeAnalytics,
} from "../../lib/api";
function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return days === 1 ? "Yesterday" : days + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hr ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " min ago";
  return Math.floor(seconds) + " sec ago";
}

function MerchantDashboardContent() {
  const router = useRouter();
  const { user, loading, getUserAccountType } = useAuth();
  const [summary, setSummary] = useState(null);
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [realtimeAnalytics, setRealtimeAnalytics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [graphPeriod, setGraphPeriod] = useState("weekly");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/dashboard");
      return;
    }
    if (!loading && user && (user?.accountType || getUserAccountType()) !== "merchant") {
      router.replace("/");
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
        if (summaryRes.status === "fulfilled") setSummary(summaryRes.value?.data || null);
        if (realtimeRes.status === "fulfilled") setRealtimeAnalytics(realtimeRes.value?.data || null);
        if (profileRes.status === "fulfilled") setMerchantProfile(profileRes.value?.data || null);
        setLastUpdated(new Date());
      } catch (err) {}
    };
    loadSummary();
    const interval = setInterval(loadSummary, 10000);
    return () => clearInterval(interval);
  }, [user, getUserAccountType]);

  if (loading || !user) return <div className="min-h-screen bg-[#FAFAFA]" />;

  const shopName = merchantProfile?.shopName || merchantProfile?.storeName || user?.shopName || "Mahalakshmi Chembers";
  const initials = shopName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "MC";

  const getGraphData = () => {
    const data = summary?.performanceGraph?.[graphPeriod] || [];
    if (!data.length) return { labels: [], revenuePoints: [], orderPoints: [], redemptionPoints: [], conversionPoints: [], maxRev: 1000 };
    
    const maxRev = Math.max(...data.map(d => d.revenue), 1000);
    const maxOrd = Math.max(...data.map(d => d.orders), 10);
    const maxRed = Math.max(...data.map(d => d.redemption), 10);
    const maxConv = Math.max(...data.map(d => d.conversion), 10);
    
    const xStep = 720 / Math.max(data.length - 1, 1);
    
    return {
      labels: data.map(d => d.label),
      revenuePoints: data.map((d, i) => ({ x: 40 + i * xStep, y: 220 - (d.revenue / maxRev) * 160 })),
      orderPoints: data.map((d, i) => ({ x: 40 + i * xStep, y: 219 - (d.orders / maxOrd) * 160 })),
      redemptionPoints: data.map((d, i) => ({ x: 40 + i * xStep, y: 218 - (d.redemption / maxRed) * 160 })),
      conversionPoints: data.map((d, i) => ({ x: 40 + i * xStep, y: 217 - (d.conversion / maxConv) * 160 })),
      maxRev
    };
  };
  
  const generatePath = (points) => {
    if (!points || points.length === 0) return "";
    return points.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `L${p.x} ${p.y}`)).join(" ");
  };

  const gData = getGraphData();

  const totalOrders = summary?.stats?.totalOrders ?? 0;
  const revenue = summary?.stats?.revenue ? `₹${summary?.stats?.revenue.toLocaleString('en-IN')}` : "₹0";
  const customers = summary?.stats?.customers ?? 0;
  const activeOffers = summary?.stats?.activeOffers !== undefined ? `${summary.stats.activeOffers} Active` : "0 Active";
  const followers = summary?.stats?.followers ?? 0;

  const renderStatusPill = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "active":
        return <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[11px] font-medium border border-[#D1FAE5]">Delivered</span>;
      case "pending":
        return <span className="px-2 py-0.5 rounded bg-[#FFFBEB] text-[#D97706] text-[11px] font-medium border border-[#FEF3C7]">Pending</span>;
      case "packed":
        return <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[11px] font-medium border border-[#DBEAFE]">Packed</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] text-[11px] font-medium border border-[#FEE2E2]">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] text-[11px] font-medium border border-[#E5E7EB]">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-poppins">
      <MerchantNavbar activeKey="dashboard" />

      <main className="w-full px-4 py-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          
          <MerchantPlanBanner merchantProfile={merchantProfile} />

          {/* Header Section */}
          <section className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-[#F59E0B] flex items-center justify-center text-[#F59E0B] text-xl font-bold bg-orange-50">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">{shopName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#157A4F] text-[11px] font-bold rounded">Open</span>
                  <span className="text-[12px] text-gray-500">Last updated {Math.floor((new Date() - lastUpdated) / 60000)} min ago</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-[#F59E0B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-4 h-4 ${star <= (summary?.stats?.averageRating || 0) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <span className="text-[13px] font-bold text-gray-800">{summary?.stats?.averageRating ? summary.stats.averageRating.toFixed(1) : "0.0"}</span>
                  <span className="text-[13px] text-gray-500">({summary?.stats?.totalReviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                <Download size={16} /> Export CSV
              </button>
              <button onClick={() => router.push("/merchant/offers/create")} className="flex items-center gap-2 px-4 py-2 bg-[#157A4F] text-white rounded-md text-sm font-medium hover:bg-[#10623E] transition-colors">
                <Plus size={16} /> Add New Offer
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-0 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar size={14} className="text-[#157A4F]" />
                <span className="text-[12px] font-medium">Total Orders</span>
              </div>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <IndianRupee size={14} className="text-[#157A4F]" />
                <span className="text-[12px] font-medium">Revenue</span>
              </div>
              <p className="text-2xl font-bold">{revenue}</p>
            </div>
            <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users size={14} className="text-[#3B82F6]" />
                <span className="text-[12px] font-medium">Customers</span>
              </div>
              <p className="text-2xl font-bold">{customers}</p>
            </div>
            <div className="p-4 border-r md:border-b-0 border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Tag size={14} className="text-[#157A4F]" />
                <span className="text-[12px] font-medium">Active Offers</span>
              </div>
              <p className="text-2xl font-bold">{activeOffers}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Heart size={14} className="text-[#EF4444]" />
                <span className="text-[12px] font-medium">Followers</span>
              </div>
              <p className="text-2xl font-bold">{followers}</p>
            </div>
          </section>

          {/* Main 2-Column Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              {/* Offers Performance Chart */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">Offers Performance</h2>
                    <HelpCircle size={14} className="text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-md border border-gray-200 p-0.5 text-[12px]">
                      <button onClick={() => setGraphPeriod('weekly')} className={`px-3 py-1 rounded-sm font-medium shadow-sm ${graphPeriod === 'weekly' ? 'bg-white text-[#157A4F]' : 'text-gray-500 hover:text-gray-700'}`}>Weekly</button>
                      <button onClick={() => setGraphPeriod('monthly')} className={`px-3 py-1 rounded-sm font-medium shadow-sm ${graphPeriod === 'monthly' ? 'bg-white text-[#157A4F]' : 'text-gray-500 hover:text-gray-700'}`}>Monthly</button>
                      <button onClick={() => setGraphPeriod('yearly')} className={`px-3 py-1 rounded-sm font-medium shadow-sm ${graphPeriod === 'yearly' ? 'bg-white text-[#157A4F]' : 'text-gray-500 hover:text-gray-700'}`}>Yearly</button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-[11px] font-bold text-[#4B5563] mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#10B981] rounded-full"></div> Orders</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#3B82F6] rounded-full"></div> Revenue (₹)</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#F59E0B] rounded-full"></div> Redemption</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#8B5CF6] rounded-full"></div> Conversion Rate (%)</div>
                </div>

                <div className="relative h-[250px] w-full mt-4">
                  <svg viewBox="0 0 800 250" className="w-full h-full overflow-visible">
                    {/* Y Axis Lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                      const y = 220 - (i * 40);
                      const val = (gData.maxRev / 4) * i;
                      const formattedVal = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val);
                      return (
                        <g key={i}>
                          <line x1="40" y1={y} x2="760" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                          <text x="30" y={y + 4} fontSize="10" fill="#9CA3AF" textAnchor="end">{formattedVal}</text>
                          <text x="770" y={y + 4} fontSize="10" fill="#9CA3AF" textAnchor="start">{i * 25}%</text>
                        </g>
                      );
                    })}
                    
                    {/* X Axis Labels */}
                    {gData.labels.map((label, i) => (
                      <text key={`xl-${i}`} x={40 + (i * (720 / Math.max(gData.labels.length - 1, 1)))} y="240" fontSize="10" fill="#9CA3AF" textAnchor="middle">{label}</text>
                    ))}

                    {/* Blue Line (Revenue) */}
                    <path d={generatePath(gData.revenuePoints)} fill="none" stroke="#3B82F6" strokeWidth="2" />
                    {gData.revenuePoints.map((p, i) => (
                      <circle key={`blue-${i}`} cx={p.x} cy={p.y} r="3" fill="#3B82F6" />
                    ))}

                    {/* Green Line (Orders) */}
                    <path d={generatePath(gData.orderPoints)} fill="none" stroke="#10B981" strokeWidth="2" />
                    {gData.orderPoints.map((p, i) => (
                      <circle key={`green-${i}`} cx={p.x} cy={p.y} r="3" fill="#10B981" />
                    ))}

                    {/* Yellow Line (Redemption) */}
                    <path d={generatePath(gData.redemptionPoints)} fill="none" stroke="#F59E0B" strokeWidth="2" />
                    {gData.redemptionPoints.map((p, i) => (
                      <circle key={`yellow-${i}`} cx={p.x} cy={p.y} r="3" fill="#F59E0B" />
                    ))}

                    {/* Purple Line (Conversion) */}
                    <path d={generatePath(gData.conversionPoints)} fill="none" stroke="#8B5CF6" strokeWidth="2" />
                    {gData.conversionPoints.map((p, i) => (
                      <circle key={`purple-${i}`} cx={p.x} cy={p.y} r="3" fill="#8B5CF6" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Top Performing Offers */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Top Performing Offers</h3>
                  <button className="text-[13px] font-bold text-[#157A4F] flex items-center gap-1 hover:underline">
                    View All Offers <ArrowRight size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="text-[#6B7280] text-[12px] border-b border-gray-100">
                        <th className="pb-3 font-medium">Offer</th>
                        <th className="pb-3 font-medium">Redeemed</th>
                        <th className="pb-3 font-medium">Revenue</th>
                        <th className="pb-3 font-medium">Conversion</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px] text-gray-900 font-bold">
                      {(summary?.topPerformingOffers || []).map((offer) => (
                        <tr key={offer._id}>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 relative">
                                <img src={offer.imageUrl || "/images/default-offer.png"} alt={offer.title} onError={(e) => { e.target.style.display='none'; }} className="w-full h-full object-cover" />
                              </div>
                              {offer.title}
                            </div>
                          </td>
                          <td className="py-3 text-gray-600">{offer.redeemed}</td>
                          <td className="py-3 text-gray-600">₹{Number(offer.revenue).toLocaleString('en-IN')}</td>
                          <td className="py-3 text-gray-600">{offer.conversion}%</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                offer.status === 'active' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-gray-100 text-gray-600'
                              }`}>
                              {offer.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Recent Orders</h3>
                  <button 
                    className="text-[13px] font-bold text-[#157A4F] flex items-center gap-1 hover:underline"
                    onClick={() => router.push('/merchant/orders')}
                  >
                    View All Orders <ArrowRight size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="text-[#6B7280] text-[12px] border-b border-gray-100">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px] text-gray-900 font-bold">
                      {(summary?.recentOrders || []).map((order) => (
                        <tr key={order._id}>
                          <td className="py-3 text-gray-500">#{order.orderNumber}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold">
                                {order.customerName?.[0] || 'C'}
                              </div>
                              {order.customerName || 'Customer'}
                            </div>
                          </td>
                          <td className="py-3">₹{order.amount}</td>
                          <td className="py-3">{renderStatusPill(order.status)}</td>
                          <td className="py-3 text-right text-gray-500 font-medium">{timeAgo(order.placedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* Today's Activity */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-lg font-bold mb-5">Today's Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981]"><Calendar size={14} /></div>
                      <span className="text-sm font-medium text-gray-600">Today's Orders</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-bold">{summary?.todayActivity?.todayOrders ?? 145}</p> <span className="text-[#10B981] text-[11px] font-semibold flex items-center">↑ 12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981]"><IndianRupee size={14} /></div>
                      <span className="text-sm font-medium text-gray-600">Revenue</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-bold">₹{summary?.todayActivity?.todayRevenue?.toLocaleString('en-IN') ?? "18,240"}</p> <span className="text-[#10B981] text-[11px] font-semibold flex items-center">↑ 8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#8B5CF6]"><Gift size={14} /></div>
                      <span className="text-sm font-medium text-gray-600">Redeemed Coupons</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-bold">{summary?.todayActivity?.todayRedemptions ?? 58}</p> <span className="text-[#10B981] text-[11px] font-semibold flex items-center">↑ 18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]"><Users size={14} /></div>
                      <span className="text-sm font-medium text-gray-600">Visitors</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-bold">{summary?.todayActivity?.todayVisitors ?? 423}</p> <span className="text-[#10B981] text-[11px] font-semibold flex items-center">↑ 9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#F97316]"><TrendingUp size={14} /></div>
                      <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-bold">{summary?.todayActivity?.todayConversionRate ?? "4.8"}%</p> <span className="text-[#10B981] text-[11px] font-semibold flex items-center">↑ 1.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981]"><ShoppingCart size={14} /></div>
                      <span className="text-sm font-medium text-gray-600">Average Order Value</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-sm font-bold">₹{summary?.todayActivity?.todayAvgOrderValue ?? "426"}</p> <span className="text-[#10B981] text-[11px] font-semibold flex items-center">↑ 6%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Your Store */}
              <div className="border border-[#FDE68A] bg-[#FEF3C7] rounded-xl p-5 relative overflow-hidden flex items-center justify-between">
                <div className="relative z-10 w-2/3">
                  <h3 className="text-lg font-bold text-[#92400E]">Preview Your Store</h3>
                  <p className="text-xs text-[#B45309] mt-1 mb-4 leading-relaxed font-medium">
                    See exactly how customers see your store.
                  </p>
                  <button className="bg-white text-[13px] font-bold text-gray-700 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    Open Shop <ArrowRight size={14} className="text-gray-400" />
                  </button>
                </div>
                <div className="absolute right-[-20px] top-0 bottom-0 w-1/2 flex items-center justify-end">
                  <div className="w-full h-full relative">
                    <div className="w-full h-full bg-[#f3ba3b] rounded-l-3xl shadow-lg flex items-center justify-center text-white/50 text-[10px] font-bold">Preview</div>
                  </div>
                </div>
              </div>

              {/* Latest Reviews */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold">Latest Reviews</h3>
                  <button className="text-[13px] font-bold text-[#157A4F] flex items-center gap-1 hover:underline">
                    View All Reviews <ArrowRight size={14} />
                  </button>
                </div>
                <div className="space-y-4">
                  {(summary?.latestReviews || []).map((review) => (
                    <div key={review._id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                            {review.userName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                            <div className="flex items-center text-[#F59E0B]">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium">{timeAgo(review.createdAt)}</span>
                      </div>
                      <p className="text-[13px] text-gray-600 font-medium ml-11">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FF9800] text-[#111827] pt-10 pb-6 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-[#157A4F] text-white flex items-center justify-center font-bold text-xl">G</div>
              <span className="text-2xl font-bold text-[#157A4F]">GOLO</span>
            </div>
            <p className="text-[13px] font-semibold max-w-[250px] leading-relaxed">
              Manage your store, promotions, orders, and customer engagement from one merchant dashboard.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Facebook size={18} className="cursor-pointer hover:opacity-80" />
              <Instagram size={18} className="cursor-pointer hover:opacity-80" />
              <Linkedin size={18} className="cursor-pointer hover:opacity-80" />
              <Youtube size={18} className="cursor-pointer hover:opacity-80" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[15px] mb-4 text-[#111827]">Quick Links</h4>
            <ul className="space-y-3 text-[13px] font-semibold">
              <li><Link href="/merchant/orders" className="hover:underline">Orders</Link></li>
              <li><Link href="/merchant/products" className="hover:underline">Products</Link></li>
              <li><Link href="/merchant/offers" className="hover:underline">Offers</Link></li>
              <li><Link href="/merchant/banners" className="hover:underline">Banners</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[15px] mb-4 text-[#111827]">Support</h4>
            <ul className="space-y-3 text-[13px] font-semibold">
              <li><Link href="#" className="hover:underline">Settings</Link></li>
              <li><Link href="#" className="hover:underline">Help Center</Link></li>
              <li><Link href="#" className="hover:underline">Contact Us</Link></li>
              <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[15px] mb-4 text-[#111827]">Stay Updated</h4>
            <p className="text-[13px] font-semibold mb-4">
              Subscribe to get tips and updates to grow your business.
            </p>
            <div className="flex items-stretch rounded overflow-hidden h-10 w-full max-w-[300px] border border-gray-100">
              <input type="email" placeholder="Enter your email" className="px-3 text-sm flex-1 text-gray-900 outline-none bg-white" />
              <button className="bg-[#157A4F] text-white px-4 text-sm font-bold hover:bg-[#10623E] transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 pt-6 border-t border-[#F57C00] flex flex-col md:flex-row items-center justify-between text-[11px] font-bold">
          <p>© 2026 GOLO Merchant Dashboard. All rights reserved.</p>
          <p>Built for smarter local business growth.</p>
        </div>
      </footer>
    </div>
  );
}

export default function MerchantDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <MerchantDashboardContent />
    </Suspense>
  );
}
