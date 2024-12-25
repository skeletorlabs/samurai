export const SUPPLY_QUERY = `
  query Supply {
    createds(first: 1) {
      maxSupply maxWhitelistedSupply
    }
  }
`;

export const MY_NFTS_QUERY = `
  query Minted($wallet: String!) {
    minteds(where: {wallet: $wallet}) {
      id, tokenId, tokenUri, wallet
    }
  }
`;

export const GALLERY_QUERY = `
  query LAST_FIVE_NFTS_MINTED {
    minteds(orderBy: tokenId, orderDirection: desc, first: 24) {
      id, tokenId, tokenUri, wallet
    }
  }
`;
