"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown, Download, Tag, ShoppingBag, Users, Search, Filter, ArrowUpDown, LayoutGrid, MoreVertical, Heart, TrendingUp, TrendingDown, Star, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { getMerchantRealtimeAnalytics, deleteMyOfferPromotion, deleteMerchantProduct } from "../../../lib/api";
import { useRouter } from "next/navigation";
import MerchantNavbar from "../../MerchantNavbar";

export default function AnalyticsReportPage() {
  const [activeTab, setActiveTab] = useState("offers");
  const [analytics, setAnalytics] = useState(null);
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchAnalytics = async (s, e) => {
    try {
      const res = await getMerchantRealtimeAnalytics(s, e);
      if (res?.success) setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics(startDate, endDate);
  }, [startDate, endDate]);

  const reloadData = () => fetchAnalytics(startDate, endDate);

  const handleExportCsv = () => {
     alert('Exporting CSV...');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-poppins pb-16">
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
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm">
                <Calendar size={16} className="text-gray-400" />
                <input 
                  type="date" 
                  value={startDate} 
                  max={endDate || todayStr}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm text-gray-700 font-medium bg-transparent outline-none cursor-pointer"
                />
                <span className="text-gray-300 font-medium px-1">to</span>
                <input 
                  type="date" 
                  value={endDate} 
                  min={startDate}
                  max={todayStr}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm text-gray-700 font-medium bg-transparent outline-none cursor-pointer"
                />
              </div>
              <button 
                onClick={handleExportCsv}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm text-[#10B981] font-medium hover:bg-gray-50 shadow-sm"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
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
        {activeTab === "offers" && <OffersTab analytics={analytics} reloadData={reloadData} />}
        {activeTab === "products" && <ProductsTab analytics={analytics} reloadData={reloadData} />}
        {activeTab === "retention" && <RetentionTab analytics={analytics} />}

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

function ActionMenu({ onView, onEdit, onDelete, isLast = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className={`absolute right-0 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 ${isLast ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
          <button onClick={() => { setIsOpen(false); onView(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Eye size={14} className="text-gray-400" /> View
          </button>
          <button onClick={() => { setIsOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Edit size={14} className="text-blue-500" /> Edit
          </button>
          <button onClick={() => { setIsOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 size={14} className="text-red-500" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================
   1. OFFERS TAB
========================================= */
function OffersTab({ analytics, reloadData }) {
  const router = useRouter();
  const rawData = analytics?.offersPerformance || [];
  
  const totalOffers = rawData.length;
  const totalLikes = rawData.reduce((sum, item) => sum + (item.liked?.total ?? item.liked ?? 0), 0);
  
  const sortedByLikes = [...rawData].sort((a, b) => (b.liked?.total ?? b.liked ?? 0) - (a.liked?.total ?? a.liked ?? 0));
  const bestOffer = sortedByLikes[0];
  const bestOfferLikes = bestOffer?.liked?.total ?? bestOffer?.liked ?? 0;
  const bestOfferPercent = totalLikes > 0 ? ((bestOfferLikes / totalLikes) * 100).toFixed(1) : 0;
  
  const productsMap = new Map();
  rawData.forEach(o => {
    const pName = o.productName || "N/A";
    const l = o.liked?.total ?? o.liked ?? 0;
    productsMap.set(pName, (productsMap.get(pName) || 0) + l);
  });
  let topProduct = { name: "N/A", likes: 0 };
  for (const [name, likes] of productsMap.entries()) {
    if (likes > topProduct.likes) topProduct = { name, likes };
  }

  const [typeFilters, setTypeFilters] = useState([]);
  const [sortBy, setSortBy] = useState("Newest First");
  const [visibleColumns, setVisibleColumns] = useState(["Offer Name", "Product Name", "Total Likes", "Actions"]);
  
  const sortOptions = ["Newest First", "Oldest First", "More Likes", "Least Likes", "A-Z", "Z-A"];
  const allColumns = ["Offer Name", "Product Name", "Total Likes", "Actions"];
  
  const availableTypes = Array.from(new Set(rawData.map(r => r.type || "Standard"))).filter(Boolean);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const filteredAndSorted = rawData
    .filter(r => typeFilters.length === 0 || typeFilters.includes(r.type || "Standard"))
    .sort((a, b) => {
      if (sortBy === "Newest First") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === "Oldest First") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === "More Likes") return (b.liked?.total ?? b.liked ?? 0) - (a.liked?.total ?? a.liked ?? 0);
      if (sortBy === "Least Likes") return (a.liked?.total ?? a.liked ?? 0) - (b.liked?.total ?? b.liked ?? 0);
      if (sortBy === "A-Z") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "Z-A") return (b.title || "").localeCompare(a.title || "");
      return 0;
    });

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilters, sortBy]);

  const handleDeleteOffer = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteMyOfferPromotion(id);
        reloadData();
      } catch (e) {
        alert('Failed to delete offer');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportKpiCard icon={<Tag size={20} />} title="Total Offers" value={totalOffers} sub="All offers in selected period" />
        <ReportKpiCard icon={<Heart size={20} />} title="Total Likes" value={totalLikes} sub="Across all offers" />
        <ReportKpiCard icon={<Star size={20} />} title="Best Performing Offer" value={bestOffer?.title || "N/A"} sub={`${bestOfferLikes} likes (${bestOfferPercent}%)`} valueColor="text-[#10B981]" />
        <ReportKpiCard icon={<ShoppingBag size={20} />} title="Top Product" value={topProduct?.name || "N/A"} sub={`${topProduct?.likes || 0} likes from all offers`} valueColor="text-[#10B981]" />
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar 
          placeholder="Search offers or products..." 
          showTypeFilter={true} typeFilters={typeFilters} setTypeFilters={setTypeFilters} availableTypes={availableTypes}
          showSort={true} sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions}
          showColumns={true} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} allColumns={allColumns}
        />
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                {visibleColumns.includes("Offer Name") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Offer Name</th>}
                {visibleColumns.includes("Product Name") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Name</th>}
                {visibleColumns.includes("Total Likes") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Total Likes <ArrowUpDown size={12}/></th>}
                {visibleColumns.includes("Actions") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((row, idx) => (
                <tr key={row._id || idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  {visibleColumns.includes("Offer Name") && <td className="py-4 px-6 font-semibold text-gray-900">{row.title}</td>}
                  {visibleColumns.includes("Product Name") && <td className="py-4 px-6 text-gray-500">{row.productName}</td>}
                  {visibleColumns.includes("Total Likes") && <td className="py-4 px-6 font-bold text-[#10B981]">{row.liked?.total ?? row.liked ?? 0}</td>}
                  {visibleColumns.includes("Actions") && <td className="py-4 px-6">
                    <ActionMenu 
                      onView={() => router.push(`/merchant/offers/details?id=${row.requestId || row._id}`)} 
                      onEdit={() => router.push(`/merchant/offers/details?id=${row.requestId || row._id}`)} 
                      onDelete={() => handleDeleteOffer(row.requestId || row._id)} 
                      isLast={idx >= paginatedData.length - 2}
                    />
                  </td>}
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No offers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          total={totalFiltered} 
          onPageChange={setCurrentPage} 
          rowsPerPage={rowsPerPage} 
        />
      </div>
    </div>
  );
}

/* =========================================
   2. PRODUCTS TAB
========================================= */
function ProductsTab({ analytics, reloadData }) {
  const router = useRouter();
  const products = analytics?.products || [];
  
  const totalProducts = products.length;
  const totalLikes = products.reduce((sum, p) => sum + (p.likes || 0), 0);
  
  const mostLikedProduct = products[0];
  const mostLikedPercent = totalLikes > 0 ? (((mostLikedProduct?.likes || 0) / totalLikes) * 100).toFixed(1) : 0;
  
  const performanceTrend = analytics?.summary?.stats?.revenueIncrease || 0;
  const trendSign = performanceTrend >= 0 ? "↑" : "↓";
  const trendColor = performanceTrend >= 0 ? "text-[#10B981]" : "text-[#EF4444]";

  const [typeFilters, setTypeFilters] = useState([]);
  const [sortBy, setSortBy] = useState("Newest First");
  const [visibleColumns, setVisibleColumns] = useState(["Product Name", "Product Type", "Status", "Total Likes", "Total Views", "Actions"]);
  
  const sortOptions = ["Newest First", "Oldest First", "More Likes", "Least Likes", "A-Z", "Z-A"];
  const allColumns = ["Product Name", "Product Type", "Status", "Total Likes", "Total Views", "Actions"];
  
  const availableTypes = Array.from(new Set(products.map(p => p.type || "General"))).filter(Boolean);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const filteredAndSorted = products
    .filter(r => typeFilters.length === 0 || typeFilters.includes(r.type))
    .sort((a, b) => {
      if (sortBy === "Newest First") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === "Oldest First") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === "More Likes") return (b.likes ?? 0) - (a.likes ?? 0);
      if (sortBy === "Least Likes") return (a.likes ?? 0) - (b.likes ?? 0);
      if (sortBy === "A-Z") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "Z-A") return (b.name || "").localeCompare(a.name || "");
      return 0;
    });

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilters, sortBy]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteMerchantProduct(id);
        reloadData();
      } catch (e) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportKpiCard icon={<ShoppingBag size={20} />} title="Total Products" value={totalProducts} sub="Active catalog items" />
        <ReportKpiCard icon={<Heart size={20} />} title="Total Likes" value={totalLikes} sub="Across all products" />
        <ReportKpiCard icon={<Star size={20} />} title="Most Liked" value={mostLikedProduct?.name || "N/A"} sub={`${mostLikedProduct?.likes || 0} likes (${mostLikedPercent}%)`} valueColor="text-[#10B981]" />
        <ReportKpiCard 
          icon={performanceTrend >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />} 
          title="Performance" 
          value={`${trendSign} ${Math.abs(performanceTrend)}%`} 
          sub="vs previous period" 
          valueColor={trendColor} 
        />
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar 
          placeholder="Search products..." 
          showTypeFilter={false} typeFilters={typeFilters} setTypeFilters={setTypeFilters} availableTypes={availableTypes}
          showSort={true} sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions}
          showColumns={true} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} allColumns={allColumns}
        />
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                {visibleColumns.includes("Product Name") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Name</th>}
                {visibleColumns.includes("Product Type") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Type</th>}
                {visibleColumns.includes("Status") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>}
                {visibleColumns.includes("Total Likes") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Total Likes <ArrowUpDown size={12}/></th>}
                {visibleColumns.includes("Total Views") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Views</th>}
                {visibleColumns.includes("Actions") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((row, idx) => (
                <tr key={row._id || idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  {visibleColumns.includes("Product Name") && <td className="py-4 px-6 font-semibold text-gray-900">{row.name}</td>}
                  {visibleColumns.includes("Product Type") && <td className="py-4 px-6 text-gray-500">{row.type}</td>}
                  {visibleColumns.includes("Status") && <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {row.status}
                    </span>
                  </td>}
                  {visibleColumns.includes("Total Likes") && <td className="py-4 px-6 font-bold text-[#10B981]">{row.likes}</td>}
                  {visibleColumns.includes("Total Views") && <td className="py-4 px-6 font-medium text-gray-700">{row.views}</td>}
                  {visibleColumns.includes("Actions") && <td className="py-4 px-6">
                    <ActionMenu 
                      onView={() => router.push(`/merchant/products/details?id=${row._id}`)} 
                      onEdit={() => router.push(`/merchant/products/details?id=${row._id}`)} 
                      onDelete={() => handleDeleteProduct(row._id)} 
                      isLast={idx >= paginatedData.length - 2}
                    />
                  </td>}
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          total={totalFiltered} 
          onPageChange={setCurrentPage} 
          rowsPerPage={rowsPerPage} 
        />
      </div>
    </div>
  );
}

/* =========================================
   3. RETENTION TAB
========================================= */
function RetentionTab({ analytics }) {
  const events = analytics?.events || {};
  const stats = analytics?.summary?.stats || {};
  
  const retentionRate = events.retention || 0;
  const returningCustomers = events.returningCount || 0;
  const newCustomers = Math.max(0, (events.totalActive || 0) - returningCustomers);
  const totalOrders = stats.totalOrders || 0;
  const totalRevenue = stats.revenue || 0;
  
  const [typeFilters, setTypeFilters] = useState([]);
  const [sortBy, setSortBy] = useState("Newest First");
  const [visibleColumns, setVisibleColumns] = useState(["Customer ID", "Name", "Status", "Total Orders", "Total Spent", "First Visit", "Last Visit"]);
  
  const sortOptions = ["Newest First", "Oldest First", "Highest Spender", "Lowest Spender", "Most Orders", "Least Orders"];
  const allColumns = ["Customer ID", "Name", "Status", "Total Orders", "Total Spent", "First Visit", "Last Visit"];
  
  const availableTypes = ["New", "Returning", "At Risk"];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const rawData = analytics?.retentionList || [];
  
  const filteredAndSorted = rawData
    .filter(r => typeFilters.length === 0 || typeFilters.includes(r.status))
    .sort((a, b) => {
      if (sortBy === "Newest First") return new Date(b.firstVisit || 0).getTime() - new Date(a.firstVisit || 0).getTime();
      if (sortBy === "Oldest First") return new Date(a.firstVisit || 0).getTime() - new Date(b.firstVisit || 0).getTime();
      if (sortBy === "Highest Spender") return (b.totalSpent ?? 0) - (a.totalSpent ?? 0);
      if (sortBy === "Lowest Spender") return (a.totalSpent ?? 0) - (b.totalSpent ?? 0);
      if (sortBy === "Most Orders") return (b.orders ?? 0) - (a.orders ?? 0);
      if (sortBy === "Least Orders") return (a.orders ?? 0) - (b.orders ?? 0);
      return 0;
    });

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilters, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ReportKpiCard title="Retention Rate" value={`${retentionRate}%`} trend={stats.activeOffersIncrease || 0} sub="vs previous period" />
        <ReportKpiCard title="Returning Customers" value={returningCustomers} trend={stats.followersIncrease || 0} sub="vs previous period" />
        <ReportKpiCard title="New Customers" value={newCustomers} trend={stats.profileViewsIncrease || 0} sub="vs previous period" />
        <ReportKpiCard title="Total Orders" value={totalOrders} trend={stats.conversionRateIncrease || 0} sub="vs previous period" />
        <ReportKpiCard title="Total Revenue" value={`₹ ${(totalRevenue || 0).toLocaleString('en-IN')}`} trend={stats.revenueIncrease || 0} sub="vs previous period" />
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <TableToolbar 
          placeholder="Search customers..." 
          showTypeFilter={true} typeFilters={typeFilters} setTypeFilters={setTypeFilters} availableTypes={availableTypes}
          showSort={true} sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions}
          showColumns={true} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} allColumns={allColumns}
        />
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                {visibleColumns.includes("Customer ID") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Customer ID</th>}
                {visibleColumns.includes("Name") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Name</th>}
                {visibleColumns.includes("Status") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>}
                {visibleColumns.includes("Total Orders") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Total Orders <ArrowUpDown size={12}/></th>}
                {visibleColumns.includes("Total Spent") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Spent</th>}
                {visibleColumns.includes("First Visit") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">First Visit</th>}
                {visibleColumns.includes("Last Visit") && <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Visit</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((row, idx) => (
                <tr key={row.cId || idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  {visibleColumns.includes("Customer ID") && <td className="py-4 px-6 font-medium text-gray-500">{row.cId}</td>}
                  {visibleColumns.includes("Name") && <td className="py-4 px-6 font-semibold text-gray-900">{row.name}</td>}
                  {visibleColumns.includes("Status") && <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status === 'New' ? 'bg-[#ECFDF5] text-[#10B981]' : row.status === 'Returning' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {row.status}
                    </span>
                  </td>}
                  {visibleColumns.includes("Total Orders") && <td className="py-4 px-6 font-bold text-gray-900">{row.orders}</td>}
                  {visibleColumns.includes("Total Spent") && <td className="py-4 px-6 font-semibold text-gray-900\">₹ {(row.totalSpent || 0).toLocaleString('en-IN')}</td>}
                  {visibleColumns.includes("First Visit") && <td className="py-4 px-6 text-gray-500">{new Date(row.firstVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>}
                  {visibleColumns.includes("Last Visit") && <td className="py-4 px-6 text-gray-500">{new Date(row.lastVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>}
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          total={totalFiltered} 
          onPageChange={setCurrentPage} 
          rowsPerPage={rowsPerPage} 
        />
      </div>
    </div>
  );
}

function ReportKpiCard({ icon, title, value, sub, trend = null, valueColor = "text-gray-900" }) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl">{icon}</div>}
        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 font-medium mt-1.5">{sub}</p>}
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-[13px] font-bold px-2 py-1 rounded-md ${isPositive ? 'text-[#10B981] bg-[#10B981]/10' : 'text-red-500 bg-red-50'}`}>
            {isPositive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

function TableToolbar({ placeholder, showTypeFilter = false, typeFilters = [], setTypeFilters = () => {}, availableTypes = [], showSort = false, sortBy = "", setSortBy = () => {}, sortOptions = [], showColumns = false, visibleColumns = [], setVisibleColumns = () => {}, allColumns = [] }) {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);

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
        {showTypeFilter && (
          <div className="relative">
            <button 
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50"
            >
              <Filter size={16} /> {typeFilters.length === 0 ? 'Filter Type' : typeFilters.length === 1 ? typeFilters[0] : `${typeFilters.length} Types`} <ChevronDown size={14} className="ml-1" />
            </button>
            {isTypeOpen && (
              <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10" onMouseLeave={() => setIsTypeOpen(false)}>
                {availableTypes.map(t => {
                  const isChecked = typeFilters.includes(t);
                  return (
                    <label key={t} className="flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setTypeFilters(typeFilters.filter(f => f !== t));
                          } else {
                            setTypeFilters([...typeFilters, t]);
                          }
                        }}
                        className="rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                      />
                      <span className="text-gray-700">{t}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showSort && (
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50"
            >
              <ArrowUpDown size={16} /> Sort: {sortBy} <ChevronDown size={14} className="ml-1" />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10" onMouseLeave={() => setIsSortOpen(false)}>
                {sortOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${sortBy === opt ? 'bg-gray-50 text-[#10B981] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {showColumns && (
          <div className="relative">
            <button 
              onClick={() => setIsColumnsOpen(!isColumnsOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-50"
            >
              <LayoutGrid size={16} /> Columns <ChevronDown size={14} className="ml-1" />
            </button>
            {isColumnsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10" onMouseLeave={() => setIsColumnsOpen(false)}>
                {allColumns.map(col => {
                  const isChecked = visibleColumns.includes(col);
                  return (
                    <label key={col} className="flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setVisibleColumns(visibleColumns.filter(c => c !== col));
                          } else {
                            setVisibleColumns([...visibleColumns, col]);
                          }
                        }}
                        className="rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                      />
                      <span className="text-gray-700">{col}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TablePagination({ currentPage, totalPages, total, onPageChange, rowsPerPage }) {
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, total);

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
      <p className="text-sm text-gray-500 font-medium">
        Showing <span className="text-gray-900">{total === 0 ? 0 : start}</span> to <span className="text-gray-900">{end}</span> of <span className="text-gray-900">{total}</span> results
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Previous
        </button>
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
