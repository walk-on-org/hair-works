import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ILineItem } from "@/types/line";

// ----------------------------------------------------------------------

export function useGetLines() {
  const URL = endpoints.line.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      lines: (data?.lines as ILineItem[]) || [],
      linesLoading: isLoading,
      linesError: error,
      linesValidating: isValidating,
      linesEmpty: !isLoading && !data?.lines.length,
    }),
    [data?.lines, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLine(lineId: string) {
  const URL = lineId ? endpoints.line.detail(lineId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      line: data?.line as ILineItem,
      lineLoading: isLoading,
      lineError: error,
      lineValidating: isValidating,
    }),
    [data?.line, error, isLoading, isValidating]
  );

  return memoizedValue;
}
