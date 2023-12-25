import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IKeepItem } from "@/types/keep";

// ----------------------------------------------------------------------

export function useGetKeeps() {
  const URL = endpoints.keep.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      keeps: (data?.keeps as IKeepItem[]) || [],
      keepsLoading: isLoading,
      keepsError: error,
      keepsValidating: isValidating,
      keepsEmpty: !isLoading && !data?.keeps.length,
    }),
    [data?.keeps, error, isLoading, isValidating]
  );

  return memoizedValue;
}
