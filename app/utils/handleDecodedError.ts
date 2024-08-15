import Notification from "../components/notificate";
import { DecodedError, ErrorDecoder } from "ethers-decode-error";

type ErrorProps = {
  errorDecoder: ErrorDecoder;
  e: Error;
  notificate?: boolean;
};

export default async function handleDecodedError({
  errorDecoder,
  e,
  notificate = false,
}: ErrorProps) {
  let title: string = "Transaction failure";

  const { reason, type, args, fragment } = await errorDecoder.decode(e);
  // console.log(reason, type, args, fragment);
  const message = args[0];

  if (notificate) {
    Notification({
      type: "error",
      title: title,
      message: message || reason,
      link: "",
    });
  }

  return e;
}
