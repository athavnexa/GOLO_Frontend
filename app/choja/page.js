import { Suspense } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Categories from "../components/Categories";
import RecentListings from "../components/RecentListings";
import Footer from "../components/Footer";

export const metadata = {
  title: "Choja Classified Ads & Listings | GOLO",
  description: "Explore local advertisements, buy and sell products, search classified listings, and discover services on Choja GOLO. Your ultimate nearby classifieds hub.",
  keywords: [
    "choja", "golo choja", "choja ads", "classified ads", "nearby listings", "choja classifieds", "post ads nearby",
    "choja kolhapur ads", "kolhapur classified ads", "kolhapur local listings", "golo choja kolhapur", "buy sell kolhapur",
    "post ads free online", "local business promotion", "classified listing site", "used products marketplace", 
    "second hand selling app", "nearby products listings", "local services ads", "choja classified portal", 
    "golo marketplace ads", "post shopping deals free",
    "olx", "olx ads", "olx deals", "olx kolhapur", "olx alternatives", 
    "sites like olx", "olx classifieds", "olx buy sell", "olx second hand", "olx marketplace"
  ],
};

export default function ChojaPage() {
  return (
    <main className="relative z-10 min-h-screen bg-transparent">
      <Suspense fallback={<div className="h-16 bg-gray-50 animate-pulse" />}>
        <Navbar />
      </Suspense>

      <div className="relative z-10 w-full">
        <CategoryBar />
        <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse mx-8 rounded-3xl mt-10" />}>
          <RecentListings />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
