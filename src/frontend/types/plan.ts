export type IPlanItem = {
  id: string;
  name: string;
  term: number;
  amount: number;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IPlanTableFilterValue = string | string[];

export type IPlanTableFilters = {
  name: string;
  status: string[];
};
