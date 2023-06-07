import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";
import Notificate from '../components/notificate'
import handleError from '../utils/handleErrors'

const CONTRACT_ADDRESS = "0x2E759F0f558dB7b4077097AA7f08e1158833A8E7";

export async function general(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer)
    const totalSupply = await contract.totalSupply()
    const maxSupply = await contract.MAX_SUPPLY();

    return { totalSupply: totalSupply.toString(), maxSupply: maxSupply.toString() }
  } catch (e) {
    handleError({ e: e, notificate: true })
  }
}

export async function mint(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer)
    const signerAddress = await signer.getAddress();
    const amount = ethers.parseEther("0.1");
    const tx = await contract.safeMint(signerAddress, {value: amount});
    const txUrl = 'https://goerli.etherscan.io/tx/' + tx.hash.toString()

    Notificate({
      type: '',
      title: 'Transaction Submitted',
      message: `Transaction successfully submitted.`,
      link: txUrl,
    })

    const txReceipt = await tx.wait(3)

    Notificate({
      type: 'success',
      title: 'Transaction Confirmed',
      message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
      link: txUrl,
    })

  } catch (e) {
    handleError({ e: e, notificate: true })
  }
}