import { Suspense } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Categories from "../components/Categories";
import RecentListings from "../components/RecentListings";
import Footer from "../components/Footer";

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
