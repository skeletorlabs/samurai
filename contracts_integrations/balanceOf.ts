import { ethers } from "ethers";

export async function balanceOf(
  abi: any,
  tokenAddress: string,
  userAddress: string,
  providerOrSigner: ethers.JsonRpcProvider | ethers.Signer
): Promise<string> {
  const contract = new ethers.Contract(tokenAddress, abi, providerOrSigner);
  // Get the balance of the user
  const balance: string = await contract.balanceOf(userAddress);
  return balance;
}
