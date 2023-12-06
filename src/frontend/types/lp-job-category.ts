export type ILpJobCategoryItem = {
  id: string;
  name: string;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ILpJobCategoryTableFilterValue = string | string[];

export type ILpJobCategoryTableFilters = {
  name: string;
  status: string[];
};
