import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  CompanyInformation,
  getCompanyInformation,
} from "@/lib/services/companyInformationService";

export const useGetCompanyInformation = (): UseQueryResult<
  CompanyInformation,
  Error
> => {
  return useQuery<CompanyInformation, Error>({
    queryKey: ["companyInformation"],
    queryFn: getCompanyInformation,
  });
};
