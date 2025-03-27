import {
  Contract,
  JsonRpcProvider,
  JsonRpcSigner,
  formatEther,
  Signer,
} from "ethers";
import handleError from "../utils/handleErrors";
import { IDOs, POINTS, SAM_ADDRESS } from "../utils/constants";
import {
  DashboardUserDetails,
  IDO_v3,
  StringToNumber,
  StringToString,
} from "../utils/interfaces";
import {
  getParticipationPhase,
  userInfo as idoV3UserInfo,
} from "@/app/contracts_integrations/idoV3";
import { getTier } from "./tiers";
import { balanceOf } from "./balanceOf";
import { ERC20_ABI, SAMURAI_POINTS_ABI } from "./abis";
import { getTokens } from "./nft";

export async function userInfo(signer: Signer) {
  try {
    const signerAddress = await signer.getAddress();
    const walletToCheck = "0xcae8cf1e2119484d6cc3b6efaad2242adbdb1ea8";
    const tier = await getTier(signerAddress);
    const tierName = tier?.name || "Public";
    const samBalance = Number(
      formatEther(
        await balanceOf(ERC20_ABI, SAM_ADDRESS, walletToCheck, signer)
      )
    );

    const points = Number(
      formatEther(
        await balanceOf(SAMURAI_POINTS_ABI, POINTS, walletToCheck, signer)
      )
    );

    const nfts = await getTokens(signer, walletToCheck);

    const userIdos: IDO_v3[] = [];
    const allocations: StringToNumber = {};
    const phases: StringToString = {};
    let totalAllocated = 0;

    for (let index = 0; index < IDOs.length; index++) {
      const ido = IDOs[index];
      const userIdo = await idoV3UserInfo(
        index,
        signer,
        tierName,
        walletToCheck
      );

      if (userIdo?.allocation || 0 > 0) {
        userIdos.push(ido);
        const allocation = userIdo?.allocation || 0;

        allocations[ido.id] = allocation;
        totalAllocated += allocation;

        const idoPhase = await getParticipationPhase(index);
        phases[ido.id] = idoPhase;
      }
    }

    return {
      tier: tierName,
      samBalance,
      points,
      nftBalance: nfts.length,
      userIdos,
      allocations,
      phases,
      totalAllocated,
    } as DashboardUserDetails;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
