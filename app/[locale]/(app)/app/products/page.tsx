"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Edit2, Plus, Trash2 } from "lucide-react";

import { DeleteDialog } from "@/components/dialog/delete-dialog";
import { ProductModal } from "@/components/modals/product-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProductInformation } from "@/hooks/productInformation/use-delete-productInformation";
import { useGetProductInformation } from "@/hooks/productInformation/use-get-productInformation";
import { ProductInformation } from "@/lib/services/productinformationServices";

export default function ProductsServices() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    ProductInformation | undefined
  >();

  const { data: productInfo, isLoading } = useGetProductInformation();

  const { deleteProductData, isDeleting } = useDeleteProductInformation(() =>
    setIsAlertDialogOpen(false),
  );

  const handleOpenAlertDialog = () => {
    setIsAlertDialogOpen(true);
  };

  const handleCloseAlertDialog = () => {
    setIsAlertDialogOpen(false);
  };

  const handleEdit = (id: string) => {
    const findProduct = productInfo?.find((product) => product.id === id);
    setEditingProduct(findProduct);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    deleteProductData(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products & Services</h1>
        {isLoading ? (
          <Skeleton className="h-10 w-32 bg-gray-700" />
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            Add New
          </button>
        )}
      </div>

      {productInfo?.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-400">
            No products or services added yet
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-purple-400 hover:text-purple-300"
          >
            Add your first item
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-700 bg-gray-800 p-6"
            >
              <Skeleton className="mb-4 h-48 w-full rounded-lg bg-gray-700 object-cover" />
              <Skeleton className="mb-2 h-4 w-16 bg-gray-700" />
              <Skeleton className="text-g mb-2 h-4 bg-gray-700" />
              <Skeleton className="text-g mb-2 h-4 bg-gray-700" />
              <Skeleton className="text-g mb-2 h-4 bg-gray-700" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productInfo?.map((product) => {
            return (
              <div
                key={product.id}
                className="rounded-xl border border-gray-700 bg-gray-800 p-6"
              >
                {product.images[0] && (
                  <Image
                    height={192}
                    width={100}
                    quality={100}
                    src={product.images[0]}
                    alt={product.name}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                )}
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {product.name}
                </h3>
                <p className="mb-4 line-clamp-3 text-gray-400">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold text-white">
                      {product.currency} {product.price}
                    </span>
                    {product.frequency && (
                      <span className="ml-1 text-sm text-gray-400">
                        /{product.frequency}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-gray-400 transition-colors hover:text-white"
                      onClick={() => product.id && handleEdit(product.id)}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 transition-colors hover:text-red-500"
                      onClick={handleOpenAlertDialog}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <DeleteDialog
                      heading={"You Want To Delete Product?"}
                      text={
                        "Are you sure you want to delete this product? This action cannot be undone and will permanently remove it from our system."
                      }
                      handleDelete={() =>
                        product.id && handleDelete(Number(product.id))
                      }
                      onClose={handleCloseAlertDialog}
                      isOpen={isAlertDialogOpen}
                      isDeleting={isDeleting}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductModal
        isEditing={isEditing}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingProduct}
      />
    </div>
  );
}
