import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { IHolidayItem } from "@/types/holiday";

// ----------------------------------------------------------------------

export function useGetHolidays() {
  const URL = endpoints.holiday.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      holidays: (data?.holidays as IHolidayItem[]) || [],
      holidaysLoading: isLoading,
      holidaysError: error,
      holidaysValidating: isValidating,
      holidaysEmpty: !isLoading && !data?.holidays.length,
    }),
    [data?.holidays, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetHoliday(holidayId: string) {
  const URL = holidayId ? endpoints.holiday.detail(holidayId) : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      holiday: data?.holiday as IHolidayItem,
      holidayLoading: isLoading,
      holidayError: error,
      holidayValidating: isValidating,
    }),
    [data?.holiday, error, isLoading, isValidating]
  );

  return memoizedValue;
}
