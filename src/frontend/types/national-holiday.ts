export type INationalHolidayItem = {
  id: string;
  name: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
};

export type INationalHolidayTableFilterValue = string | Date | null;

export type INationalHolidayTableFilters = {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
};
