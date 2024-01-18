import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IJobItem } from "@/types/job";

// ----------------------------------------------------------------------

export function useGetJobs() {
  const URL = endpoints.job.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      jobs: (data?.jobs as IJobItem[]) || [],
      jobsLoading: isLoading,
      jobsError: error,
      jobsValidating: isValidating,
      jobsEmpty: !isLoading && !data?.jobs.length,
    }),
    [data?.jobs, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetJob(jobId: string) {
  const URL = jobId ? endpoints.job.detail(jobId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      job: data?.job as IJobItem,
      jobLoading: isLoading,
      jobError: error,
      jobValidating: isValidating,
    }),
    [data?.job, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchJobs(
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
  order: "asc" | "desc" = "desc",
  reload: boolean
) {
  const URL = [
    endpoints.job.list,
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
        reload,
      },
    },
  ];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      jobs: (data?.jobs as IJobItem[]) || [],
      jobsCount: data?.jobs_count || 0,
      jobsLoading: isLoading,
      jobsError: error,
      jobsValidating: isValidating,
      jobsEmpty: !isLoading && !data?.jobs.length,
    }),
    [data?.jobs, error, isLoading, isValidating]
  );

  return memoizedValue;
}
