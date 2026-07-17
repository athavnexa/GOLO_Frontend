"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function GlobalAppBanner() {
	const [showAppBanner, setShowAppBanner] = useState(true);

	if (!showAppBanner) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-[99999] md:hidden bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.15)] border-t border-gray-100 px-4 py-3 transition-transform duration-300">
			<div className="flex items-center gap-2 sm:gap-3">
				<button 
					onClick={() => setShowAppBanner(false)}
					className="p-1.5 -ml-2 text-gray-400 hover:text-gray-600 shrink-0"
					aria-label="Close banner"
				>
					<X size={18} />
				</button>
				<div className="w-10 h-10 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center p-2 shadow-sm border border-gray-100">
					<img 
						src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" 
						alt="Play Store" 
						className="w-full h-full object-contain" 
					/>
				</div>
				<div className="flex-1 min-w-0 pr-4">
					<p className="text-[14px] font-bold text-gray-900 truncate">Download GOLO App</p>
					<p className="text-[12px] text-gray-500 truncate">Get the best deals instantly</p>
				</div>
				<a 
					href="https://play.google.com/store" 
					target="_blank" 
					rel="noopener noreferrer"
					className="shrink-0 bg-[#157A4F] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#0f5c3a] transition shadow-md active:scale-95"
				>
					Install
				</a>
			</div>
		</div>
	);
}
