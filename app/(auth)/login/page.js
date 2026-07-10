"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import SocialButtons from "../../components/SocialButtons";

export default function LoginPage() {
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

  // Handle redirect param
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

  // Redirect if already logged in
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

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("type", type);
      window.history.replaceState(null, "", url.pathname + url.search);
    }
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
      
      if (errorMsg.includes("merchant") || errorMsg.includes("Merchant")) {
        setPopupMessage(errorMsg);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
      } else if (errorMsg.includes("user") || errorMsg.includes("User")) {
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
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-bounce-in">
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
              Welcome to GOLO Network Group
            </h2>
            <p className="text-center text-gray-500 text-[13px] mb-8">
              Grow Smarter With Every Ad. Join Free
            </p>
            
            {/* Social Buttons */}
            <div className="flex gap-4 mb-7">
              <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-semibold text-gray-700">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-semibold text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
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
                    placeholder="Enter your email"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mb-4">
                <button 
                  type="button" 
                  onClick={handleForgotPassword} 
                  className="text-[#F59E0B] text-[11px] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 mb-6 text-gray-500 text-[11px]">
                <input type="checkbox" id="terms" className="w-3.5 h-3.5 border-gray-300 rounded text-[#F59E0B] focus:ring-[#F59E0B]" />
                <label htmlFor="terms">
                  By clicking on &quot;Continue&quot;, I agree <span className="text-[#F59E0B] font-bold cursor-pointer hover:underline">Terms</span> and <span className="text-[#F59E0B] font-bold cursor-pointer hover:underline">Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F59E0B] hover:bg-[#E69309] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 text-center text-[12px] text-gray-500">
              New to Ad Network Group?{" "}
              <Link href="/register" className="text-[#F59E0B] font-bold hover:underline">
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
