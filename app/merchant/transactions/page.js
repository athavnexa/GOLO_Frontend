"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import MerchantNavbar from "../MerchantNavbar";
import { 
  Search, Calendar, Download, Wallet, Receipt, Clock, AlertCircle, 
  ChevronRight, MessageSquare, HelpCircle, CreditCard, X, CheckCircle2, XCircle
} from "lucide-react";
import { getMyPayments, openRazorpayCheckout } from "../../lib/api";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, success: false, message: "" });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getMyPayments({ limit: 100 });
      if (res?.data?.items) {
        setPayments(res.data.items);
      } else if (Array.isArray(res?.data)) {
        setPayments(res.data);
      } else if (res?.data?.data) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleTestPayment = async () => {
    try {
      await openRazorpayCheckout({
        amount: 1, // 1 INR
        description: "Test Transaction 1 RS",
        notes: { type: "test" }
      });
      setPopup({ show: true, success: true, message: "Payment successful!" });
      fetchPayments();
    } catch (err) {
      setPopup({ show: true, success: false, message: "Payment failed: " + err.message });
    }
  };

  const filteredPayments = useMemo(() => {
    let filtered = payments;
    if (activeTab === "Paid") {
      filtered = filtered.filter(p => p.status === "captured" || p.status === "paid");
    } else if (activeTab === "Failed") {
      filtered = filtered.filter(p => p.status === "failed");
    } else if (activeTab === "Refunded") {
      filtered = filtered.filter(p => p.status === "refunded");
    }
    
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => 
        (p.receipt && p.receipt.toLowerCase().includes(s)) ||
        (p.paymentId && p.paymentId.toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [payments, activeTab, search]);

  const stats = useMemo(() => {
    let totalPaid = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    
    payments.forEach(p => {
      if (p.status === "captured" || p.status === "paid") {
        totalPaid += p.amount;
        paidCount++;
      } else if (p.status === "created" || p.status === "authorized" || p.status === "pending") {
        pendingCount++;
      } else if (p.status === "failed" || p.status === "refunded") {
        failedCount++;
      }
    });

    return { totalPaid, totalTransactions: payments.length, paidCount, pendingCount, failedCount };
  }, [payments]);
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="" />
      
      <main className="w-full px-8 lg:px-10 py-8">
        <div className="mx-auto w-full max-w-[1400px] space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-[#1a1a1a]">Transaction History</h1>
              <p className="text-[#666] text-[14px] mt-1">Manage all your subscription payments and invoices.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                <input 
                  type="text" 
                  placeholder="Search by Invoice ID, Order ID or Plan"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[42px] w-[320px] rounded-[8px] border border-[#e5e5e5] bg-white pl-9 pr-4 text-[13px] outline-none focus:border-[#157a4f]"
                />
              </div>
              <button onClick={handleTestPayment} className="h-[42px] flex items-center gap-2 rounded-[8px] border border-[#157a4f] bg-[#157a4f] px-4 text-[13px] font-medium text-white hover:bg-[#11623f] shadow-sm">
                <CreditCard size={16} />
                Pay test 1 RS
              </button>
              <button className="h-[42px] flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-4 text-[13px] font-medium text-[#333] hover:bg-[#f9f9f9]">
                <Calendar size={16} className="text-[#666]" />
                Last 30 Days
                <ChevronRight size={14} className="text-[#999] rotate-90 ml-1" />
              </button>
              <button className="h-[42px] flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-4 text-[13px] font-medium text-[#333] hover:bg-[#f9f9f9]">
                <Download size={16} className="text-[#666]" />
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-[12px] border border-[#e5e5e5] bg-[#F4FBF7] p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-white flex items-center justify-center shadow-sm">
                <Wallet size={20} className="text-[#157A4F]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Total Paid</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">₹{stats.totalPaid.toLocaleString()}</p>
                <p className="text-[11px] text-[#999] mt-1">Across {stats.paidCount} transactions</p>
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[#F4FBF7] flex items-center justify-center">
                <Receipt size={20} className="text-[#157A4F]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Total Transactions</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">{stats.totalTransactions}</p>
                <p className="text-[11px] text-[#999] mt-1">All time transactions</p>
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[#FFF9E6] flex items-center justify-center">
                <Clock size={20} className="text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Pending</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">{stats.pendingCount}</p>
                <p className="text-[11px] text-[#999] mt-1">Payments pending</p>
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[#FEF2F2] flex items-center justify-center">
                <AlertCircle size={20} className="text-[#EF4444]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Failed / Refunded</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">{stats.failedCount}</p>
                <p className="text-[11px] text-[#999] mt-1">Across {stats.failedCount} transactions</p>
              </div>
            </div>
          </div>
          
          {/* Main Table Container */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#e5e5e5]">
              {["All Transactions", "Paid", "Failed", "Refunded"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[13px] font-medium rounded-[8px] transition-colors ${
                    activeTab === tab 
                      ? "bg-[#F4FBF7] text-[#157A4F] border border-[#CDE9D9]" 
                      : "bg-white text-[#666] border border-transparent hover:bg-[#f5f5f5]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f0f0f0] bg-[#FAFAFA]">
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Invoice ID <span className="inline-block ml-1 opacity-60">↑↓</span></th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Plan</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Billing Cycle</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Payment Date <span className="inline-block ml-1 opacity-60">↑↓</span></th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Amount</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Status</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Payment Method</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Invoice</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9" className="px-6 py-8 text-center text-[13px] text-[#666]">Loading transactions...</td></tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr><td colSpan="9" className="px-6 py-8 text-center text-[13px] text-[#666]">No transactions found.</td></tr>
                  ) : filteredPayments.map((tx, idx) => {
                    const statusText = (tx.status || 'unknown').charAt(0).toUpperCase() + (tx.status || 'unknown').slice(1);
                    const isSuccess = tx.status === "captured" || tx.status === "paid";
                    const isFailed = tx.status === "failed";
                    const method = tx.method ? tx.method.toUpperCase() : "N/A";

                    return (
                      <tr key={tx.paymentId || idx} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors group">
                        <td className="px-6 py-4 text-[13px] font-medium text-[#157A4F]">{tx.receipt || String(tx.paymentId || "").substring(0, 10)}</td>
                        <td className="px-6 py-4 text-[13px] text-[#333]">{tx.description || "GOLO Services"}</td>
                        <td className="px-6 py-4 text-[13px] text-[#666]">One-time</td>
                        <td className="px-6 py-4 text-[13px] text-[#666]">{new Date(tx.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                        <td className="px-6 py-4 text-[13px] font-medium text-[#333]">₹{(tx.amount || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            isSuccess ? "bg-[#F0FDF4] text-[#166534]" :
                            isFailed ? "bg-[#FEF2F2] text-[#991B1B]" :
                            "bg-[#EFF6FF] text-[#1E3A8A]"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              isSuccess ? "bg-[#166534]" :
                              isFailed ? "bg-[#991B1B]" :
                              "bg-[#1E3A8A]"
                            }`} />
                            {statusText}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-[#666] flex items-center gap-2">
                          <span className={`font-bold italic text-[10px] border border-[#e5e5e5] bg-white rounded px-1.5 py-0.5 shadow-sm ${
                            method === 'UPI' ? 'text-[#333]' : method.includes('VISA') ? 'text-[#1A1F71]' : method.includes('PAYPAL') ? 'text-[#003087]' : 'text-[#333]'
                          }`}>
                            {method}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#666] hover:text-[#157A4F]">
                            <Download size={14} /> PDF
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/merchant/transactions/${tx.paymentId}`} className="text-[#999] hover:text-[#333] opacity-50 group-hover:opacity-100 transition-opacity block w-fit">
                            <ChevronRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5e5]">
              <p className="text-[12px] text-[#666]">Showing {filteredPayments.length > 0 ? 1 : 0} to {filteredPayments.length} of {payments.length} transactions</p>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-[6px] border border-[#e5e5e5] bg-white flex items-center justify-center text-[#999] hover:bg-[#f9f9f9]">
                  <ChevronRight size={14} className="rotate-180" />
                </button>
                <button className="h-8 w-8 rounded-[6px] bg-[#157A4F] text-white flex items-center justify-center text-[12px] font-medium shadow-sm">1</button>
                <button className="h-8 w-8 rounded-[6px] bg-transparent text-[#666] flex items-center justify-center text-[12px] font-medium hover:bg-[#f5f5f5]">2</button>
                <button className="h-8 w-8 rounded-[6px] border border-[#e5e5e5] bg-white flex items-center justify-center text-[#666] hover:bg-[#f9f9f9]">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 pb-2 text-[12px] text-[#999] border-t border-[#e5e5e5] mt-8">
            <p>© 2026 GOLO Merchant. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-3 sm:mt-0">
              <a href="#" className="hover:text-[#666]">Privacy Policy</a>
              <a href="#" className="hover:text-[#666]">Terms of Service</a>
            </div>
          </div>
          
        </div>
      </main>

      {/* Payment Notification Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-[16px] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between p-5 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-3">
                {popup.success ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 size={22} />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <XCircle size={22} />
                  </div>
                )}
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1a1a1a]">
                    {popup.success ? "Payment Successful" : "Payment Failed"}
                  </h3>
                  <p className="text-[13px] text-[#666] mt-0.5 max-w-[220px] leading-relaxed">
                    {popup.message}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPopup({ ...popup, show: false })}
                className="text-[#999] hover:text-[#333] transition-colors bg-[#f5f5f5] hover:bg-[#e5e5e5] p-1.5 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bg-[#fafafa] p-4 flex justify-end">
              <button 
                onClick={() => setPopup({ ...popup, show: false })}
                className={`px-5 py-2 text-[13px] font-medium text-white rounded-[8px] transition-colors ${
                  popup.success ? "bg-[#157a4f] hover:bg-[#11623f]" : "bg-[#ef4444] hover:bg-[#dc2626]"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

