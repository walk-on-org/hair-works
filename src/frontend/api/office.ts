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

// ----------------------------------------------------------------------

export function useSearchOffices(
  corporation_name: string,
  office_name: string,
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc",
  reload: boolean
) {
  const URL = [
    endpoints.office.list,
    {
      params: {
        corporation_name,
        office_name,
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
      offices: (data?.offices as IOfficeItem[]) || [],
      officesCount: data?.offices_count || 0,
      officesLoading: isLoading,
      officesError: error,
      officesValidating: isValidating,
      officesEmpty: !isLoading && !data?.offices.length,
    }),
    [data?.offices, error, isLoading, isValidating]
  );

  return memoizedValue;
}
