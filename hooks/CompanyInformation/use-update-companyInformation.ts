import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CompanyInformation,
  updateCompanyInformation,
} from "@/lib/services/companyInformationService";

export const useUpdateCompanyInformation = (): {
  updateCompanyData: (data: Partial<CompanyInformation>) => void;
  isUpdating: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CompanyInformation,
    Error,
    Partial<CompanyInformation>
  >({
    mutationFn: updateCompanyInformation,
    onSuccess: (data) => {
      queryClient.setQueryData(["companyInformation"], data);

      queryClient.invalidateQueries({ queryKey: ["companyInformation"] });
    },
    onError: (error) => {
      console.error("Error updating company information:", error);
    },
  });

  return {
    updateCompanyData: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};
