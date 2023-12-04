export type ICityItem = {
  id: string;
  name: string;
  permalink: string;
  prefecture_id: string;
  prefecture_name: string;
  government_city_id: string;
  government_city_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ICityTableFilterValue = string | string[];

export type ICityTableFilters = {
  name: string;
  prefecture: string[];
};
