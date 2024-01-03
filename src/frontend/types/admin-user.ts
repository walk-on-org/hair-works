export type IAdminUserItem = {
  id: string;
  name: string;
  email: string;
  password: string;
  tel: string;
  admin_role_id: string;
  admin_role_name: string;
  corporation_ids: string[];
  corporation_names: string[];
  created_at: Date;
  updated_at: Date;
};

export type IAdminUserTableFilterValue = string | string[];

export type IAdminUserTableFilters = {
  email: string;
  admin_role: string[];
};
