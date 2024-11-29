import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import {
  defaultValues,
  productInfo,
  productSchema,
} from "@/app/[locale]/(app)/app/products/constants";
import { useSaveProductInformation } from "@/hooks/productInformation/use-save-productInformation";
import { useUpdateProductInformation } from "@/hooks/productInformation/use-update-productInformation";
import { ProductInformation } from "@/lib/services/productinformationServices";

import {
  CategoryField,
  CurrencyField,
  DescriptionField,
  FrequencyField,
  NameField,
  PriceField,
} from "../products/FormFields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ProductModalProps {
  isEditing: boolean;
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductInformation;
}

export function ProductModal({
  isEditing,
  isOpen,
  onClose,
  initialData,
}: ProductModalProps) {
  const { saveProductData, isSaving } = useSaveProductInformation(onClose, () =>
    form.reset(defaultValues),
  );
  const { updateProductData, isUpdating } = useUpdateProductInformation(
    onClose,
    () => form.reset(defaultValues),
  );

  const form = useForm<productInfo>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || defaultValues,
  });
  const [dragActive, setDragActive] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      form.reset(initialData);
      setLocalImages(initialData?.images || []);
    }
  }, [initialData, isEditing]);

  if (!isOpen) return null;

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = e.target?.result as string;
          const currentImages = form.getValues("images") || [];
          const updatedImages = [...currentImages, newImage];

          form.setValue("images", updatedImages);

          setLocalImages(updatedImages);
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

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images") || [];

    if (currentImages.length <= 1) return;

    const updatedImages = currentImages.filter((_, i) => i !== index);

    form.setValue("images", updatedImages);

    setLocalImages(updatedImages);
  };

  const onSubmit = (data: productInfo) => {
    const productData: ProductInformation = {
      ...data,
      images: data.images || [],
    };

    if (isEditing) {
      updateProductData({ ...productData, id: initialData?.id });
    } else {
      saveProductData(productData);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if ((!isEditing && !isSaving) || (isEditing && !isUpdating)) {
          form.reset(defaultValues);
          onClose();
        }
      }}
    >
      <DialogContent className="scrollbar-hidden max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl bg-gray-800 p-6">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Add New"} Product/Service
          </DialogTitle>
          <DialogDescription>
            Edit or Add New Products or Services
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CategoryField
              control={form.control}
              isDisabled={false}
              form={form}
            />
            <NameField control={form.control} isDisabled={false} form={form} />
            <DescriptionField
              control={form.control}
              isDisabled={false}
              form={form}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <CurrencyField
                control={form.control}
                isDisabled={false}
                form={form}
              />
              <PriceField
                control={form.control}
                isDisabled={false}
                form={form}
              />
              <FrequencyField
                control={form.control}
                isDisabled={false}
                form={form}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Images
              </label>
              {localImages.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-4">
                  {form.getValues("images")?.map((image, index) => (
                    <div key={index} className="group relative">
                      <Image
                        width={300}
                        height={300}
                        quality={100}
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        disabled={isSaving || isUpdating}
                        onClick={() => handleRemoveImage(index)}
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
                onClick={() => {
                  form.reset(defaultValues);
                  onClose();
                }}
                disabled={isSaving}
                className="px-4 py-2 text-gray-300 transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUpdating}
                className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
              >
                {isEditing
                  ? isUpdating
                    ? "Updating..."
                    : "Update Changes"
                  : isSaving
                    ? "Adding..."
                    : "Add"}
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
