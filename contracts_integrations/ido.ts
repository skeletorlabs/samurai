import { ethers } from "ethers";
import { PARTICIPATOR_ABI } from "./abis";
import Notificate from "../components/notificate";
import handleError from "../utils/handleErrors";
import {
  GeneralInfo,
  NFTMetadata,
  WhitelistDataType,
} from "@/utils/interfaces";
import { IDO_LIST, LINKS } from "@/utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

// address[] public acceptedTokens;
// uint256 public min;
// uint256 public max;
// bool public isPublic;

// mapping(address wallet => uint256 allocation) public allocations;
// mapping(address wallet => bool isWhitelisted) public whitelist;
// mapping(address wallet => bool isBlacklisted) public blacklist;

async function getContract(
  index: number,
  signer?: ethers.Signer
): Promise<ethers.Contract> {
  const ido = IDO_LIST[index];
  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  const contractAddress = ido.contract;
  const contract = new ethers.Contract(
    contractAddress,
    PARTICIPATOR_ABI,
    signer || provider
  );

  return contract;
}

async function notificateTx(tx: any, network: any) {
  const txUrl = LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

  Notificate({
    type: "",
    title: "Transaction Submitted",
    message: `Transaction successfully submitted.`,
    link: txUrl,
  });

  const txReceipt = await tx.wait(3);

  Notificate({
    type: "success",
    title: "Transaction Confirmed",
    message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
    link: txUrl,
  });
}

export async function general(index: number) {
  const contract = await getContract(index);

  const owner = await contract.owner();
  const minPerWallet = await contract.min();
  const maxPerWallet = await contract.max();
  const isPublic = await contract.isPublic();
  const acceptedtokens = await contract.acceptedTokens();
}

export async function userInfo(index: number, signer: ethers.Signer) {
  const signerAdress = await signer.getAddress();
  const contract = await getContract(index, signer);

  const allocation = await contract.allocations(signerAdress);
  const isWhitelisted = await contract.whitelist(signerAdress);
  const isBlacklisted = await contract.blacklist(signerAdress);
}

export async function participate(
  index: number,
  signer: ethers.Signer,
  amount: string,
  acceptedToken: string
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract.sendToken(
      signerAddress,
      acceptedToken,
      ethers.parseUnits(amount, 6)
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function addToWhitelist(
  index: number,
  signer: ethers.Signer,
  addresses: string[]
) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract.addBatchToWhitelist(addresses);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function addToBlacklist(
  index: number,
  signer: ethers.Signer,
  address: string
) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract.addToWhitelist(address);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function makePublic(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract.makePublic();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function withdraw(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract.withdraw();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function togglePause(index: number, signer: ethers.Signer) {
  const contract = await getContract(index, signer);

  try {
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const isPaused = await contract.paused();
      let tx: any;

      tx = isPaused ? await contract.unpause() : await contract.pause();

      const txUrl = "https://goerli.etherscan.io/tx/" + tx.hash.toString();

      Notificate({
        type: "",
        title: "Transaction Submitted",
        message: `Transaction successfully submitted.`,
        link: txUrl,
      });

      const txReceipt = await tx.wait(3);

      Notificate({
        type: "success",
        title: "Transaction Confirmed",
        message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
        link: txUrl,
      });
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
