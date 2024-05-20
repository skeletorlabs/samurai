import { fromUnixTime, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formattedDate(timestamp: number) {
  return format(toZonedTime(fromUnixTime(timestamp), "UTC"), "dd MMM, HH:mm");
}

export function formattedDateSimple(timestamp: number) {
  return format(toZonedTime(fromUnixTime(timestamp), "UTC"), "dd MMM");
}

export function formattedDate2(timestamp: number) {
  return format(toZonedTime(fromUnixTime(timestamp), "UTC"), "dd/MM/yyyy");
}

export function formattedDate3(timestamp: number) {
  return (
    format(toZonedTime(fromUnixTime(timestamp), "UTC"), "dd/MM/yyyy HH:mm") +
    " UTC"
  );
}
