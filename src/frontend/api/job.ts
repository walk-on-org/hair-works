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
