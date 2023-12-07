export type INationalHolidayItem = {
  id: string;
  name: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type INationalHolidayTableFilterValue = string | Date | null;

export type INationalHolidayTableFilters = {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
};
