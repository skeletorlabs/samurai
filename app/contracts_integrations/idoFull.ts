import {
  ethers,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers";
import { ERC20_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { IDO_LIST } from "@/app/utils/constants";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";

// const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

async function getContract(index: number, signer?: ethers.Signer) {
  try {
    const ido = IDO_LIST[index];
    const provider = new ethers.JsonRpcProvider(TEST_RPC);
    const contractAddress = ido.contract;
    const contract = new ethers.Contract(
      contractAddress,
      ido.abi,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// OVERALL INFOS

export async function checkIsPaused(index: number) {
  try {
    const contract = await getContract(index);
    const isPaused = await contract?.paused();
    return isPaused;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function ido(index: number) {
  try {
    const contract = await getContract(index);
    const owner = await contract?.owner();
    const isPaused = await contract?.paused();

    const token = await contract?.token();
    const acceptedToken = await contract?.acceptedToken();
    const raised = Number(ethers.formatUnits(await contract?.raised(), 6));
    const fees = Number(ethers.formatUnits(await contract?.raised(), 6));

    // booleans
    const isPublic = await contract?.isPublic();
    const usingETH = await contract?.usingETH();
    const usingLinkedWallet = await contract?.usingLinkedWallet();

    // Vesting Type
    const vestingType = await contract?.vestingType();

    // Amounts
    const amounts = await contract?.amounts();
    const tokenPrice = Number(ethers.formatUnits(amounts[0], 6));
    const maxAllocations = Number(ethers.formatUnits(amounts[1], 6));
    const tgeReleasePercent = Number(ethers.formatUnits(amounts[2], 6));

    // Periods
    const periods = await contract?.periods();
    const registrationAt = periods[0];
    const participationStartsAt = periods[1];
    const participationEndsAt = periods[2];
    const vestingAt = periods[3];
    const cliff = periods[4];
    const releaseSchedule = periods[5];

    // Refund
    const refund = await contract?.refund();
    const active = refund[0];
    const feePercent = refund[1];
    const period = refund[2];

    const rangesLength = Number(await contract?.rangesLength());
    const ranges: WalletRange[] = [];
    for (let index = 0; index < rangesLength; index++) {
      const range = await contract?.getRange(index);

      const walletRange: WalletRange = {
        name: range.name,
        minPerWallet: Number(
          formatUnits(range.min.toString(), usingETH ? 18 : 6)
        ),
        maxPerWallet: Number(
          formatUnits(range.max.toString(), usingETH ? 18 : 6)
        ),
      };
      ranges.push(walletRange);
    }

    return {
      owner,
      isPaused,
      token,
      acceptedToken,
      raised,
      fees,
      isPublic,
      usingETH,
      usingLinkedWallet,
      vestingType,
      idoAmounts: {
        tokenPrice,
        maxAllocations,
        tgeReleasePercent,
      },
      idoPeriods: {
        registrationAt,
        participationStartsAt,
        participationEndsAt,
        vestingAt,
        cliff,
        releaseSchedule,
      },
      idoRefundConfig: {
        active,
        feePercent,
        period,
      },
      ranges,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

function parseWalletRange(range: any, decimals: number) {
  const walletRange: WalletRange = {
    name: range.name,
    minPerWallet: Number(formatUnits(range.min.toString(), decimals)),
    maxPerWallet: Number(formatUnits(range.max.toString(), decimals)),
  };

  return walletRange;
}

export async function user(index: number, signer: ethers.Signer) {
  try {
    const ido = IDO_LIST[index];
    const signerAdress = await signer.getAddress();
    const contract = await getContract(index, signer);
    const usingETH = await contract?.usingETH();

    const isPublic = await contract?.isPublic();

    const range = isPublic
      ? await contract?.getRange(0)
      : await contract?.getWalletRange(signerAdress);

    const walletRange = parseWalletRange(range, usingETH ? 18 : 6);

    const allocation = Number(
      ethers.formatUnits(await contract?.allocations(signerAdress), 6)
    );

    // let linkedWallet = "0xC2a96B13a975c656f60f401a5F72851af4717D4A";
    let linkedWallet = "";
    if (ido.id !== "launchpad-v2/kvants") {
      linkedWallet = await contract?.linkedWallets(signerAdress);
    }

    const isWhitelisted = await contract?.whitelist(signerAdress);
    // const isWhitelisted = true;

    const acceptedToken = await contract?.acceptedTokens(0);
    const balanceEther = await signer.provider?.getBalance(signerAdress);
    const balanceToken = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken, signerAdress, signer),
        6
      )
    );

    const contractAddress = await contract?.getAddress();
    const acceptedTokenBalance = ethers.formatUnits(
      await balanceOf(
        ERC20_ABI,
        acceptedToken,
        contractAddress as string,
        signer
      ),
      6
    );

    return {
      allocation,
      walletRange,
      isWhitelisted,
      linkedWallet,
      balanceEther,
      balanceToken,
      acceptedTokenBalance,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function linkWallet(
  index: number,
  linkedWallet: string,
  signer: ethers.Signer
) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const usingLinkedWallet = await contract?.usingLinkedWallet();

    if (usingLinkedWallet) {
      const tx = await contract?.linkWallet(linkedWallet);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// REGISTER

export async function register(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.registerToWhitelist();
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// PARTICIPATE IN THE IDO

export async function participate(
  index: number,
  signer: ethers.Signer,
  amount: string,
  acceptedToken: string
) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();

    const contractAddress = await contract?.getAddress();
    await checkApproval(
      acceptedToken,
      contractAddress!,
      signer,
      parseUnits(amount, 6)
    );

    const tx = await contract?.participate(parseUnits(amount, 6));

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function participateETH(
  index: number,
  signer: ethers.Signer,
  amount: string
) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.participateETH(parseEther(amount), {
      value: parseEther(amount),
    });

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function makePublic(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.makePublic();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function withdraw(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.withdraw();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function togglePause(index: number, signer: ethers.Signer) {
  const contract = await getContract(index, signer);

  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const isPaused = await contract?.paused();
      const tx = isPaused ? await contract?.unpause() : await contract?.pause();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function updateRanges(
  index: number,
  ranges: WalletRange[],
  signer: ethers.Signer
) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const formattedRanges: any[] = [];

    ranges.forEach((range) => {
      const newRange = [
        range.name,
        parseUnits(range.minPerWallet.toString(), 6),
        parseUnits(range.maxPerWallet.toString(), 6),
      ];
      formattedRanges.push(newRange);
    });

    const tx = await contract?.setRanges(formattedRanges);
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function phase(index: number) {
  const ido = IDO_LIST[index];
  const registrationStartsAt = ido.registrationStartsAt;
  const participationStartAt = ido.participationStartsAt;
  const publicEndsAt = ido.publicParticipationEndsAt;
  const now = getUnixTime(new Date());
  const isPaused = await checkIsPaused(index);

  let phase = "Upcoming";

  if (now >= registrationStartsAt && now <= participationStartAt && !isPaused)
    phase = "Registration";
  if (now >= participationStartAt && now <= publicEndsAt && !isPaused)
    phase = "Participation";

  const contract = await getContract(index, undefined);
  const publicRange = await contract?.getRange(0);
  const usingETH = await contract?.usingETH();
  const range = parseWalletRange(publicRange, usingETH ? 18 : 6);

  const raised = Number(ethers.formatUnits(await contract?.raised(), 6));
  const maxAllocations = Number(
    ethers.formatUnits(await contract?.maxAllocations(), 6)
  );

  if (maxAllocations - raised < range.minPerWallet) phase = "Completed";
  if (isPaused && raised > 0) phase = "Completed";

  return phase;
}
