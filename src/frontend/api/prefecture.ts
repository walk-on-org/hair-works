import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IPrefectureItem } from "@/types/prefecture";

// ----------------------------------------------------------------------

export function useGetPrefectures() {
  const URL = endpoints.prefecture.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      prefectures: (data?.prefectures as IPrefectureItem[]) || [],
      prefecturesLoading: isLoading,
      prefecturesError: error,
      prefecturesValidating: isValidating,
      prefecturesEmpty: !isLoading && !data?.prefectures.length,
    }),
    [data?.prefectures, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPrefecture(prefectureId: string) {
  const URL = prefectureId ? endpoints.prefecture.detail(prefectureId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      prefecture: data?.prefecture as IPrefectureItem,
      prefectureLoading: isLoading,
      prefectureError: error,
      prefectureValidating: isValidating,
    }),
    [data?.prefecture, error, isLoading, isValidating]
  );

  return memoizedValue;
}
