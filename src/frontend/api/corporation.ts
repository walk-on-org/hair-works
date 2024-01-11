import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ICorporationItem } from "@/types/corporation";

// ----------------------------------------------------------------------

export function useGetCorporations() {
  const URL = endpoints.corporation.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      corporations: (data?.corporations as ICorporationItem[]) || [],
      corporationsLoading: isLoading,
      corporationsError: error,
      corporationsValidating: isValidating,
      corporationsEmpty: !isLoading && !data?.corporations.length,
    }),
    [data?.corporations, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCorporation(corporationId: string) {
  const URL = corporationId ? endpoints.corporation.detail(corporationId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      corporation: data?.corporation as ICorporationItem,
      corporationLoading: isLoading,
      corporationError: error,
      corporationValidating: isValidating,
    }),
    [data?.corporation, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchCorporations(
  corporation_name: string,
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc"
) {
  const URL = [
    endpoints.corporation.list,
    { params: { corporation_name, limit, page, orderBy, order } },
  ];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      corporations: (data?.corporations as ICorporationItem[]) || [],
      corporationsCount: data?.corporations_count || 0,
      corporationsLoading: isLoading,
      corporationsError: error,
      corporationsValidating: isValidating,
      corporationsEmpty: !isLoading && !data?.corporations.length,
    }),
    [data?.corporations, error, isLoading, isValidating]
  );

  return memoizedValue;
}
