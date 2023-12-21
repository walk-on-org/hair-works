export type IMemberItem = {
  id: string;
  name: string;
  name_kana: string;
  birthyear: number;
  postcode: string;
  prefecture_id: string;
  prefecture_name: string;
  address: string;
  phone: string;
  email: string;
  change_time: string;
  change_time_name: string;
  retirement_time: string;
  retirement_time_name: string;
  employment_id: string;
  employment_name: string;
  emp_prefecture_id: string;
  emp_prefecture_name: string;
  status: string;
  status_name: string;
  register_site: string;
  register_site_name: string;
  register_form: string;
  register_form_name: string;
  job_id: string;
  job_name: string;
  introduction_name: string;
  introduction_member_id: string;
  introduction_member_name: string;
  introduction_gift_status: string;
  introduction_gift_status_name: string;
  lat: number;
  lng: number;
  qualification_ids: string[];
  qualification_names: string[];
  lp_job_category_ids: string[];
  lp_job_category_names: string[];
  member_proposal_datetimes_text: string;
  // TODO 登録経歴
  // TODO 応募履歴
  created_at: Date;
  updated_at: Date;
};

export type IMemberTableFilterValue = string | string[];

export type IMemberTableFilters = {
  name: string;
  email: string;
  phone: string;
  emp_prefecture: string[];
  register_site: string[];
  register_form: string[];
  // TODO 登録経路
  introduction_gift_status: string[];
};
