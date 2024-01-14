import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IInquiryItem } from "@/types/inquiry";

// ----------------------------------------------------------------------

export function useGetInquiries() {
  const URL = endpoints.inquiry.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inquiries: (data?.inquiries as IInquiryItem[]) || [],
      inquiriesLoading: isLoading,
      inquiriesError: error,
      inquiriesValidating: isValidating,
      inquiriesEmpty: !isLoading && !data?.inquiries.length,
    }),
    [data?.inquiries, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInquiry(inquiryId: string) {
  const URL = inquiryId ? endpoints.inquiry.detail(inquiryId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inquiry: data?.inquiry as IInquiryItem,
      inquiryLoading: isLoading,
      inquiryError: error,
      inquiryValidating: isValidating,
    }),
    [data?.inquiry, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchInquiries(
  salon_name: string,
  name: string,
  limit: number = 30,
  page: number = 1,
  orderBy: string = "id",
  order: "asc" | "desc" = "desc"
) {
  const URL = [
    endpoints.inquiry.list,
    {
      params: {
        salon_name,
        name,
        limit,
        page,
        orderBy,
        order,
      },
    },
  ];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inquiries: (data?.inquiries as IInquiryItem[]) || [],
      inquiriesCount: data?.inquiries_count || 0,
      inquiriesLoading: isLoading,
      inquiriesError: error,
      inquiriesValidating: isValidating,
      inquiriesEmpty: !isLoading && !data?.inquiries.length,
    }),
    [data?.inquiries, error, isLoading, isValidating]
  );

  return memoizedValue;
}
