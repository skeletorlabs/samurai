import {
  ethers,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers";
import { ERC20_ABI, IDO_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { NEW_IDOS } from "@/app/utils/constants";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";
import { IDO } from "./factory";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
// const TEST_RPC = "http://127.0.0.1:8545";

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

async function getContract(index: number, signer?: ethers.Signer) {
  try {
    const ido = NEW_IDOS[index];
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
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

async function getContract2(address: string, signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(address, IDO_ABI, signer || provider);

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

export async function idoRaw(address: string, signer: ethers.Signer) {
  const contract = await getContract2(address, signer);

  const samuraiTiers = await contract?.samuraiTiers();
  const acceptedToken = await contract?.acceptedToken();
  const usingETH = await contract?.usingETH();
  const usingLinkedWallet = await contract?.usingLinkedWallet();
  const vestingType = await contract?.vestingType();
  const amounts = await contract?.amounts();
  const periods = await contract?.periods();

  const rangesLength = Number(await contract?.rangesLength());
  const ranges = [];
  for (let index = 0; index < rangesLength; index++) {
    const range = await contract?.getRange(index);
    ranges.push(range);
  }

  const refund = await contract?.refund();

  const raw: IDO = {
    samuraiTiers: samuraiTiers,
    acceptedToken: acceptedToken,
    usingETH: usingETH,
    usingLinkedWallet: usingLinkedWallet,
    vestingType: vestingType,
    amounts: amounts,
    periods: periods,
    ranges: ranges,
    refund: refund,
  };

  return raw;
}

export async function generalInfo(index: number) {
  try {
    const contract = await getContract(index);

    // address
    const owner = await contract?.owner();
    const samuraiTiers = await contract?.samuraiTiers();
    const token = await contract?.token();
    const acceptedToken = await contract?.acceptedToken();

    // booleans
    const isPaused = await contract?.paused();
    const isPublic = await contract?.isPublic();
    const usingETH = await contract?.usingETH();
    const usingLinkedWallet = await contract?.usingLinkedWallet();

    // Vesting Type
    const vestingType = Number(await contract?.vestingType());

    // Amounts
    const amounts = await contract?.amounts();
    const tokenPrice = Number(ethers.formatUnits(amounts[0], 6));
    const maxAllocations = Number(ethers.formatUnits(amounts[1], 6));
    const tgeReleasePercent = Number(ethers.formatUnits(amounts[2], 6));
    console.log("tgeReleasePercent", tgeReleasePercent);
    const raised = Number(ethers.formatUnits(await contract?.raised(), 6));
    const fees = Number(ethers.formatUnits(await contract?.raised(), 6));

    // Periods
    // uint256 registrationAt;
    // uint256 participationStartsAt;
    // uint256 participationEndsAt;
    // uint256 vestingDuration;
    // uint256 vestingAt;
    // uint256 cliff;
    const periods = await contract?.periods();
    const registrationAt = Number(periods[0]);
    const participationStartsAt = Number(periods[1]);
    const participationEndsAt = Number(periods[2]);
    const vestingDuration = Number(periods[3]);
    const vestingAt = Number(periods[4]);
    const cliff = Number(periods[5]);

    // Refund
    const refund = await contract?.refund();
    const active = refund[0];
    const feePercent = Number(ethers.formatUnits(refund[1], 6));
    const period = Number(refund[2]);

    // Ranges
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
      // address
      owner,
      samuraiTiers,
      token,
      acceptedToken,
      // vesting type
      vestingType,
      // ammounts
      amounts: {
        tokenPrice,
        maxAllocations,
        tgeReleasePercent,
      },
      raised,
      fees,
      // booleans
      isPaused,
      isPublic,
      usingETH,
      usingLinkedWallet,
      // periods
      periods: {
        registrationAt,
        participationStartsAt,
        participationEndsAt,
        vestingDuration,
        vestingAt,
        cliff,
      },
      // refund
      refund: {
        active,
        feePercent,
        period,
      },
      // ranges
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

export async function userInfo(index: number, signer: ethers.Signer) {
  try {
    const ido = NEW_IDOS[index];
    const signerAdress = await signer.getAddress();
    const contract = await getContract(index, signer);
    const usingETH = await contract?.usingETH();
    const isPublic = await contract?.isPublic();

    const range = isPublic
      ? await contract?.getRange(0)
      : await contract?.getWalletRange(signerAdress);

    const walletRange = parseWalletRange(range, usingETH ? 18 : 6);

    // const allocation = Number(
    //   ethers.formatUnits(await contract?.allocations(signerAdress), 6)
    // );

    const allocation = Number(100);

    const linkedWallet = await contract?.linkedWallets(signerAdress);

    // const isWhitelisted = await contract?.whitelist(signerAdress);
    const isWhitelisted = true;

    const acceptedToken = await contract?.acceptedToken();
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

export async function phaseInfo(index: number) {
  // const ido = NEW_IDOS[index];
  // const registrationStartsAt = ido.registrationStartsAt;
  // const participationStartAt = ido.participationStartsAt;
  // const publicEndsAt = ido.publicParticipationEndsAt;
  // const now = getUnixTime(new Date());
  // const isPaused = await checkIsPaused(index);

  let phase = "Participation";

  // if (now >= registrationStartsAt && now <= participationStartAt && !isPaused)
  //   phase = "Registration";
  // if (now >= participationStartAt && now <= publicEndsAt && !isPaused)
  //   phase = "Participation";

  // const contract = await getContract(index, undefined);
  // const publicRange = await contract?.getRange(0);
  // const usingETH = await contract?.usingETH();
  // const range = parseWalletRange(publicRange, usingETH ? 18 : 6);

  // const raised = Number(ethers.formatUnits(await contract?.raised(), 6));
  // const maxAllocations = Number(
  //   ethers.formatUnits(await contract?.maxAllocations(), 6)
  // );

  // if (maxAllocations - raised < range.minPerWallet) phase = "Completed";
  // if (isPaused && raised > 0) phase = "Completed";

  return phase;
}
