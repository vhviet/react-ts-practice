import dayjs from "dayjs";

export const FORMAT_DATE = "YYYY-MM-DD";

export const FORMAT_DATE_VN = "DD-MM-YYYY";

export const FILE_SIZE_MAX = 2;

export const dateRangeValidate = (dateRange: any): [Date, Date] | undefined => {
  if (!dateRange || dateRange.length !== 2) return undefined;

  const startDate = dayjs(dateRange[0], FORMAT_DATE).startOf("day").toDate();
  const endDate = dayjs(dateRange[1], FORMAT_DATE).endOf("day").toDate();

  return [startDate, endDate];
};
