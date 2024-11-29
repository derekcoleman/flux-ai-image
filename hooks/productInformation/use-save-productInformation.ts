import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ProductInformation,
  saveProductInformation,
} from "@/lib/services/productinformationServices";

export const useSaveProductInformation = (
  onClose: () => void,
  reset: () => void,
): {
  saveProductData: (data: ProductInformation) => void;
  isSaving: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ProductInformation, Error, ProductInformation>({
    mutationFn: saveProductInformation,
    onSuccess: (data) => {
      console.log("Product information saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["productInformation"] });
      onClose();
      reset();
    },
    onError: (error) => {
      console.error("Error saving product information:", error);
    },
  });

  return {
    saveProductData: mutation.mutate,
    isSaving: mutation.isPending,
  };
};
