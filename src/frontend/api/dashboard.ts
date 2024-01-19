import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "@/utils/axios";

import {
  IDashboardJobCountEveryStatusItem,
  IDashboardJobCountEveryPrefectureItem,
  IDashboardMemberCountEveryYearItem,
  IDashboardMemberCountEveryYearRootItem,
  IDashboardMemberDeploymentItem,
  IDashboardApplicantCountEveryYearItem,
  IDashboardApplicantCountEveryYearRootItem,
  IDashboardApplicantCountEveryCorporationItem,
  IDashboardInquiryCountEveryYearItem,
} from "@/types/dashboard";

// ----------------------------------------------------------------------

export function useGetJobCount() {
  const URL = endpoints.dashboard.jobCount;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      jobCountEveryStatus:
        (data?.job_count_every_status as IDashboardJobCountEveryStatusItem[]) ||
        [],
      jobCountEveryPrefecture:
        (data?.job_count_every_prefecture as IDashboardJobCountEveryPrefectureItem[]) ||
        [],
      publishJobCount: data?.publish_job_count || 0,
      jobCountLoading: isLoading,
      jobCountError: error,
      jobCountValidating: isValidating,
      jobCountEmpty:
        !isLoading &&
        !data?.job_count_every_status.length &&
        !data?.job_count_every_prefecture.length,
    }),
    [
      data?.job_count_every_status,
      data?.job_count_every_prefecture,
      data?.publish_job_count,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMemberCount() {
  const URL = endpoints.dashboard.memebrCount;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      memberCountEveryYear:
        (data?.member_count_every_year as IDashboardMemberCountEveryYearItem[]) ||
        [],
      memberCountThisMonth: data?.member_count_this_month || 0,
      memberCountOneYearAgo: data?.member_count_one_year_ago || [],
      memberCountEveryYearRoot:
        (data?.member_count_every_year_root as IDashboardMemberCountEveryYearRootItem[]) ||
        [],
      memberDeploymentEveryMonthByGoogleAll:
        (data?.member_deployment_every_month_by_google_all as IDashboardMemberDeploymentItem[]) ||
        [],
      memberDeploymentEveryMonthByGoogle:
        (data?.member_deployment_every_month_by_google as IDashboardMemberDeploymentItem[]) ||
        [],
      memberDeploymentEveryMonthByGoogleHairmake:
        (data?.member_deployment_every_month_by_google_hairmake as IDashboardMemberDeploymentItem[]) ||
        [],
      memberDeploymentEveryMonthByGoogleEyelist:
        (data?.member_deployment_every_month_by_google_eyelist as IDashboardMemberDeploymentItem[]) ||
        [],
      memberDeploymentEveryMonthByGoogleColorlist:
        (data?.member_deployment_every_month_by_google_colorlist as IDashboardMemberDeploymentItem[]) ||
        [],
      memberDeploymentEveryMonthByYahoo:
        (data?.member_deployment_every_month_by_yahoo as IDashboardMemberDeploymentItem[]) ||
        [],
      memberDeploymentEveryMonthByGoogleAgent:
        (data?.member_deployment_every_month_by_google_agent as IDashboardMemberDeploymentItem[]) ||
        [],
      memberCountLoading: isLoading,
      memberCountError: error,
      memberCountValidating: isValidating,
      memberCountEmpty: !isLoading,
    }),
    [
      data?.member_count_every_year,
      data?.member_count_this_month,
      data?.member_count_one_year_ago,
      data?.member_count_every_year_root,
      data?.member_deployment_every_month_by_google_all,
      data?.member_deployment_every_month_by_google,
      data?.member_deployment_every_month_by_google_hairmake,
      data?.member_deployment_every_month_by_google_eyelist,
      data?.member_deployment_every_month_by_google_colorlist,
      data?.member_deployment_every_month_by_yahoo,
      data?.member_deployment_every_month_by_google_agent,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetApplicantCount() {
  const URL = endpoints.dashboard.applicantCount;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      applicantCountEveryYear:
        (data?.applicant_count_every_year as IDashboardApplicantCountEveryYearItem[]) ||
        [],
      applicantCountThisMonth: data?.applicant_count_this_month || 0,
      applicantCountOneYearAgo: data?.applicant_count_one_year_ago || [],
      applicantCountEveryYearRoot:
        (data?.applicant_count_every_year_root as IDashboardApplicantCountEveryYearRootItem[]) ||
        [],
      applicantCountEveryCorporation:
        (data?.applicant_count_every_corporation as IDashboardApplicantCountEveryCorporationItem[]) ||
        [],
      applicantCountLoading: isLoading,
      applicantCountError: error,
      applicantCountValidating: isValidating,
      applicantCountEmpty:
        !isLoading && !data?.applicant_count_every_year.length,
    }),
    [
      data?.applicant_count_every_year,
      data?.applicant_count_this_month,
      data?.applicant_count_one_year_ago,
      data?.applicant_count_every_year_root,
      data?.applicant_count_every_corporation,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInquiryCount() {
  const URL = endpoints.dashboard.inquiryCount;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inquiryCountEveryYear:
        (data?.inquiry_count_every_year as IDashboardInquiryCountEveryYearItem[]) ||
        [],
      inquiryCountThisMonth: data?.inquiry_count_every_year || 0,
      inquiryCountOneYearAgo: data?.inquiry_count_one_year_ago || [],
      inquiryCountLoading: isLoading,
      inquiryCountError: error,
      inquiryCountValidating: isValidating,
      inquiryCountEmpty: !isLoading && !data?.inquiry_count_every_year.length,
    }),
    [
      data?.inquiry_count_every_year,
      data?.inquiry_count_this_month,
      data?.inquiry_count_one_year_ago,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}
