import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";
import Notificate from '../components/notificate'
import handleError from '../utils/handleErrors'
import { GeneralInfo, NFTMetadata } from "@/utils/interfaces";
import { Metadata } from "next"

// const CONTRACT_ADDRESS = "0x2E759F0f558dB7b4077097AA7f08e1158833A8E7";
const CONTRACT_ADDRESS = "0x2f7B66161A34e396ED82F1bC3932eb044726d8d3"

export async function general(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer)
    const signerAddress = await signer.getAddress();
    const isPaused = await contract.paused();
    const totalSupply = await contract.totalSupply()
    const maxSupply = await contract.MAX_SUPPLY();
    const baseUri = await contract.baseURI();
    const isWhitelisted = await contract.isWhitelisted(signerAddress)
    const hasUsedFreeMint = await contract.hasUsedFreeMint(signerAddress)

    return { 
      totalSupply, 
      maxSupply,
      isWhitelisted, 
      hasUsedFreeMint, 
      isPaused,
      baseUri
    } as GeneralInfo
  } catch (e) {
    handleError({ e: e, notificate: true })
  }
}

export async function mint(signer: ethers.Signer, freeMint: boolean) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer)
    const signerAddress = await signer.getAddress();

    let tx: any
    
    if (freeMint) {
      tx = await contract.freeMint(signerAddress);
    } else {
      const amount = ethers.parseEther("0.1");
      tx = await contract.mint(signerAddress, {value: amount});
    }

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

export async function getNFTData(ipfsUrl: string, tokenId: string, tokenUri: string) {
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY as string

  const metadataUrl = gateway + "/ipfs/" + ipfsUrl.substring(ipfsUrl.indexOf("ipfs://") + 7, ipfsUrl.length) + tokenUri
  const metadataResponse = await fetch(metadataUrl);
  const metadata: NFTMetadata = await metadataResponse.json();

  const imageUrl = gateway + "/ipfs/" + metadata.image.substring(metadata.image.indexOf("ipfs://") + 7, metadata.image.length)
  
  return imageUrl
}