export type IPrefectureItem = {
  id: string;
  name: string;
  name_kana: string;
  permalink: string;
  minimum_wage: number;
  region: string;
  region_name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IPrefectureTableFilterValue = string;

export type IPrefectureTableFilters = {
  name: string;
};
