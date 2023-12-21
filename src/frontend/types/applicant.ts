export type IApplicantItem = {
  id: string;
  corporation_id: string;
  corporation_name: string;
  office_id: string;
  office_name: string;
  office_prefecture_id: string;
  office_prefecture_name: string;
  job_id: string;
  job_name: string;
  job_recommend: string;
  job_recommend_name: string;
  status: string;
  status_name: string;
  proposal_type: string;
  proposal_type_name: string;
  name: string;
  name_kana: string;
  birthyear: number;
  postcode: string;
  prefecture_id: string;
  prefecture_name: string;
  address: string;
  phone: string;
  mail: string;
  change_time: string;
  change_time_name: string;
  retirement_time: string;
  retirement_time_name: string;
  employment_id: string;
  employment_name: string;
  emp_prefecture_id: string;
  emp_prefecture_name: string;
  qualification_ids: string[];
  qualification_names: string[];
  lp_job_category_ids: string[];
  lp_job_category_names: string[];
  note: string;
  applicant_proposal_datetimes_text: string;
  applicant_contact_histories: IApplicantContactHistoryItem[];
  // TODO 登録経路
  created_at: Date;
  updated_at: Date;
};

export type IApplicantTableFilterValue = string;

export type IApplicantTableFilters = {
  corporation_name: string;
  office_name: string;
  name: string;
  // TODO 登録経路
};

export type IApplicantContactHistoryItem = {
  id: string;
  contact_date: Date;
  contact_memo: string;
};
