import { format, parseISO, isValid, startOfDay } from "date-fns";
import dayjs from "dayjs";

export default function formatDate(dateParam) {
  if (!dateParam) return "";

  let date;

  if (dateParam instanceof Date) {
    date = dateParam;
  } else if (typeof dateParam === "string") {
    date = parseISO(dateParam);
    if (!isValid(date)) {
      console.error("Invalid date string:", dateParam);
      return "";
    }
  } else if (dayjs.isDayjs(dateParam)) {
    date = dateParam.toDate();
  } else {
    console.error("Unsupported date format:", dateParam);
    return "";
  }

  date = startOfDay(date);

  return format(date, "yyyy-MM-dd");
}
