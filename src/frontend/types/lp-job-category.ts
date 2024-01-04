export type ILpJobCategoryItem = {
  id: string;
  name: string;
  status: string;
  status_name: string;
  created_at: Date;
  updated_at: Date;
};

export type ILpJobCategoryTableFilterValue = string | string[];

export type ILpJobCategoryTableFilters = {
  name: string;
  status: string[];
};
