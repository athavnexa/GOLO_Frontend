"use client";

import { Suspense, useMemo, useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetForgotPassword,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
} from "../../lib/api";
import styles from "./check-email.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CheckEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const stepMeta = useMemo(() => {
    if (step === "otp") {
      return {
        icon: ShieldCheck,
        title: "Verify your OTP",
        description: `Enter the 6-digit OTP sent to ${email}.`,
      };
    }

    if (step === "password") {
      return {
        icon: LockKeyhole,
        title: "Create new password",
        description: "Use at least 6 characters and confirm it once.",
      };
    }

    if (step === "success") {
      return {
        icon: CheckCircle2,
        title: "Password changed",
        description: "Your password has been updated. You can login now.",
      };
    }

    return {
      icon: Mail,
      title: "Forgot password?",
      description: "Enter your registered email and we’ll send an OTP to reset your password.",
    };
  }, [email, step]);

  const StepIcon = stepMeta.icon;

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  const getErrorMessage = (apiError, fallback) => {
    return apiError?.data?.message || apiError?.message || fallback;
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();
    clearFeedback();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !emailPattern.test(cleanEmail)) {
      setError("Please enter a valid registered email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await sendForgotPasswordOTP(cleanEmail);
      setEmail(cleanEmail);
      setAccountType(response?.data?.accountType || "");
      setMessage(
        response?.data?.accountType === "merchant"
          ? "Merchant password reset OTP sent successfully."
          : "Password recovery OTP sent successfully."
      );
      setStep("otp");
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    clearFeedback();

    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await verifyForgotPasswordOTP(email, cleanOtp);
      setOtp(cleanOtp);
      setMessage("OTP verified. Set your new password now.");
      setStep("password");
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Invalid OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetForgotPassword(email, otp, newPassword);
      setMessage("Password changed successfully. Redirecting to login...");
      setStep("success");
      setTimeout(() => router.push("/login"), 1400);
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Failed to change password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || loading) return;
    clearFeedback();
    setLoading(true);
    try {
      await sendForgotPasswordOTP(email);
      setOtp("");
      setMessage("A fresh OTP has been sent to your email.");
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Failed to resend OTP."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={`auth-container centered ${styles.page}`}>
        <div className={styles.decorLayer}>
          <div className="bg-glow-left"></div>
          <div className="bg-glow-right"></div>
          <div className="dot-pattern-fixed"></div>
        </div>

        <div className={`check-email-card ${styles.card}`}>
          <div className="top-g-box">G</div>

          <Link href="/login" className={styles.backLink}>
            <ArrowLeft size={17} />
            Back to login
          </Link>

          <div className={styles.cardInner}>
            <div className={styles.headerBlock}>
              <div className={styles.iconShell}>
                <StepIcon size={42} strokeWidth={1.7} />
              </div>

              <p className={styles.eyebrow}>
                {accountType === "merchant" ? "Merchant Account" : "GOLO Account"}
              </p>
              <h2>{stepMeta.title}</h2>
              <p className={styles.description}>{stepMeta.description}</p>

              <div className={styles.stepper} aria-label="Password reset progress">
                {["email", "otp", "password"].map((item, index) => (
                  <span
                    key={item}
                    className={`${styles.stepDot} ${
                      ["email", "otp", "password", "success"].indexOf(step) >= index ? styles.stepDotActive : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.formArea}>
              {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
              {message && <div className={`${styles.alert} ${styles.success}`}>{message}</div>}

              {step === "email" && (
                <form onSubmit={handleSendOTP} className={styles.form}>
                  <label>Registered Email</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearFeedback();
                      }}
                      placeholder="Enter your registered email"
                      autoComplete="email"
                    />
                  </div>
                  <button className={`primary-orange-btn ${styles.submitButton}`} disabled={loading}>
                    {loading ? <Loader2 className={styles.spinIcon} size={18} /> : null}
                    Send OTP
                  </button>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className={styles.form}>
                  <label>Enter OTP</label>
                  <div className={styles.inputWrapper}>
                    <KeyRound size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => {
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                        clearFeedback();
                      }}
                      placeholder="6-digit OTP"
                      autoComplete="one-time-code"
                    />
                  </div>
                  <button className={`primary-orange-btn ${styles.submitButton}`} disabled={loading}>
                    {loading ? <Loader2 className={styles.spinIcon} size={18} /> : null}
                    Verify OTP
                  </button>
                  <button type="button" className={styles.textButton} onClick={handleResend} disabled={loading}>
                    Resend OTP
                  </button>
                </form>
              )}

              {step === "password" && (
                <form onSubmit={handleResetPassword} className={styles.form}>
                  <label>Enter New Password</label>
                  <div className={styles.inputWrapper}>
                    <LockKeyhole size={18} className={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        clearFeedback();
                      }}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.eyeButton} onClick={() => setShowPassword((value) => !value)}>
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  <label>Re-enter New Password</label>
                  <div className={styles.inputWrapper}>
                    <LockKeyhole size={18} className={styles.inputIcon} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        clearFeedback();
                      }}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.eyeButton} onClick={() => setShowConfirmPassword((value) => !value)}>
                      {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  <button className={`primary-orange-btn ${styles.submitButton}`} disabled={loading}>
                    {loading ? <Loader2 className={styles.spinIcon} size={18} /> : null}
                    Change Password
                  </button>
                </form>
              )}

              {step === "success" && (
                <button className={`primary-orange-btn ${styles.submitButton}`} onClick={() => router.push("/login")}>
                  Go to Login
                </button>
              )}
            </div>
          </div>

          <div className="register-footer">
            New to GOLO?{" "}
            <Link href="/register" className="font-bold cursor-pointer">
              Register Now
            </Link>
          </div>
        </div>

        <div className={`auth-footer-bottom ${styles.footer}`}>
          <span>Copyright©2026</span>
          <span className="separator">|</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function CheckEmail() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  );
}
