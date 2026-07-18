"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, User, ImagePlus, Video, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getMerchantProductById, updateMerchantProduct } from "../../../lib/api";
import ImageCarousel from "../../../components/ImageCarousel";
import InappropriateImageModal from "../../../components/InappropriateImageModal";

export default function MerchantProductDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { user, loading, logout } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: "",
  });
  const [productImages, setProductImages] = useState([]);
  const [productVideo, setProductVideo] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setSubmitError("");
    setVideoError("");
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
            if (videoElement.duration > 30) {
              setVideoError("Video must be up to 30 seconds.");
            } else {
              setProductVideo({ file, preview: URL.createObjectURL(file) });
            }
          };
          videoElement.src = URL.createObjectURL(file);
        } else if (file.type.startsWith("image/")) {
          setProductImages((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, { file, preview: URL.createObjectURL(file) }];
          });
        }
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveVideo = () => {
    setProductVideo(null);
    setVideoError("");
  };

  const handleSaveChanges = async () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.stockQuantity || !formData.price) {
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
      if (productVideo) {
        if (productVideo.file) {
          const videoData = await uploadToCloudinary(productVideo.file);
          uploadedVideoUrl = videoData.url;
        } else {
          uploadedVideoUrl = productVideo.preview;
        }
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        stockQuantity: Number(formData.stockQuantity),
        price: Number(formData.price),
        description: formData.description.trim(),
        images: uploadedUrls,
        videoUrl: uploadedVideoUrl,
      };

      await updateMerchantProduct(productId, payload);
      
      setIsEditMode(false);
      // Reload product data
      window.location.reload();
    } catch (error) {
      const errorMsg = error?.message || "";
      if (typeof errorMsg === 'string' && errorMsg.includes("inappropriate content")) {
        setIsModalOpen(true);
      } else {
        setSubmitError(errorMsg || "Failed to save changes");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardChanges = () => {
    if (originalData) {
      setFormData({
        name: originalData.name,
        category: originalData.category,
        price: originalData.price,
        stockQuantity: originalData.stockQuantity,
        description: originalData.description,
      });
      setProductImages(originalData.images.map(url => ({ preview: url })));
      setProductVideo(originalData.videoUrl ? { preview: originalData.videoUrl } : null);
    }
    setIsEditMode(false);
    setSubmitError("");
    setVideoError("");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/products/details");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.accountType !== "merchant") return;
    if (!productId) {
      router.replace("/merchant/products");
      return;
    }

    const loadProduct = async () => {
      try {
        setIsFetching(true);
        setFetchError("");
        const res = await getMerchantProductById(productId);
        const product = res?.data;
        console.log("LOADED PRODUCT FROM API:", product);
        const mapped = {
          name: product?.name || "",
          category: product?.category || "",
          price: String(product?.price || ""),
          stockQuantity: String(product?.stockQuantity || ""),
          description: product?.description || "",
          images: product?.images || (product?.image ? [product.image] : []),
          videoUrl: product?.videoUrl || "",
        };
        console.log("MAPPED DATA:", mapped);
        setOriginalData(mapped);
        setFormData({
          name: mapped.name,
          category: mapped.category,
          price: mapped.price,
          stockQuantity: mapped.stockQuantity,
          description: mapped.description,
        });
        setProductImages(mapped.images.map(url => ({ preview: url })));
        setProductVideo(mapped.videoUrl ? { preview: mapped.videoUrl } : null);
      } catch (error) {
        setFetchError(error?.message || "Failed to load product details");
      } finally {
        setIsFetching(false);
      }
    };

    loadProduct();
  }, [user, productId, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#efefef]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <>
      <header className="sticky top-0 z-[9999] h-16 bg-[#efb02e] border-b border-[#d7a02a] px-8 lg:px-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-[180px]">
          <button type="button" onClick={() => router.push("/merchant/dashboard")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold" style={{ color: "#157a4f" }}>
              G
            </div>
            <span className="text-xl font-semibold tracking-wide text-[#157a4f]">GOLO</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-8 text-[12px] font-semibold text-[#5a4514]">
          <nav className="flex items-center gap-8">
            <button onClick={() => router.push("/merchant/dashboard")}>Overview</button>
            <button onClick={() => router.push("/merchant/orders")}>Orders</button>
            <button onClick={() => router.push("/merchant/products")} className="relative h-16 text-[#157a4f]">
              Products
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />
            </button>
            <button onClick={() => router.push("/merchant/offers")}>Offers</button>
            <button onClick={() => router.push("/merchant/banners")}>Banners</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={() => router.push("/merchant/profile")} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Profile">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-4">
          <button
            onClick={() => router.push("/merchant/products")}
            className="text-[13px] text-[#5a5a5a] inline-flex items-center gap-2"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a9a9a9] text-[10px]">‹</span>
            Back to Products
          </button>

          <section className="rounded-[12px] border border-[#dddddd] bg-white p-5">
            {fetchError ? (
              <p className="mb-4 text-[12px] text-[#ef4d4d]">{fetchError}</p>
            ) : null}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-[35px] font-semibold leading-none">Product Details</h1>
              {!isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#157a4f] bg-white px-5 text-[13px] font-semibold text-[#157a4f] shadow-sm transition hover:bg-[#f4fbf7]"
                >
                  Edit Product <Pencil size={13} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <p className="text-[14px] font-semibold mb-2">Name</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full h-9 rounded-[8px] border border-[#ddd] bg-white px-3 text-[12px] text-[#4b4b4b] focus:outline-none focus:border-[#79c68f]"
                    />
                  ) : (
                    <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">{formData.name}</div>
                  )}
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Category</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full h-9 rounded-[8px] border border-[#ddd] bg-white px-3 text-[12px] text-[#4b4b4b] focus:outline-none focus:border-[#79c68f]"
                    />
                  ) : (
                    <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">{formData.category}</div>
                  )}
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Product Media</p>
                  {!isEditMode ? (
                    <div className="rounded-[12px] border border-[#e5e5e5] bg-[#fbfbfb] p-3">
                      <ImageCarousel images={originalData?.images || []} videoUrl={originalData?.videoUrl} alt={formData.name || "Product"} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {videoError && <p className="text-[#ef4d4d] text-xs">{videoError}</p>}
                      {(productImages.length > 0 || productVideo) && (
                        <div className="grid grid-cols-3 gap-3">
                          {productImages.map((img, idx) => (
                            <div key={idx} className="relative rounded-[8px] overflow-hidden border border-[#e2e2e2] h-24 group">
                              <img src={img.preview} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                          {productVideo && (
                            <div className="relative rounded-[8px] overflow-hidden border border-[#e2e2e2] h-24 group col-span-2 sm:col-span-1">
                              <video src={productVideo.preview} controls className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={handleRemoveVideo}
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#d1d1d1] bg-[#fafafa] py-8 transition hover:bg-[#f4f4f4] cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <ImagePlus size={24} className="text-[#888]" />
                          <span className="text-[#888] font-semibold">or</span>
                          <Video size={24} className="text-[#888]" />
                        </div>
                        <p className="text-[13px] font-semibold text-[#444]">
                          Click to upload product photos or video
                        </p>
                        <p className="mt-1 text-[11px] text-[#7a7a7a] text-center">
                          Images: PNG, JPG, WebP (Max 5, 10MB each)<br/>
                          Video: MP4, WebM (Max 1, up to 30s, 50MB)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[14px] font-semibold mb-2">Price</p>
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-[#4b4b4b]">₹</span>
                      <input
                        type="number" min="0" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }}
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="flex-1 h-9 rounded-[8px] border border-[#ddd] bg-white px-3 text-[12px] text-[#4b4b4b] focus:outline-none focus:border-[#79c68f]"
                      />
                    </div>
                  ) : (
                    <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">₹ {formData.price}</div>
                  )}
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Stock Quantity</p>
                  {isEditMode ? (
                    <input
                      type="number" min="0" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }}
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                      className="w-full h-9 rounded-[8px] border border-[#ddd] bg-white px-3 text-[12px] text-[#4b4b4b] focus:outline-none focus:border-[#79c68f]"
                    />
                  ) : (
                    <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">{formData.stockQuantity}</div>
                  )}
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Description</p>
                  {isEditMode ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full rounded-[10px] border border-[#ddd] bg-white p-3 text-[12px] leading-6 text-[#4b4b4b] focus:outline-none focus:border-[#79c68f] resize-none"
                      rows="6"
                    />
                  ) : (
                    <div className="rounded-[10px] bg-[#f0f1f3] p-3 text-[12px] leading-6 text-[#4b4b4b]">
                      {formData.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleDiscardChanges}
                  disabled={isSubmitting}
                  className="h-9 rounded-[8px] bg-[#f0f1f3] px-6 text-[13px] font-semibold text-[#4b4b4b] hover:bg-[#e8e8e8] transition disabled:opacity-50"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSubmitting}
                  className="h-9 rounded-[8px] bg-[#efb02e] px-6 text-[13px] font-semibold text-[#19462a] hover:bg-[#e8ad2f] transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#19462a] border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </section>
        </div>
        </main>

      <InappropriateImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <footer className="mt-4 bg-[#e8ad2f] border-t border-[#d49b22] text-[#2f2a1f] lg:mt-6">
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[3px] bg-[#0f7d49] text-white text-[26px] font-bold flex items-center justify-center leading-none">G</div>
              <span className="text-[34px] leading-none font-semibold text-[#0f7d49]">GOLO</span>
            </div>
            <p className="mt-3 text-[12px] max-w-[250px]">The all-in-one management platform for modern businesses. Empowering growth through analytics and intuitive product management.</p>
          </div>
          <div>
            <p className="text-[20px] font-bold">Links</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Overview</p><p>Inventory</p><p>Posts</p><p>Profile</p></div>
          </div>
          <div className="pt-8 md:pt-9 space-y-2 text-[13px]"><p>Analytics</p><p>Contact</p></div>
          <div>
            <p className="text-[20px] font-bold">Support</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Help Center</p><p>Security</p><p>Terms of Service</p></div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-3 border-t border-[#d49b22] flex items-center justify-between gap-3 text-[11px]"><p>© 2026 GOLO Dashboard. All rights reserved.</p></div>
      </footer>
    </>
  );
}
