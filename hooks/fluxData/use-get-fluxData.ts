import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getFluxData, PaginatedFluxData } from "@/lib/services/fluxData";

export const useGetFluxData = (params: {
  page: number;
  pageSize: number;
  model?: string;
}): UseQueryResult<PaginatedFluxData, Error> => {
  return useQuery<PaginatedFluxData, Error>({
    queryKey: ["fluxData", params],
    queryFn: () => getFluxData(params),
  });
};
