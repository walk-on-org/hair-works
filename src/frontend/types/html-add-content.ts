export type IHtmlAddContentItem = {
  id: string;
  prefecture_id: string;
  prefecture_name: string;
  government_city_id: string;
  government_city_name: string;
  city_id: string;
  city_name: string;
  station_id: string;
  station_name: string;
  display_average_salary: string;
  display_average_salary_name: string;
  display_feature: string;
  display_feature_name: string;
  feature: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IHtmlAddContentTableFilterValue = string[];

export type IHtmlAddContentTableFilters = {
  prefecture: string[];
};
