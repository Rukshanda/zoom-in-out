export type DayProps = {
  month: number;
  year: number;
  day: number;
  className?: string;
  labelDays?: string[];
  labelHours?: string[];
};

export type MonthProps = {
  month: number;
  year: number;
  className?: string;
  shortLabelDate?: string[];
  labelMonths?: string[];
  isMondayStart?: boolean;
};

export const enum TypeDate {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  SCHEDULE = "schedule",
  FOUR_DAY = "four_day",
}

export type CalendarEvent = {
  title: string;
  description?: string;
  start: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minus: number;
    typeHour: "AM" | "PM";
  };
  end: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minus: number;
    typeHour: "AM" | "PM";
  };
};

export type CalendarProps = {
  className?: string;
  isMondayStart?: boolean;
  type?: TypeDate;
  events?: CalendarEvent[];
};
