import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IPositionItem } from "@/types/position";

// ----------------------------------------------------------------------

export function useGetPositions() {
  const URL = endpoints.position.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      positions: (data?.positions as IPositionItem[]) || [],
      positionsLoading: isLoading,
      positionsError: error,
      positionsValidating: isValidating,
      positionsEmpty: !isLoading && !data?.positions.length,
    }),
    [data?.positions, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPosition(positionId: string) {
  const URL = positionId ? endpoints.position.detail(positionId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      position: data?.position as IPositionItem,
      positionLoading: isLoading,
      positionError: error,
      positionValidating: isValidating,
    }),
    [data?.position, error, isLoading, isValidating]
  );

  return memoizedValue;
}
