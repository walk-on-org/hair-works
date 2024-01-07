import { IJobItem } from "./job";

export type IOfficeItem = {
  id: string;
  name: string;
  corporation_id: string;
  corporation_name: string;
  postcode: string;
  prefecture_id: string;
  prefecture_name: string;
  city_id: string;
  city_name: string;
  address: string;
  tel: string;
  fax: string;
  open_date: Date | null;
  business_time: string;
  regular_holiday: string;
  floor_space: number | null;
  seat_num: number | null;
  shampoo_stand: string;
  staff: number | null;
  new_customer_ratio: number | null;
  cut_unit_price: number | null;
  customer_unit_price: number | null;
  passive_smoking: string;
  passive_smoking_name: string;
  lat: number;
  lng: number;
  external_url: string;
  sns_url: string;
  office_accesses: IOfficeAccessItem[];
  office_clienteles: IOfficeClienteleItem[];
  office_images: IOfficeImageItem[];
  office_features: IOfficeFeatureItem[];
  jobs: IJobItem[];
  job_count: number;
  applicant_count: number;
  created_at: Date;
  updated_at: Date;
};

export type IOfficeTableFilterValue = string;

export type IOfficeTableFilters = {
  name: string;
  corporation_name: string;
};

export type IOfficeAccessItem = {
  id: string;
  line_id: string;
  line_name: string;
  station_id: string;
  station_name: string;
  move_type: string;
  move_type_name: string;
  time: number;
  note: string;
};

export type IOfficeClienteleItem = {
  id: string;
  clientele: string;
  clientele_name: string;
  othertext: string;
};

export type IOfficeImageItem = {
  id: string;
  image: string;
  alttext: string;
  sort: number;
};

export type IOfficeFeatureItem = {
  id: string;
  feature: string;
  image: string;
};
