"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, EyeOff, Eye, X, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MerchantLoginPage() {
  const quotes = [
    "Maximize your ROI with our AI-driven ad placement strategy.",
    "Real-time analytics that give you the edge over competitors.",
    "The simplest way to manage global ad campaigns in one place."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

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
    const mail = inviteEmail.trim().toLowerCase();
    if (!mail) { setInviteError("Please enter your email address."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) { setInviteError("Please enter a valid email address."); return; }

    setInviteLoading(true);
    setInviteError("");
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const res = await fetch(`${apiBase}/merchant/send-registration-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mail }),
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

  // Handle redirect param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get("reason");
      if (reason === "session_expired") setSessionExpired(true);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if ((user?.accountType || "merchant") === "merchant") {
        router.push("/merchant/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleForgotPassword = () => {
    const cleanEmail = email.trim().toLowerCase();
    router.push(cleanEmail ? `/check-email?email=${encodeURIComponent(cleanEmail)}` : "/check-email");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!validateEmail()) return;
    if (!password.trim()) {
      setLoginError("Password is required.");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password, "merchant");
      router.push("/merchant/dashboard");
    } catch (error) {
      const errorMsg = error.data?.message || "Login failed. Please check your credentials.";
      setLoginError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>

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
                  Get your registration link instantly — it&apos;s free!
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
                      We&apos;ve sent a welcome email to{" "}
                      <strong className="text-[#157a4f]">{inviteEmail}</strong>{" "}
                      with your registration link. Please check your inbox (and spam folder).
                    </p>
                    <div className="bg-[#f0faf5] border border-[#c3e6d4] rounded-xl px-4 py-3 text-[12px] text-[#0f5c3d] font-semibold mb-6">
                      📧 Don&apos;t see it? Check your spam / promotions folder.
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
                      Enter your business email and we&apos;ll send you a welcome email with your merchant registration link.
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
                      <button type="button" onClick={closeInviteModal} className="text-[#f3b12a] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">
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

      <div className="flex h-screen w-full overflow-hidden bg-white font-sans text-gray-900">
        
        {/* LEFT SIDE - Cream Background */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-[#FCFAEB] relative">
          <div className="flex flex-col items-center justify-center text-center max-w-sm px-4">
            {/* Double Quote icon */}
            <div className="mb-6 text-[#F8E1BA] text-7xl leading-none font-serif font-black">&rdquo;</div>
            
            {/* Logo Square */}
            <div className="w-20 h-20 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-10 shadow-sm">
              <span className="text-white text-5xl font-bold">G</span>
            </div>
            
            {/* Text */}
            <h1 className="text-[22px] font-bold text-[#763645] mb-12 leading-relaxed">
              The simplest way to<br/>manage global ad<br/>campaigns in one place.
            </h1>
            
            {/* Pagination */}
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] hover:text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold">‹</span>
              </button>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FDE68A]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FDE68A]"></span>
              </div>
              <button className="w-8 h-8 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#9CA3AF] hover:text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - White Background */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 relative">
          
          {/* The Card */}
          <div className="w-full max-w-[460px] bg-white rounded-[24px] p-8 lg:p-10 border border-gray-200 shadow-[0_12px_40px_rgb(0,0,0,0.06)] relative z-10">
            <h2 className="text-2xl lg:text-[26px] font-extrabold text-center text-gray-900 mb-2">
              Merchant Portal Login
            </h2>
            <p className="text-center text-gray-500 text-[13px] mb-8">
              Manage Your Store & Campaigns
            </p>
            
            {/* Social Buttons */}
            <div className="flex gap-4 mb-7">
              <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-semibold text-gray-700">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-semibold text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-white px-3 text-gray-400">
                  OR SIGN IN WITH
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              {/* Session Expired Banner */}
              {sessionExpired && (
                <p className="text-[#92400E] bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-2.5 text-xs mb-4 text-center">
                  ⚠️ Your session expired. Please log in again to continue.
                </p>
              )}
              
              {/* Login Error */}
              {loginError && (
                <p className="text-red-500 text-xs mb-4 text-center">
                  {loginError}
                </p>
              )}

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    placeholder="Enter store email"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors text-gray-800"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setLoginError("");
                    }}
                  />
                </div>
                {emailError && <p className="text-red-500 text-xs mt-1.5">{emailError}</p>}
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors text-gray-800"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none cursor-pointer p-0"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mb-6">
                <button 
                  type="button" 
                  onClick={handleForgotPassword} 
                  className="text-[#F59E0B] text-[11px] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F59E0B] hover:bg-[#E69309] text-white font-bold py-3 rounded-xl transition-colors text-[14px] shadow-sm cursor-pointer"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </button>
            </form>

            {/* Footer — Register Now opens invite modal */}
            <div className="mt-6 text-center text-[12px] text-gray-500">
              New to Ad Network Group?{" "}
              <button
                type="button"
                onClick={openInviteModal}
                className="text-[#F59E0B] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </AuthLayout>
  );
}
