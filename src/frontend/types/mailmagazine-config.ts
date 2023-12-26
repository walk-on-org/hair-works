export type IMailmagazineConfigItem = {
  id: string;
  title: string;
  deliver_job_type: string;
  deliver_job_type_name: string;
  job_keyword: string;
  member_birthyear_from: number | null;
  member_birthyear_to: number | null;
  job_match_lp_job_category: string;
  job_match_lp_job_category_name: string;
  job_match_employment: string;
  job_match_employment_name: string;
  job_match_distance: number | null;
  job_count_limit: number | null;
  search_other_corporation: string;
  search_other_corporation_name: string;
  j_corporation_ids: string[];
  j_corporation_names: string[];
  j_corporation_labels: string[];
  j_job_category_ids: string[];
  j_job_category_names: string[];
  mailmagazine_m_areas: IMailmagazineMAreaItem[];
  m_lp_job_category_ids: string[];
  m_lp_job_category_names: string[];
  m_emp_prefecture_ids: string[];
  m_emp_prefecture_names: string[];
  m_employment_ids: string[];
  m_employment_names: string[];
  m_qualification_ids: string[];
  m_qualification_names: string[];
  m_statuses: string[];
  m_status_names: string[];
  m_change_times: string[];
  m_change_time_names: string[];
};

export type IMailmagazineConfigTableFilterValue = string;

export type IMailmagazineConfigTableFilters = {
  title: string;
};

export type IMailmagazineMAreaItem = {
  id: string;
  prefecture_id: string;
  prefecture_name: string;
  city_id: string;
  city_name: string;
};
