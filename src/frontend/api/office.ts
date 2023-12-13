import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IOfficeItem } from "@/types/office";

// ----------------------------------------------------------------------

export function useGetOffices() {
  const URL = endpoints.office.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      offices: (data?.offices as IOfficeItem[]) || [],
      officesLoading: isLoading,
      officesError: error,
      officesValidating: isValidating,
      officesEmpty: !isLoading && !data?.offices.length,
    }),
    [data?.offices, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetOffice(officeId: string) {
  const URL = officeId ? endpoints.office.detail(officeId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      office: data?.office as IOfficeItem,
      officeLoading: isLoading,
      officeError: error,
      officeValidating: isValidating,
    }),
    [data?.office, error, isLoading, isValidating]
  );

  return memoizedValue;
}
