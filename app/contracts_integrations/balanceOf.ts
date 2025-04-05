import { MulticallProvider } from "@ethers-ext/provider-multicall";
import { ethers } from "ethers";

export async function balanceOf(
  abi: any,
  tokenAddress: string,
  userAddress: string,
  providerOrSigner: ethers.JsonRpcProvider | ethers.Signer | MulticallProvider
): Promise<string> {
  const contract = new ethers.Contract(tokenAddress, abi, providerOrSigner);
  const balance: string = await contract.balanceOf(userAddress);
  return balance;
}
