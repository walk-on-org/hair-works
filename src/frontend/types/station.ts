export type IStationItem = {
  id: string;
  name: string;
  permalink: string;
  station_group_id: string;
  line_id: string;
  line_name: string;
  prefecture_id: string;
  prefecture_name: string;
  city_id: string;
  city_name: string;
  status: string;
  status_name: string;
  sort: number;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
};

export type IStationTableFilterValue = string | string[];

export type IStationTableFilters = {
  name: string;
  status: string[];
  line: string[];
  prefecture: string[];
};
