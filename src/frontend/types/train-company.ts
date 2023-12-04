export type ITrainCompanyItem = {
  id: string;
  name: string;
  name_r: string;
  status: string;
  status_name: number;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ITrainCompanyTableFilterValue = string | string[];

export type ITrainCompanyTableFilters = {
  name: string;
  status: string[];
};
