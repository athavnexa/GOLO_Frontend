"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
} from "firebase/auth";
import { firebaseAuth } from "../lib/firebase-client";
import { socialAuthUser, setStoredAuthTokens } from "../lib/api";

const providerFactory = {
	google: () => {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" });
		return provider;
	},
	facebook: () => {
		const provider = new FacebookAuthProvider();
		provider.addScope("email");
		return provider;
	},
};

export default function SocialButtons({ redirectPath = "/" }) {
	const router = useRouter();
	const { refreshProfile } = useAuth();
	const [loadingProvider, setLoadingProvider] = useState("");
	const [error, setError] = useState("");

	const handleSocialAuth = async (providerKey) => {
		setError("");
		setLoadingProvider(providerKey);

		try {
			if (!firebaseAuth) {
				throw new Error("Social login is not configured yet.");
			}

			const provider = providerFactory[providerKey]?.();
			if (!provider) {
				throw new Error("Unsupported social provider.");
			}

			const result = await signInWithPopup(firebaseAuth, provider);
			const socialUser = result?.user;
			const email = socialUser?.email;

			if (!email) {
				throw new Error("Your social account did not return an email. Please use another method.");
			}

			const fullName = socialUser?.displayName || email.split("@")[0] || "GOLO User";
			const phone = socialUser?.phoneNumber || undefined;

			const backendAuth = await socialAuthUser({
				name: fullName,
				email,
				provider: providerKey,
				phone,
			});

			const authData = backendAuth?.data?.data || backendAuth?.data;
			if (!authData?.user) {
				throw new Error("Social login response is invalid.");
			}

			localStorage.setItem("user", JSON.stringify(authData.user));
			setStoredAuthTokens({
				accessToken: authData?.accessToken || '',
				refreshToken: authData?.refreshToken || '',
			});

			await refreshProfile();
			router.push(redirectPath || "/");
		} catch (authError) {
			setError(authError?.message || "Social sign-in failed. Please try again.");
		} finally {
			setLoadingProvider("");
		}
	};

	return (
		<>
			<div className="social-buttons" style={{ display: "flex", gap: "12px", width: "100%" }}>
				<button
					type="button"
					className="social-btn google"
					disabled={Boolean(loadingProvider)}
					onClick={() => handleSocialAuth("google")}
					style={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
						padding: "12px",
						borderRadius: "12px",
						background: "#ffffff",
						border: "1px solid #dadce0",
						color: "#3c4043",
						fontWeight: "600",
						cursor: "pointer",
						transition: "background-color .2s, border-color .2s",
					}}
					onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f8f9fa"; }}
					onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
					</svg>
					{loadingProvider === "google" ? "Connecting..." : "Google"}
				</button>

				<button
					type="button"
					className="social-btn facebook"
					disabled={Boolean(loadingProvider)}
					onClick={() => handleSocialAuth("facebook")}
					style={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
						padding: "12px",
						borderRadius: "12px",
						background: "#1877f2",
						border: "none",
						color: "#ffffff",
						fontWeight: "600",
						cursor: "pointer",
						transition: "background-color .2s",
					}}
					onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#166fe5"; }}
					onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#1877f2"; }}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#fff"/>
					</svg>
					{loadingProvider === "facebook" ? "Connecting..." : "Facebook"}
				</button>
			</div>

			{error && (
				<p style={{ color: "red", fontSize: "13px", marginTop: "10px", marginBottom: "10px", textAlign: "center" }}>
					{error}
				</p>
			)}
		</>
	);
}
