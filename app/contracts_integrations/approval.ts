import { ethers } from "ethers";
import { ERC20_ABI } from "./abis";
import Notificate from "@/app/components/notificate";
import handleError from "@/app/utils/handleErrors";
import { LINKS } from "@/app/utils/constants";

export async function giveApproval({
  owner,
  spender,
  signer,
  customAbi,
  amount,
}: {
  owner: string;
  spender: string;
  signer: ethers.Signer;
  customAbi?: any;
  amount?: ethers.BigNumberish; // Change the amount type to ethers.BigNumber
}) {
  try {
    const network = await signer.provider?.getNetwork();
    const contract = new ethers.Contract(
      owner,
      customAbi ? customAbi : ERC20_ABI,
      signer
    );

    const tx = await contract.approve(spender, amount);
    const txUrl = LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

    Notificate({
      type: "",
      title: "Transaction Submitted",
      message: "Your approval transaction was successfully submitted.",
      link: txUrl,
    });

    const receipt = await tx.wait();
    Notificate({
      type: "success",
      title: "Transaction Confirmed",
      message: `Approval confirmed in block ${receipt.blockNumber}`,
      link: txUrl,
    });

    return receipt;
  } catch (e) {
    return handleError({ e: e, notificate: false });
  }
}
