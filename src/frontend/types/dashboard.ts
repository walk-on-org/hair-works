// ステータス別求人件数
export type IDashboardJobCountEveryStatusItem = {
  status: string;
  status_name: string;
  job_count: number;
};

// 都道府県別求人件数
export type IDashboardJobCountEveryPrefectureItem = {
  prefecture_id: string;
  prefecture_name: string;
  job_count: number;
};

// ----------------------------------------------------------------------

// 月別会員登録件数
export type IDashboardMemberCountEveryYearItem = {
  created_year: string;
  member_count: number[];
};

// 経路・月別会員登録件数
export type IDashboardMemberCountEveryYearRootItem = {
  created_year: string;
  member_count_every_root: IDashboardMemberCountEveryRootItem[];
};
export type IDashboardMemberCountEveryRootItem = {
  register_root: string;
  member_count: number[];
};

// 月別会員登録展開率
export type IDashboardMemberDeploymentItem = {
  created_ym: string;
  member_count: number;
  entry_count: number;
  entry_ratio: number | null;
  interview_count: number;
  interview_ratio: number | null;
  offer_count: number;
  offer_ratio: number | null;
  contract_count: number;
  contract_ratio: number | null;
};

// ----------------------------------------------------------------------

// 月別応募者件数
export type IDashboardApplicantCountEveryYearItem = {
  created_year: string;
  applicant_count: number[];
};

// 法人別応募者件数
export type IDashboardApplicantCountEveryCorporationItem = {
  corporation_id: string;
  corporation_name: string;
  prefecture_name: string;
  office_count: number;
  applicant_count: number;
  plan_name: string;
  start_date: Date | null;
  end_plan_date: Date | null;
  end_date: Date | null;
};

// 経路・月別応募者件数
export type IDashboardApplicantCountEveryYearRootItem = {
  created_year: string;
  applicant_count_every_root: IDashboardApplicantCountEveryRootItem[];
};
export type IDashboardApplicantCountEveryRootItem = {
  register_root: string;
  applicant_count: number[];
};

// ----------------------------------------------------------------------

// 月別問い合わせ件数
export type IDashboardInquiryCountEveryYearItem = {
  created_year: string;
  inquiry_count: number[];
};
