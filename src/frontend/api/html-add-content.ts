import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IHtmlAddContentItem } from "@/types/html-add-content";

// ----------------------------------------------------------------------

export function useGetHtmlAddContents() {
  const URL = endpoints.htmlAddContent.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      htmlAddContents: (data?.html_add_contents as IHtmlAddContentItem[]) || [],
      htmlAddContentsLoading: isLoading,
      htmlAddContentsError: error,
      htmlAddContentsValidating: isValidating,
      htmlAddContentsEmpty: !isLoading && !data?.html_add_contents.length,
    }),
    [data?.html_add_contents, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetHtmlAddContent(htmlAddContentId: string) {
  const URL = htmlAddContentId
    ? endpoints.htmlAddContent.detail(htmlAddContentId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      htmlAddContent: data?.html_add_content as IHtmlAddContentItem,
      htmlAddContentLoading: isLoading,
      htmlAddContentError: error,
      htmlAddContentValidating: isValidating,
    }),
    [data?.html_add_content, error, isLoading, isValidating]
  );

  return memoizedValue;
}
