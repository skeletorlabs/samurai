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

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

async function getContract(index: number, signer?: ethers.Signer) {
  try {
    const ido = IDO_LIST[index];
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

    const owner = await contract?.owner();
    const isPublic = await contract?.isPublic();
    const acceptedToken = await contract?.acceptedTokens(0);
    const isPaused = await contract?.paused();
    const pricePerToken = Number(
      formatUnits(await contract?.pricePerToken(), 6)
    );
    const maxAllocations = Number(await contract?.maxAllocations());
    const raised = Number(await contract?.raised());
    const rangesLength = Number(await contract?.rangesLength());
    const ranges: WalletRange[] = [];
    for (let index = 0; index < rangesLength; index++) {
      const range = await contract?.getRange(index);

      const walletRange: WalletRange = {
        name: range.name,
        minPerWallet: Number(range.min),
        maxPerWallet: Number(range.max),
      };
      ranges.push(walletRange);
    }

    return {
      owner,
      isPublic,
      acceptedToken,
      isPaused,
      maxAllocations,
      pricePerToken,
      raised,
      ranges,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

function parseWalletRange(range: any) {
  const walletRange: WalletRange = {
    name: range.name,
    minPerWallet: Number(range.min),
    maxPerWallet: Number(range.max),
  };

  return walletRange;
}

export async function userInfo(
  index: number,
  signer: ethers.Signer,
  tierName: string
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(index);
    const usingETH = await contract?.usingETH();

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

    const walletRange = parseWalletRange(range);
    const isWhitelisted = await contract?.whitelist(signerAddress);
    const allocation = Number(await contract?.allocations(signerAddress));
    const acceptedToken = await contract?.acceptedTokens(0);

    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const balanceEther = await provider.getBalance(signerAddress);
    const balanceToken = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken, signerAddress, provider),
        6
      )
    );

    return {
      usingETH,
      allocation,
      walletRange,
      isWhitelisted,
      balanceEther,
      balanceToken,
    };
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

    const pricePerToken = Number(
      ethers.formatUnits(await contract?.pricePerToken(), 6)
    );
    const amountInTokens = (Number(amount) * pricePerToken).toString();

    await checkApproval(
      acceptedToken,
      contractAddress!,
      signer,
      ethers.parseUnits(amountInTokens, 6)
    );

    const tx = await contract?.participate(acceptedToken, Number(amount));

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
    const price = Number(await contract?.pricePerToken());
    const tx = await contract?.participateETH(amount, {
      value: parseEther((Number(amount) * price).toString()),
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
  const ido = IDO_LIST[index];
  const registrationStartsAt = ido.registrationStartsAt;
  const participationStartAt = ido.participationStartsAt;
  const participationEndsAt = ido.participationEndsAt;
  const now = getUnixTime(new Date());
  const isPaused = await checkIsPaused(index);

  let phase = "Upcoming";
  if (now >= registrationStartsAt && now <= participationStartAt && !isPaused)
    phase = "Registration";
  if (now >= participationStartAt && now <= participationEndsAt && !isPaused)
    phase = "Participation";
  if (now > participationEndsAt) phase = "Completed";

  const contract = await getContract(index, undefined);
  const publicRange = await contract?.getRange(0);
  const range = parseWalletRange(publicRange);
  const raised = Number(await contract?.raised());
  const maxAllocations = Number(await contract?.maxAllocations());
  if (maxAllocations - raised < range.minPerWallet) phase = "Completed";
  if (isPaused && raised > 0) phase = "Completed";
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
