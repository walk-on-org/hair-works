export type IGovernmentCityItem = {
  id: string;
  name: string;
  permalink: string;
  prefecture_id: string;
  prefecture_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IGovernmentCityTableFilterValue = string;

export type IGovernmentCityTableFilters = {
  name: string;
};
