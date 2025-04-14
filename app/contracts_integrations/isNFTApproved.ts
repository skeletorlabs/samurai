import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";

export async function isNFTApproved({
  samNftAddress,
  spender,
  tokenId,
}: {
  samNftAddress: string;
  spender: string;
  tokenId: number;
}): Promise<boolean> {
  const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  const contract = new ethers.Contract(samNftAddress, NFTS_ABI, provider);

  try {
    const getApprovedAddress: string = await contract?.getApproved(tokenId);
    return getApprovedAddress.toLowerCase() === spender.toLowerCase();
  } catch (e) {
    return false;
  }
}
