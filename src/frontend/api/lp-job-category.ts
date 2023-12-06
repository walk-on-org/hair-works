import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ILpJobCategoryItem } from "@/types/lp-job-category";

// ----------------------------------------------------------------------

export function useGetLpJobCategories() {
  const URL = endpoints.lpJobCategory.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      lpJobCategories: (data?.lp_job_categories as ILpJobCategoryItem[]) || [],
      lpJobCategoriesLoading: isLoading,
      lpJobCategoriesError: error,
      lpJobCategoriesValidating: isValidating,
      lpJobCategoriesEmpty: !isLoading && !data?.lp_job_categories.length,
    }),
    [data?.lp_job_categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLpJobCategory(lpJobCategoryId: string) {
  const URL = lpJobCategoryId
    ? endpoints.lpJobCategory.detail(lpJobCategoryId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      lpJobCategory: data?.lp_job_category as ILpJobCategoryItem,
      lpJobCategoryLoading: isLoading,
      lpJobCategoryError: error,
      lpJobCategoryValidating: isValidating,
    }),
    [data?.lp_job_category, error, isLoading, isValidating]
  );

  return memoizedValue;
}
