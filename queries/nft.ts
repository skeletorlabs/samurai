
export const MY_NFTS_QUERY = `
  query Minted($wallet: String!) {
    minteds(where: {wallet: $wallet}) {
      id, tokenId, tokenUri, wallet
    }
  }
`

export const LAST_FIVE_NFTS_QUERY = `
  query LAST_FIVE_NFTS_MINTED {
    minteds(last: 5) {
      id, tokenId, tokenUri, wallet
    }
  }
`