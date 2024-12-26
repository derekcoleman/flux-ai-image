import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createReplicateModel,
  ReplicateModel,
} from "@/lib/services/replicatemodelServices";

export const useSaveReplicateModel = (
  reset: () => void,
): {
  saveModelData: (data: ReplicateModel) => void;
  isSaving: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReplicateModel, Error, ReplicateModel>({
    mutationFn: createReplicateModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replicateModels"] });
      reset();
    },
    onError: (error) => {
      console.error("Error saving replicate model:", error);
      return error;
    },
  });

  return {
    saveModelData: mutation.mutate,
    isSaving: mutation.isPending,
  };
};
