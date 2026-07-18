"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X, ImagePlus, Video } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { createMerchantProduct, getMerchantProfile } from "../../../lib/api";
import MerchantNavbar from "../../MerchantNavbar";
import InappropriateImageModal from "../../../components/InappropriateImageModal";
import ImageLimitModal from "../../../components/ImageLimitModal";

const MERCHANT_CATEGORIES = [
  "Food & Restaurants",
  "Home Services",
  "Beauty & Wellness",
  "Healthcare & Medical",
  "Hotels & Accommodation",
  "Shopping & Retail",
  "Education & Training",
  "Real Estate",
  "Events & Entertainment",
  "Professional Services",
  "Automotive Services",
  "Home Improvement",
  "Fitness & Sports",
  "Daily Needs & Utilities",
  "Local Businesses & Vendors",
];
function pickStoreName(user, merchantProfile) {
  return (
    merchantProfile?.storeName ||
    user?.storeName ||
    user?.shopName ||
    user?.name ||
    "My Store"
  );
}

function pickStoreLocation(user, merchantProfile) {
  return (
    merchantProfile?.storeLocation ||
    user?.storeLocation ||
    user?.location ||
    user?.city ||
    ""
  );
}

function pickStoreImage(user, merchantProfile) {
  return (
    merchantProfile?.profilePhoto ||
    merchantProfile?.shopPhoto ||
    user?.profilePhoto ||
    user?.shopPhoto ||
    "/images/deal2.avif"
  );
}

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Food & Restaurants");
  const [stockQuantity, setStockQuantity] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [merchantProfileError, setMerchantProfileError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [productVideo, setProductVideo] = useState(null);
  const [videoError, setVideoError] = useState("");

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files) {
      setSubmitError("");
      setVideoError("");
      
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("video/")) {
          if (productVideo) {
            setVideoError("You can only upload 1 video.");
            return;
          }
          const videoElement = document.createElement("video");
          videoElement.preload = "metadata";
          videoElement.onloadedmetadata = () => {
            URL.revokeObjectURL(videoElement.src);
            const duration = videoElement.duration;
            if (duration > 30) {
              setVideoError("Video must be up to 30 seconds.");
            } else {
              setProductVideo({ file, preview: URL.createObjectURL(file) });
            }
          };
          videoElement.src = URL.createObjectURL(file);
        } else if (file.type.startsWith("image/")) {
          setProductImages((prevImages) => {
            if (prevImages.length >= 5) {
              setIsLimitModalOpen(true);
              return prevImages;
            }
            return [...prevImages, { file, preview: URL.createObjectURL(file) }];
          });
        }
      });
    }
    
    // Clear input so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveProductImage = (indexToRemove) => {
    setProductImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveVideo = () => {
    setProductVideo(null);
    setVideoError("");
  };

  const handlePublishProduct = async () => {
    if (!productName.trim() || !category.trim() || !stockQuantity || !regularPrice) {
      setSubmitError("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      
      const { uploadToCloudinary } = await import('../../../services/cloudinaryConfig');
      const uploadedUrls = [];
      for (const img of productImages) {
        if (img.file) {
          const uploadedData = await uploadToCloudinary(img.file);
          uploadedUrls.push(uploadedData.url);
        } else {
          uploadedUrls.push(img.preview);
        }
      }

      let uploadedVideoUrl = null;
      if (productVideo?.file) {
        const videoData = await uploadToCloudinary(productVideo.file);
        uploadedVideoUrl = videoData.url;
      }

      const payload = {
        name: productName.trim(),
        category: category.trim(),
        stockQuantity: Number(stockQuantity),
        price: Number(regularPrice),
        description: description.trim(),
        images: uploadedUrls,
        videoUrl: uploadedVideoUrl,
      };
      
      console.log("SENDING PRODUCT PAYLOAD:", payload);

      await createMerchantProduct(payload);

      router.push("/merchant/products");
    } catch (error) {
      const errorMsg = error?.data?.message || error.message || "";
      if (typeof errorMsg === 'string' && errorMsg.includes("inappropriate content")) {
        setIsModalOpen(true);
      } else {
        setSubmitError(errorMsg || "Failed to publish product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/products/add");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.accountType !== "merchant") return;

    let active = true;
    (async () => {
      try {
        setMerchantProfileError("");
        const res = await getMerchantProfile();
        if (!active) return;
        setMerchantProfile(res?.data || null);
      } catch (error) {
        if (!active) return;
        setMerchantProfile(null);
        setMerchantProfileError(error?.message || "Failed to load merchant profile");
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#ececec]" />;
  }

  if (user.accountType !== "merchant") return null;

  const storeName = pickStoreName(user, merchantProfile);
  const storeLocation = pickStoreLocation(user, merchantProfile);
  const brandImage = pickStoreImage(user, merchantProfile);

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="products" />

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/merchant/products")} className="flex items-center gap-1.5 text-[13px] text-[#666] hover:text-[#333]">
              <ChevronLeft size={16} />
              Back to Products
            </button>
          </div>

          <section>
            <h1 className="text-[36px] font-semibold leading-none text-[#1e1e1e]">Add New Product</h1>
            <p className="mt-2 text-[13px] text-[#6f6f6f]">
              Fill in the details below to list a new item in your inventory.
            </p>
          </section>

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            {/* Left: Product Information */}
            <div className="space-y-6">
              <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6">
                <h2 className="text-[16px] font-semibold text-[#1e1e1e] mb-4">Product Information</h2>
                <p className="text-[12px] text-[#666] mb-5">Standard details used for customer display and search.</p>

                {/* Product Name */}
                <div className="mb-5">
                  <label className="text-[12px] font-semibold text-[#333] block mb-2">
                    Product Name <span className="text-[#ef4d4d]">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Premium Roasted Almonds (500g)"
                    className="w-full h-10 rounded-[8px] border border-[#e2e2e2] bg-white px-3 text-[13px] outline-none focus:border-[#157a4f]"
                  />
                  <p className="text-[11px] text-[#999] mt-1.5">Create a clear, descriptive name for the product.</p>
                </div>

                {/* Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-[12px] font-semibold text-[#333] block mb-2">
                      Category <span className="text-[#ef4d4d]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 rounded-[8px] border border-[#e2e2e2] bg-white px-3 text-[13px] outline-none focus:border-[#157a4f]"
                    >
                      {MERCHANT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="text-[12px] font-semibold text-[#333] block mb-2">
                      Stock Quantity <span className="text-[#ef4d4d]">*</span>
                    </label>
                    <input
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full h-10 rounded-[8px] border border-[#e2e2e2] bg-white px-3 text-[13px] outline-none focus:border-[#157a4f]"
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-[#fafafa] rounded-[8px] border border-[#ececec] p-4 mb-5">
                  <p className="text-[12px] font-semibold text-[#333] mb-3">Pricing</p>
                  <p className="text-[11px] text-[#666] mb-3">Set your base prices and promotional offers.</p>
                  <label className="text-[11px] font-semibold text-[#666] block mb-2">Regular Price (₹) *</label>
                  <input
                    type="number"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    placeholder="3.00"
                    className="w-full h-10 rounded-[8px] border border-[#e2e2e2] bg-white px-3 text-[13px] outline-none focus:border-[#157a4f]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[12px] font-semibold text-[#333] block mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell customers more about the product ingredients, benefits, and usage..."
                    className="w-full h-28 rounded-[8px] border border-[#e2e2e2] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#157a4f] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right: Product Media */}
            <div className="space-y-6">
              <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6">
                {/* Brand Display */}
                <div className="rounded-[10px] border border-[#e2e2e2] bg-[#f9f9f9] p-4 mb-5 flex items-center justify-center min-h-[80px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-[#ececec] bg-white">
                      <Image src={brandImage} alt="Store" width={48} height={48} className="h-full w-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-[#333]">{storeName}</p>
                      {storeLocation ? (
                        <p className="text-[11px] text-[#999]">{storeLocation}</p>
                      ) : (
                        <p className="text-[11px] text-[#999]">Store location not set</p>
                      )}
                      {merchantProfileError ? (
                        <p className="mt-1 text-[10px] text-[#ef4d4d]">{merchantProfileError}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Product Media Section */}
                <h3 className="text-[13px] font-semibold text-[#333] mb-2">Product Media</h3>
                <p className="text-[11px] text-[#666] mb-4">High-quality media increases conversion. You can upload up to 5 photos and 1 short video/reel (up to 30s).</p>
                {videoError && <p className="text-[11px] text-[#ef4d4d] mb-4">{videoError}</p>}

                {/* Display Uploaded Media */}
                {(productImages.length > 0 || productVideo) && (
                  <div className="mb-4 grid grid-cols-3 gap-3">
                    {productImages.map((img, idx) => (
                      <div key={idx} className="relative rounded-[8px] overflow-hidden border border-[#e2e2e2] h-20 group">
                        <Image
                          src={img.preview}
                          alt={`Product ${idx + 1}`}
                          fill
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(idx)}
                          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                          aria-label={`Remove product image ${idx + 1}`}
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    {productVideo && (
                      <div className="relative rounded-[8px] overflow-hidden border border-[#e2e2e2] h-20 group col-span-2 sm:col-span-1">
                        <video src={productVideo.preview} controls className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                          aria-label="Remove product video"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Area */}
                <div className="rounded-[10px] border-2 border-dashed border-[#d5d5d5] bg-[#fafafa] py-8 px-4 text-center flex flex-col items-center justify-center min-h-[180px]">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <ImagePlus size={36} className="text-[#a0a0a0]" />
                    <span className="text-[13px] font-semibold text-[#a0a0a0]">or</span>
                    <Video size={36} className="text-[#a0a0a0]" />
                  </div>
                  <p className="text-[12px] text-[#666] mb-2">Click to upload product photos or video</p>
                  <p className="text-[11px] text-[#999]">Images (PNG, JPG, WebP - Max 10MB)</p>
                  <p className="text-[11px] text-[#999]">Video (MP4, WebM, OGG - up to 30s, Max 50MB)</p>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Plus Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="mt-4 h-10 w-10 rounded-full bg-[#f0aa19] text-white flex items-center justify-center text-[18px] hover:bg-[#e2960e] transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ready to go section and buttons */}
          <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-[14px] font-semibold text-[#333]">Ready to go?</h3>
                <p className="text-[12px] text-[#666] mt-1">Review your product details before publishing</p>
                {submitError ? <p className="mt-2 text-[12px] text-[#ef4d4d]">{submitError}</p> : null}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => router.push("/merchant/products")}
                  className="h-10 rounded-[8px] border border-[#d5d5d5] bg-white px-5 text-[12px] font-semibold text-[#6f6f6f] hover:bg-[#f9f9f9] transition"
                >
                  Discard Changes
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handlePublishProduct}
                  className="h-10 rounded-[8px] bg-[#efb02e] px-5 text-[12px] font-semibold text-[#5a4514] hover:bg-[#e2a112] transition inline-flex items-center gap-1.5 disabled:opacity-60"
                >
                  ➕ Publish Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <InappropriateImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ImageLimitModal isOpen={isLimitModalOpen} onClose={() => setIsLimitModalOpen(false)} />

      {/* Footer */}
      <footer className="mt-4 bg-[#e8ad2f] border-t border-[#d49b22] px-4 py-4 text-[#5a4514] lg:mt-12 lg:bg-[#f0aa19] lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1400px] flex items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold" style={{ color: "#157a4f" }}>
                G
              </div>
              <span className="text-lg font-semibold">GOLO</span>
            </div>
            <p className="text-[12px] max-w-[250px] leading-relaxed">
              The all-in-one management platforms for modern businesses. Empowering growth through analytics and innovative product management.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-12 text-[12px]">
            <div>
              <p className="font-semibold mb-3">Links</p>
              <ul className="space-y-1.5">
                <li><button className="hover:underline">Overview</button></li>
                <li><button className="hover:underline">Inventory</button></li>
                <li><button className="hover:underline">Posts</button></li>
                <li><button className="hover:underline">Profile</button></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Support</p>
              <ul className="space-y-1.5">
                <li><button className="hover:underline">Analytics</button></li>
                <li><button className="hover:underline">Contact</button></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Support</p>
              <ul className="space-y-1.5">
                <li><button className="hover:underline">Help Center</button></li>
                <li><button className="hover:underline">Security</button></li>
                <li><button className="hover:underline">Terms of Service</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#e2a112] pt-4 text-[11px] flex items-center justify-between">
          <p>© 2024 GOLO Dashboard. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Made with ♥️ Vaily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
