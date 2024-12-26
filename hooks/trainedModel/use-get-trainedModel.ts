import { useQuery } from "@tanstack/react-query";

import { TrainedModel } from "@/config/constants";
import { getTrainedModels } from "@/lib/services/trainedModelServices";

export function useGetTrainedModel() {
  return useQuery<TrainedModel[]>({
    queryKey: ["trainedModels"],
    queryFn: getTrainedModels,
  });
}
