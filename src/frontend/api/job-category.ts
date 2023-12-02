import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IJobCategoryItem } from "@/types/job-category";

// ----------------------------------------------------------------------

export function useGetJobCategories() {
  const URL = endpoints.jobCategory.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      jobCategories: (data?.jobCategories as IJobCategoryItem[]) || [],
      jobCategoriesLoading: isLoading,
      jobCategoriesError: error,
      jobCategoriesValidating: isValidating,
      jobCategoriesEmpty: !isLoading && !data?.jobCategories.length,
    }),
    [data?.jobCategories, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetJobCategory(jobCategoryId: string) {
  const URL = jobCategoryId ? endpoints.jobCategory.detail(jobCategoryId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      jobCategory: data?.jobCategory as IJobCategoryItem,
      jobCategoryLoading: isLoading,
      jobCategoryError: error,
      jobCategoryValidating: isValidating,
    }),
    [data?.jobCategory, error, isLoading, isValidating]
  );

  return memoizedValue;
}
