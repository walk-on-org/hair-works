import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IPlanItem } from "@/types/plan";

// ----------------------------------------------------------------------

export function useGetPlans() {
  const URL = endpoints.plan.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plans: (data?.plans as IPlanItem[]) || [],
      plansLoading: isLoading,
      plansError: error,
      plansValidating: isValidating,
      plansEmpty: !isLoading && !data?.plans.length,
    }),
    [data?.plans, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPlan(planId: string) {
  const URL = planId ? endpoints.plan.detail(planId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plan: data?.plan as IPlanItem,
      planLoading: isLoading,
      planError: error,
      planValidating: isValidating,
    }),
    [data?.plan, error, isLoading, isValidating]
  );

  return memoizedValue;
}
