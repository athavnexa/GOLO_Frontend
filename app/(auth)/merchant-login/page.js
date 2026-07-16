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
      <div
        className="flex h-screen w-full overflow-hidden bg-white"
        style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      >
        {/* ─── LEFT PANEL ─── */}
        <div
          className="hidden lg:flex w-[46%] flex-col items-center justify-center relative"
          style={{ background: "#FAFAFA" }}
        >
          <div className="flex flex-col items-center gap-8 px-10 text-center relative w-full max-w-md">
            
            {/* White illustration card */}
            <div
              className="rounded-[28px] bg-white shadow-sm flex flex-col items-center p-8 relative mx-auto w-full max-w-[380px]"
            >
              {/* GOLO Logo (Floating outside top-left) */}
              <div className="absolute top-[-30px] left-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#157A4F] rounded-md flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 9l10 13 10-13L12 2z" fill="#FFF" fillOpacity="0.85" stroke="#FFF" strokeWidth="1.5"/>
                    <path d="M12 2L2 9h20L12 2z" fill="#FFF" fillOpacity="1"/>
                  </svg>
                </div>
                <span className="text-[18px] font-bold text-gray-800 tracking-wide">GOLO</span>
              </div>

              {/* Merchant Illustration */}
              <div className="relative flex items-center justify-center w-full bg-[#E5EEF5] rounded-2xl overflow-hidden" style={{ height: 280 }}>
                {/* Floating Badge (Left) - New Orders */}
                <div className="absolute left-[-10px] top-[140px] bg-white rounded-xl py-2 px-3 shadow-lg flex items-center gap-2 z-20 border border-gray-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span className="text-[11px] font-bold text-[#2196F3]">New Orders</span>
                </div>

                {/* Floating Badge (Top Right) - Revenue */}
                <div className="absolute right-[20px] top-[20px] bg-white rounded-xl py-2 px-3 shadow-lg flex items-center gap-2 z-20 border border-gray-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  <span className="text-[11px] font-bold text-gray-700">REVENUE</span>
                </div>

                {/* Floating Avatar (Top Left) - Handshake */}
                <div className="absolute left-[10px] top-[15px] w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-white z-20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M16 12h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM15 16H9c-1.3 0-2-1-2-2v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2c0 1-.7 2-2 2z"></path></svg>
                </div>

                {/* SVG Scene */}
                <svg
                  viewBox="0 0 300 280"
                  width="100%"
                  height="100%"
                  className="relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background elements */}
                  <rect x="0" y="160" width="300" height="120" fill="#C5D3E8" />
                  <rect x="230" y="50" width="70" height="230" fill="#94A3B8" /> {/* Shelves BG */}
                  <rect x="230" y="100" width="70" height="8" fill="#CBD5E1" />
                  <rect x="230" y="160" width="70" height="8" fill="#CBD5E1" />
                  <rect x="230" y="220" width="70" height="8" fill="#CBD5E1" />

                  {/* Items on shelves */}
                  <rect x="240" y="70" width="15" height="30" fill="#4CAF50" rx="2" />
                  <rect x="265" y="75" width="20" height="25" fill="#2196F3" rx="2" />
                  
                  <rect x="235" y="125" width="20" height="35" fill="#F44336" rx="5" />
                  <circle cx="275" cy="145" r="12" fill="#FF9800" />
                  <rect x="268" y="120" width="14" height="15" fill="#FF9800" />
                  
                  <rect x="240" y="185" width="25" height="35" fill="#E0E0E0" rx="2" />
                  <rect x="275" y="195" width="15" height="25" fill="#FFC107" rx="2" />

                  {/* Delivery Van */}
                  <path d="M-20 60 L120 60 L120 230 L-20 230 Z" fill="#607D8B" />
                  <path d="M-20 70 L110 70 L110 210 L-20 210 Z" fill="#37474F" />
                  {/* Van lights */}
                  <circle cx="100" cy="225" r="5" fill="#F44336" />
                  <circle cx="20" cy="225" r="5" fill="#F44336" />
                  <rect x="40" y="240" width="40" height="20" fill="#455A64" rx="5" />
                  
                  {/* Lights from ceiling */}
                  <path d="M60 0 L50 20 L70 20 Z" fill="#90A4AE" />
                  <rect x="58" y="20" width="4" height="5" fill="#FFF59D" />
                  <path d="M180 0 L170 20 L190 20 Z" fill="#90A4AE" />
                  <rect x="178" y="20" width="4" height="5" fill="#FFF59D" />

                  {/* Person with Hand Truck */}
                  <g transform="translate(130, 80)">
                    {/* Hand truck */}
                    <path d="M20 20 L20 150 L80 150" stroke="#455A64" strokeWidth="6" fill="none" />
                    <circle cx="25" cy="150" r="12" fill="#263238" />
                    <circle cx="25" cy="150" r="5" fill="#CFD8DC" />
                    
                    {/* Boxes on truck */}
                    <rect x="35" y="110" width="45" height="40" fill="#D4A020" rx="3" />
                    <rect x="30" y="70" width="55" height="40" fill="#E8B830" rx="3" />
                    <rect x="45" y="45" width="30" height="25" fill="#D4A020" rx="2" />
                    {/* Box details */}
                    <path d="M45 125 L70 125 M45 135 L60 135" stroke="#A87A13" strokeWidth="2" />
                    <path d="M40 85 L75 85" stroke="#A87A13" strokeWidth="2" />

                    {/* Person */}
                    <ellipse cx="-15" cy="40" rx="15" ry="18" fill="#F5C5A3" />
                    <path d="M-30 35 Q-15 15 -5 40" fill="#263238" />
                    {/* Body */}
                    <path d="M-30 65 L0 65 L5 120 L-35 120 Z" fill="#1976D2" />
                    <path d="M-30 65 L0 65 L0 120 L-30 120 Z" fill="#37474F" opacity="0.9" /> {/* Apron */}
                    <rect x="-20" y="80" width="15" height="5" fill="#2196F3" /> {/* Logo on apron */}
                    {/* Arms */}
                    <path d="M-25 70 Q-40 90 -20 100" stroke="#F5C5A3" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <path d="M0 70 Q15 90 20 85" stroke="#F5C5A3" strokeWidth="10" strokeLinecap="round" fill="none" />
                    {/* Clipboard/Tablet in hand */}
                    <rect x="15" y="70" width="15" height="25" fill="#90A4AE" rx="2" transform="rotate(20 15 70)" />
                    <rect x="17" y="72" width="11" height="21" fill="#E3F2FD" rx="1" transform="rotate(20 15 70)" />
                    {/* Legs */}
                    <path d="M-20 120 L-30 160" stroke="#1976D2" strokeWidth="12" strokeLinecap="round" />
                    <path d="M-5 120 L5 155" stroke="#1976D2" strokeWidth="12" strokeLinecap="round" />
                    {/* Shoes */}
                    <ellipse cx="-35" cy="162" rx="12" ry="6" fill="#263238" />
                    <ellipse cx="8" cy="158" rx="12" ry="6" fill="#263238" />
                  </g>

                  {/* Boxes on floor near van */}
                  <rect x="20" y="190" width="40" height="40" fill="#E8B830" rx="2" />
                  <rect x="25" y="150" width="30" height="40" fill="#D4A020" rx="2" />
                  <rect x="65" y="170" width="35" height="60" fill="#D4A020" rx="2" />
                  <rect x="40" y="195" width="25" height="35" fill="#FFB300" rx="2" />
                </svg>
              </div>
            </div>

            {/* Text below card */}
            <div className="flex flex-col items-center gap-2 max-w-[320px]">
              {/* Secure platform label */}
              <div className="flex items-center gap-2 text-[#157A4F] mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#157A4F" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-[#157A4F]">
                  Secure Platform
                </span>
              </div>

              <h2 className="text-[22px] font-extrabold text-gray-900 leading-tight">
                Elevate Your Business
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed px-2">
                Access your comprehensive merchant dashboard to manage inventory, analyze performance, and connect with local customers.
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-[420px]">
            {/* Title */}
            <h1 className="text-[26px] font-extrabold text-gray-900 text-center mb-1">
              Merchant Portal Login
            </h1>
            <p className="text-center text-[13px] text-gray-400 mb-7">
              Manage Your Store & Campaigns
            </p>

            {/* Session Expired */}
            {sessionExpired && (
              <p className="text-[#92400E] bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-2.5 text-xs mb-5 text-center">
                ⚠️ Your session expired. Please log in again to continue.
              </p>
            )}

            {/* Social Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white text-[13px] font-semibold text-gray-700">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.5-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5c-7.7 0-14.4 4.3-17.7 9.7z"/>
                  <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.5-5.2l-6.2-5.3C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.2-11.3-7.7l-6.5 5C9.5 40.7 16.2 45 24 45z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.3C36.9 40.2 44 35 44 25c0-1.3-.2-2.5-.4-3.9z"/>
                </svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white text-[13px] font-semibold text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  OR SIGN IN WITH
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} noValidate>
              {/* Login Error */}
              {loginError && (
                <p className="text-red-500 text-xs mb-4 text-center">{loginError}</p>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    type="email"
                    placeholder="Enter store email"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors text-gray-800 placeholder-gray-400"
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

              {/* Password */}
              <div className="mb-2">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 transition-colors text-gray-800 placeholder-gray-400"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-gray-700 text-[12px] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#157A4F] hover:bg-[#116340] text-white font-bold py-3.5 rounded-xl transition-colors text-[14px] shadow-sm cursor-pointer"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 text-center text-[12px] text-gray-500">
              New to Ad Network Group?{" "}
              <button
                type="button"
                onClick={openInviteModal}
                className="text-gray-900 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
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
