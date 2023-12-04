import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ITrainCompanyItem } from "@/types/train-company";

// ----------------------------------------------------------------------

export function useGetTrainCompanies() {
  const URL = endpoints.trainCompany.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      trainCompanies: (data?.train_companies as ITrainCompanyItem[]) || [],
      trainCompaniesLoading: isLoading,
      trainCompaniesError: error,
      trainCompaniesValidating: isValidating,
      trainCompaniesEmpty: !isLoading && !data?.train_companies.length,
    }),
    [data?.train_companies, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetTrainCompany(trainCompanyId: string) {
  const URL = trainCompanyId
    ? endpoints.trainCompany.detail(trainCompanyId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      trainCompany: data?.train_company as ITrainCompanyItem,
      trainCompanyLoading: isLoading,
      trainCompanyError: error,
      trainCompanyValidating: isValidating,
    }),
    [data?.train_company, error, isLoading, isValidating]
  );

  return memoizedValue;
}
