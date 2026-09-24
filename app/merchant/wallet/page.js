"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getWalletBalance, getWalletTransactions } from "../../lib/api/merchant";;
import { Clock, Search, ArrowUpRight, ArrowDownLeft, Wallet, Receipt, CreditCard, ChevronRight } from "lucide-react";
import MerchantNavbar from "../MerchantNavbar";

export default function MerchantWalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const [balanceRes, transRes] = await Promise.all([
          getWalletBalance(),
          getWalletTransactions()
        ]);
        setBalance(balanceRes.data?.balance || 0);
        setTransactions(transRes.data?.transactions || []);
      } catch (error) {
        console.error("Failed to fetch wallet info", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchWallet();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="" />
      
      <main className="w-full px-8 lg:px-10 py-8">
        <div className="mx-auto w-full max-w-[1400px] space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-[#1a1a1a]">Store Wallet</h1>
              <p className="text-[#666] text-[14px] mt-1">Manage your wallet balance and review your transaction history.</p>
            </div>
          </div>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-[12px] border border-[#e5e5e5] bg-[#F4FBF7] p-5 flex items-start gap-4 shadow-sm relative overflow-hidden">
              <div className="h-12 w-12 shrink-0 rounded-[10px] bg-white flex items-center justify-center shadow-sm z-10">
                <Wallet size={24} className="text-[#157A4F]" />
              </div>
              <div className="z-10">
                <p className="text-[13px] text-[#666] uppercase tracking-wider font-semibold">Available Balance</p>
                <p className="text-[32px] font-bold text-[#1a1a1a] mt-1">₹{balance.toLocaleString()}</p>
                <p className="text-[11px] text-[#999] mt-1">Use balance to pay for banner uploads or subscriptions</p>
              </div>
              {/* Decorative background element */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none z-0">
                <Wallet size={120} />
              </div>
            </div>
            
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex items-start gap-4 shadow-sm">
              <div className="h-12 w-12 shrink-0 rounded-[10px] bg-[#F4FBF7] flex items-center justify-center">
                <Receipt size={24} className="text-[#157A4F]" />
              </div>
              <div>
                <p className="text-[13px] text-[#666] uppercase tracking-wider font-semibold">Total Transactions</p>
                <p className="text-[32px] font-bold text-[#1a1a1a] mt-1">{transactions.length}</p>
                <p className="text-[11px] text-[#999] mt-1">All time transactions in your wallet</p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-5 flex flex-col justify-center shadow-sm">
              <p className="text-[14px] font-semibold text-[#1a1a1a] mb-2">How it works</p>
              <p className="text-[12px] text-[#666] leading-relaxed">
                When you cancel a banner promotion, the leftover unutilized funds are automatically credited to this wallet. You can use these funds towards any future payments on the platform seamlessly during checkout.
              </p>
            </div>
          </div>
          
          {/* Main Table Container */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white overflow-hidden shadow-sm mt-8">
            <div className="px-6 py-5 border-b border-[#e5e5e5] flex items-center gap-2">
              <Clock className="text-[#157A4F]" size={20} />
              <h2 className="text-[16px] font-bold text-[#1a1a1a]">Transaction History</h2>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f0f0f0] bg-[#FAFAFA]">
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Type</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Description</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Date <span className="inline-block ml-1 opacity-60">↑↓</span></th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-[#666]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-[13px] text-[#666]">Loading transactions...</td></tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <Search className="mx-auto text-[#ccc] mb-3" size={32} />
                        <h3 className="text-[14px] font-medium text-[#1a1a1a] mb-1">No transactions yet</h3>
                        <p className="text-[12px] text-[#999]">When you cancel a banner or receive a refund, it will appear here.</p>
                      </td>
                    </tr>
                  ) : transactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          tx.type === 'credit' ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-[#FFF7ED] text-[#C2410C]'
                        }`}>
                          {tx.type === 'credit' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {tx.type === 'credit' ? 'CREDIT' : 'DEBIT'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-[#333]">{tx.description || (tx.type === 'credit' ? 'Refund / Credit' : 'Payment / Debit')}</td>
                      <td className="px-6 py-4 text-[13px] text-[#666]">{new Date(tx.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className={`px-6 py-4 text-[14px] font-bold ${tx.type === 'credit' ? 'text-[#166534]' : 'text-[#1a1a1a]'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            {transactions.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5e5]">
                <p className="text-[12px] text-[#666]">Showing {transactions.length} transactions</p>
                <div className="flex items-center gap-2">
                  <button className="h-8 w-8 rounded-[6px] border border-[#e5e5e5] bg-white flex items-center justify-center text-[#999] hover:bg-[#f9f9f9]">
                    <ChevronRight size={14} className="rotate-180" />
                  </button>
                  <button className="h-8 w-8 rounded-[6px] bg-[#157A4F] text-white flex items-center justify-center text-[12px] font-medium shadow-sm">1</button>
                  <button className="h-8 w-8 rounded-[6px] border border-[#e5e5e5] bg-white flex items-center justify-center text-[#666] hover:bg-[#f9f9f9]">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
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
