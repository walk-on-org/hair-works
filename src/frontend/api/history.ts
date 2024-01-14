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

// ----------------------------------------------------------------------

export function useSearchHistories(
  corporation_name: string,
  office_name: string,
  job_name: string,
  job_category_id: string[],
  position_id: string[],
  employment_id: string[],
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc"
) {
  const URL = [
    endpoints.history.list,
    {
      params: {
        corporation_name,
        office_name,
        job_name,
        job_category_id,
        position_id,
        employment_id,
        limit,
        page,
        orderBy,
        order,
      },
    },
  ];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      histories: (data?.histories as IHistoryItem[]) || [],
      historiesCount: data?.histories_count || 0,
      historiesLoading: isLoading,
      historiesError: error,
      historiesValidating: isValidating,
      historiesEmpty: !isLoading && !data?.histories.length,
    }),
    [data?.histories, error, isLoading, isValidating]
  );

  return memoizedValue;
}
