export type IHistoryItem = {
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
  viewed_at: Date;
};

export type IHistoryTableFilterValue = string | string[];

export type IHistoryTableFilters = {
  corporation_name: string;
  office_name: string;
  job_name: string;
  job_category: string[];
  position: string[];
  employment: string[];
};
