import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";

export async function isNFTApproved({
  samNftAddress,
  spender,
  tokenId,
  signer,
}: {
  samNftAddress: string;
  spender: string;
  tokenId: number;
  signer: ethers.Signer;
}): Promise<boolean> {
  const contract = new ethers.Contract(samNftAddress, NFTS_ABI, signer);

  try {
    const getApprovedAddress: string = await contract.getApproved(tokenId);
    return getApprovedAddress.toLowerCase() === spender.toLowerCase();
  } catch (e) {
    return false;
  }
}
