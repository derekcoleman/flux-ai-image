import axios from "axios";

export interface ProductInformation {
  id?: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  frequency: string;
  category: string;
  images: string[] | [];
}

export const saveProductInformation = async (
  productInfo: ProductInformation,
): Promise<ProductInformation> => {
  const { data } = await axios.post<ProductInformation>(
    "/api/products",
    productInfo,
  );
  return data;
};

export const getProductInformation = async (): Promise<
  ProductInformation[]
> => {
  const { data } = await axios.get("/api/products");
  return data;
};

export const updateProductInformation = async (
  productInfo: Partial<ProductInformation>,
): Promise<ProductInformation> => {
  const { data } = await axios.put("/api/products", productInfo);
  return data;
};

export const deleteProductInformation = async (
  id: number,
): Promise<ProductInformation> => {
  const { data } = await axios.delete("/api/products", {
    data: { id },
  });
  return data;
};
