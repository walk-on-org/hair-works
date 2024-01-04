export type IJobCategoryItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  created_at: Date;
  updated_at: Date;
};

export type IJobCategoryTableFilterValue = string | string[];

export type IJobCategoryTableFilters = {
  name: string;
  status: string[];
};
