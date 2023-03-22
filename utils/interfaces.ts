export type ProjectInfo = {
  address: string
  network: string
  startTime: string
  unlockClaimTime: string
  endTime: string
  distributionTime: number
  unstakeLockTime: number
  maxStakingAmount: string
  minStakingAmount: string
  maxPool: string
  rewardTotal: string
  totalStaked: string
  totalDistributed: string
  rewardTokenAddress: string
  rewardTokenSymbol: string
  rewardTokenDecimal: number
  stakeTokenAddress: string
  stakeTokenSymbol: string
  stakeTokenDecimal: number
  isPaused: boolean
  sumTotalReward: string
}

export type ProjectLink = {
  name: string
  url: string
  projectKey: string
}

export interface Project {
  stake: ProjectInfo
  lp: ProjectInfo
  projectKey: string
  stakeAddress: string
  stakeAddress2: string
  stakeAddress3: string
  uniswapPairAddress: string
  buyLink: string
  addLiquidityLink: string
  addLiquidityXiotLink: string
  instantUnstake: string
  isHideLp: true
  thirdCoinId: string
  network: string
  isTimeBase: boolean
  firstBlock: string
  isHideStake: boolean
  id: string
  key: string
  img: string
  type: string
  name: string
  isShowOnMain: boolean
  isProxy: boolean
  category1: number
  category2: number
  groupName: string
  description: string
  shortDescription: string
  descriptionTemplate: string
  listingPrice: string
  coinId: string
  acceptedCoinId: string
  hardcodeTemplate: string
  mainBtnType: string
  links: ProjectLink[]
}
