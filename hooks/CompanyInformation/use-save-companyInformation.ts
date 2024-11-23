import { useMutation } from "@tanstack/react-query";

import {
  CompanyInformation,
  saveCompanyInformation,
} from "@/lib/services/companyInformationService";

export const useSaveCompanyInformation = (): {
  saveCompanyData: (data: CompanyInformation) => void;
  isSaving: boolean;
} => {
  const mutation = useMutation<any, Error, CompanyInformation>({
    mutationFn: saveCompanyInformation,
    onSuccess: (data) => {
      console.log("Company information saved successfully:", data);
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
