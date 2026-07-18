"use client";

import { useState } from "react";
import Link from "next/link";
import MerchantNavbar from "../MerchantNavbar";
import { 
  Search, Calendar, Download, Wallet, Receipt, Clock, AlertCircle, 
  ChevronRight, MessageSquare, HelpCircle
} from "lucide-react";

// Dummy data for transactions matching the image
const transactions = [
  { id: "INV-2026-0001", plan: "GOLO PRO", cycle: "1 Month", date: "01 Jul 2026, 10:42 AM", amount: "₹2,499", status: "Paid", method: "UPI" },
  { id: "INV-2026-0002", plan: "GOLO PRO", cycle: "1 Month", date: "01 Jun 2026, 10:31 AM", amount: "₹2,499", status: "Paid", method: "UPI" },
  { id: "INV-2026-0003", plan: "GOLO PRO", cycle: "1 Month", date: "01 May 2026, 09:15 AM", amount: "₹2,499", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2026-0004", plan: "GOLO PRO", cycle: "1 Month", date: "01 Apr 2026, 09:10 AM", amount: "₹2,499", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2026-0005", plan: "GOLO BASIC", cycle: "1 Month", date: "01 Mar 2026, 11:20 AM", amount: "₹999", status: "Paid", method: "UPI" },
  { id: "INV-2026-0006", plan: "GOLO PRO", cycle: "1 Month", date: "01 Feb 2026, 10:05 AM", amount: "₹2,499", status: "Failed", method: "PayPal" },
  { id: "INV-2026-0007", plan: "GOLO PRO", cycle: "1 Month", date: "01 Jan 2026, 09:45 AM", amount: "₹2,499", status: "Refunded", method: "PayPal" },
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [search, setSearch] = useState("");
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
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
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">₹17,493</p>
                <p className="text-[11px] text-[#999] mt-1">Across 8 transactions</p>
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[#F4FBF7] flex items-center justify-center">
                <Receipt size={20} className="text-[#157A4F]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Total Transactions</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">12</p>
                <p className="text-[11px] text-[#999] mt-1">All time transactions</p>
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[#FFF9E6] flex items-center justify-center">
                <Clock size={20} className="text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Pending</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">0</p>
                <p className="text-[11px] text-[#999] mt-1">Payments pending</p>
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[#FEF2F2] flex items-center justify-center">
                <AlertCircle size={20} className="text-[#EF4444]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666]">Failed / Refunded</p>
                <p className="text-[24px] font-bold text-[#1a1a1a] mt-0.5">2</p>
                <p className="text-[11px] text-[#999] mt-1">Across 2 transactions</p>
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
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors group">
                      <td className="px-6 py-4 text-[13px] font-medium text-[#157A4F]">{tx.id}</td>
                      <td className="px-6 py-4 text-[13px] text-[#333]">{tx.plan}</td>
                      <td className="px-6 py-4 text-[13px] text-[#666]">{tx.cycle}</td>
                      <td className="px-6 py-4 text-[13px] text-[#666]">{tx.date}</td>
                      <td className="px-6 py-4 text-[13px] font-medium text-[#333]">{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          tx.status === "Paid" ? "bg-[#F0FDF4] text-[#166534]" :
                          tx.status === "Failed" ? "bg-[#FEF2F2] text-[#991B1B]" :
                          "bg-[#EFF6FF] text-[#1E3A8A]"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === "Paid" ? "bg-[#166534]" :
                            tx.status === "Failed" ? "bg-[#991B1B]" :
                            "bg-[#1E3A8A]"
                          }`} />
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#666] flex items-center gap-2">
                        {tx.method.includes("UPI") && <span className="font-bold italic text-[#333] text-[10px] border border-[#e5e5e5] bg-white rounded px-1.5 py-0.5 shadow-sm">UPI</span>}
                        {tx.method.includes("Visa") && <span className="font-bold italic text-[#1A1F71] text-[10px] border border-[#e5e5e5] bg-white rounded px-1.5 py-0.5 shadow-sm">VISA</span>}
                        {tx.method.includes("PayPal") && <span className="font-bold italic text-[#003087] text-[10px] border border-[#e5e5e5] bg-white rounded px-1.5 py-0.5 shadow-sm">PayPal</span>}
                        <span className="mt-0.5">{tx.method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#666] hover:text-[#157A4F]">
                          <Download size={14} /> PDF
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/merchant/transactions/${tx.id}`} className="text-[#999] hover:text-[#333] opacity-50 group-hover:opacity-100 transition-opacity block w-fit">
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5e5]">
              <p className="text-[12px] text-[#666]">Showing 1 to 7 of 12 transactions</p>
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
          
          {/* Help Widget */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-[10px] bg-[#F4FBF7] flex items-center justify-center">
                <MessageSquare size={20} className="text-[#157A4F]" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Need help with billing?</h3>
                <p className="text-[13px] text-[#666] mt-0.5">Get support for payments, invoices, and refunds.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="h-10 px-4 rounded-[8px] border border-[#e5e5e5] bg-white flex items-center gap-2 text-[13px] font-medium text-[#333] hover:bg-[#f9f9f9] flex-1 md:flex-none justify-center">
                <MessageSquare size={16} className="text-[#157A4F]" />
                Contact Support
              </button>
              <button className="h-10 px-4 rounded-[8px] border border-[#e5e5e5] bg-white flex items-center gap-2 text-[13px] font-medium text-[#333] hover:bg-[#f9f9f9] flex-1 md:flex-none justify-center">
                <HelpCircle size={16} className="text-[#157A4F]" />
                Billing FAQ
              </button>
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
    </div>
  );
}
