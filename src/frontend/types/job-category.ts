export type IJobCategoryItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IJobCategoryTableFilterValue = string | string[];

export type IJobCategoryTableFilters = {
  name: string;
  status: string[];
};
