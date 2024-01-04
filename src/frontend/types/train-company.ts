export type ITrainCompanyItem = {
  id: string;
  name: string;
  name_r: string;
  status: string;
  status_name: string;
  sort: number;
  created_at: Date;
  updated_at: Date;
};

export type ITrainCompanyTableFilterValue = string | string[];

export type ITrainCompanyTableFilters = {
  name: string;
  status: string[];
};
