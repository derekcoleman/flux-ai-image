import React, { useEffect, useRef, useState } from "react";

import { Upload, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  frequency?: string;
  images: string[];
  category: "Products" | "Services";
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">) => void;
  initialData?: Product;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

const frequencies = [
  { value: "one-time", label: "One-time payment" },
  { value: "hourly", label: "Per hour" },
  { value: "daily", label: "Per day" },
  { value: "weekly", label: "Per week" },
  { value: "monthly", label: "Per month" },
  { value: "yearly", label: "Per year" },
];

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    currency: initialData?.currency || "USD",
    frequency: initialData?.frequency || "one-time",
    images: initialData?.images || [],
    category: initialData?.category || "Products",
  });

  const [dragActive, setDragActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, e.target?.result as string],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-3xl rounded-xl bg-gray-800 p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {initialData ? "Edit" : "Add New"} Product/Service
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-200">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as "Products" | "Services",
                })
              }
              className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="Products">Products</option>
              <option value="Services">Services</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-200">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-200">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-200">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-200">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-200">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Images
            </label>

            {formData.images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files)
                }
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <Upload className="mb-4 h-12 w-12 text-gray-500" />
                <p className="mb-2 text-gray-300">
                  Drag and drop images here or
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Browse files
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Supported formats: JPG, PNG, WebP
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
            >
              {initialData ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
