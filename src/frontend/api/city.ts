import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ICityItem } from "@/types/city";

// ----------------------------------------------------------------------

export function useGetCities() {
  const URL = endpoints.city.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      cities: (data?.cities as ICityItem[]) || [],
      citiesLoading: isLoading,
      citiesError: error,
      citiesValidating: isValidating,
      citiesEmpty: !isLoading && !data?.cities.length,
    }),
    [data?.cities, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCity(cityId: string) {
  const URL = cityId ? endpoints.city.detail(cityId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      city: data?.city as ICityItem,
      cityLoading: isLoading,
      cityError: error,
      cityValidating: isValidating,
    }),
    [data?.city, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchCities(prefecture_id: string) {
  const URL = prefecture_id
    ? [endpoints.city.list, { params: { prefecture_id } }]
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      cities: (data?.cities as ICityItem[]) || [],
      citiesLoading: isLoading,
      citiesError: error,
      citiesValidating: isValidating,
      citiesEmpty: !isLoading && !data?.cities.length,
    }),
    [data?.cities, error, isLoading, isValidating]
  );

  return memoizedValue;
}
