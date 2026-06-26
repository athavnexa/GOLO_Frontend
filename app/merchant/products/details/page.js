"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Pencil, Sparkles, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import MerchantNavbar from "../../MerchantNavbar";
import { getMerchantProductById, updateMerchantProduct } from "../../../lib/api";

export default function MerchantProductDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#efefef]" />}>
      <MerchantProductDetailsContent />
    </Suspense>
  );
}

function MerchantProductDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { user, loading, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stockQuantity: "",
    description: "",
    image: "/images/deal2.avif",
    images: [],
  });

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveChanges = async () => {
    if (!formData?.id) return;

    try {
      setIsSaving(true);
      setFetchError("");
      setSaveMessage("");

      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price || 0),
        stockQuantity: Number(formData.stockQuantity || 0),
        description: formData.description,
        images: Array.isArray(formData.images) ? formData.images : [],
      };

      const res = await updateMerchantProduct(formData.id, payload);
      const updated = res?.data;
      const mapped = {
        id: updated?.id || formData.id,
        name: updated?.name || formData.name,
        category: updated?.category || formData.category,
        price: String(updated?.price ?? formData.price),
        stockQuantity: String(updated?.stockQuantity ?? formData.stockQuantity),
        description: updated?.description || formData.description,
        image: updated?.image || formData.image,
        images: updated?.images || formData.images || [],
      };

      setOriginalData(mapped);
      setFormData(mapped);
      setIsEditMode(false);
      setSaveMessage("Product updated successfully");
    } catch (error) {
      setFetchError(error?.data?.message || error?.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const invalidFile = files.find((file) => !file?.type?.startsWith("image/"));
    if (invalidFile) {
      setFetchError("Please select valid image files only.");
      event.target.value = "";
      return;
    }

    const readers = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result || "");
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((images) => {
        setFormData((prev) => {
          const nextImages = [...(prev.images || []), ...images.filter(Boolean)];
          return {
            ...prev,
            images: nextImages,
            image: nextImages[0] || prev.image,
          };
        });
        setFetchError("");
      })
      .catch(() => {
        setFetchError("Unable to upload one or more images. Please try again.");
      })
      .finally(() => {
        event.target.value = "";
      });
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const currentImages = Array.isArray(prev.images) && prev.images.length ? prev.images : (prev.image ? [prev.image] : []);
      const nextImages = currentImages.filter((_, index) => index !== indexToRemove);

      return {
        ...prev,
        images: nextImages,
        image: nextImages[0] || "",
      };
    });
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
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
        const mapped = {
          id: product?.id || "",
          name: product?.name || "",
          category: product?.category || "",
          price: String(product?.price || ""),
          stockQuantity: String(product?.stockQuantity || ""),
          description: product?.description || "",
          image: product?.image || "/images/deal2.avif",
          images: Array.isArray(product?.images)
            ? product.images
            : (product?.image ? [product.image] : []),
        };
        setOriginalData(mapped);
        setFormData(mapped);
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
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="products" />

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-4">
          <button
            onClick={() => router.push("/merchant/products")}
            className="text-[13px] text-[#5a5a5a] inline-flex items-center gap-2"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a9a9a9] text-[10px]">‹</span>
            Back to Products
          </button>

          <section className="rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0_18px_45px_-28px_rgba(15,28,44,0.35)]">
            {fetchError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{fetchError}</div>
            ) : null}
            {saveMessage ? (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">{saveMessage}</div>
            ) : null}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8a5d00]">
                  <Sparkles size={12} /> Merchant Product Studio
                </p>
                <h1 className="text-[32px] font-semibold leading-tight text-[#1e1e1e] lg:text-[38px]">Product Details</h1>
                <p className="mt-2 text-[13px] text-[#667085]">Refresh product information and manage your visuals in one modern workspace.</p>
              </div>
              {!isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#157a4f] bg-white px-5 text-[13px] font-semibold text-[#157a4f] shadow-sm transition hover:bg-[#f4fbf7]"
                >
                  Edit Product <Pencil size={13} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[24px] border border-[#edf0f4] bg-gradient-to-br from-[#fffaf2] via-white to-[#f7fbf7] p-5 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Overview</p>
                      <h2 className="mt-1 text-[18px] font-semibold text-[#1e1e1e]">Product Highlights</h2>
                    </div>
                    <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-[11px] font-semibold text-[#157a4f]">Live listing</span>
                  </div>

                  <div className="grid gap-2.5 md:grid-cols-2">
                    <label className="block rounded-[14px] border border-[#edf0f4] bg-white p-2.5 shadow-sm">
                      <span className="mb-1 block text-[12px] font-semibold text-[#4a5565]">Product Name</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="h-10 w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] px-3 py-2 text-[12px] text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1]"
                        />
                      ) : (
                        <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] text-[#1f2937]">{formData.name || "—"}</p>
                      )}
                    </label>

                    <label className="block rounded-[14px] border border-[#edf0f4] bg-white p-2.5 shadow-sm">
                      <span className="mb-1 block text-[12px] font-semibold text-[#4a5565]">Category</span>
                      {isEditMode ? (
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          className="h-10 w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] px-3 text-[12px] text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1]"
                        >
                          <option>Clothing</option>
                          <option>Electronics</option>
                          <option>Home & Kitchen</option>
                          <option>Beauty & Personal Care</option>
                          <option>Sports & Outdoors</option>
                          <option>Toys & Games</option>
                          <option>Books & Media</option>
                          <option>Jewellery & Accessories</option>
                          <option>Footwear</option>
                          <option>Furniture</option>
                          <option>Health & Wellness</option>
                          <option>Food & Groceries</option>
                          <option>Pet Supplies</option>
                          <option>Garden & Outdoor</option>
                          <option>Arts & Crafts</option>
                        </select>
                      ) : (
                        <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] text-[#1f2937]">{formData.category || "—"}</p>
                      )}
                    </label>

                    <label className="block rounded-[14px] border border-[#edf0f4] bg-white p-2.5 shadow-sm md:col-span-2">
                      <span className="mb-1.5 block text-[12px] font-semibold text-[#4a5565]">Description</span>
                      {isEditMode ? (
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows="4"
                          className="min-h-[92px] w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] p-2.5 text-[12px] leading-5 text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1] resize-none"
                        />
                      ) : (
                        <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] leading-6 text-[#475467]">{formData.description || "No description added yet."}</p>
                      )}
                    </label>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf0f4] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Media</p>
                      <h2 className="mt-1 text-[18px] font-semibold text-[#1e1e1e]">Product Images</h2>
                      <p className="mt-1 text-[12px] text-[#667085]">Upload several images at once, then remove any one with the close button.</p>
                    </div>
                    {isEditMode ? (
                      <button
                        type="button"
                        onClick={triggerImageUpload}
                        className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#157a4f] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_16px_26px_-18px_rgba(21,122,79,0.95)] transition hover:bg-[#126b43]"
                      >
                        <Camera size={13} /> Add Multiple Images
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[22px] border border-[#edf0f4] bg-[#f8fbfa] p-3">
                      <div className="relative h-[320px] overflow-hidden rounded-[18px] border border-[#edf0f4] bg-white">
                        {formData.image ? (
                          <Image src={formData.image} alt={formData.name || "Product"} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#f6f7f8] text-center text-[13px] text-[#667085]">
                            No product image selected
                          </div>
                        )}
                        {formData.image ? (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 text-white">
                            <p className="text-[12px] uppercase tracking-[0.25em] text-amber-100">Primary image</p>
                            <h3 className="mt-1 text-[16px] font-semibold">{formData.name || "Product Preview"}</h3>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Gallery</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(formData.images && formData.images.length ? formData.images : []).map((img, idx) => (
                          <div key={`${img}-${idx}`} className="group relative aspect-square overflow-hidden rounded-[18px] border border-[#edf0f4] bg-[#f8fbfa] shadow-sm">
                            <Image src={img} alt={`${formData.name || "Product"} ${idx + 1}`} fill className="object-cover" />
                            {isEditMode ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                                aria-label={`Remove image ${idx + 1}`}
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            ) : null}
                            <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Image {idx + 1}</span>
                          </div>
                        ))}
                        {(!formData.images || formData.images.length === 0) && !formData.image ? (
                          <div className="col-span-2 flex min-h-[120px] items-center justify-center rounded-[18px] border border-dashed border-[#d7dbe2] bg-[#fafbfc] text-[12px] text-[#667085]">
                            No gallery images selected
                          </div>
                        ) : null}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                <div className="rounded-[24px] border border-[#edf0f4] bg-gradient-to-br from-[#fffaf2] via-white to-[#f4fbf6] p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Pricing & stock</p>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#1e1e1e]">Inventory overview</h2>
                      <p className="mt-1 text-[13px] text-[#667085]">Keep pricing and stock tidy with a clean, high-contrast layout for quick edits.</p>
                    </div>
                    <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-[11px] font-semibold text-[#157a4f]">Live</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-[18px] border border-[#edf0f4] bg-white p-3 shadow-sm">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-[#7a7a7a]">Price</p>
                      <p className="mt-2 text-[18px] font-semibold text-[#1e1e1e]">₹ {formData.price || "0"}</p>
                    </div>
                    <div className="rounded-[18px] border border-[#edf0f4] bg-white p-3 shadow-sm">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-[#7a7a7a]">Stock</p>
                      <p className="mt-2 text-[18px] font-semibold text-[#1e1e1e]">{formData.stockQuantity || "0"} units</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf0f4] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <label className="mb-2 block text-[12px] font-semibold text-[#4a5565]">Price</label>
                  {isEditMode ? (
                    <div className="flex items-center gap-2 rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] px-3 py-2">
                      <span className="text-[13px] text-[#4b5563]">₹</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="w-full bg-transparent text-[13px] text-[#1f2937] outline-none"
                      />
                    </div>
                  ) : (
                    <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] text-[#1f2937]">₹ {formData.price || "0"}</p>
                  )}

                  <label className="mt-4 mb-2 block text-[12px] font-semibold text-[#4a5565]">Stock Quantity</label>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                      className="h-10 w-full rounded-[10px] border border-[#e4e7ec] bg-[#fcfdff] px-3 py-2 text-[12px] text-[#1f2937] outline-none transition focus:border-[#157a4f] focus:ring-2 focus:ring-[#d8efe1]"
                    />
                  ) : (
                    <p className="rounded-[12px] bg-[#f8fbfa] px-3 py-3 text-[13px] text-[#1f2937]">{formData.stockQuantity || "0"} units</p>
                  )}
                </div>

                <div className="rounded-[24px] border border-[#edf0f4] bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">Quick tips</p>
                  <ul className="mt-3 space-y-2 text-[13px] text-[#475467]">
                    <li>• Add multiple images in one tap from the edit mode.</li>
                    <li>• Use the close icon on any thumbnail to remove it instantly.</li>
                    <li>• Keep the primary image clear and high quality for customers.</li>
                  </ul>
                </div>
              </aside>
            </div>

            {isEditMode && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#edf0f4] pt-6 sm:flex-row sm:justify-end">
                <button
                  onClick={handleDiscardChanges}
                  className="h-11 rounded-[12px] border border-[#d4d9e1] bg-white px-5 text-[13px] font-semibold text-[#4b5563] transition hover:bg-[#f7f8fa]"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="h-11 rounded-[12px] bg-[#efb02e] px-5 text-[13px] font-semibold text-[#19462a] shadow-[0_14px_24px_-18px_rgba(239,176,46,0.9)] transition hover:bg-[#e4a82a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

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
    </div>
  );
}
