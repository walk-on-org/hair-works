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
  plan_id: string;
  plan_name: string;
  start_date: Date | null;
  end_plan_date: Date | null;
  end_date: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
