import { Prisma } from "@prisma/client";

export const buildDateRangeFilter = (
  startDate?: string,
  endDate?: string,
): Prisma.DateTimeFilter | undefined => {
  if (!startDate && !endDate) {
    return undefined;
  }

  const range: Prisma.DateTimeFilter = {};

  // Current Filter Logic: Start day of startDate all the way to end day of endDate
  // Sample case: curr is 2 February, then if startDate is 2 February and endDate is also 2 February,
  // then any records in 2 February will be included
  if (startDate) {
    range.gte = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    range.lte = end;
  }

  return range;
};

export const buildMonthFilter = (
  month: number,
  year: number,
): Prisma.DateTimeFilter => {
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  return {
    gte: startOfMonth,
    lte: endOfMonth,
  };
};
