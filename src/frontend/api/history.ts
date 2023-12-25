import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IHistoryItem } from "@/types/history";

// ----------------------------------------------------------------------

export function useGetHistories() {
  const URL = endpoints.history.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      histories: (data?.histories as IHistoryItem[]) || [],
      historiesLoading: isLoading,
      historiesError: error,
      historiesValidating: isValidating,
      historiesEmpty: !isLoading && !data?.histories.length,
    }),
    [data?.histories, error, isLoading, isValidating]
  );

  return memoizedValue;
}
