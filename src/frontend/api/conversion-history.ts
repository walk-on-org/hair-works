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

// ----------------------------------------------------------------------

export function useSearchConversionHistories(
  utm_source: string,
  utm_medium: string,
  utm_campaign: string,
  utm_term: string,
  lp_url: string,
  lp_start_date: string,
  lp_end_date: string,
  cv_url: string,
  cv_start_date: string,
  cv_end_date: string,
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc"
) {
  const URL = [
    endpoints.conversionHistory.list,
    {
      params: {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        lp_url,
        lp_start_date,
        lp_end_date,
        cv_url,
        cv_start_date,
        cv_end_date,
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
      conversionHistories:
        (data?.conversion_histories as IConversionHistoryItem[]) || [],
      conversionHistoriesCount: data?.conversion_histories_count || 0,
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
