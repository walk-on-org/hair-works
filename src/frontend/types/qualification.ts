export type IQualificationItem = {
  id: string;
  name: string;
  status: string;
  status_name: string;
  sort: number;
  created_at: Date;
  updated_at: Date;
};

export type IQualificationTableFilterValue = string | string[];

export type IQualificationTableFilters = {
  name: string;
  status: string[];
};
