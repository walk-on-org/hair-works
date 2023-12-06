import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IQualificationItem } from "@/types/qualification";

// ----------------------------------------------------------------------

export function useGetQualifications() {
  const URL = endpoints.qualification.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      qualifications: (data?.qualifications as IQualificationItem[]) || [],
      qualificationsLoading: isLoading,
      qualificationsError: error,
      qualificationsValidating: isValidating,
      qualificationsEmpty: !isLoading && !data?.qualifications.length,
    }),
    [data?.qualifications, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetQualification(qualificationId: string) {
  const URL = qualificationId
    ? endpoints.qualification.detail(qualificationId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      qualification: data?.qualification as IQualificationItem,
      qualificationLoading: isLoading,
      qualificationError: error,
      qualificationValidating: isValidating,
    }),
    [data?.qualification, error, isLoading, isValidating]
  );

  return memoizedValue;
}
