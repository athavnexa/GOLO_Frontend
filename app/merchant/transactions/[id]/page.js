"use client";

import { use } from "react";

import { useRouter } from "next/navigation";
import MerchantNavbar from "../../MerchantNavbar";
import { 
  ArrowLeft, Download, Check, Calendar, CreditCard, FileText, User, 
  Headset
} from "lucide-react";

export default function TransactionDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="" />
      
      <main className="w-full px-8 lg:px-10 py-8">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          
          {/* Back Link */}
          <button 
            onClick={() => router.push("/merchant/transactions")}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#157A4F] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Transaction History
          </button>
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-[#1a1a1a]">Transaction Details</h1>
              <p className="text-[#666] text-[14px] mt-1">View detailed information about this transaction.</p>
            </div>
            <button className="h-[42px] flex items-center gap-2 rounded-[8px] border border-[#157A4F] bg-white px-5 text-[13px] font-semibold text-[#157A4F] hover:bg-[#F4FBF7] transition-colors">
              <Download size={16} />
              Download Invoice (PDF)
            </button>
          </div>
          
          {/* Main Status Card */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                <Check size={28} className="text-[#16A34A]" />
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1a1a1a]">Payment Successful</h2>
                <p className="text-[#666] text-[13px] mt-1">Your payment was completed successfully.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
              <div>
                <p className="text-[11px] font-bold text-[#999] tracking-wider uppercase">PAID AMOUNT</p>
                <p className="text-[28px] font-bold text-[#157A4F] mt-1 leading-none">₹2,499</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[11px] font-bold text-[#999] tracking-wider uppercase">COMPLETED ON</p>
                <p className="text-[14px] font-bold text-[#1a1a1a] mt-1.5">12 Jul 2026, 10:42 AM</p>
              </div>
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Subscription Details */}
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white shadow-sm flex flex-col">
              <div className="px-6 py-5 flex items-center gap-3 border-b border-[#f0f0f0]">
                <div className="h-8 w-8 rounded bg-[#F4FBF7] flex items-center justify-center">
                  <Calendar size={18} className="text-[#157A4F]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">Subscription Details</h3>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Plan</span>
                  <span className="font-bold text-[#1a1a1a]">GOLO PRO</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Billing Period</span>
                  <span className="font-bold text-[#1a1a1a]">Monthly</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Subscription Start</span>
                  <span className="font-bold text-[#1a1a1a]">12 Jul 2026</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Next Billing Date</span>
                  <span className="font-bold text-[#1a1a1a]">12 Aug 2026</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Renewal</span>
                  <span className="font-bold text-[#157A4F]">Auto Renewal ON</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-bold text-[#16A34A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white shadow-sm flex flex-col">
              <div className="px-6 py-5 flex items-center gap-3 border-b border-[#f0f0f0]">
                <div className="h-8 w-8 rounded bg-[#F4FBF7] flex items-center justify-center">
                  <CreditCard size={18} className="text-[#157A4F]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">Payment Information</h3>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold italic text-[#1A1F71] text-[10px] border border-[#e5e5e5] rounded px-1 py-0.5">VISA</span>
                    <span className="font-bold text-[#1a1a1a]">Visa •••• 3456</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Transaction ID</span>
                  <span className="font-bold text-[#1a1a1a]">TXN202607120001</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Invoice Number</span>
                  <span className="font-bold text-[#1a1a1a]">{id}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Reference ID</span>
                  <span className="font-bold text-[#1a1a1a]">REF89324521</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Gateway</span>
                  <span className="font-bold text-[#1a1a1a]">Razorpay</span>
                </div>
              </div>
            </div>
            
            {/* Billing Summary */}
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white shadow-sm flex flex-col">
              <div className="px-6 py-5 flex items-center gap-3 border-b border-[#f0f0f0]">
                <div className="h-8 w-8 rounded bg-[#F4FBF7] flex items-center justify-center">
                  <FileText size={18} className="text-[#157A4F]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">Billing Summary</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 mb-auto">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">Plan Price</span>
                    <span className="font-bold text-[#1a1a1a]">₹2,499</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">Discount</span>
                    <span className="font-bold text-[#1a1a1a]">₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">GST (0%)</span>
                    <span className="font-bold text-[#1a1a1a]">₹0</span>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-[#f0f0f0] flex justify-between items-end">
                  <span className="text-[16px] font-bold text-[#1a1a1a]">Total Paid</span>
                  <span className="text-[28px] font-bold text-[#157A4F] leading-none">₹2,499</span>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Customer Information */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white shadow-sm">
            <div className="px-6 py-5 flex items-center gap-3 border-b border-[#f0f0f0]">
              <div className="h-8 w-8 rounded bg-[#F4FBF7] flex items-center justify-center">
                <User size={18} className="text-[#157A4F]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">Customer Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[#f0f0f0]">
              <div className="lg:pr-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Merchant Name</p>
                <p className="text-[15px] font-bold text-[#1a1a1a]">ABC Store</p>
              </div>
              <div className="lg:px-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Merchant ID</p>
                <p className="text-[15px] font-bold text-[#1a1a1a]">MER000124</p>
              </div>
              <div className="lg:px-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Email</p>
                <p className="text-[15px] font-bold text-[#1a1a1a]">john.doe@gmail.com</p>
              </div>
              <div className="lg:pl-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Phone</p>
                <p className="text-[15px] font-bold text-[#1a1a1a]">+91 9876543210</p>
              </div>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button className="w-full sm:w-auto h-[42px] flex items-center justify-center gap-2 rounded-[8px] border border-[#157A4F] bg-white px-5 text-[13px] font-semibold text-[#157A4F] hover:bg-[#F4FBF7] transition-colors">
                <Download size={16} /> Download Invoice (PDF)
              </button>
              <button className="w-full sm:w-auto h-[42px] flex items-center justify-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-5 text-[13px] font-semibold text-[#157A4F] hover:bg-[#f9f9f9] transition-colors">
                <Headset size={16} /> Contact Support
              </button>
            </div>
            <button 
              onClick={() => router.push("/merchant/transactions")}
              className="w-full md:w-auto h-[42px] flex items-center justify-center gap-2 rounded-[8px] bg-[#157A4F] px-6 text-[13px] font-semibold text-white hover:bg-[#126b45] transition-colors"
            >
              Back to Transaction History
            </button>
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
