import { ReactNode } from "react";

export type SupplyInfo = {
  maxSupply: string;
  maxWhitelistedSupply: string;
};

export type GeneralInfo = {
  owner: string;
  totalSupply: number;
  totalSupplyPublic: number;
  totalSupplyWhitelist: number;
  totalSupplyRetained: number;
  maxSupplyPublic: number;
  maxSupplyWhitelist: number;
  maxSupplyReleased: number;
  maxSupplyRetained: number;
  unitPrice: number;
  isPaused: boolean;
  baseUri: string;
};

export type Nfts = {
  id: string;
  tokenId: string;
  tokenUri: string;
  wallet: string;
  src?: string;
  metadata?: NFTMetadata;
}[];

export type Minted = {
  tokenId: string;
}[];

export type UniqueWallet = {
  tokenId: string;
  wallet: string;
}[];

export type NFTMetadata = {
  compiler: string;
  description: string;
  edition: number;
  image: string;
  name: string;
  symbol: string;
};

export type ProjectInfo = {
  address: string;
  network: string;
  startTime: string;
  unlockClaimTime: string;
  endTime: string;
  distributionTime: number;
  unstakeLockTime: number;
  maxStakingAmount: string;
  minStakingAmount: string;
  maxPool: string;
  rewardTotal: string;
  totalStaked: string;
  totalDistributed: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
  rewardTokenDecimal: number;
  stakeTokenAddress: string;
  stakeTokenSymbol: string;
  stakeTokenDecimal: number;
  isPaused: boolean;
  sumTotalReward: string;
};

export type ProjectLink = {
  name: string;
  url: string;
  projectKey: string;
};

export type WhitelistDataType = {
  isWhitelisted: boolean;
  hasUsedFreeMint: boolean;
  whitelistFinishAt: number;
};

export interface Project {
  stake: ProjectInfo;
  lp: ProjectInfo;
  projectKey: string;
  stakeAddress: string;
  stakeAddress2: string;
  stakeAddress3: string;
  uniswapPairAddress: string;
  buyLink: string;
  addLiquidityLink: string;
  addLiquidityXiotLink: string;
  instantUnstake: string;
  isHideLp: true;
  thirdCoinId: string;
  network: string;
  isTimeBase: boolean;
  firstBlock: string;
  isHideStake: boolean;
  id: string;
  key: string;
  img: string;
  type: string;
  name: string;
  isShowOnMain: boolean;
  isProxy: boolean;
  category1: number;
  category2: number;
  groupName: string;
  description: string;
  shortDescription: string;
  descriptionTemplate: string;
  listingPrice: string;
  coinId: string;
  acceptedCoinId: string;
  hardcodeTemplate: string;
  mainBtnType: string;
  links: ProjectLink[];
}

export interface IDO_SOCIAL {
  svg: any;
  href: string;
}

export interface IDO {
  id: string;
  logo: ReactNode;
  idoImageSrc: string;
  acceptedTokenSymbol: string;
  tokenNetwork: string;
  crowdsaleNetwork: string;
  networkImageSrc: string;
  projectName: string;
  projectListDescription: string;
  projectDescription: string;
  projectTokenSymbol: string;
  totalAllocation: number;
  price: string;
  participationStartsAt: number;
  participationEndsAt: number;
  publicParticipationStartsAt: number;
  publicParticipationEndsAt: number;
  simplified: boolean;
  tgeDate: number;
  tgePercentage: number;
  cliff: number;
  investmentRound: string;
  fdv: string;
  exchangeListingPrice: number;
  marketCapAtTGE: number;
  vesting: string;
  releaseType: string;
  currentPhase: string;
  socials: IDO_SOCIAL[];
  bigDescription: ReactNode;
  contract: string;
  abi: any;
  images?: string[];
}
