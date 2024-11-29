import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import {
  OnboardingAnswers,
  updateOnboardingAnswers,
} from "@/lib/services/onboardingService";

export const useUpdateOnboarding = (): {
  updateOnBoardingData: (data: Partial<OnboardingAnswers>) => void;
  isUpdating: boolean;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, Error, Partial<OnboardingAnswers>>({
    mutationFn: updateOnboardingAnswers,
    onSuccess: (data) => {
      console.log("Updated successfully:", data);

      queryClient.setQueryData(["onboardingData"], data);

      queryClient.invalidateQueries({ queryKey: ["onboardingData"] });
    },
    onError: (error) => {
      console.error("Error updating onboarding data:", error);
    },
  });

  return {
    updateOnBoardingData: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};
