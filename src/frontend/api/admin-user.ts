import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IAdminUserItem } from "@/types/admin-user";

// ----------------------------------------------------------------------

export function useGetAdminUsers() {
  const URL = endpoints.adminUser.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      adminUsers: (data?.admin_users as IAdminUserItem[]) || [],
      adminUsersLoading: isLoading,
      adminUsersError: error,
      adminUsersValidating: isValidating,
      adminUsersEmpty: !isLoading && !data?.admin_users.length,
    }),
    [data?.admin_users, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAdminUser(adminUserId: string) {
  const URL = adminUserId ? endpoints.adminUser.detail(adminUserId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      adminUser: data?.admin_user as IAdminUserItem,
      adminUserLoading: isLoading,
      adminUserError: error,
      adminUserValidating: isValidating,
    }),
    [data?.admin_user, error, isLoading, isValidating]
  );

  return memoizedValue;
}
