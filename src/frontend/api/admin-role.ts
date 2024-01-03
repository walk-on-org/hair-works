import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IAdminRoleItem } from "@/types/admin-role";

// ----------------------------------------------------------------------

export function useGetAdminRoles() {
  const URL = endpoints.adminRole.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      adminRoles: (data?.admin_roles as IAdminRoleItem[]) || [],
      adminRolesLoading: isLoading,
      adminRolesError: error,
      adminRolesValidating: isValidating,
      adminRolesEmpty: !isLoading && !data?.admin_roles.length,
    }),
    [data?.admin_roles, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAdminRole(adminRoleId: string) {
  const URL = adminRoleId ? endpoints.adminRole.detail(adminRoleId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      adminRole: data?.admin_role as IAdminRoleItem,
      adminRoleLoading: isLoading,
      adminRoleError: error,
      adminRoleValidating: isValidating,
    }),
    [data?.admin_role, error, isLoading, isValidating]
  );

  return memoizedValue;
}
