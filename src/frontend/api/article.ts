import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IArticleItem } from "@/types/article";

// ----------------------------------------------------------------------

export function useGetArticles() {
  const URL = endpoints.article.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      articles: (data?.articles as IArticleItem[]) || [],
      articlesLoading: isLoading,
      articlesError: error,
      articlesValidating: isValidating,
      articlesEmpty: !isLoading && !data?.articles.length,
    }),
    [data?.articles, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetArticle(articleId: string) {
  const URL = articleId ? endpoints.article.detail(articleId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      article: data?.article as IArticleItem,
      articleLoading: isLoading,
      articleError: error,
      articleValidating: isValidating,
    }),
    [data?.article, error, isLoading, isValidating]
  );

  return memoizedValue;
}
