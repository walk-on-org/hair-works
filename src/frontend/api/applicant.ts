import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IApplicantItem } from "@/types/applicant";

// ----------------------------------------------------------------------

export function useGetApplicants() {
  const URL = endpoints.applicant.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      applicants: (data?.applicants as IApplicantItem[]) || [],
      applicantsLoading: isLoading,
      applicantsError: error,
      applicantsValidating: isValidating,
      applicantsEmpty: !isLoading && !data?.applicants.length,
    }),
    [data?.applicants, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetApplicant(applicantId: string) {
  const URL = applicantId ? endpoints.applicant.detail(applicantId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      applicant: data?.applicant as IApplicantItem,
      applicantLoading: isLoading,
      applicantError: error,
      applicantValidating: isValidating,
    }),
    [data?.applicant, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchApplicants(
  corporation_name: string,
  office_name: string,
  name: string,
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc"
) {
  const URL = [
    endpoints.applicant.list,
    {
      params: {
        corporation_name,
        office_name,
        name,
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
      applicants: (data?.applicants as IApplicantItem[]) || [],
      applicantsCount: data?.applicants_count || 0,
      applicantsLoading: isLoading,
      applicantsError: error,
      applicantsValidating: isValidating,
      applicantsEmpty: !isLoading && !data?.applicants.length,
    }),
    [data?.applicants, error, isLoading, isValidating]
  );

  return memoizedValue;
}
