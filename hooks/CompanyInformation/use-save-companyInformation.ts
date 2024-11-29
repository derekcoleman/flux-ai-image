import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CompanyInformation,
  saveCompanyInformation,
} from "@/lib/services/companyInformationService";

export const useSaveCompanyInformation = (): {
  saveCompanyData: (data: CompanyInformation) => void;
  isSaving: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CompanyInformation, Error, CompanyInformation>({
    mutationFn: saveCompanyInformation,
    onSuccess: (data) => {
      console.log("Company information saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["companyInformation"] });
    },
    onError: (error) => {
      console.error("Error saving company information:", error);
    },
  });

  return {
    saveCompanyData: mutation.mutate,
    isSaving: mutation.isPending,
  };
};
