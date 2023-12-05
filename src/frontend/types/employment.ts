export type IEmploymentItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IEmploymentTableFilterValue = string | string[];

export type IEmploymentTableFilters = {
  name: string;
  status: string[];
};
