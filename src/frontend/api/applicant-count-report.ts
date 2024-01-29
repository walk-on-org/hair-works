import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";
import {
  IApplicantCountReportByApplicantAddress,
  IApplicantCountReportByOfficeAddress,
} from "@/types/applicant-count-report";

// ----------------------------------------------------------------------

export function useGetApplicantCount(
  prefecture_id: string,
  government_city_id: string,
  city_id: string,
  from: string,
  to: string
) {
  const URL = [
    endpoints.applicantCountReport.root,
    {
      params: {
        prefecture_id,
        government_city_id,
        city_id,
        from,
        to,
      },
    },
  ];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      applicantCountByApplicantAddress:
        (data?.applicant_count_by_applicant_address as IApplicantCountReportByApplicantAddress[]) ||
        [],
      applicantAllCountByApplicantAddress:
        data?.applicant_all_count_by_applicant_address || 0,
      officeCount: data?.office_count || 0,
      applicantCountByOfficeAddress:
        (data?.applicant_count_by_office_address as IApplicantCountReportByOfficeAddress[]) ||
        [],
      applicantAllCountByOfficeAddress:
        data?.applicant_all_count_by_office_address || 0,
      applicantCountLoading: isLoading,
      applicantCountError: error,
      applicantCountValidating: isValidating,
      applicantCountEmpty:
        !isLoading &&
        !data?.applicant_count_by_applicant_address.length &&
        !data?.applicant_count_by_office_address.length,
    }),
    [
      data?.applicant_count_by_applicant_address,
      data?.applicant_all_count_by_applicant_address,
      data?.office_count,
      data?.applicant_count_by_office_address,
      data?.applicant_all_count_by_office_address,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}
