import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import { INationalHolidayItem } from "@/types/national-holiday";

// ----------------------------------------------------------------------

export function useGetNationalHolidays() {
  const URL = endpoints.nationalHoliday.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      nationalHolidays:
        (data?.national_holidays as INationalHolidayItem[]) || [],
      nationalHolidaysLoading: isLoading,
      nationalHolidaysError: error,
      nationalHolidaysValidating: isValidating,
      nationalHolidaysEmpty: !isLoading && !data?.national_holidays.length,
    }),
    [data?.national_holidays, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetNationalHoliday(nationalHolidayId: string) {
  const URL = nationalHolidayId
    ? endpoints.nationalHoliday.detail(nationalHolidayId)
    : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      nationalHoliday: data?.national_holiday as INationalHolidayItem,
      nationalHolidayLoading: isLoading,
      nationalHolidayError: error,
      nationalHolidayValidating: isValidating,
    }),
    [data?.national_holiday, error, isLoading, isValidating]
  );

  return memoizedValue;
}
