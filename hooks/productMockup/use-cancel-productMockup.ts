import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelTrainingRequest } from "@/lib/services/replicatemodelServices";

interface CancelTrainingResponse {
  success: boolean;
  message: string;
}

interface CancelTrainingParams {
  trainingId: string;
}

export function useCancelTraining(onSuccessCallback: () => void): {
  cancelTraining: (params: CancelTrainingParams) => void;
  isCancelling: boolean;
} {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CancelTrainingResponse,
    Error,
    CancelTrainingParams
  >({
    mutationFn: cancelTrainingRequest,
    onSuccess: (data) => {
      console.log("Training cancelled successfully:", data, onSuccessCallback);
      queryClient.invalidateQueries({ queryKey: ["training"] });
      onSuccessCallback();
    },
    onError: (error) => {
      console.error("Error cancelling training:", error);
    },
  });

  return {
    cancelTraining: mutation.mutate,
    isCancelling: mutation.isPending,
  };
}
