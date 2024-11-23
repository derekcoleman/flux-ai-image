"use client";

import React, { useState } from "react";

import { Edit2, Plus, Trash2 } from "lucide-react";

import { ProductModal } from "@/components/modals/product-modal";

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

export default function ProductsServices() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleSave = (data: Omit<Product, "id">) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...data, id: p.id } : p,
        ),
      );
    } else {
      setProducts([...products, { ...data, id: crypto.randomUUID() }]);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products & Services</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          Add New
        </button>
      </div>

      {products.length === 0 ? (
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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-700 bg-gray-800 p-6"
            >
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}
              <h3 className="mb-2 text-xl font-semibold text-white">
                {product.name}
              </h3>
              <p className="mb-4 text-gray-400">{product.description}</p>
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
                    onClick={() => handleEdit(product)}
                    className="p-2 text-gray-400 transition-colors hover:text-white"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingProduct}
      />
    </div>
  );
}
