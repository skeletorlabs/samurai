import { fromUnixTime, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export function formattedDate(timestamp: number) {
  return format(
    utcToZonedTime(fromUnixTime(timestamp), "UTC"),
    "dd MMM, HH:mm"
  );
}

export function formattedDateSimple(timestamp: number) {
  return format(utcToZonedTime(fromUnixTime(timestamp), "UTC"), "dd MMM");
}
