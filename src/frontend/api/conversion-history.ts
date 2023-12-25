import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IConversionHistoryItem } from "@/types/conversion-history";

// ----------------------------------------------------------------------

export function useGetConversionHistories() {
  const URL = endpoints.conversionHistory.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      conversionHistories:
        (data?.conversion_histories as IConversionHistoryItem[]) || [],
      conversionHistoriesLoading: isLoading,
      conversionHistoriesError: error,
      conversionHistoriesValidating: isValidating,
      conversionHistoriesEmpty:
        !isLoading && !data?.conversion_histories.length,
    }),
    [data?.conversion_histories, error, isLoading, isValidating]
  );

  return memoizedValue;
}
