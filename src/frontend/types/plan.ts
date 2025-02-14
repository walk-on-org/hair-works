export type IPlanItem = {
  id: string;
  name: string;
  term: number;
  amount: number;
  status: string;
  status_name: string;
  created_at: Date;
  updated_at: Date;
};

export type IPlanTableFilterValue = string | string[];

export type IPlanTableFilters = {
  name: string;
  status: string[];
};
