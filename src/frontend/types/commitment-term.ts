export type ICommitmentTermItem = {
  id: string;
  name: string;
  permalink: string;
  category: string;
  category_name: string;
  recommend: string;
  recommend_name: string;
  status: string;
  status_name: string;
  created_at: Date;
  updated_at: Date;
};

export type ICommitmentTermTableFilterValue = string | string[];

export type ICommitmentTermTableFilters = {
  name: string;
  status: string[];
};
