export type ILineItem = {
  id: string;
  name: string;
  permalink: string;
  train_company_id: string;
  train_company_name: string;
  status: string;
  status_name: string;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ILineTableFilterValue = string | string[];

export type ILineTableFilters = {
  name: string;
  status: string[];
  trainCompany: string[];
};
