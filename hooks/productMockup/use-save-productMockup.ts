import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Productmockup,
  saveProductMockup,
} from "@/lib/services/productmockupServices";

export const useSaveProductMockup = (
  reset: () => void,
): {
  saveProductData: (data: Productmockup) => void;
  isSaving: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Productmockup, Error, Productmockup>({
    mutationFn: saveProductMockup,
    onSuccess: (data) => {
      console.log("Product Mockup created and saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["productMockUp"] });
      reset();
    },
    onError: (error) => {
      console.error("Error saving product mockup:", error);
    },
  });

  return {
    saveProductData: mutation.mutate,
    isSaving: mutation.isPending,
  };
};
