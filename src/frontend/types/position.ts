export type IPositionItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IPositionTableFilterValue = string | string[];

export type IPositionTableFilters = {
  name: string;
  status: string[];
};
