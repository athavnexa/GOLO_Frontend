"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import MerchantNavbar from "../MerchantNavbar";
import { apiClient } from "../../lib/api/core";;
import { 
  Users, 
  Gift, 
  Link as LinkIcon, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MerchantReferralsPage() {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);
  const [claimLoading, setClaimLoading] = useState(null);
  const [showFreeTierModal, setShowFreeTierModal] = useState(false);
  const [freeTierMessage, setFreeTierMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await apiClient("/merchant/referrals");
        if (response.success) {
          setReferralData(response);
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const [referralLink, setReferralLink] = useState("");

  const referralCode = referralData?.referralCode || user?.referralCode || "GOLO2026";

  // Set the referral link only on client side to avoid SSR hydration mismatch
  useEffect(() => {
    const link = referralData?.link || `${window.location.origin}/merchant-register?ref=${referralCode}`;
    setReferralLink(link);
  }, [referralData, referralCode]);
  
  const stats = referralData?.stats || {
    totalReferrals: 0,
    activeReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0
  };

  const referralHistory = referralData?.history || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClaim = async (referralId) => {
    setClaimLoading(referralId);
    try {
      const response = await apiClient(`/merchant/referrals/claim/${referralId}`, { method: 'POST' });
      if (response.success) {
        // Manually update the local state to show it was claimed
        setReferralData((prev) => {
          if (!prev) return prev;
          const newHistory = prev.history.map(r => r.id === referralId ? { ...r, status: 'VERIFIED', reward: 15 } : r);
          // Also update stats if needed
          return { ...prev, history: newHistory, stats: { ...prev.stats, activeReferrals: prev.stats.activeReferrals + 1, totalRewards: prev.stats.totalRewards + 15 } };
        });
      } else {
        if (response.message?.toLowerCase().includes('free tier') || response.message?.toLowerCase().includes('upgrade')) {
          setFreeTierMessage(response.message);
          setShowFreeTierModal(true);
        } else {
          alert(response.message || 'Failed to claim reward.');
        }
      }
    } catch (error) {
      if (error.message?.toLowerCase().includes('free tier') || error.message?.toLowerCase().includes('upgrade')) {
        setFreeTierMessage(error.message);
        setShowFreeTierModal(true);
      } else {
        console.error('Claim error:', error);
        alert(error.message || 'An error occurred while claiming.');
      }
    } finally {
      setClaimLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1b1b1b]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="referrals" />
      
      <main className="w-full px-8 lg:px-10 py-8">
        <div className="mx-auto w-full max-w-[1400px] space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">Referrals & Rewards</h1>
              <p className="text-[#666] text-[15px] mt-2 max-w-2xl">
                Invite other businesses and users to join GOLO. Earn exclusive rewards and wallet credits for every successful referral.
              </p>
            </div>
            <div className="flex items-center justify-end">
              {/* Reward Badge */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC] rounded-2xl px-4 py-2.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#157A4F] flex items-center justify-center shadow-sm shrink-0">
                  <Gift size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#166534] leading-none mb-0.5">Your Reward</p>
                  <p className="text-[14px] font-extrabold text-[#14532D] leading-tight">+15 Days Subscription Extension</p>
                  <p className="text-[10px] text-[#16A34A] font-medium">per successful referral</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Share Card (Glassmorphism + Gradient) */}
          <div className="w-full rounded-[24px] overflow-hidden relative shadow-lg">
            {/* Vibrant Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#157A4F] via-[#1b9a64] to-[#0d4f33] z-0"></div>
            
            {/* Decorative Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

            <div className="relative z-10 p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1 text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[12px] font-medium tracking-wide uppercase mb-4">
                  <Gift size={14} /> Earn 15 Days Extension per invite
                </div>
                <h2 className="text-[36px] font-bold leading-tight mb-3">Share GOLO with your network</h2>
                <p className="text-white/80 text-[16px] max-w-lg leading-relaxed">
                  Give your friends exclusive signup bonuses and earn a 15-day free extension to your subscription when they make their first transaction on the platform.
                </p>
              </div>

              {/* Glassmorphic Action Cards */}
              <div className="flex-shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                {/* Referral Code Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[16px] p-5 flex flex-col gap-3 min-w-[240px]">
                  <p className="text-white/70 text-[13px] font-medium">Your Invite Code</p>
                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                    <span className="text-[20px] font-bold tracking-widest text-white">{referralCode}</span>
                    <button 
                      onClick={handleCopyCode}
                      className="text-white hover:text-[#a7f3d0] transition-colors p-1"
                      title="Copy Code"
                    >
                      {copiedCode ? <CheckCircle2 size={20} className="text-[#a7f3d0]" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                {/* Referral Link Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[16px] p-5 flex flex-col gap-3 min-w-[300px]">
                  <p className="text-white/70 text-[13px] font-medium">Your Share Link</p>
                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                    <span className="text-[14px] text-white/90 truncate mr-3">{referralLink}</span>
                    <button 
                      onClick={handleCopyLink}
                      className="bg-white text-[#157A4F] px-4 py-1.5 rounded-md text-[13px] font-bold hover:bg-[#f0fdf4] transition-colors flex items-center gap-2"
                    >
                      {copiedLink ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#157A4F] transition-colors">
              <div>
                <p className="text-[14px] text-[#666] font-medium mb-1">Total Referrals</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[36px] font-extrabold text-[#1a1a1a]">{stats.totalReferrals}</h3>
                  <span className="text-[13px] text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <TrendingUp size={12} /> +3 this week
                  </span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-[#f8f9fa] flex items-center justify-center group-hover:bg-[#F0FDF4] group-hover:scale-110 transition-all">
                <Users size={28} className="text-[#1a1a1a] group-hover:text-[#157A4F] transition-colors" />
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-[#157A4F] transition-colors">
              <div>
                <p className="text-[14px] text-[#666] font-medium mb-1">Total Days Earned</p>
                <h3 className="text-[36px] font-extrabold text-[#1a1a1a]">{stats.totalRewards.toLocaleString()}</h3>
                <p className="text-[13px] text-[#999] mt-1">Added to your plan</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-[#f8f9fa] flex items-center justify-center group-hover:bg-[#F0FDF4] group-hover:scale-110 transition-all">
                <Award size={28} className="text-[#1a1a1a] group-hover:text-[#157A4F] transition-colors" />
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-center">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[14px] text-[#1a1a1a] font-semibold">Conversion Rate</p>
                <span className="text-[14px] font-bold text-[#157A4F]">75%</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#157A4F] rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[12px] text-[#666]">
                <strong className="text-[#1a1a1a]">{stats.activeReferrals} Verified</strong> out of {stats.totalReferrals} total invites
              </p>
            </div>
          </div>
          
          {/* Main Table Container */}
          <div className="rounded-[16px] border border-[#e5e5e5] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-8 py-6 border-b border-[#e5e5e5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F0FDF4] rounded-lg">
                  <Clock className="text-[#157A4F]" size={20} />
                </div>
                <h2 className="text-[18px] font-bold text-[#1a1a1a]">Referral History</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#666] font-medium mr-2">Filter by:</span>
                <select className="border border-[#e5e5e5] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1a1a] outline-none hover:border-[#ccc] focus:border-[#157A4F] transition-colors">
                  <option>All Referrals</option>
                  <option>Verified</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                    <th className="px-8 py-4 text-[13px] font-semibold text-[#666] uppercase tracking-wider">Referred User</th>
                    <th className="px-8 py-4 text-[13px] font-semibold text-[#666] uppercase tracking-wider">Date Joined</th>
                    <th className="px-8 py-4 text-[13px] font-semibold text-[#666] uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-[13px] font-semibold text-[#666] uppercase tracking-wider text-right">Reward (Days)</th>
                  </tr>
                </thead>
                <tbody>
                  {referralHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-8 text-center text-gray-500">
                        No referrals found. Share your link to start earning!
                      </td>
                    </tr>
                  )}
                  {referralHistory.map((referral) => (
                    <tr key={referral.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#157A4F] to-[#1b9a64] text-white flex items-center justify-center font-bold text-sm">
                            {referral.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#1a1a1a]">{referral.name}</p>
                            <p className="text-[12px] text-[#666]">{referral.type} Account</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[14px] text-[#666] font-medium">
                        {new Date(referral.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                          referral.status === 'VERIFIED' ? 'bg-[#F0FDF4] text-[#166534]' : referral.status === 'QUALIFIED' ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#FFFBEB] text-[#B45309]'
                        }`}>
                          {referral.status === 'VERIFIED' ? <CheckCircle2 size={14} /> : referral.status === 'QUALIFIED' ? <Gift size={14} /> : <Clock size={14} />}
                          {referral.status === 'VERIFIED' ? 'Reward Credited' : referral.status === 'QUALIFIED' ? 'Qualified · Ready to Claim' : 'Registered · Pending Purchase'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {referral.status === 'VERIFIED' && referral.reward != null ? (
                          <span className="text-[15px] font-bold text-[#157A4F]">+{referral.reward} Days</span>
                        ) : referral.status === 'QUALIFIED' ? (
                          <button 
                            onClick={() => handleClaim(referral.id)}
                            disabled={claimLoading === referral.id}
                            className="bg-[#157A4F] text-white px-4 py-1.5 rounded-lg text-[13px] font-bold hover:bg-[#11623f] transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto"
                          >
                            {claimLoading === referral.id ? 'Claiming...' : 'Claim Reward'}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#B45309] bg-[#FFFBEB] px-2 py-1 rounded-md">
                            <Clock size={12} />
                            Awaiting first purchase
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between px-8 py-5 bg-[#fafafa] border-t border-[#e5e5e5]">
              <p className="text-[13px] text-[#666] font-medium">Showing <strong className="text-[#1a1a1a]">1 to 5</strong> of {stats.totalReferrals} entries</p>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-lg border border-[#e5e5e5] bg-white flex items-center justify-center text-[#999] hover:bg-[#f5f5f5] transition-colors">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <button className="h-9 w-9 rounded-lg bg-[#157A4F] text-white flex items-center justify-center text-[13px] font-bold shadow-sm">1</button>
                <button className="h-9 w-9 rounded-lg border border-[#e5e5e5] bg-white flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors font-medium text-[13px]">2</button>
                <button className="h-9 w-9 rounded-lg border border-[#e5e5e5] bg-white flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors font-medium text-[13px]">3</button>
                <button className="h-9 w-9 rounded-lg border border-[#e5e5e5] bg-white flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Free Tier Modal */}
      {showFreeTierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Award className="text-red-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">Upgrade Required</h3>
            <p className="text-center text-gray-600 mb-8 leading-relaxed">
              {freeTierMessage || "You cannot claim this reward on the Free tier. Please upgrade to a Paid plan to claim your 15-day extension."}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/merchant/upgrade')}
                className="w-full bg-[#157A4F] text-white font-bold py-4 rounded-xl hover:bg-[#11623f] transition-colors shadow-lg shadow-[#157A4F]/20 text-[15px]"
              >
                View Paid Plans
              </button>
              <button 
                onClick={() => setShowFreeTierModal(false)}
                className="w-full bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-100 transition-colors text-[15px]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
