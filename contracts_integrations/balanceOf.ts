import { ethers } from "ethers";

export async function balanceOf(
  abi: any,
  tokenAddress: string,
  userAddress: string,
  signer: ethers.Signer
): Promise<string> {
  const contract = new ethers.Contract(tokenAddress, abi, signer);
  // Get the balance of the user
  const balance: string = await contract.balanceOf(userAddress);
  return balance;
}
