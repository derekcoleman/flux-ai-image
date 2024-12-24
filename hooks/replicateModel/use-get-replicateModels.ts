import { useQuery } from "@tanstack/react-query";

import {
  getReplicateModels,
  ReplicateModel,
} from "@/lib/services/replicatemodelServices";

export const useGetReplicateModels = () => {
  const { data, isLoading, error } = useQuery<
    { models: ReplicateModel[] },
    Error
  >({
    queryKey: ["replicateModels"],
    queryFn: getReplicateModels,
  });

  return {
    models: data?.models ?? [],
    isLoading,
    error,
  };
};
