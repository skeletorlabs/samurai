import { fromUnixTime, format } from "date-fns";

export function formattedDate(timestamp: number) {
  return format(fromUnixTime(timestamp), "dd MMM, HH:mm");
}
