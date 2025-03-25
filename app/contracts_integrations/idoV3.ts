import {
  ethers,
  formatEther,
  formatUnits,
  JsonRpcProvider,
  parseEther,
  parseUnits,
} from "ethers";
import { ERC20_ABI, LATEST_PARTICIPATOR_TOKENS_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { CHAIN_ID_TO_RPC_URL, IDOs } from "@/app/utils/constants";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";
import { generalInfo as generalVestingInfo } from "./vesting";
import { getTokens } from "@/app/contracts_integrations/nft";
import { vestingInfos } from "./migrator";
import { UTCDate } from "@date-fns/utc";
import { base } from "../utils/chains";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const BASE_PROVIDER = new JsonRpcProvider(BASE_RPC_URL);

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

async function getContract(index: number, signer?: ethers.Signer) {
  try {
    const ido = IDOs[index];

    const contractAddress = ido.contract;
    let signerNetwork;
    let signerIsOnBase = false;

    if (signer) signerNetwork = await signer.provider?.getNetwork();
    if (signer && signerNetwork)
      signerIsOnBase = Number(signerNetwork.chainId) === base.chainId;

    const contract = new ethers.Contract(
      contractAddress,
      ido.abi,
      signer && signerIsOnBase ? signer : BASE_PROVIDER
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

export async function generalInfo(index: number) {
  try {
    const contract = await getContract(index);
    const ido = IDOs[index];
    const owner = await contract?.owner();
    const isPublic = await contract?.isPublic();
    const acceptedToken = await contract?.acceptedTokens(0);
    const isPaused = await contract?.paused();

    const maxAllocations = Number(
      ethers.formatUnits(await contract?.maxAllocations(), 6)
    );

    let raised = Number(ethers.formatUnits(await contract?.raised(), 6));

    if (ido.id === "alpaca") raised = maxAllocations;

    const rangesLength = Number(await contract?.rangesLength());

    const usingETH = ido.ether ? await contract?.usingETH() : false;

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

    let usingLinkedWallet = false;
    if (ido.linkedWallet) {
      usingLinkedWallet = await contract?.usingLinkedWallet();
    }

    return {
      owner,
      isPublic,
      acceptedToken,
      isPaused,
      maxAllocations,
      raised,
      ranges,
      usingLinkedWallet,
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

export async function userInfo(
  index: number,
  signer: ethers.Signer,
  tierName: string
) {
  try {
    const ido = IDOs[index];
    let signerAddress = await signer.getAddress();
    const contract = await getContract(index, signer);
    const usingETH = ido.ether ? await contract?.usingETH() : false;
    const isPublic = await contract?.isPublic();

    const range0 = await contract?.getRange(0);
    const range1 = await contract?.getRange(1);
    const range2 = await contract?.getRange(2);
    const range3 = await contract?.getRange(3);
    const range4 = await contract?.getRange(4);
    const range5 = await contract?.getRange(5);

    const ranges = [range0, range1, range2, range3, range4, range5];

    const range =
      isPublic || tierName === ""
        ? range0
        : ranges.find((item) => item[0].toString() === tierName);

    const walletRange = parseWalletRange(range, usingETH ? 18 : 6);
    const linkedWallet = await contract?.linkedWallets(signerAddress);

    const isWhitelisted = await contract?.whitelist(signerAddress);

    const allocation = Number(
      ethers.formatUnits(await contract?.allocations(signerAddress), 6)
    );

    const acceptedToken = await contract?.acceptedTokens(0);

    const balanceEther = await signer.provider?.getBalance(signerAddress);

    const balanceToken = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken, signerAddress, BASE_PROVIDER),
        6
      )
    );

    const contractAddress = await contract?.getAddress();
    const acceptedTokenBalance = ethers.formatUnits(
      await balanceOf(
        ERC20_ABI,
        acceptedToken,
        contractAddress as string,
        BASE_PROVIDER
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

    const tx = await contract?.participate(
      acceptedToken,
      parseUnits(amount, 6)
    );

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

export async function getParticipationPhase(index: number) {
  const ido = IDOs[index];
  const start = ido.date;
  const end = ido.end;
  const now = getUnixTime(new UTCDate());
  const isPaused = await checkIsPaused(index);

  let phase = "Upcoming";
  if (now >= start && now <= end && !isPaused) phase = "Participation";

  const contract = await getContract(index, undefined);
  const gokenin = await contract?.getRange(2);
  const usingETH = await contract?.usingETH();
  const range = parseWalletRange(gokenin, usingETH ? 18 : 6);
  let raised = Number(ethers.formatUnits(await contract?.raised(), 6));

  const maxAllocations = Number(
    ethers.formatUnits(await contract?.maxAllocations(), 6)
  );

  if (ido.end < now) phase = "Vesting";
  if (maxAllocations - raised < range.minPerWallet) phase = "Vesting";
  if (isPaused && raised > 0) phase = "Vesting";

  if (ido.vesting) {
    const vesting = await generalVestingInfo(index);

    if (vesting && now > vesting?.periods?.vestingEndsAt) phase = "Completed";
  }

  return phase;
}

// export type LinkedWalletEvent = {
//   wallet: string;
//   linkedWallet: string;
// };

// // startBlock 15711862
// export async function getLinkedWalletsEvents(
//   index: number,
//   startBlock: number
// ) {
//   try {
//     const contract = await getContract(index);
//     const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
//     const currentBlock = await provider.getBlockNumber();
//     const blocksPerFilter = 10000;

//     let allEvents: LinkedWalletEvent[] = []; // Array to store all retrieved events

//     for (
//       let fromBlock = startBlock;
//       fromBlock <= currentBlock;
//       fromBlock += blocksPerFilter
//     ) {
//       const toBlock = Math.min(fromBlock + blocksPerFilter - 1, currentBlock); // Ensure toBlock doesn't exceed current block
//       const eventFilter = contract!.filters.WhitelistedWithLinkedWallet();
//       const events = await contract!.queryFilter(
//         eventFilter,
//         fromBlock,
//         toBlock
//       );

//       if (events && events?.length > 0) {
//         events.forEach(async (event: any) => {
//           const log = event.args as [string, string];
//           const wallet = log[0];

//           const index = allEvents.findIndex((event) => event.wallet === wallet);

//           allEvents.push({
//             wallet: log[0],
//             linkedWallet: log[1],
//           });
//         });
//       }
//     }

//     return allEvents;
//   } catch (error) {
//     console.error("Error fetching contract log events:", error);
//     return [];
//   }
// }

// export async function getLinkedWallets() {
//   const events1 = await getLinkedWalletsEvents(2, 15711862);
//   const events2 = await getLinkedWalletsEvents(1, 15748408);
//   const events = [...events1];

//   console.log(events1);

//   events2.forEach((item: LinkedWalletEvent, index) => {
//     if (!events1.find((event1) => event1.wallet === item.wallet)) {
//       events.push(item);
//     }
//   });

//   console.log(events);
// }
