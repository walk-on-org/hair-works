import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IArticleCategoryItem } from "@/types/article-category";

// ----------------------------------------------------------------------

export function useGetArticleCategories() {
  const URL = endpoints.articleCategory.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      articleCategories:
        (data?.article_categories as IArticleCategoryItem[]) || [],
      articleCategoriesLoading: isLoading,
      articleCategoriesError: error,
      articleCategoriesValidating: isValidating,
      articleCategoriesEmpty: !isLoading && !data?.article_categories.length,
    }),
    [data?.article_categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetArticleCategory(articleCategoryId: string) {
  const URL = articleCategoryId
    ? endpoints.articleCategory.detail(articleCategoryId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      articleCategory: data?.article_category as IArticleCategoryItem,
      articleCategoryLoading: isLoading,
      articleCategoryError: error,
      articleCategoryValidating: isValidating,
    }),
    [data?.article_category, error, isLoading, isValidating]
  );

  return memoizedValue;
}
