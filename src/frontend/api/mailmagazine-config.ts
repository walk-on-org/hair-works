import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IMailmagazineConfigItem } from "@/types/mailmagazine-config";

// ----------------------------------------------------------------------

export function useGetMailmagazineConfigs() {
  const URL = endpoints.mailmagazineConfig.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      mailmagazineConfigs:
        (data?.mailmagazine_configs as IMailmagazineConfigItem[]) || [],
      mailmagazineConfigsLoading: isLoading,
      mailmagazineConfigsError: error,
      mailmagazineConfigsValidating: isValidating,
      mailmagazineConfigsEmpty:
        !isLoading && !data?.mailmagazine_configs.length,
    }),
    [data?.mailmagazine_configs, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMailmagazineConfig(mailmagazineConfigId: string) {
  const URL = mailmagazineConfigId
    ? endpoints.mailmagazineConfig.detail(mailmagazineConfigId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      mailmagazineConfig: data?.mailmagazine_config as IMailmagazineConfigItem,
      mailmagazineConfigLoading: isLoading,
      mailmagazineConfigError: error,
      mailmagazineConfigValidating: isValidating,
    }),
    [data?.mailmagazine_config, error, isLoading, isValidating]
  );

  return memoizedValue;
}
