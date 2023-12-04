import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IGovernmentCityItem } from "@/types/government-city";

// ----------------------------------------------------------------------

export function useGetGovernmentCities() {
  const URL = endpoints.governmentCity.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      governmentCities:
        (data?.government_cities as IGovernmentCityItem[]) || [],
      governmentCitiesLoading: isLoading,
      governmentCitiesError: error,
      governmentCitiesValidating: isValidating,
      governmentCitiesEmpty: !isLoading && !data?.government_cities.length,
    }),
    [data?.government_cities, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetGovernmentCity(governmentCityId: string) {
  const URL = governmentCityId
    ? endpoints.governmentCity.detail(governmentCityId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      governmentCity: data?.government_city as IGovernmentCityItem,
      governmentCityLoading: isLoading,
      governmentCityError: error,
      governmentCityValidating: isValidating,
    }),
    [data?.government_city, error, isLoading, isValidating]
  );

  return memoizedValue;
}
