import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getCompanyInformation } from "@/lib/services/companyInformationService";

export const useGetCompanyInformation = (): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["companyInformation"],
    queryFn: getCompanyInformation,
  });
};
