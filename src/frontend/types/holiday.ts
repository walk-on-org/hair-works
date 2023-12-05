export type IHolidayItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IHolidayTableFilterValue = string | string[];

export type IHolidayTableFilters = {
  name: string;
  status: string[];
};
