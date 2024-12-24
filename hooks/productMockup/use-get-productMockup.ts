import * as React from "react";

import { useQuery } from "@tanstack/react-query";

import { getProductTrainingStatus } from "@/lib/services/productmockupServices";

interface UseGetProductMockupsProps {
  trainingId: string;
  enabled?: boolean;
  signal?: AbortSignal;
}

const POLLING_INTERVAL = 30000; // 30 seconds

export function useGetProductMockups({
  trainingId,
  enabled = true,
}: UseGetProductMockupsProps) {
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const query = useQuery({
    queryKey: ["productMockups", trainingId],
    queryFn: async () => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      const result = await getProductTrainingStatus({
        trainingId,
        signal: abortControllerRef.current.signal,
      });

      // If we get a final status, stop polling
      if (["succeeded", "failed"].includes(result.trainingStatus)) {
        return result;
      }

      // Throw error to continue polling if not complete
      throw new Error("Training in progress");
    },
    enabled: Boolean(trainingId) && enabled,
    refetchInterval: POLLING_INTERVAL,
    retry: true,
    retryDelay: POLLING_INTERVAL,
  });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cancelQuery = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    trainingStatus: query.data?.trainingStatus,
    isLoading: query.isLoading,
    error: query.error,
    cancelQuery,
    failedReason: query.error?.message,
  };
}
