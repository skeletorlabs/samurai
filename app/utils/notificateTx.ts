import Notificate from "@/app/components/notificate";
import { LINKS } from "./constants";

export async function notificateTx(tx: any, network: any) {
  const txUrl = LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

  Notificate({
    type: "",
    title: "Transaction Submitted",
    message: `Transaction successfully submitted.`,
    link: txUrl,
  });

  const txReceipt = await tx.wait(6);

  Notificate({
    type: "success",
    title: "Transaction Confirmed",
    message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
    link: txUrl,
  });
}
