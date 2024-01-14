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

// ----------------------------------------------------------------------

export function useSearchKeeps(
  corporation_name: string,
  office_name: string,
  job_name: string,
  job_category_id: string[],
  position_id: string[],
  employment_id: string[],
  status: string[],
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc"
) {
  const URL = [
    endpoints.keep.list,
    {
      params: {
        corporation_name,
        office_name,
        job_name,
        job_category_id,
        position_id,
        employment_id,
        status,
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
      keeps: (data?.keeps as IKeepItem[]) || [],
      keepsCount: data?.keeps_count || 0,
      keepsLoading: isLoading,
      keepsError: error,
      keepsValidating: isValidating,
      keepsEmpty: !isLoading && !data?.keeps.length,
    }),
    [data?.keeps, error, isLoading, isValidating]
  );

  return memoizedValue;
}
