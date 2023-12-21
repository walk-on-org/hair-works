import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IMemberItem } from "@/types/member";

// ----------------------------------------------------------------------

export function useGetMembers() {
  const URL = endpoints.member.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      members: (data?.members as IMemberItem[]) || [],
      membersLoading: isLoading,
      membersError: error,
      membersValidating: isValidating,
      membersEmpty: !isLoading && !data?.members.length,
    }),
    [data?.members, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMember(memberId: string) {
  const URL = memberId ? endpoints.member.detail(memberId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      member: data?.member as IMemberItem,
      memberLoading: isLoading,
      memberError: error,
      memberValidating: isValidating,
    }),
    [data?.member, error, isLoading, isValidating]
  );

  return memoizedValue;
}
