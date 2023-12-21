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
