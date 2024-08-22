import { ethers } from "ethers";
import { getAllowance } from "./allowance";
import { giveApproval } from "./approval";
import delay from "@/app/utils/delay";

export default async function checkApproval(
  owner: string,
  spender: string,
  signer: ethers.Signer,
  transactionAmount?: ethers.BigNumberish,
  customAbi?: any
) {
  let rejected = false;
  let allowed: ethers.BigNumberish | undefined = await getAllowance({
    owner: owner as string,
    spender: spender as string,
    signer,
    customAbi: customAbi ? customAbi : null,
  });
  let amountTocheck =
    transactionAmount ||
    ethers.parseUnits(
      "1000000000000000000000000000000000000000000000000000",
      6
    );

  if (!allowed || allowed < amountTocheck) {
    const approval: ethers.BigNumberish | undefined = await giveApproval({
      owner: owner,
      spender: spender,
      amount: transactionAmount,
      signer,
      customAbi: customAbi ? customAbi : null,
    });

    if (typeof approval === "undefined" || approval === "ACTION_REJECTED") {
      rejected = true;
      throw new Error("Approval rejected or encountered an error");
    }
  }

  while (!rejected) {
    allowed = await getAllowance({
      owner: owner as string,
      spender: spender as string,
      signer,
      customAbi: customAbi ? customAbi : null,
    });

    if (allowed >= amountTocheck) {
      return true;
    }

    await delay(100);
  }
}
