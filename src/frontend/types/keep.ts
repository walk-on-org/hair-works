export type IKeepItem = {
  id: string;
  member_id: string;
  member_name: string;
  corporation_id: string;
  corporation_name: string;
  office_id: string;
  office_name: string;
  job_id: string;
  job_name: string;
  job_category_id: string;
  job_category_name: string;
  position_id: string;
  position_name: string;
  employment_id: string;
  employment_name: string;
  status: string;
  status_name: string;
  keeped_at: Date;
  released_at: Date;
};

export type IKeepTableFilterValue = string | string[];

export type IKeepTableFilters = {
  corporation_name: string;
  office_name: string;
  job_name: string;
  job_category: string[];
  position: string[];
  employment: string[];
  status: string[];
};
