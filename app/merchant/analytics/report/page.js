"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown, Download, Tag, ShoppingBag, Users, Search, Filter, ArrowUpDown, LayoutGrid, MoreVertical, Heart, TrendingUp, TrendingDown, Star } from "lucide-react";
import MerchantNavbar from "../../MerchantNavbar";

export default function AnalyticsReportPage() {
  const [activeTab, setActiveTab] = useState("offers");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans pb-16">
      <MerchantNavbar activeKey="analytics" />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        
        {/* Back Link */}
        <Link href="/merchant/analytics" className="inline-flex items-center gap-1 text-[#10B981] font-medium text-sm mb-4 hover:underline">
          <ChevronLeft size={16} /> Back to Analytics
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Report</h1>
            <p className="text-sm text-gray-500 mt-1">Complete data and insights in one place</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm text-gray-600 font-medium hover:bg-gray-50 shadow-sm">
                <span className="text-gray-400">📅</span> 9 Jul 2026 - 5 Aug 2026 <ChevronDown size={14} className="ml-4" />
              </button>
              <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm text-[#10B981] font-medium hover:bg-gray-50 shadow-sm">
                <Download size={16} /> Export CSV
              </button>
            </div>
            <span className="text-[11px] text-gray-400">Last Updated: 05 Aug 2026 3:16 PM 🔄</span>
          </div>
        </div>

        {/* Segmented Controls */}
        <div className="flex gap-4 mb-8">
          <TabButton 
            active={activeTab === "offers"} 
            onClick={() => setActiveTab("offers")}
            icon={<Tag size={16} />} 
            label="Offers" 
          />
          <TabButton 
            active={activeTab === "products"} 
            onClick={() => setActiveTab("products")}
            icon={<ShoppingBag size={16} />} 
            label="Products" 
          />
          <TabButton 
            active={activeTab === "retention"} 
            onClick={() => setActiveTab("retention")}
            icon={<Users size={16} />} 
            label="Customer Retention" 
          />
        </div>

        {/* Tab Content */}
        {activeTab === "offers" && <OffersTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "retention" && <RetentionTab />}

      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-bold border transition-colors ${
        active 
          ? "bg-[#10B981] text-white border-[#10B981] shadow-sm" 
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* =========================================
   1. OFFERS TAB
========================================= */
function OffersTab() {
  const tableData = [
    { id: 1, offer: "Summer Sale", product: "Wireless Earbuds", likes: 42 },
    { id: 2, offer: "Buy 1 Get 1", product: "Smart Watch", likes: 24 },
    { id: 3, offer: "Flat 20% Off", product: "Bluetooth Speaker", likes: 12 },
    { id: 4, offer: "Free Shipping", product: "Gaming Mouse", likes: 6 },
    { id: 5, offer: "Weekend Special", product: "Keyboard", likes: 4 },
    { id: 6, offer: "Refer & Earn", product: "Laptop Stand", likes: 3 },
    { id: 7, offer: "Welcome Offer", product: "Power Bank", likes: 2 },
    { id: 8, offer: "Welcome Offer", product: "Power Bank", likes: 2 },
    { id: 9, offer: "Welcome Offer", product: "Power Bank", likes: 2 },
    { id: 10, offer: "Welcome Offer", product: "Power Bank", likes: 2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportKpiCard icon={<Tag size={20} />} title="Total Offers" value="15" sub="All offers in selected period" />
        <ReportKpiCard icon={<Heart size={20} />} title="Total Likes" value="128" sub="Across all offers" />
        <ReportKpiCard icon={<Star size={20} />} title="Best Performing Offer" value="Summer Sale" sub="42 likes (32.8%)" valueColor="text-[#10B981]" />
        <ReportKpiCard icon={<ShoppingBag size={20} />} title="Top Product" value="Wireless Earbuds" sub="68 likes from all offers" valueColor="text-[#10B981]" />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar placeholder="Search offers or products..." />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Offer Name</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Total Likes <ArrowUpDown size={12}/></th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-gray-500">{row.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{row.offer}</td>
                  <td className="py-4 px-6 text-gray-500">{row.product}</td>
                  <td className="py-4 px-6 font-bold text-gray-900 text-[#10B981]">{row.likes}</td>
                  <td className="py-4 px-6"><button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination start={1} end={10} total={15} />
      </div>
    </div>
  );
}

/* =========================================
   2. PRODUCTS TAB
========================================= */
function ProductsTab() {
  const tableData = [
    { id: 1, product: "Wireless Earbuds", likes: 68, trend: 12 },
    { id: 2, product: "Smart Watch", likes: 42, trend: 8 },
    { id: 3, product: "Bluetooth Speaker", likes: 20, trend: -3 },
    { id: 4, product: "Gaming Mouse", likes: 12, trend: 5 },
    { id: 5, product: "Keyboard", likes: 8, trend: 2 },
    { id: 6, product: "Laptop Stand", likes: 7, trend: 10 },
    { id: 7, product: "Power Bank", likes: 6, trend: -1 },
    { id: 8, product: "Wireless Charger", likes: 5, trend: 6 },
    { id: 9, product: "Phone Case", likes: 4, trend: -2 },
    { id: 10, product: "USB Cable", likes: 3, trend: 1 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportKpiCard icon={<ShoppingBag size={20} />} title="Total Products" value="52" sub="All products in selected period" />
        <ReportKpiCard icon={<Heart size={20} />} title="Total Likes" value="256" sub="Across all products" />
        <ReportKpiCard icon={<Star size={20} />} title="Most Liked Product" value="Wireless Earbuds" sub="68 likes (26.6%)" valueColor="text-[#10B981]" />
        <ReportKpiCard icon={<TrendingUp size={20} />} title="Performance" value="↑ 24%" sub="vs last 30 days" valueColor="text-[#10B981]" />
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar placeholder="Search products..." />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Total Likes <ArrowUpDown size={12}/></th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trend (Vs Last 30 Days)</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-gray-500">{row.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{row.product}</td>
                  <td className="py-4 px-6 font-bold text-[#10B981]">{row.likes}</td>
                  <td className="py-4 px-6 font-medium">
                    {row.trend > 0 ? (
                      <span className="text-[#10B981]">↑ {row.trend}%</span>
                    ) : (
                      <span className="text-red-500">↓ {Math.abs(row.trend)}%</span>
                    )}
                  </td>
                  <td className="py-4 px-6"><button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination start={1} end={10} total={52} />
      </div>
    </div>
  );
}

/* =========================================
   3. RETENTION TAB
========================================= */
function RetentionTab() {
  const tableData = [
    { id: 1, cId: "CUST001", name: "John Doe", first: "08 Jul 2026", last: "05 Aug 2026", orders: 6, spent: "₹ 4,250", status: "Returning" },
    { id: 2, cId: "CUST002", name: "Sarah Lee", first: "11 Jul 2026", last: "30 Jul 2026", orders: 4, spent: "₹ 3,680", status: "Returning" },
    { id: 3, cId: "CUST003", name: "Mike Ross", first: "16 Jul 2026", last: "05 Aug 2026", orders: 5, spent: "₹ 5,120", status: "Returning" },
    { id: 4, cId: "CUST004", name: "Emily Clark", first: "20 Jul 2026", last: "02 Aug 2026", orders: 3, spent: "₹ 2,940", status: "Returning" },
    { id: 5, cId: "CUST005", name: "David Brown", first: "25 Jul 2026", last: "31 Jul 2026", orders: 2, spent: "₹ 1,850", status: "Returning" },
    { id: 6, cId: "CUST006", name: "Jessica Wilson", first: "28 Jul 2026", last: "28 Jul 2026", orders: 1, spent: "₹ 750", status: "At Risk" },
    { id: 7, cId: "CUST007", name: "Chris Martin", first: "30 Jul 2026", last: "30 Jul 2026", orders: 1, spent: "₹ 620", status: "At Risk" },
    { id: 8, cId: "CUST008", name: "Daniel Taylor", first: "01 Aug 2026", last: "01 Aug 2026", orders: 1, spent: "₹ 540", status: "New" },
    { id: 9, cId: "CUST009", name: "Olivia Green", first: "02 Aug 2026", last: "02 Aug 2026", orders: 1, spent: "₹ 320", status: "New" },
    { id: 10, cId: "CUST010", name: "James White", first: "03 Aug 2026", last: "03 Aug 2026", orders: 1, spent: "₹ 410", status: "New" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ReportKpiCard icon={<Users size={20} />} title="Retention Rate" value="42%" inc="12" />
        <ReportKpiCard icon={<Users size={20} />} title="Returning Customers" value="842" inc="18" />
        <ReportKpiCard icon={<Users size={20} />} title="New Customers" value="356" inc="-8" />
        <ReportKpiCard icon={<ShoppingBag size={20} />} title="Total Orders" value="2,156" inc="15" />
        <ReportKpiCard icon={<Tag size={20} />} title="Total Revenue" value="₹ 18,72,450" inc="16" />
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar placeholder="Search by customer ID or name..." />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">First Visit</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Retention Status</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Order Date</th>
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-gray-500">{row.id}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{row.cId}</td>
                  <td className="py-4 px-6 text-gray-600">{row.name}</td>
                  <td className="py-4 px-6 text-gray-500">{row.first}</td>
                  <td className="py-4 px-6 text-gray-500">{row.last}</td>
                  <td className="py-4 px-6 text-gray-600">{row.orders}</td>
                  <td className="py-4 px-6 text-gray-600">{row.spent}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      row.status === 'Returning' ? 'bg-[#ECFDF5] text-[#10B981]' : 
                      row.status === 'At Risk' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{row.last}</td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <button className="bg-[#ECFDF5] text-[#10B981] font-semibold text-[11px] px-3 py-1 rounded">View</button>
                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination start={1} end={10} total={1198} />
      </div>
    </div>
  );
}

/* =========================================
   UTILITY COMPONENTS
========================================= */

function ReportKpiCard({ icon, title, value, sub, inc, valueColor="text-gray-900" }) {
  return (
    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-[13px] font-bold text-gray-500">{title}</h3>
      </div>
      <div>
        <div className={`text-[28px] font-bold leading-none mb-2 ${valueColor}`}>{value}</div>
        {inc ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 font-medium">vs last 30 days</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${Number(inc) > 0 ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-red-50 text-red-500'}`}>
              {Number(inc) > 0 ? '↑' : '↓'} {Math.abs(Number(inc))}%
            </span>
          </div>
        ) : sub ? (
          <div className="text-[11px] text-gray-400 font-medium">{sub}</div>
        ) : null}
      </div>
    </div>
  );
}

function TableToolbar({ placeholder }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-100 gap-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50">
          <Filter size={16} /> Filter <ChevronDown size={14} className="ml-1" />
        </button>
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50">
          <ArrowUpDown size={16} /> Sort by <ChevronDown size={14} className="ml-1" />
        </button>
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50">
          <LayoutGrid size={16} /> Columns <ChevronDown size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

function TablePagination({ start, end, total }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 gap-4">
      <span className="text-sm text-gray-500">Showing {start} to {end} of {total.toLocaleString()} entries</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-sm text-gray-400 flex items-center gap-1" disabled><ChevronLeft size={16}/> Previous</button>
          <button className="w-8 h-8 rounded bg-[#10B981] text-white text-sm font-bold flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded hover:bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded hover:bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center">3</button>
          <button className="w-8 h-8 rounded hover:bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center">4</button>
          <button className="w-8 h-8 rounded hover:bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center">5</button>
          <span className="text-gray-400 mx-1">...</span>
          <button className="w-8 h-8 rounded hover:bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center">{Math.ceil(total/10)}</button>
          <button className="px-3 py-1 text-sm text-gray-600 flex items-center gap-1 hover:text-gray-900">Next <ChevronDown size={16} className="-rotate-90"/></button>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50">
          10 per page <ChevronDown size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
