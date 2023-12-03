import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IEmploymentItem } from "@/types/employment";

// ----------------------------------------------------------------------

export function useGetEmployments() {
  const URL = endpoints.employment.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      employments: (data?.employments as IEmploymentItem[]) || [],
      employmentsLoading: isLoading,
      employmentsError: error,
      employmentsValidating: isValidating,
      employmentsEmpty: !isLoading && !data?.employments.length,
    }),
    [data?.employments, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEmployment(employmentId: string) {
  const URL = employmentId ? endpoints.employment.detail(employmentId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      employment: data?.employment as IEmploymentItem,
      employmentLoading: isLoading,
      employmentError: error,
      employmentValidating: isValidating,
    }),
    [data?.employment, error, isLoading, isValidating]
  );

  return memoizedValue;
}
