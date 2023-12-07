import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IAdKeywordItem } from "@/types/ad-keyword";

// ----------------------------------------------------------------------

export function useGetAdKeywords() {
  const URL = endpoints.adKeyword.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      adKeywords: (data?.ad_keywords as IAdKeywordItem[]) || [],
      adKeywordsLoading: isLoading,
      adKeywordsError: error,
      adKeywordsValidating: isValidating,
      adKeywordsEmpty: !isLoading && !data?.ad_keywords.length,
    }),
    [data?.ad_keywords, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAdKeyword(adKeywordId: string) {
  const URL = adKeywordId ? endpoints.adKeyword.detail(adKeywordId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      adKeyword: data?.ad_keyword as IAdKeywordItem,
      adKeywordLoading: isLoading,
      adKeywordError: error,
      adKeywordValidating: isValidating,
    }),
    [data?.ad_keyword, error, isLoading, isValidating]
  );

  return memoizedValue;
}
