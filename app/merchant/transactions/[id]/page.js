"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MerchantNavbar from "../../MerchantNavbar";
import { 
  ArrowLeft, Download, Check, Calendar, CreditCard, FileText, User, 
  Headset, AlertCircle, Clock
} from "lucide-react";
import { getPaymentById } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function TransactionDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const { user, merchantProfile } = useAuth();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const res = await getPaymentById(id);
        const data = res?.data?.data || res?.data;
        if (data) {
          setPayment(data);
        } else {
          setError("Payment not found.");
        }
      } catch (err) {
        console.error("Failed to load payment details", err);
        setError("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#666]">Loading transaction details...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
        <MerchantNavbar activeKey="" />
        <main className="w-full px-8 lg:px-10 py-8">
          <div className="mx-auto w-full max-w-[1200px] space-y-6">
            <button 
              onClick={() => router.push("/merchant/transactions")}
              className="flex items-center gap-2 text-[13px] font-semibold text-[#157A4F] hover:underline"
            >
              <ArrowLeft size={16} /> Back to Transaction History
            </button>
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
              {error || "Transaction not found."}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isSuccess = payment.status === "captured" || payment.status === "paid";
  const isFailed = payment.status === "failed";
  const statusText = (payment.status || 'unknown').charAt(0).toUpperCase() + (payment.status || 'unknown').slice(1);
  const method = payment.method ? payment.method.toUpperCase() : "N/A";
  const createdAtDate = new Date(payment.createdAt);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
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
            {isSuccess && (
              <button className="h-[42px] flex items-center gap-2 rounded-[8px] border border-[#157A4F] bg-white px-5 text-[13px] font-semibold text-[#157A4F] hover:bg-[#F4FBF7] transition-colors">
                <Download size={16} />
                Download Invoice (PDF)
              </button>
            )}
          </div>
          
          {/* Main Status Card */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 shrink-0 rounded-full flex items-center justify-center ${
                isSuccess ? "bg-[#F0FDF4] text-[#16A34A]" : 
                isFailed ? "bg-[#FEF2F2] text-[#991B1B]" : 
                "bg-[#EFF6FF] text-[#1E3A8A]"
              }`}>
                {isSuccess ? <Check size={28} /> : isFailed ? <AlertCircle size={28} /> : <Clock size={28} />}
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1a1a1a]">
                  {isSuccess ? "Payment Successful" : isFailed ? "Payment Failed" : "Payment Pending"}
                </h2>
                <p className="text-[#666] text-[13px] mt-1">
                  {isSuccess ? "Your payment was completed successfully." : 
                   isFailed ? payment.failureDescription || "The payment transaction failed." : 
                   "Your payment is currently being processed."}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
              <div>
                <p className="text-[11px] font-bold text-[#999] tracking-wider uppercase">PAID AMOUNT</p>
                <p className="text-[28px] font-bold text-[#157A4F] mt-1 leading-none">₹{(payment.amount || 0).toLocaleString()}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[11px] font-bold text-[#999] tracking-wider uppercase">{isSuccess ? 'COMPLETED ON' : 'CREATED ON'}</p>
                <p className="text-[14px] font-bold text-[#1a1a1a] mt-1.5">{createdAtDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
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
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">Service Details</h3>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Description</span>
                  <span className="font-bold text-[#1a1a1a]">{payment.description || "GOLO Services"}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Billing Type</span>
                  <span className="font-bold text-[#1a1a1a]">One-time</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Date</span>
                  <span className="font-bold text-[#1a1a1a]">{createdAtDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Status</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isSuccess ? "bg-[#F0FDF4] text-[#16A34A]" : 
                    isFailed ? "bg-[#FEF2F2] text-[#991B1B]" : 
                    "bg-[#EFF6FF] text-[#1E3A8A]"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isSuccess ? "bg-[#16A34A]" : 
                      isFailed ? "bg-[#991B1B]" : 
                      "bg-[#1E3A8A]"
                    }`} />
                    {statusText}
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
                    <span className="font-bold italic text-[#1A1F71] text-[10px] border border-[#e5e5e5] rounded px-1 py-0.5">{method}</span>
                  </div>
                </div>
                {payment.razorpayPaymentId && (
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">Transaction ID</span>
                    <span className="font-bold text-[#1a1a1a] truncate ml-4">{payment.razorpayPaymentId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Receipt</span>
                  <span className="font-bold text-[#1a1a1a] truncate ml-4">{payment.receipt}</span>
                </div>
                {payment.razorpayOrderId && (
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">Order ID</span>
                    <span className="font-bold text-[#1a1a1a] truncate ml-4">{payment.razorpayOrderId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#666]">Gateway</span>
                  <span className="font-bold text-[#1a1a1a]">{payment.provider === "razorpay" ? "Razorpay" : payment.provider || "N/A"}</span>
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
                    <span className="text-[#666]">Base Amount</span>
                    <span className="font-bold text-[#1a1a1a]">₹{(payment.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">Discount</span>
                    <span className="font-bold text-[#1a1a1a]">₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#666]">Taxes / Fees</span>
                    <span className="font-bold text-[#1a1a1a]">₹0</span>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-[#f0f0f0] flex justify-between items-end">
                  <span className="text-[16px] font-bold text-[#1a1a1a]">Total</span>
                  <span className={`text-[28px] font-bold leading-none ${isFailed ? "text-[#1a1a1a]" : "text-[#157A4F]"}`}>₹{(payment.amount || 0).toLocaleString()}</span>
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
                <p className="text-[15px] font-bold text-[#1a1a1a]">{merchantProfile?.businessName || user?.name || "N/A"}</p>
              </div>
              <div className="lg:px-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Merchant ID</p>
                <p className="text-[15px] font-bold text-[#1a1a1a] truncate">{user?._id || "N/A"}</p>
              </div>
              <div className="lg:px-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Email</p>
                <p className="text-[15px] font-bold text-[#1a1a1a] truncate">{user?.email || "N/A"}</p>
              </div>
              <div className="lg:pl-6">
                <p className="text-[11px] font-semibold text-[#999] mb-1 uppercase tracking-wide">Phone</p>
                <p className="text-[15px] font-bold text-[#1a1a1a]">{user?.phone || merchantProfile?.phone || "N/A"}</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
