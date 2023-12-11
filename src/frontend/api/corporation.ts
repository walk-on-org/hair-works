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
