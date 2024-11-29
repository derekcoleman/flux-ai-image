import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteProductInformation,
  ProductInformation,
} from "@/lib/services/productinformationServices";

export const useDeleteProductInformation = (
  handleCloseAlertDialog: () => void,
): {
  deleteProductData: (id: number) => void;
  isDeleting: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ProductInformation, Error, number>({
    mutationFn: deleteProductInformation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productInformation"] });
      handleCloseAlertDialog();
    },
    onError: (error) => {
      console.error("Error updating product information:", error);
    },
  });

  return {
    deleteProductData: mutation.mutate,
    isDeleting: mutation.isPending,
  };
};
