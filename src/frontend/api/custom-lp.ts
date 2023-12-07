import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ICustomLpItem } from "@/types/custom-lp";

// ----------------------------------------------------------------------

export function useGetCustomLps() {
  const URL = endpoints.customLp.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      customLps: (data?.custom_lps as ICustomLpItem[]) || [],
      customLpsLoading: isLoading,
      customLpsError: error,
      customLpsValidating: isValidating,
      customLpsEmpty: !isLoading && !data?.custom_lps.length,
    }),
    [data?.custom_lps, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCustomLp(customLpId: string) {
  const URL = customLpId ? endpoints.customLp.detail(customLpId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      customLp: data?.custom_lp as ICustomLpItem,
      customLpLoading: isLoading,
      customLpError: error,
      customLpValidating: isValidating,
    }),
    [data?.custom_lp, error, isLoading, isValidating]
  );

  return memoizedValue;
}
