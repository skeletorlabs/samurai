import { getUnixTime } from "date-fns";

export function currentTime() {
  return getUnixTime(new Date());
}
