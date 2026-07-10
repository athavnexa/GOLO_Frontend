"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { 
  BarChart3, Globe, QrCode, Sparkles, Star, 
  Smartphone, ChevronRight, Check, MapPin, 
  ChevronDown, Box, Ticket, UserCheck, MoreVertical,
  X, Mail, CheckCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FadeInScroll({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function MerchantLandingPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // --- Invite Popup State ---
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const modalRef = useRef(null);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeInviteModal(); };
    if (showInviteModal) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showInviteModal]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showInviteModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showInviteModal]);

  const openInviteModal = () => {
    setInviteEmail("");
    setInviteError("");
    setInviteSuccess(false);
    setShowInviteModal(true);
    setShowMenu(false);
  };

  const closeInviteModal = () => {
    if (inviteLoading) return;
    setShowInviteModal(false);
    setInviteSuccess(false);
    setInviteError("");
    setInviteEmail("");
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) { setInviteError("Please enter your email address."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setInviteError("Please enter a valid email address."); return; }

    setInviteLoading(true);
    setInviteError("");
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const res = await fetch(`${apiBase}/merchant/send-registration-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to send email.");
      setInviteSuccess(true);
    } catch (err) {
      setInviteError(err.message || "Something went wrong. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1e2228] font-sans antialiased">

      {/* ===== MERCHANT INVITE POPUP MODAL ===== */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeInviteModal(); }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={closeInviteModal}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} className="text-gray-600" />
              </button>

              {/* Green top bar */}
              <div className="bg-gradient-to-r from-[#157a4f] to-[#1aaa6b] px-8 pt-8 pb-7 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3b12a] shadow-lg mb-4">
                  <span className="text-white text-2xl font-black">G</span>
                </div>
                <h2 className="text-white text-xl font-extrabold leading-tight mb-1">
                  Join GOLO as a Merchant
                </h2>
                <p className="text-green-100 text-[13px]">
                  Get your registration link instantly — it's free!
                </p>
              </div>

              {/* Body */}
              <div className="px-8 py-8">
                {inviteSuccess ? (
                  /* Success State */
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto bg-[#e8f5ed] rounded-full flex items-center justify-center mb-5">
                      <CheckCircle size={32} className="text-[#157a4f]" />
                    </div>
                    <h3 className="text-[#111827] font-extrabold text-lg mb-2">
                      Check Your Inbox!
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                      We've sent a welcome email to <strong className="text-[#157a4f]">{inviteEmail}</strong> with your registration link. Please check your inbox (and spam folder).
                    </p>
                    <div className="bg-[#f0faf5] border border-[#c3e6d4] rounded-xl px-4 py-3 text-[12px] text-[#0f5c3d] font-semibold mb-6">
                      📧 Don't see it? Check your spam / promotions folder.
                    </div>
                    <button
                      onClick={closeInviteModal}
                      className="w-full bg-[#157a4f] hover:bg-[#0f5c3d] text-white font-bold py-3 rounded-xl transition-colors text-[14px] cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  /* Email Form */
                  <form onSubmit={handleInviteSubmit}>
                    <p className="text-gray-600 text-[13px] leading-relaxed mb-6 text-center">
                      Enter your business email and we'll send you a welcome email with your merchant registration link.
                    </p>

                    {inviteError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-[12px] font-semibold mb-4 text-center">
                        {inviteError}
                      </div>
                    )}

                    <div className="mb-5">
                      <label className="block text-[12px] font-bold text-gray-700 mb-2">Business Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          autoFocus
                          placeholder="yourstore@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#157a4f] focus:ring-2 focus:ring-[#157a4f]/20 transition-all text-gray-800"
                          value={inviteEmail}
                          onChange={(e) => { setInviteEmail(e.target.value); setInviteError(""); }}
                          disabled={inviteLoading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={inviteLoading}
                      className="w-full bg-[#f3b12a] hover:bg-[#e0a022] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-[14px] shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {inviteLoading ? (
                        <><Loader2 size={16} className="animate-spin" /> Sending...</>
                      ) : (
                        "Send Registration Link"
                      )}
                    </button>

                    <p className="text-center text-[11px] text-gray-400 mt-3">
                      Already registered?{" "}
                      <button type="button" onClick={() => { closeInviteModal(); router.push("/merchant-login"); }} className="text-[#f3b12a] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">
                        Sign In
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-[9999] bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/merchant" className="flex items-center gap-2">
            <div className="flex h-10 px-5 items-center justify-center rounded-xl bg-[#f3b12a] text-white font-extrabold text-lg shadow-sm">
              GOLO
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/merchant-login" className="text-sm font-bold text-[#f3b12a] hover:text-[#e0a022] transition-colors">
              Sign In
            </Link>
            <button
              onClick={openInviteModal}
              className="h-10 px-6 rounded-full bg-[#157a4f] hover:bg-[#0f5c3d] text-white font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer"
            >
              Become a Merchant
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 shadow-sm hover:bg-gray-100 transition-colors"
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 flex flex-col gap-2 px-3">
                <button
                  onClick={openInviteModal}
                  className="w-full h-10 rounded-full bg-[#157a4f] text-white font-bold text-sm shadow-sm hover:bg-[#0f5c3d] transition-colors cursor-pointer"
                >
                  Become a Merchant
                </button>
                <Link href="/merchant-login" onClick={() => setShowMenu(false)}>
                  <button className="w-full h-10 rounded-full border-2 border-[#f3b12a] text-[#f3b12a] font-bold text-sm bg-white hover:bg-[#fff4de] transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 py-12 lg:py-24 max-w-[1400px] mx-auto bg-white overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <FadeInScroll delay={0.1} className="space-y-6 lg:max-w-xl">
            <h1 className="text-5xl sm:text-[64px] font-extrabold text-[#1e2228] leading-[1.1] tracking-tight">
              Grow Your Local <br />
              <span className="text-[#157a4f]">Business with</span> <br />
              <span className="text-[#157a4f]">GOLO</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
              Connect with local shoppers, digitize your store, and manage your offers—all from one platform designed for local growth.
            </p>
            <div className="pt-2">
              <button
                onClick={openInviteModal}
                className="h-12 px-8 rounded-xl bg-[#f3b12a] hover:bg-[#e0a022] text-[#1e2228] font-bold text-base shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Become a Merchant
              </button>
            </div>
          </FadeInScroll>
          {/* Right Image */}
          <FadeInScroll delay={0.2} className="relative w-full aspect-[4/3]">
            <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl bg-gray-100 group">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" 
                alt="Merchant working on laptop" 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating Analytics Card */}
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 md:-bottom-8 md:-left-8 bg-white rounded-2xl p-4 md:p-5 shadow-2xl border border-gray-100 flex flex-col gap-2 z-10 w-44 md:w-48 animate-[bounce_3s_infinite] scale-[0.65] sm:scale-100 origin-bottom-left">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#e8f5ed] flex items-center justify-center text-[#157a4f]">
                  <BarChart3 size={20} />
                </div>
                <span className="text-[#157a4f] text-xs font-bold bg-[#e8f5ed] px-2 py-1 rounded-full">+48%</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Weekly Views</p>
                <p className="text-xl font-extrabold text-gray-900">24,592</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div className="w-[75%] h-full bg-[#157a4f] rounded-full"></div>
              </div>
            </div>
            
            {/* Second Floating Analytics Card */}
            <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 bg-white rounded-2xl p-4 md:p-5 shadow-2xl border border-gray-100 flex flex-col gap-2 z-10 w-44 md:w-48 animate-[bounce_4s_infinite] scale-[0.65] sm:scale-100 origin-top-right">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#fff4de] flex items-center justify-center text-[#f3b12a]">
                  <UserCheck size={20} />
                </div>
                <span className="text-[#f3b12a] text-xs font-bold bg-[#fff4de] px-2 py-1 rounded-full">+12 Today</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">New Customers</p>
                <p className="text-xl font-extrabold text-gray-900">143</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div className="w-[85%] h-full bg-[#f3b12a] rounded-full"></div>
              </div>
            </div>
          </FadeInScroll>
        </div>
      </section>

      {/* HOW GOLO WORKS */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-[#fef9f5]">
        <FadeInScroll delay={0.1} className="max-w-[1500px] mx-auto space-y-10 md:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">How GOLO Works</h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">Simple steps to get your local business online and thriving.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-md border-2 border-gray-100">
              <div className="w-16 h-16 mx-auto bg-[#fdf2d0] rounded-full flex items-center justify-center text-[#f3b12a]">
                <UserCheck size={28} />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">Register Your Business</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sign up in minutes with your store details, location, and operating hours.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-md border-2 border-gray-100">
              <div className="w-16 h-16 mx-auto bg-[#fdf2d0] rounded-full flex items-center justify-center text-[#f3b12a]">
                <Ticket size={28} />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">Create an Offer</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Set up discounts and promotional deals to attract nearby shoppers.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-md border-2 border-gray-100">
              <div className="w-16 h-16 mx-auto bg-[#fdf2d0] rounded-full flex items-center justify-center text-[#f3b12a]">
                <BarChart3 size={28} />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">Get Customers & Grow</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Watch shoppers claim your offers, visit your store, and boost your revenue.
              </p>
            </div>
          </div>
        </FadeInScroll>
      </section>

      {/* EVERYTHING YOUR BUSINESS NEEDS TO GROW */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-[1500px] mx-auto space-y-10 md:space-y-12">
        <FadeInScroll delay={0.1} className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Everything Your Business <br /> Needs to Grow
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Powerful tools designed specifically for local merchants.
          </p>
        </FadeInScroll>

        <div className="space-y-6">
          {/* Top Two Large Cards */}
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
            {/* Promo Card */}
            <FadeInScroll delay={0.2} className="bg-gradient-to-br from-[#e8f5ed] to-[#d0ebd9] rounded-[32px] p-10 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-xl shadow-[#157a4f]/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <QrCode size={250} />
              </div>
              <div className="space-y-4 relative z-10">
                <span className="bg-white/60 text-[#157a4f] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  SPECIAL OFFER
                </span>
                <h3 className="text-3xl font-extrabold text-[#0f5c3d] leading-tight max-w-sm">
                  Enjoy all premium features completely free for the first 50 days
                </h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center gap-2 text-xs font-bold text-[#157a4f]">
                    <Check size={14} /> Full Analytics Access
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-[#157a4f]">
                    <Check size={14} /> Unlimited Offers
                  </li>
                </ul>
              </div>
              <button
                onClick={openInviteModal}
                className="bg-white text-[#157a4f] hover:bg-gray-50 w-fit h-11 px-6 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5 relative z-10 cursor-pointer"
              >
                Claim Offer Now <ChevronRight size={14} />
              </button>
            </FadeInScroll>

            {/* Analytics Preview Card */}
            <FadeInScroll delay={0.3} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#157a4f]">
                  <BarChart3 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Analytics</span>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900">Advanced Business Analytics</h4>
                <p className="text-xs text-gray-500">Track your daily views, customer visits, and offer claims in real-time.</p>
              </div>
              <div className="mt-8 flex items-end gap-3 h-24">
                <div className="w-full bg-[#157a4f] rounded-t-md h-[40%]" />
                <div className="w-full bg-[#157a4f] rounded-t-md h-[70%]" />
                <div className="w-full bg-[#157a4f] rounded-t-md h-[50%]" />
                <div className="w-full bg-[#157a4f] rounded-t-md h-[90%]" />
                <div className="w-full bg-[#157a4f] rounded-t-md h-[100%]" />
                <div className="w-full bg-[#f3b12a] rounded-t-md h-[60%]" />
                <div className="w-full bg-gray-100 rounded-t-md h-[30%]" />
              </div>
            </FadeInScroll>
          </div>

          {/* Grid of features (8 Cards) */}
          <FadeInScroll delay={0.4} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            
            {/* Card 1: Flexible Subscription Plans */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                  <span className="font-bold text-sm">$</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Flexible Subscription Plans</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Choose a plan that fits your growth stage after the initial trial.
                </p>
              </div>
              <Link href="/merchant/upgrade" className="text-xs font-bold text-[#157a4f] hover:underline flex items-center gap-1 w-fit">
                View Plans <ChevronRight size={12} />
              </Link>
            </div>

            {/* Card 2: Digital Business Visibility */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                <Globe size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Digital Business Visibility</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Reach more customers across the city through our localized search engine.
              </p>
            </div>

            {/* Card 3: Inventory Management */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                <Box size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Inventory Management</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manage all your products, variations, and stocks from a simplified merchant dashboard.
              </p>
            </div>

            {/* Card 4: City-Wide Customer Reach */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                <MapPin size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">City-Wide Customer Reach</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Break local barriers and let people from all corners of the city find your store.
              </p>
            </div>

            {/* Card 5: Product Offers & Deals */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                <Ticket size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Product Offers & Deals</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Create exclusive verified deals to drive footfall to your physical shop.
              </p>
            </div>

            {/* Card 6: Banner Promotions */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                <Sparkles size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Banner Promotions</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Spotlight your business on the homepage with high-impact display banners.
              </p>
            </div>

            {/* Card 7: Customer Reviews & Ratings */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                <Star size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Customer Reviews & Ratings</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Build organic trust with genuine verified buyer feedback and ratings.
              </p>
            </div>

            {/* Card 8: Mini Business Website */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#157a4f]/40 p-7 min-h-[230px] space-y-4 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#157a4f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ed] text-[#157a4f]">
                    <Globe size={20} />
                  </div>
                  <span className="text-[9px] font-bold text-[#f3b12a] bg-[#fdf2d0] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    COMING SOON
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Mini Business Website</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  A dedicated, SEO-optimized page specifically for your shop.
                </p>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs font-bold text-[#157a4f] hover:underline cursor-pointer flex items-center gap-1">
                  See All <ChevronRight size={12} />
                </span>
              </div>
            </div>

          </FadeInScroll>
        </div>
      </section>

      {/* YOUR BUSINESS, ITS OWN WEBSITE */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#fef9f5]">
        <FadeInScroll delay={0.1} className="max-w-[1500px] mx-auto space-y-10 md:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Your Business, <br />
              <span className="text-[#f3b12a]">Its Own Website.</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Choose a template, customize it, and get a professional website for your store.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Template 1 */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="relative aspect-[4/5] w-full bg-white flex flex-col border-b border-gray-100 overflow-hidden">
                {/* Browser Top Bar */}
                <div className="h-5 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5 w-full shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                {/* Navbar Mockup */}
                <div className="h-8 flex items-center justify-between px-4 border-b border-gray-50 shrink-0">
                  <div className="w-10 h-2.5 bg-gray-200 rounded-sm"></div>
                  <div className="flex gap-2.5">
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                  </div>
                </div>
                {/* Hero Banner with Specific Image */}
                <div className="h-[55%] relative overflow-hidden flex flex-col justify-center items-center p-4 text-center shrink-0">
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" alt="Food & Dining" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 space-y-2">
                    <div className="w-20 h-3.5 bg-white rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-32 h-2 bg-white/80 rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-12 h-3.5 bg-[#f3b12a] rounded-sm mx-auto mt-3 shadow-sm"></div>
                  </div>
                </div>
                {/* Below the Fold: Services / Features Skeleton */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-center gap-3">
                  <div className="w-24 h-2 bg-gray-300 rounded-sm mx-auto mb-1"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-20 bg-[#f3b12a] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  NEW TEMPLATE
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white relative z-30">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">Food & Dining</h4>
                  <p className="text-xs text-gray-400 mt-1">Classic & Clean</p>
                </div>
                <span className="text-xs font-bold text-[#157a4f] group-hover:underline flex items-center gap-1">
                  Preview Template <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Template 2 */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="relative aspect-[4/5] w-full bg-white flex flex-col border-b border-gray-100 overflow-hidden">
                {/* Browser Top Bar */}
                <div className="h-5 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5 w-full shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                {/* Navbar Mockup */}
                <div className="h-8 flex items-center justify-between px-4 border-b border-gray-50 shrink-0">
                  <div className="w-10 h-2.5 bg-gray-200 rounded-sm"></div>
                  <div className="flex gap-2.5">
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                  </div>
                </div>
                {/* Hero Banner with Specific Image */}
                <div className="h-[55%] relative overflow-hidden flex flex-col justify-center items-center p-4 text-center shrink-0">
                  <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" alt="Retail & Clothing" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="relative z-10 space-y-2">
                    <div className="w-24 h-3.5 bg-white rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-16 h-2 bg-white/80 rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-12 h-3.5 bg-[#157a4f] rounded-sm mx-auto mt-3 shadow-sm"></div>
                  </div>
                </div>
                {/* Below the Fold: Services / Features Skeleton */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-center gap-3">
                  <div className="w-24 h-2 bg-gray-300 rounded-sm mx-auto mb-1"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-20 bg-[#157a4f] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  MOST POPULAR
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white relative z-30">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">Retail & Clothing</h4>
                  <p className="text-xs text-gray-400 mt-1">Modern & Elegance</p>
                </div>
                <span className="text-xs font-bold text-[#157a4f] group-hover:underline flex items-center gap-1">
                  Preview Template <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Template 3 */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="relative aspect-[4/5] w-full bg-white flex flex-col border-b border-gray-100 overflow-hidden">
                {/* Browser Top Bar */}
                <div className="h-5 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5 w-full shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                {/* Navbar Mockup */}
                <div className="h-8 flex items-center justify-between px-4 border-b border-gray-50 shrink-0">
                  <div className="w-10 h-2.5 bg-gray-200 rounded-sm"></div>
                  <div className="flex gap-2.5">
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                  </div>
                </div>
                {/* Hero Banner with Specific Image */}
                <div className="h-[55%] relative overflow-hidden flex flex-col justify-center items-center p-4 text-center shrink-0">
                  <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" alt="Spa & Wellness" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 space-y-2">
                    <div className="w-16 h-3.5 bg-white rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-20 h-2 bg-white/80 rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-12 h-3.5 bg-gray-800 rounded-sm mx-auto mt-3 shadow-sm"></div>
                  </div>
                </div>
                {/* Below the Fold: Services / Features Skeleton */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-center gap-3">
                  <div className="w-24 h-2 bg-gray-300 rounded-sm mx-auto mb-1"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white relative z-30">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">Spa & Wellness</h4>
                  <p className="text-xs text-gray-400 mt-1">Minimal & Calm</p>
                </div>
                <span className="text-xs font-bold text-[#157a4f] group-hover:underline flex items-center gap-1">
                  Preview Template <ChevronRight size={14} />
                </span>
              </div>
            </div>

            {/* Template 4 */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="relative aspect-[4/5] w-full bg-white flex flex-col border-b border-gray-100 overflow-hidden">
                {/* Browser Top Bar */}
                <div className="h-5 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5 w-full shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                {/* Navbar Mockup */}
                <div className="h-8 flex items-center justify-between px-4 border-b border-gray-50 shrink-0">
                  <div className="w-10 h-2.5 bg-gray-200 rounded-sm"></div>
                  <div className="flex gap-2.5">
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-5 h-1.5 bg-gray-200 rounded-sm"></div>
                  </div>
                </div>
                {/* Hero Banner with Specific Image */}
                <div className="h-[55%] relative overflow-hidden flex flex-col justify-center items-center p-4 text-center shrink-0">
                  <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" alt="Fitness & Gym" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 space-y-2">
                    <div className="w-24 h-3.5 bg-white rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-28 h-2 bg-white/80 rounded-sm mx-auto shadow-sm"></div>
                    <div className="w-12 h-3.5 bg-[#f3b12a] rounded-sm mx-auto mt-3 shadow-sm"></div>
                  </div>
                </div>
                {/* Below the Fold: Services / Features Skeleton */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-center gap-3">
                  <div className="w-24 h-2 bg-gray-300 rounded-sm mx-auto mb-1"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full aspect-video bg-gray-200 rounded-sm"></div>
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white relative z-30">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">Fitness & Gym</h4>
                  <p className="text-xs text-gray-400 mt-1">Bold & Dynamic</p>
                </div>
                <span className="text-xs font-bold text-[#157a4f] group-hover:underline flex items-center gap-1">
                  Preview Template <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </FadeInScroll>
      </section>

      {/* READY TO GROW YOUR BUSINESS? */}
      <section className="py-12 md:py-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <FadeInScroll delay={0.2} className="bg-[#0f5c3d] rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-[#157a4f]/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="p-8 md:p-16 flex-1 flex flex-col justify-center space-y-6 text-white relative z-10">
            <div>
              <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                SPECIAL OFFER
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mt-1">
                Ready to Grow <br /> Your Business?
              </h2>
            </div>
            <p className="text-base text-green-50 max-w-lg leading-relaxed">
              Join thousands of local merchants utilizing GOLO. Sign up today and get a <strong className="text-white">50-day free trial</strong> with full access to all premium features—no credit card required!
            </p>
            <div className="pt-3 flex items-center gap-4">
              <button
                onClick={openInviteModal}
                className="bg-[#f3b12a] hover:bg-[#e0a022] text-[#1e2228] h-12 px-8 rounded-full font-extrabold text-sm shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
              >
                Start 50-Day Free Trial
              </button>
            </div>
          </div>
          <div className="md:w-[45%] relative min-h-[350px] md:min-h-[auto]">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80" 
              alt="Merchant handing shopping bag to customer" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </FadeInScroll>
      </section>

      {/* GET MERCHANT GROWTH TIPS */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center space-y-6">
        <FadeInScroll delay={0.2} className="space-y-6">
          <div className="w-16 h-16 mx-auto bg-[#fef9f5] rounded-2xl flex items-center justify-center text-[#f3b12a] shadow-sm border border-[#f3b12a]/10">
          <Box size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Get Merchant Growth Tips</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Subscribe to our newsletter for exclusive tips, marketing strategies, and GOLO platform updates directly to your inbox.
          </p>
        </div>
        <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto relative mt-4 shadow-sm rounded-full">
          <input 
            type="email" 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email address" 
            className="w-full h-12 pl-6 pr-32 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#157a4f] transition-all bg-white"
            required
          />
          <button 
            type="submit" 
            className="absolute right-1 top-1 bottom-1 bg-[#157a4f] hover:bg-[#0f5c3d] text-white px-6 rounded-full font-bold text-sm shadow-sm transition-colors"
          >
            {subscribed ? "Subscribed!" : "Subscribe"}
          </button>
        </form>
        </FadeInScroll>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 px-3 items-center justify-center rounded-lg bg-[#f3b12a] text-white font-extrabold text-sm shadow-sm">
                GOLO
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              The ultimate local discovery platform. Empowering merchants and delighting shoppers everywhere.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Platform</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li><Link href="/" className="hover:text-[#157a4f] transition-colors">Home</Link></li>
              <li><Link href="/login" className="hover:text-[#157a4f] transition-colors">Shopper Login</Link></li>
              <li><Link href="/merchant" className="hover:text-[#157a4f] transition-colors">Merchant Portal</Link></li>
              <li><Link href="/register" className="hover:text-[#157a4f] transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Support & Legal</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li><Link href="/help" className="hover:text-[#157a4f] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-[#157a4f] transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-[#157a4f] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#157a4f] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Get the GOLO App</h4>
            <div className="space-y-3">
              <button className="w-full max-w-[140px] h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors">
                <span className="text-xs font-bold">App Store</span>
              </button>
              <button className="w-full max-w-[140px] h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors">
                <span className="text-xs font-bold">Google Play</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 GOLO Inc. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#157a4f] cursor-pointer"><Globe size={14} /></div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#157a4f] cursor-pointer"><Star size={14} /></div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#157a4f] cursor-pointer"><Box size={14} /></div>
          </div>
        </div>
      </footer>

    </div>
  );
}
