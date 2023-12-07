export type ICustomLpItem = {
  id: string;
  permalink: string;
  title: string;
  logo: string;
  point1: string;
  point2: string;
  point3: string;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ICustomLpTableFilterValue = string;

export type ICustomLpTableFilters = {
  title: string;
};
