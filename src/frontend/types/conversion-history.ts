export type IConversionHistoryItem = {
  id: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  keyword: string;
  lp_url: string;
  lp_date: Date | null;
  cv_url: string;
  cv_date: Date | null;
  member_id: string;
  member_name: string;
  applicant_id: string;
  applicant_name: string;
  inquiry_id: string;
  inquiry_name: string;
};

export type IConversionHistoryTableFilterValue = string | Date | null;

export type IConversionHistoryTableFilters = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  lp_url: string;
  lp_start_date: Date | null;
  lp_end_date: Date | null;
  cv_url: string;
  cv_start_date: Date | null;
  cv_end_date: Date | null;
};
