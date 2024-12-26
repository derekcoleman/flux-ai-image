import { useMutation } from "@tanstack/react-query";

import {
  OnboardingAnswers,
  saveOnboardingAnswers,
} from "@/lib/services/onboardingService";

export const useSaveOnboarding = (): {
  saveOnboardingData: (data: OnboardingAnswers) => void;
  isSaving: boolean;
} => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, OnboardingAnswers>({
    mutationFn: saveOnboardingAnswers,
    onSuccess: (data) => {
      console.log("Saved successfully:", data);
    },
    onError: (error) => {
      console.error("Error saving onboarding data:", error);
    },
  });

  return {
    saveOnboardingData: mutation.mutate,
    isSaving: mutation.isPending,
  };
};
