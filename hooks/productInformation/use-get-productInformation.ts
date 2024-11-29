import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  getProductInformation,
  ProductInformation,
} from "@/lib/services/productinformationServices";

export const useGetProductInformation = (): UseQueryResult<
  ProductInformation[],
  Error
> => {
  return useQuery<ProductInformation[], Error>({
    queryKey: ["productInformation"],
    queryFn: getProductInformation,
  });
};
