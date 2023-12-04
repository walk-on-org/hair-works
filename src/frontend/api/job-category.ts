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
      jobCategories: (data?.job_categroies as IJobCategoryItem[]) || [],
      jobCategoriesLoading: isLoading,
      jobCategoriesError: error,
      jobCategoriesValidating: isValidating,
      jobCategoriesEmpty: !isLoading && !data?.job_categroies.length,
    }),
    [data?.job_categroies, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetJobCategory(jobCategoryId: string) {
  const URL = jobCategoryId ? endpoints.jobCategory.detail(jobCategoryId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      jobCategory: data?.job_category as IJobCategoryItem,
      jobCategoryLoading: isLoading,
      jobCategoryError: error,
      jobCategoryValidating: isValidating,
    }),
    [data?.job_category, error, isLoading, isValidating]
  );

  return memoizedValue;
}
