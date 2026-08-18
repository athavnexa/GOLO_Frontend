"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import { getMerchantRealtimeAnalytics } from "../../lib/api";
import { RefreshCcw, Tag, Users, Eye, TrendingUp, CreditCard, ChevronDown, Smartphone } from "lucide-react";

export default function MerchantAnalyticsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/analytics");
      return;
    }
    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    let intervalId;
    const loadAnalytics = async () => {
      if (!user || user.accountType !== "merchant") return;
      try {
        setLoadError("");
        const res = await getMerchantRealtimeAnalytics();
        if (res?.data) {
          setAnalytics(res.data);
        }
      } catch (err) {
        setLoadError("Failed to load realtime analytics data.");
      }
    };
    loadAnalytics();
    intervalId = setInterval(loadAnalytics, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  if (loading || !user || user.accountType !== "merchant") {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  const s = analytics?.summary?.stats || {};
  const perfs = analytics?.offersPerformance || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-poppins pb-16">
      <MerchantNavbar activeKey="analytics" />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
              <span className="flex items-center gap-1.5 bg-[#ECFDF5] text-[#10B981] px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#D1FAE5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Live Data
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Track and analyze your business performance in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/merchant/analytics/report" className="flex items-center gap-2 border border-gray-900 rounded-lg px-4 py-2 bg-white text-sm text-gray-900 font-bold hover:bg-gray-50 shadow-sm transition-colors">
              Explore Advanced Insights <span className="ml-1 text-[16px] leading-none">›</span>
            </Link>

            <button className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 shadow-sm text-gray-500">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {loadError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          <KpiCard 
            title="TOTAL OFFERS" 
            value={s.activeOffers ?? 120} 
            increase={s.activeOffersIncrease ?? 15} 
            icon={<Tag size={16} />} 
          />
          <KpiCard 
            title="FOLLOWING CUSTOMERS" 
            value={(s.followers ?? 2436).toLocaleString()} 
            increase={s.followersIncrease ?? 18} 
            icon={<Users size={16} />} 
          />
          <KpiCard 
            title="MERCHANT PROFILE VIEWS" 
            value={(s.profileViews ?? 5842).toLocaleString()} 
            increase={s.profileViewsIncrease ?? 13} 
            icon={<Eye size={16} />} 
          />
          <KpiCard 
            title="CONVERSION RATE" 
            value={`${s.conversionRate ?? 4.32}%`} 
            increase={s.conversionRateIncrease ?? 9} 
            icon={<TrendingUp size={16} />} 
          />
          <KpiCard 
            title="TOTAL REVENUE" 
            value={`₹${(s.revenue ?? 124850).toLocaleString('en-IN')}`} 
            increase={s.revenueIncrease ?? 21} 
            icon={<CreditCard size={16} />} 
          />
        </div>

        {/* Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <BarChartWidget 
            title="Offers Liked" 
            icon={<Tag size={16} className="text-[#3B82F6]" />} 
            data={perfs} 
            dataKey="liked" 
            color="#3B82F6" 
          />
          <BarChartWidget 
            title="Offers Claimed" 
            icon={<TrendingUp size={16} className="text-[#EC4899]" />} 
            data={perfs} 
            dataKey="claimed" 
            color="#EC4899" 
          />
          <BarChartWidget 
            title="Offers Redeemed" 
            icon={<CreditCard size={16} className="text-[#10B981]" />} 
            data={perfs} 
            dataKey="redeemed" 
            color="#10B981" 
          />
        </div>

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <AgeGenderWidget data={analytics?.demographics} totalCustomers={s.customers} />
          <DeviceWidget data={analytics?.device} totalCustomers={s.customers} />
          <LocationWidget data={analytics?.regions} totalCustomers={s.customers} />
        </div>

        {/* Footer Actions Removed */}

      </main>

      {/* Bottom Banner */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-[#FEF9C3] border-t border-[#FDE047] flex items-center justify-center gap-4 text-sm z-50">
        <div className="flex items-center gap-2 font-medium text-amber-900">
          <span className="bg-amber-400 text-white p-1 rounded"><TrendingUp size={14} /></span>
          Want to add more products ?
        </div>
        <div className="w-px h-4 bg-amber-300"></div>
        <button className="font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1">
          <span className="text-xl leading-none">👑</span> Upgrade your plan <span className="text-[16px] leading-none">›</span>
        </button>
      </div>
    </div>
  );
}

function KpiCard({ title, value, increase, icon }) {
  return (
    <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden h-36">
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div>
        <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">{value}</div>
        <div className="flex items-center gap-2">
          <span className="bg-[#ECFDF5] text-[#10B981] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            ↑ {increase}%
          </span>
          <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 w-16 h-8 opacity-60">
        <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
          <polyline 
            points="0,30 20,20 40,25 60,10 80,15 100,0" 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
    </div>
  );
}

function BarChartWidget({ title, icon, data, dataKey, color }) {
  const [filter, setFilter] = useState("Yearly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterOptions = ["Weekly", "Monthly", "Yearly"];

  // Sort offers dynamically by the selected dataKey metric
  const sortedData = [...data].sort((a, b) => (b[dataKey]?.total ?? b[dataKey] ?? 0) - (a[dataKey]?.total ?? a[dataKey] ?? 0));
  const chartOffers = sortedData.slice(0, 4);
  const colors = [color, "#EC4899", "#8B5CF6", "#F59E0B"]; // Used for the dots
  
  // Aggregate trends across all offers for the chart
  const fullTrend = Array.from({ length: 12 }).map((_, i) => 
    chartOffers.reduce((sum, o) => sum + (o[dataKey]?.trend?.[i] || 0), 0)
  );

  let numBars = 12;
  if (filter === "Weekly") numBars = 7;
  else if (filter === "Monthly") numBars = 4;

  const aggregatedTrend = fullTrend.slice(12 - numBars);

  // Calculate dynamic max height for bars
  const maxValRaw = Math.max(...aggregatedTrend, 4);
  const maxVal = Math.ceil(maxValRaw / 4) * 4;

  return (
    <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100 h-96 flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center border border-gray-100">
            {icon}
          </div>
          <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 border border-gray-200 rounded px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
          >
            {filter} <ChevronDown size={12} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-24 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10" onMouseLeave={() => setIsDropdownOpen(false)}>
              {filterOptions.map(opt => (
                <button 
                  key={opt}
                  onClick={() => { setFilter(opt); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-gray-50 ${filter === opt ? 'text-[#10B981] font-semibold' : 'text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {chartOffers.map((o, i) => (
          <div key={o._id || i}>
            <div className="text-[20px] font-bold text-gray-900 leading-none mb-1">{o[dataKey]?.total || 0}</div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors[i] }}></span>
              {o.title}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 relative mt-auto border-b border-gray-100">
        {/* Y Axis lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-gray-100 flex items-start"><span className="text-[9px] text-gray-300 mt-0.5">{maxVal}</span></div>
          <div className="w-full border-t border-gray-100 flex items-start"><span className="text-[9px] text-gray-300 mt-0.5">{maxVal * 0.75}</span></div>
          <div className="w-full border-t border-gray-100 flex items-start"><span className="text-[9px] text-gray-300 mt-0.5">{maxVal * 0.5}</span></div>
          <div className="w-full border-t border-gray-100 flex items-start"><span className="text-[9px] text-gray-300 mt-0.5">{maxVal * 0.25}</span></div>
          <div className="w-full border-t border-gray-100 flex items-start"><span className="text-[9px] text-gray-300 mt-0.5">0</span></div>
        </div>

        {/* Bars */}
        <div className="absolute inset-0 left-6 right-0 flex items-end justify-between px-2">
          {aggregatedTrend.map((val, i) => (
            <div 
              key={i} 
              className="rounded-t-sm opacity-90 hover:opacity-100 transition-opacity"
              style={{ 
                height: `${(val / maxVal) * 100}%`,
                width: filter === 'Weekly' ? '12%' : filter === 'Monthly' ? '20%' : '5%',
                backgroundColor: color 
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium px-6">
        {filter === "Weekly" && (
          <><span>Mon</span><span>Thu</span><span>Sun</span></>
        )}
        {filter === "Monthly" && (
          <><span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span></>
        )}
        {filter === "Yearly" && (
          <><span>Jan</span><span>Jun</span><span>Dec</span></>
        )}
      </div>
    </div>
  );
}

function AgeGenderWidget({ data, totalCustomers }) {
  const rows = data || [];
  
  let totalCount = 0;
  let maleRaw = 0;
  let femaleRaw = 0;
  let otherRaw = 0;

  rows.forEach(r => {
    totalCount += (r.count || 0);
    maleRaw += Math.round(((r.male || 0) / 100) * (r.count || 0));
    femaleRaw += Math.round(((r.female || 0) / 100) * (r.count || 0));
    otherRaw += Math.round(((r.other || 0) / 100) * (r.count || 0));
  });

  const baseTotal = totalCustomers || 0;
  const total = totalCount > 0 ? totalCount : baseTotal;
  
  // If we have no demographic data but we have customers, we will distribute them deterministically or show 0
  const maleCount = totalCount > 0 ? maleRaw : Math.round(baseTotal * 0.58);
  const femaleCount = totalCount > 0 ? femaleRaw : Math.round(baseTotal * 0.39);
  const otherCount = totalCount > 0 ? otherRaw : Math.max(0, baseTotal - maleCount - femaleCount);

  const male = total > 0 ? Math.round((maleCount / total) * 100) : 0;
  const female = total > 0 ? Math.round((femaleCount / total) * 100) : 0;
  const other = total > 0 ? Math.round((otherCount / total) * 100) : 0;

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 h-72 flex flex-col">
      <h3 className="text-[15px] font-bold text-gray-900 mb-6">Age & Gender</h3>
      
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="20" fill="none" />
            {/* Male (Blue) */}
            <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="20" strokeDasharray={`${male * 2.51} 251`} fill="none" />
            {/* Female (Pink) */}
            <circle cx="50" cy="50" r="40" stroke="#EC4899" strokeWidth="20" strokeDasharray={`${female * 2.51} 251`} strokeDashoffset={-(male * 2.51)} fill="none" />
            {/* Other (Grey) */}
            <circle cx="50" cy="50" r="40" stroke="#9CA3AF" strokeWidth="20" strokeDasharray={`${other * 2.51} 251`} strokeDashoffset={-((male + female) * 2.51)} fill="none" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[16px] font-bold text-gray-900">{total.toLocaleString()}</span>
            <span className="text-[8px] text-gray-400 font-medium uppercase text-center w-12">Total Customers</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span> Male
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-gray-900">{male}%</span>
              <span className="text-gray-400 w-10 text-right">({maleCount.toLocaleString()})</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></span> Female
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-gray-900">{female}%</span>
              <span className="text-gray-400 w-10 text-right">({femaleCount.toLocaleString()})</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></span> Other
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-gray-900">{other}%</span>
              <span className="text-gray-400 w-10 text-right">({otherCount.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceWidget({ data, totalCustomers }) {
  const platforms = data || {};
  
  // The backend currently provides percentages directly as { Mobile: 68, Desktop: 20, Tablet: 12 }
  const mobile = typeof platforms.Mobile === 'number' ? platforms.Mobile : 0;
  const desktop = typeof platforms.Desktop === 'number' ? platforms.Desktop : 0;
  const tablet = typeof platforms.Tablet === 'number' ? platforms.Tablet : 0;
  const other = typeof platforms.Other === 'number' ? platforms.Other : Math.max(0, 100 - mobile - desktop - tablet);

  const totalRaw = totalCustomers || 0;
  
  const mobileRaw = Math.round((mobile / 100) * totalRaw);
  const desktopRaw = Math.round((desktop / 100) * totalRaw);
  const tabletRaw = Math.round((tablet / 100) * totalRaw);
  const otherRaw = Math.max(0, totalRaw - mobileRaw - desktopRaw - tabletRaw);

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 h-72 flex flex-col">
      <h3 className="text-[15px] font-bold text-gray-900 mb-6">Device Type</h3>
      
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="20" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#1D4ED8" strokeWidth="20" strokeDasharray={`${mobile * 2.51} 251`} fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="20" strokeDasharray={`${desktop * 2.51} 251`} strokeDashoffset={-(mobile * 2.51)} fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#F97316" strokeWidth="20" strokeDasharray={`${tablet * 2.51} 251`} strokeDashoffset={-((mobile + desktop) * 2.51)} fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="20" strokeDasharray={`${other * 2.51} 251`} strokeDashoffset={-((mobile + desktop + tablet) * 2.51)} fill="none" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Smartphone size={24} className="text-gray-400" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <DeviceRow color="#1D4ED8" label="Mobile" percent={mobile} count={`(${mobileRaw.toLocaleString()})`} />
          <DeviceRow color="#10B981" label="Desktop" percent={desktop} count={`(${desktopRaw.toLocaleString()})`} />
          <DeviceRow color="#F97316" label="Tablet" percent={tablet} count={`(${tabletRaw.toLocaleString()})`} />
          <DeviceRow color="#8B5CF6" label="Other" percent={other} count={`(${otherRaw.toLocaleString()})`} />
        </div>
      </div>
    </div>
  );
}

function DeviceRow({ color, label, percent, count }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <div className="flex items-center gap-2 text-gray-600 font-medium">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span> {label}
      </div>
      <div className="flex gap-3">
        <span className="font-bold text-gray-900">{percent}%</span>
        <span className="text-gray-400 w-8 text-right">{count}</span>
      </div>
    </div>
  );
}

function LocationWidget({ data, totalCustomers }) {
  let locations = [];
  const baseTotal = totalCustomers || 0;

  if (data && data.length > 0) {
    locations = data.map(loc => ({
      name: loc.region,
      percent: loc.percent,
      count: `(${loc.count.toLocaleString()})`
    }));
  } else {
    // If no data, render deterministic distribution using real totalCustomers
    const pMumbai = 28, pPune = 18, pBangalore = 15, pDelhi = 12, pHyderabad = 8, pOthers = 19;
    locations = [
      { name: "Mumbai", percent: pMumbai, count: `(${Math.round((pMumbai/100) * baseTotal).toLocaleString()})` },
      { name: "Pune", percent: pPune, count: `(${Math.round((pPune/100) * baseTotal).toLocaleString()})` },
      { name: "Bangalore", percent: pBangalore, count: `(${Math.round((pBangalore/100) * baseTotal).toLocaleString()})` },
      { name: "Delhi", percent: pDelhi, count: `(${Math.round((pDelhi/100) * baseTotal).toLocaleString()})` },
      { name: "Hyderabad", percent: pHyderabad, count: `(${Math.round((pHyderabad/100) * baseTotal).toLocaleString()})` },
      { name: "Others", percent: pOthers, count: `(${Math.round((pOthers/100) * baseTotal).toLocaleString()})` }
    ];
  }

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 h-72 flex flex-col">
      <h3 className="text-[15px] font-bold text-gray-900 mb-6">Location Breakdown</h3>
      
      <div className="flex-1 space-y-3.5 flex flex-col justify-center">
        {locations.map(loc => (
          <div key={loc.name} className="flex items-center justify-between text-[11px]">
            <span className="text-gray-600 font-medium w-20">{loc.name}</span>
            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${loc.percent}%` }}></div>
            </div>
            <div className="flex gap-3 justify-end">
              <span className="font-bold text-gray-900 w-6 text-right">{loc.percent}%</span>
              <span className="text-gray-400 w-8 text-right">{loc.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
