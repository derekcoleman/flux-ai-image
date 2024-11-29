import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ProductInformation,
  updateProductInformation,
} from "@/lib/services/productinformationServices";

export const useUpdateProductInformation = (
  onClose: () => void,
  reset: () => void,
): {
  updateProductData: (data: Partial<ProductInformation>) => void;
  isUpdating: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ProductInformation,
    Error,
    Partial<ProductInformation>
  >({
    mutationFn: updateProductInformation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productInformation"] });
      onClose();
      reset();
    },
    onError: (error) => {
      console.error("Error updating product information:", error);
    },
  });

  return {
    updateProductData: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};
