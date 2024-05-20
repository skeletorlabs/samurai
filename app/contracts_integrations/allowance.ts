import { ethers } from "ethers";
import { ERC20_ABI } from "./abis";

export async function getAllowance({
  owner,
  spender,
  signer,
  customAbi,
}: {
  owner: string;
  spender: string;
  signer: ethers.Signer;
  customAbi?: any;
}): Promise<ethers.BigNumberish> {
  const signerAddress = await signer.getAddress();
  const contract = new ethers.Contract(
    owner,
    customAbi ? customAbi : ERC20_ABI,
    signer
  );

  try {
    const allowance: ethers.BigNumberish = await contract.allowance(
      signerAddress,
      spender
    );
    return allowance;
  } catch (e) {
    return 0; // Return 0 as the default allowance if an error occurs
  }
}
