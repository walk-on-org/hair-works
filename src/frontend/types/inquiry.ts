export type IInquiryItem = {
  id: string;
  salon_name: string;
  name: string;
  prefecture_id: string;
  prefecture_name: string;
  tel: string;
  mail: string;
  inquiry_type: string;
  inquiry_type_name: string;
  inquiry_note: string;
  note: string;
  status: string;
  status_name: string;
  created_at: Date;
  updated_at: Date;
};

export type IInquiryTableFilterValue = string;

export type IInquiryTableFilters = {
  salon_name: string;
  name: string;
};
