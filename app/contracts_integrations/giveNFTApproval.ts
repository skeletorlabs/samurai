import { ethers } from "ethers";
import { ERC20_ABI, NFTS_ABI } from "./abis";
import Notificate from "@/app/components/notificate";
import handleError from "@/app/utils/handleErrors";
import { LINKS } from "@/app/utils/constants";

export async function giveNFTApproval({
  samNftAddress,
  spender,
  signer,
  tokenId,
}: {
  samNftAddress: string;
  spender: string;
  signer: ethers.Signer;
  tokenId: ethers.BigNumberish;
}) {
  try {
    const network = await signer.provider?.getNetwork();
    const contract = new ethers.Contract(samNftAddress, NFTS_ABI, signer);
    const signerAddress = await signer.getAddress();

    // console.log(samNftAddress, signerAddress, tokenId);
    const tx = await contract?.approve(spender, tokenId);
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
