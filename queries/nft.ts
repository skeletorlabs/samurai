export const SUPPLY_QUERY = `
  query Supply {
    createds(first: 1) {
      maxSupply maxWhitelistedSupply
    }
  }
`;

export const MY_NFTS_QUERY = `
  query Minted($wallet: String!) {
    minteds(where: {wallet: $wallet, tokenId_lte: "2006"}) {
      id, tokenId, tokenUri, wallet
    }
  }
`;

export const LAST_FIVE_NFTS_QUERY = `
  query LAST_FIVE_NFTS_MINTED {
    minteds(orderBy: tokenId, orderDirection: desc, first: 5, skip: 111) {
      id, tokenId, tokenUri, wallet
    }
  }
`;

export const ALL_WALLETS = `
  query ALL_WALLETS($first: Int!, $skip: Int!) {
    minteds(orderBy: tokenId, orderDirection: asc, first: $first, skip: $skip) {
      tokenId,
      wallet
    }
  }
`;
