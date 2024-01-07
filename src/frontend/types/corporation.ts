import { IAdminUserItem } from "./admin-user";
import { IOfficeItem } from "./office";

export type ICorporationItem = {
  id: string;
  name: string;
  name_private: string;
  name_private_name: string;
  postcode: string;
  prefecture_id: string;
  prefecture_name: string;
  city_id: string;
  city_name: string;
  address: string;
  tel: string;
  fax: string;
  salon_num: number | null;
  employee_num: number | null;
  yearly_turnover: string;
  average_age: string;
  drug_maker: string;
  homepage: string;
  higher_display: string;
  higher_display_name: string;
  owner_image: string;
  owner_message: string;
  contracts: IContractItem[];
  corporation_images: ICorporationImageItem[];
  corporation_features: ICorporationFeatureItem[];
  offices: IOfficeItem[];
  plan_id: string;
  plan_name: string;
  start_date: Date | null;
  end_plan_date: Date | null;
  end_date: Date | null;
  office_count: number;
  job_count: number;
  applicant_count: number;
  admin_users: IAdminUserItem[];
  created_at: Date;
  updated_at: Date;
};

export type ICorporationTableFilterValue = string;

export type ICorporationTableFilters = {
  name: string;
};

export type IContractItem = {
  id: string;
  plan_id: string;
  plan_name: string;
  start_date: Date | null;
  end_plan_date: Date | null;
  end_date: Date | null;
  expire: string;
  expire_name: string;
};

export type ICorporationImageItem = {
  id: string;
  image: string;
  alttext: string;
  sort: number;
};

export type ICorporationFeatureItem = {
  id: string;
  feature: string;
  image: string;
};
