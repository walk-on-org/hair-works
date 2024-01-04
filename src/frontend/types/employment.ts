export type IEmploymentItem = {
  id: string;
  name: string;
  permalink: string;
  status: string;
  status_name: string;
  employment_concern_points: IEmploymentConcernPointItem[];
  created_at: Date;
  updated_at: Date;
};

export type IEmploymentTableFilterValue = string | string[];

export type IEmploymentTableFilters = {
  name: string;
  status: string[];
};

export type IEmploymentConcernPointItem = {
  id: string;
  employment_id: string;
  position_id: string;
  position_name: string;
  commitment_term_id: string;
  commitment_term_name: string;
  title: string;
  description: string;
  sort: number;
};
