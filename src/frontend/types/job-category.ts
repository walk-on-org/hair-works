export type IJobCategoryItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IJobCategoryTableFilterValue = string | string[];

export type IJobCategoryTableFilters = {
  name: string;
  status: string[];
};
