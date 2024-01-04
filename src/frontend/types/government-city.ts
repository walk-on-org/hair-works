export type IGovernmentCityItem = {
  id: string;
  name: string;
  permalink: string;
  prefecture_id: string;
  prefecture_name: string;
  created_at: Date;
  updated_at: Date;
};

export type IGovernmentCityTableFilterValue = string;

export type IGovernmentCityTableFilters = {
  name: string;
};
