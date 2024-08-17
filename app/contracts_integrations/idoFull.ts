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
import { DecodedError, ErrorDecoder } from "ethers-decode-error";
import handleDecodedError from "../utils/handleDecodedError";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
// const TEST_RPC = "http://127.0.0.1:8545";

const errorDecoder = ErrorDecoder.create([IDO_ABI]);

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

export type IDO_GENERAL_INFO = {
  // address
  owner: string;
  samuraiTiers: string;
  token: string;
  acceptedToken: string;
  // vesting type
  vestingType: number;
  // ammounts
  amounts: {
    tokenPrice: number;
    maxAllocations: number;
    tgeReleasePercent: number;
  };
  raised: number;
  fees: number;
  totalPurchased: number;
  // booleans
  isPaused: boolean;
  isPublic: boolean;
  usingETH: boolean;
  usingLinkedWallet: boolean;
  idoTokenDecimals: number;
  // periods
  periods: {
    registrationAt: number;
    participationStartsAt: number;
    participationEndsAt: number;
    vestingDuration: number;
    vestingAt: number;
    cliff: number;
    cliffEndsAt: number;
    vestingEndsAt: number;
  };
  // refund
  refund: {
    active: boolean;
    feePercent: number;
    period: number;
  };
  // ranges
  ranges: WalletRange[];
};

export type IDO_USER_INFO = {
  walletRange: WalletRange;
  isWhitelisted: boolean;
  linkedWallet: string;
  balance: number;
  allocation: number;
  purchased: number;
  claimed: number;
  claimable: number;
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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

async function getContract2(address: string, signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(address, IDO_ABI, signer || provider);

    return contract;
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// IS PAUSED ==============================================================
// ========================================================================

export async function checkIsPaused(index: number) {
  try {
    const contract = await getContract(index);
    const isPaused = await contract?.paused();
    return isPaused;
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// FACTORY IDO RAW ========================================================
// ========================================================================

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

// ========================================================================
// IDO INFOS ==============================================================
// ========================================================================

export async function generalInfo(index: number) {
  try {
    const contract = await getContract(index);

    // Addresses
    const owner = await contract?.owner();
    const samuraiTiers = await contract?.samuraiTiers();
    const token = await contract?.token();
    const acceptedToken = await contract?.acceptedToken();
    // const acceptedToken = "0x2a064000D0252d16c57FAFD1586bE7ce5deD8320";

    // Booleans
    const isPaused = await contract?.paused();
    const isPublic = await contract?.isPublic();
    // const isPublic = false;
    // const usingETH = await contract?.usingETH();
    const usingETH = await contract?.usingETH();
    const DECIMALS = usingETH ? 18 : 6;
    const usingLinkedWallet = await contract?.usingLinkedWallet();
    // const usingLinkedWallet = true;

    // Vesting Type
    const vestingType = Number(await contract?.vestingType());

    // Amounts
    const amounts = await contract?.amounts();
    const tokenPrice = Number(ethers.formatUnits(amounts[0], DECIMALS));
    const maxAllocations = Number(ethers.formatUnits(amounts[1], DECIMALS));
    const tgeReleasePercent = Number(ethers.formatUnits(amounts[2], DECIMALS));
    const raised = Number(
      ethers.formatUnits(await contract?.raised(), DECIMALS)
    );
    const fees = Number(ethers.formatUnits(await contract?.raised(), DECIMALS));

    let totalPurchased = 0;
    if (raised > 0) {
      totalPurchased = Number(
        formatEther(
          await contract?.tokenAmountByParticipation(
            parseUnits(raised.toString(), DECIMALS)
          )
        )
      );
    }

    // Periods
    const periods = await contract?.periods();
    const registrationAt = Number(periods[0]); // uint256 registrationAt;
    const participationStartsAt = Number(periods[1]); // uint256 participationStartsAt;
    const participationEndsAt = Number(periods[2]); // uint256 participationEndsAt;
    const vestingDuration = Number(periods[3]); // uint256 vestingDuration;
    const vestingAt = Number(periods[4]); // uint256 vestingAt;
    const cliff = Number(periods[5]); // uint256 cliff;
    const cliffEndsAt = Number(await contract?.cliffEndsAt());
    const vestingEndsAt = Number(await contract?.vestingEndsAt());

    // Refund
    const refund = await contract?.refund();
    const active = refund[0];
    const feePercent = Number(ethers.formatUnits(refund[1], DECIMALS));
    const period = Number(refund[2]);

    // Ranges
    const rangesLength = Number(await contract?.rangesLength());
    const ranges: WalletRange[] = [];
    for (let index = 0; index < rangesLength; index++) {
      const range = await contract?.getRange(index);

      const walletRange: WalletRange = {
        name: range.name,
        minPerWallet: Number(formatUnits(range.min.toString(), DECIMALS)),
        maxPerWallet: Number(formatUnits(range.max.toString(), DECIMALS)),
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
      totalPurchased,
      // booleans
      isPaused,
      isPublic,
      usingETH,
      usingLinkedWallet,
      idoTokenDecimals: DECIMALS,
      // periods
      periods: {
        registrationAt,
        participationStartsAt,
        participationEndsAt,
        vestingDuration,
        vestingAt,
        cliff,
        cliffEndsAt,
        vestingEndsAt,
      },
      // refund
      refund: {
        active,
        feePercent,
        period,
      },
      // ranges
      ranges,
    } as IDO_GENERAL_INFO;
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// USER INFO ==============================================================
// ========================================================================

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
  generalInfo: IDO_GENERAL_INFO,
  signer: ethers.Signer
) {
  try {
    // const signerAddress = await signer.getAddress();
    const signerAddress = "0x5AD17A1A013E6dc9356fa5E047e70d1B5D490BbA";
    const contract = await getContract(index, signer);

    const { usingETH, usingLinkedWallet, isPublic } = generalInfo;
    const DECIMALS = usingETH ? 18 : 6;

    const range = isPublic
      ? await contract?.getRange(0)
      : await contract?.getWalletRange(signerAddress);

    const walletRange = parseWalletRange(range, DECIMALS);

    let linkedWallet = usingLinkedWallet
      ? await contract?.linkedWallets(signerAddress)
      : "";

    // linkedWallet = "0xcDe00Be56479F95b5e33De136AD820FfaE996009";

    const isWhitelisted = await contract?.whitelist(signerAddress);
    // const isWhitelisted = true;

    let balance = 0;

    if (usingETH) {
      const ethBalance = await signer.provider?.getBalance(signerAddress);
      if (ethBalance) balance = Number(formatEther(ethBalance));
    } else {
      const acceptedToken = generalInfo?.acceptedToken;
      balance = Number(
        formatUnits(
          await balanceOf(ERC20_ABI, acceptedToken, signerAddress, signer),
          DECIMALS
        )
      );
    }

    const allocation = Number(
      ethers.formatUnits(await contract?.allocations(signerAddress), DECIMALS)
    );

    // const allocation = 100;

    let purchased = 0;
    let claimed = 0;
    let claimable = 0;

    if (generalInfo.token !== "0x0000000000000000000000000000000000000000") {
      purchased = Number(
        formatEther(await contract?.tokenAmountByParticipation(allocation))
      );
      claimed = Number(
        formatEther(await contract?.tokensClaimed(signerAddress))
      );
      claimable = Number(
        formatEther(await contract?.previewClaimableTokens(signerAddress))
      );
    } else {
      if (allocation > 0) {
        purchased = allocation / generalInfo.amounts.tokenPrice;
      }
    }

    return {
      walletRange,
      isWhitelisted,
      linkedWallet,
      balance,
      allocation,
      purchased,
      claimed,
      claimable,
    } as IDO_USER_INFO;
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// REGISTER ===============================================================
// ========================================================================

export async function register(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.register();
    await notificateTx(tx, network);
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// LINK WALLET ============================================================
// ========================================================================

export async function linkWallet(
  index: number,
  linkedWallet: string,
  signer: ethers.Signer
) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.linkWallet(linkedWallet);
    await notificateTx(tx, network);
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// PARTICIPATE ============================================================
// ========================================================================

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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// REFUND =================================================================
// ========================================================================

export async function getRefund(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.getRefund();
    await notificateTx(tx, network);
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// CLAIM ==================================================================
// ========================================================================

export async function claim(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.claim();
    await notificateTx(tx, network);
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// ========================================================================
// CURRENT PHASE ==========================================================
// ========================================================================

export async function phaseInfo(index: number, generalInfo: IDO_GENERAL_INFO) {
  // const ido = NEW_IDOS[index];
  // const contract = await getContract(index, undefined);

  const now = getUnixTime(new Date());

  if (generalInfo.isPaused) {
    return "Paused";
  }

  if (now < generalInfo.periods.registrationAt) {
    return "Upcoming";
  }

  if (
    now >= generalInfo.periods.registrationAt &&
    now <= generalInfo.periods.participationStartsAt
  ) {
    return "Registration";
  }

  if (
    now >= generalInfo.periods.participationStartsAt &&
    now <= generalInfo.periods.participationEndsAt
  ) {
    return "Participation";
  }

  if (
    now >= generalInfo.periods.vestingAt &&
    now <= generalInfo.periods.cliffEndsAt
  ) {
    return "Cliff";
  }

  if (
    now > generalInfo.periods.cliffEndsAt &&
    now <= generalInfo.periods.vestingEndsAt
  ) {
    return "Vesting";
  }

  if (now > generalInfo.periods.vestingEndsAt) {
    return "Vested";
  }
}

//  ========================================================================
// ADMIN FUNCTIONS =========================================================
//  ========================================================================

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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
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
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

export async function setIDOToken(
  index: number,
  tokenAddress: string,
  signer: ethers.Signer
) {
  const contract = await getContract(index, signer);
  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.setIDOToken(tokenAddress);
      await notificateTx(tx, network);
    }
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}

// fillIDOToken(uint256 amount) external
export async function fillIDOToken(
  index: number,
  amount: string,
  signer: ethers.Signer
) {
  const contract = await getContract(index, signer);
  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.fillIDOToken(parseEther(amount));
      await notificateTx(tx, network);
    }
  } catch (e) {
    await handleDecodedError({ errorDecoder, e: e as Error, notificate: true });
  }
}
