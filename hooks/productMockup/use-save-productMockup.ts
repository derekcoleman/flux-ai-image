/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import {
  Productmockup,
  saveProductMockup,
} from "@/lib/services/productmockupServices";

export const useSaveProductMockup = (
  setUrls: (urls: { cancel: string; stream: string; get: string }) => void,
): {
  saveProductData: (data: Productmockup) => Promise<void>;
  isSaving: boolean;
  error: Error | null;
} => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<void, Error, Productmockup>({
    mutationFn: async (data) => {
      const result = await saveProductMockup(data);
      setUrls((result as any).urls);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product Mockup created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["productMockUp"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create Product Mockup",
        variant: "destructive",
      });
      throw error;
    },
  });

  return {
    saveProductData: mutation.mutateAsync,
    isSaving: mutation.isPending,
    error: mutation.error,
  };
};
