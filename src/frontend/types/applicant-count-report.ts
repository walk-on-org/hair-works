export type IApplicantCountReportFilterValue = string;

export type IApplicantCountReportFilters = {
  prefecture_id: string;
  government_city_id: string;
  city_id: string;
  from: string;
  to: string;
};

export type IApplicantCountReportByApplicantAddress = {
  prefecture_name: string;
  government_city_name: string;
  city_name: string;
  count: number;
};

export type IApplicantCountReportByOfficeAddress = {
  office_name: string;
  prefecture_name: string;
  government_city_name: string;
  city_name: string;
  count: number;
};
