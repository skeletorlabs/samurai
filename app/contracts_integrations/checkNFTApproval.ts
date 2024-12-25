import { ethers } from "ethers";
import delay from "@/app/utils/delay";
import { isNFTApproved } from "./isNFTApproved";
import { giveNFTApproval } from "./giveNFTApproval";

export default async function checkNFTApproval(
  samNftAddress: string,
  spender: string,
  signer: ethers.Signer,
  tokenId: number
) {
  let rejected = false;
  let approved: boolean | undefined = await isNFTApproved({
    samNftAddress,
    spender,
    tokenId,
    signer,
  });

  console.log(approved);

  if (!approved) {
    const approval: any = await giveNFTApproval({
      samNftAddress: samNftAddress,
      spender: spender,
      tokenId: tokenId,
      signer,
    });

    if (typeof approval === "undefined" || approval === "ACTION_REJECTED") {
      rejected = true;
      throw new Error("Approval rejected or encountered an error");
    }
  }

  while (!rejected) {
    approved = await isNFTApproved({
      samNftAddress,
      spender,
      tokenId,
      signer,
    });

    if (approved) {
      return true;
    }

    await delay(100);
  }
}
