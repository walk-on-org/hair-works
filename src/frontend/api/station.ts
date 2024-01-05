import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IStationItem } from "@/types/station";

// ----------------------------------------------------------------------

export function useGetStations() {
  const URL = endpoints.station.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      stations: (data?.stations as IStationItem[]) || [],
      stationsLoading: isLoading,
      stationsError: error,
      stationsValidating: isValidating,
      stationsEmpty: !isLoading && !data?.stations.length,
    }),
    [data?.stations, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetStation(stationId: string) {
  const URL = stationId ? endpoints.station.detail(stationId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      station: data?.station as IStationItem,
      stationLoading: isLoading,
      stationError: error,
      stationValidating: isValidating,
    }),
    [data?.station, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchStations(prefecture_id: string, station_name: string) {
  const URL =
    prefecture_id || station_name
      ? [endpoints.station.list, { params: { prefecture_id, station_name } }]
      : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      stations: (data?.stations as IStationItem[]) || [],
      stationsLoading: isLoading,
      stationsError: error,
      stationsValidating: isValidating,
      stationsEmpty: !isLoading && !data?.stations.length,
    }),
    [data?.stations, error, isLoading, isValidating]
  );

  return memoizedValue;
}
