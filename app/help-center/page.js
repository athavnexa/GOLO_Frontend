"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LifeBuoy, Send, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HelpCenterPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    issueType: "",
    description: "",
  });

  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.issueType || !formData.description) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:3002'}/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // If the user is logged in, you could append their ID here
          userId: typeof window !== "undefined" && localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : undefined
        }),
      });

      if (!res.ok) throw new Error("Failed to submit support ticket");

      setStatus("success");
      setFormData({ customerName: "", email: "", issueType: "", description: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <div className="pt-[140px] pb-24 px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-white/40 backdrop-blur-sm rounded-full mb-6 shadow-sm"
            >
              <LifeBuoy className="w-8 h-8 text-[#5a4514]" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#2d2412]"
            >
              How can we help you?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#4d3c16] max-w-2xl mx-auto font-medium"
            >
              Submit a request and our support team will get back to you as soon as possible.
            </motion.p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto px-6 -mt-8 pb-20 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-[24px] shadow-xl p-8 md:p-10 border border-white/60"
          >
            {status === "success" ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h2>
                <p className="text-gray-600 mb-8">
                  Your ticket has been securely received. Our support team will review it and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 bg-[#f3b22a] text-[#2d2412] font-semibold rounded-xl hover:bg-[#efb335] transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f3b22a] focus:ring-2 focus:ring-[#f3b22a]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f3b22a] focus:ring-2 focus:ring-[#f3b22a]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Issue Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">What do you need help with? <span className="text-red-500">*</span></label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f3b22a] focus:ring-2 focus:ring-[#f3b22a]/20 outline-none transition-all bg-white"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Billing & Payments">Billing & Payments</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Report a Listing or User">Report a Listing or User</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description <span className="text-red-500">*</span></label>
                  <p className="text-xs text-gray-500 mb-2">Please provide as much detail as possible so we can best assist you.</p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your issue here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f3b22a] focus:ring-2 focus:ring-[#f3b22a]/20 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#f3b22a] text-[#2d2412] font-bold rounded-xl hover:bg-[#efb335] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
          
          {/* Quick Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex items-center gap-4 text-gray-600">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center flex-shrink-0">
                   <MessageSquare className="w-5 h-5 text-[#f3b22a]" />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900">Email Support</h4>
                   <p className="text-sm">support@golo.in</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-gray-600">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center flex-shrink-0">
                   <AlertCircle className="w-5 h-5 text-[#f3b22a]" />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900">Fast Response</h4>
                   <p className="text-sm">Under 24 hour turnaround</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-gray-600">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center flex-shrink-0">
                   <CheckCircle className="w-5 h-5 text-[#f3b22a]" />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900">Secure</h4>
                   <p className="text-sm">Your data is safe with us</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
