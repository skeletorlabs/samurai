import {
  formatDistance,
  formatDistanceStrict,
  formatDistanceToNow,
  fromUnixTime,
  getUnixTime,
  isValid,
} from "date-fns";

export const countdown = async (current: number, target: number) => {
  const start = fromUnixTime(current);
  const end = fromUnixTime(target);

  return formatDistance(end, start, { includeSeconds: true });
};
