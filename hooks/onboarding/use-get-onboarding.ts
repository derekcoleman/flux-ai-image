import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getOnboardingAnswers } from "@/lib/services/onboardingService";

export const useGetOnboarding = (): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["onboardingData"],
    queryFn: getOnboardingAnswers,
  });
};
