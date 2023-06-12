export type GeneralInfo = {
  totalSupply: number
  maxSupply: number
  isWhitelisted: boolean
  hasUsedFreeMint: boolean
  isPaused: boolean
  baseUri: string
}

export type Nfts = {
    id: string
    tokenId: string
    tokenUri: string
    wallet: string
    src?: string
}[]

export type NFTMetadata = {
  compiler: string
  description: string
  edition: number
  image: string
  name: string
  symbol: string
}
