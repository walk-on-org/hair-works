export type IArticleCategoryItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  created_at: Date;
  updated_at: Date;
};

export type IArticleCategoryTableFilterValue = string;

export type IArticleCategoryTableFilters = {
  name: string;
};
