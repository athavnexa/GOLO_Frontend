"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState("user");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);

  const shouldGoToGolocalOnboarding = (targetEmail, userAccountType) => {
    if (typeof window === "undefined") return false;
    if (userAccountType !== "user") return false;
    const normalizedEmail = String(targetEmail || "").trim().toLowerCase();
    if (!normalizedEmail) return false;
    const pendingEmail = localStorage.getItem("golo_pending_first_login_email");
    const doneKey = `golo_golocal_onboarding_done_email_${normalizedEmail}`;
    return pendingEmail === normalizedEmail && localStorage.getItem(doneKey) !== "1";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get("reason");
      if (reason === "session_expired") setSessionExpired(true);
      const typeParam = params.get("type");
      if (typeParam === "merchant" || typeParam === "user") {
        setAccountType(typeParam);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const effectiveEmail = user?.email || email;
      const effectiveType = user?.accountType || accountType;
      if (shouldGoToGolocalOnboarding(effectiveEmail, effectiveType)) {
        router.push("/golocal/onboarding");
        return;
      }
      if (effectiveType === "merchant") {
        router.push("/merchant/dashboard");
        return;
      }
      router.push("/");
    }
  }, [isAuthenticated, user, router, email, accountType]);

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
      const response = await login(email, password, accountType);
      const authData = response?.data?.data || response?.data;
      const loggedInUser = authData?.user;
      if (shouldGoToGolocalOnboarding(loggedInUser?.email || email, loggedInUser?.accountType || accountType)) {
        router.push("/golocal/onboarding");
        return;
      }
      if ((loggedInUser?.accountType || accountType) === "merchant") {
        router.push("/merchant/dashboard");
        return;
      }
      router.push("/");
    } catch (error) {
      const errorMsg = error.data?.message || "Login failed. Please check your credentials.";
      setLoginError("");
      if (errorMsg.includes("merchant") || errorMsg.includes("Merchant") || errorMsg.includes("user") || errorMsg.includes("User")) {
        setPopupMessage(errorMsg);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
      } else {
        setLoginError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Account type mismatch popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-gray-800">Account Type Mismatch</h3>
            <p className="mb-4 text-center text-sm text-gray-600">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full rounded-lg bg-[#157A4F] py-2 text-sm font-semibold text-white transition hover:bg-[#145a3f]"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <AuthLayout>
        <div
          className="flex h-screen w-full overflow-hidden bg-white"
          style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
        >
          {/* ─── LEFT PANEL ─── */}
          <div
            className="hidden lg:flex w-[46%] flex-col items-center justify-center"
            style={{ background: "#E8F5EE" }}
          >
            <div className="flex flex-col items-center gap-8 px-10 text-center">
              {/* White illustration card */}
              <div
                className="rounded-[28px] bg-white shadow-md flex flex-col items-center px-10 py-8"
                style={{ width: 340 }}
              >
                {/* GOLO Logo row */}
                <div className="flex items-center gap-2 self-end mb-4">
                  {/* Diamond logo icon */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 9l10 13 10-13L12 2z" fill="#157A4F" fillOpacity="0.15" stroke="#157A4F" strokeWidth="1.5"/>
                    <path d="M12 2L2 9h20L12 2z" fill="#157A4F" fillOpacity="0.35"/>
                  </svg>
                  <span className="text-[15px] font-bold text-gray-800 tracking-wide">GOLO</span>
                </div>

                {/* Shopping cart illustration */}
                <div className="relative flex items-center justify-center" style={{ height: 200 }}>
                  {/* Peach circle background */}
                  <div
                    className="absolute rounded-full"
                    style={{ width: 160, height: 160, background: "#F8E4C8", top: 12, left: "50%", transform: "translateX(-50%)" }}
                  />
                  {/* SVG illustration: person in shopping cart */}
                  <svg
                    viewBox="0 0 220 200"
                    width="220"
                    height="200"
                    className="relative z-10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Cart body */}
                    <rect x="55" y="110" width="110" height="60" rx="8" fill="#D4A020" />
                    <rect x="60" y="116" width="100" height="48" rx="5" fill="#E8B830" />
                    {/* Cart grid lines */}
                    <line x1="85" y1="116" x2="85" y2="164" stroke="#D4A020" strokeWidth="1.5"/>
                    <line x1="110" y1="116" x2="110" y2="164" stroke="#D4A020" strokeWidth="1.5"/>
                    <line x1="135" y1="116" x2="135" y2="164" stroke="#D4A020" strokeWidth="1.5"/>
                    <line x1="60" y1="136" x2="160" y2="136" stroke="#D4A020" strokeWidth="1.5"/>
                    {/* Cart handle bar */}
                    <rect x="42" y="105" width="136" height="10" rx="5" fill="#C49018" />
                    {/* Wheels */}
                    <circle cx="78" cy="178" r="10" fill="#333" />
                    <circle cx="78" cy="178" r="5" fill="#666" />
                    <circle cx="142" cy="178" r="10" fill="#333" />
                    <circle cx="142" cy="178" r="5" fill="#666" />
                    {/* Person - body (sitting in cart) */}
                    <ellipse cx="112" cy="125" rx="18" ry="22" fill="#E8833A" />
                    {/* Person - head */}
                    <circle cx="112" cy="88" r="18" fill="#1a1a2e" />
                    {/* Hair flowing */}
                    <path d="M94 85 Q88 60 96 55 Q104 50 110 60 Q118 50 126 55 Q134 60 130 85" fill="#1a1a2e"/>
                    {/* Face highlight */}
                    <ellipse cx="112" cy="90" rx="13" ry="14" fill="#F5C5A3" />
                    {/* Arms */}
                    <path d="M94 118 Q70 100 60 85" stroke="#E8833A" strokeWidth="10" strokeLinecap="round" fill="none"/>
                    <path d="M130 115 Q148 105 155 90" stroke="#F5C5A3" strokeWidth="9" strokeLinecap="round" fill="none"/>
                    {/* Legs */}
                    <path d="M100 145 Q90 155 82 148" stroke="#4A5A8C" strokeWidth="10" strokeLinecap="round" fill="none"/>
                    <path d="M124 145 Q138 158 148 150" stroke="#4A5A8C" strokeWidth="10" strokeLinecap="round" fill="none"/>
                    {/* Shoes */}
                    <ellipse cx="78" cy="148" rx="10" ry="6" fill="#222" transform="rotate(-20,78,148)"/>
                    <ellipse cx="150" cy="150" rx="10" ry="6" fill="#222" transform="rotate(15,150,150)"/>
                    {/* Shopping bags */}
                    <rect x="44" y="72" width="18" height="22" rx="3" fill="#2196F3" opacity="0.9"/>
                    <path d="M48 72 Q53 62 58 72" stroke="#1565C0" strokeWidth="2" fill="none"/>
                    <rect x="156" y="75" width="16" height="20" rx="3" fill="#26C6DA" opacity="0.9"/>
                    <path d="M159 75 Q164 66 168 75" stroke="#00838F" strokeWidth="2" fill="none"/>
                    {/* Phone in hand */}
                    <rect x="152" y="82" width="10" height="15" rx="2" fill="#fff" stroke="#ddd" strokeWidth="1"/>
                    <rect x="154" y="84" width="6" height="10" rx="1" fill="#4FC3F7"/>
                    {/* Items in cart */}
                    <rect x="70" y="138" width="18" height="18" rx="3" fill="#E91E63" opacity="0.85"/>
                    <rect x="93" y="140" width="14" height="16" rx="3" fill="#7C4DFF" opacity="0.8"/>
                    <rect x="133" y="139" width="16" height="17" rx="3" fill="#FF7043" opacity="0.85"/>
                  </svg>
                </div>
              </div>

              {/* Text below card */}
              <div className="flex flex-col items-center gap-2 max-w-[300px]">
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
                  Shop Smarter, Shop Local
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  The easiest way to get everything you need from nearby favorites delivered to your door.
                </p>
              </div>
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="flex flex-1 items-center justify-center bg-white px-6 py-10">
            <div className="w-full max-w-[420px]">
              {/* Title */}
              <h1 className="text-[26px] font-extrabold text-gray-900 text-center mb-1">
                Welcome to GOLO Network Group
              </h1>
              <p className="text-center text-[13px] text-gray-400 mb-7">
                Grow Smarter With Every Ad. Join Free
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
                      placeholder="Enter your email"
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none"
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
                  className="w-full bg-[#157A4F] hover:bg-[#116340] text-white font-bold py-3.5 rounded-xl transition-colors text-[14px] shadow-sm"
                  style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                  {isLoading ? "Signing in..." : "Continue"}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-5 text-center text-[12px] text-gray-500">
                New to GOLO Network Group?{" "}
                <Link href="/register" className="text-gray-900 font-bold hover:underline">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
