import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { ICommitmentTermItem } from "@/types/commitment-term";

// ----------------------------------------------------------------------

export function useGetCommitmentTerms() {
  const URL = endpoints.commitmentTerm.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      commitmentTerms: (data?.commitment_terms as ICommitmentTermItem[]) || [],
      commitmentTermsLoading: isLoading,
      commitmentTermsError: error,
      commitmentTermsValidating: isValidating,
      commitmentTermsEmpty: !isLoading && !data?.commitment_terms.length,
    }),
    [data?.commitment_terms, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCommitmentTerm(commitmentTermId: string) {
  const URL = commitmentTermId
    ? endpoints.commitmentTerm.detail(commitmentTermId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      commitmentTerm: data?.commitment_term as ICommitmentTermItem,
      commitmentTermLoading: isLoading,
      commitmentTermError: error,
      commitmentTermValidating: isValidating,
    }),
    [data?.commitment_term, error, isLoading, isValidating]
  );

  return memoizedValue;
}
