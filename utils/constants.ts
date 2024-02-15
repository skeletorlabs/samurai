import {
  medium,
  twitterX,
  telegram,
  linkedin,
  home,
  nft,
  rocket,
  token,
  incubation,
  discord,
  globe,
  youtube,
} from "@/utils/svgs";
import { Page } from "./enums";
import { IDONEW, IDO_SOCIAL } from "./interfaces";

export const simplifiedPhases = [
  { title: "Upcoming", buttonTitle: "" },
  {
    title: "Participation",
    buttonTitle: "PARTICIPATE",
  },
  { title: "Completed", buttonTitle: "" },
];

export const IDO_LIST: IDONEW[] = [
  {
    id: "launchpad/havens-compass",
    idoImageSrc: "/IDOs/havens-compass.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TO BE ANNOUNCED",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "Haven's Compass",
    projectListDescription:
      "Haven's Compass is a tactical FPS game that empowers players, enhances ownership rights, and create a thriving gaming ecosystem.",
    projectDescription:
      "Haven's Compass sees the last-surviving inhabitants of a near-future Earth battle for survival following an apocalyptic geological catastrophe. Players enter this dangerous world and battle against each other for token rewards, utilizing their arsenal of highly customisable NFT weapons.",
    projectTokenSymbol: "CMPS",
    totalAllocation: 50_000,
    price: "0.011",
    participationStartsAt: 1707310800,
    participationEndsAt: 1707397200,
    publicParticipationStartsAt: 1707397200,
    publicParticipationEndsAt: 1707483600,
    simplified: true,
    tgeDate: 1706195232,
    tgePercentage: 7,
    cliff: 86400 * 30 * 5,
    investmentRound: "Private Round",
    fdv: "15000000",
    circulatingSupplyAtTGE: 29_000_000,
    marketCapAtTGE: 435_000,
    vesting: "7% at TGE, 5 month cliff, 14 month linear vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://www.havenscompass.com/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/HavensCompass",
      },
      {
        svg: telegram,
        href: "https://t.me/havenscompass",
      },
      {
        svg: discord,
        href: "https://t.co/KfGWR06E93",
      },
      {
        svg: youtube,
        href: "https://www.youtube.com/@ghostivy1555",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">Haven's Compass</h1>
        <p>Built inside Unreal Engine 5, Haven's Compass is an innovative tactical FPS game which utilizes blockchain technology to “empower players, enhance ownership rights, and create a thriving gaming ecosystem”.</p>
        <p>Haven's Compass sees the last-surviving inhabitants of a near-future Earth battle for survival following an apocalyptic geological catastrophe. Players enter this dangerous world and battle against each other for token rewards, utilizing their arsenal of highly customisable NFT weapons.</p>
        <p>Developer Ghost Ivy's player-first approach and high production values set Haven's Compass head and shoulders above the other blockchain games on the market, which are often plagued by rigid (or non-existent) gameplay and high technical barriers for entry. They instead aim to make the transition to Web3 gaming as seamless as possible for traditional gamers, opening the doors for thousands of newcomers to join their action-packed world.</p>
        <p>The game has already proven itself a roaring success, with over 25,000 downloads on the public alpha since its launch on the Epic Games Store in August 2023 (you can try it for yourself here). On top of that, their first NFT mint sold out in just 59 seconds!</p>
        <p>Haven's Compass is clearly making all the right moves — we can't wait to see how the project develops in the lead-up to the full game launch in Q4 2024.</p>
        <h1 style="font-weight: bold; font-size: 1.2em; margin-top: 10px;">The $CMPS Token</h1>
        <p>$CMPS is the native utility token of Haven's Compass, and the fuel powering every aspect of its gaming ecosystem. Players can earn $CMPS rewards by winning matches, participating in special events, or even creating art which is utilized inside the game.</p>
        <p>They can then use these tokens to trade weapon and item NFTs with other players on the in-game decentralized marketplace. Ghost Ivy will also implement DAO governance features, giving $CMPS holders the chance to take an active part in the development of the game.</p>
      </div>
  `,
    contract: "0xB3C8BB7508af2f18f3BBD96515134C3Cb3bf5702",
    images: [
      "/IDOs/havens-compass/havens-compass-1.png",
      "/IDOs/havens-compass/havens-compass-2.png",
      "/IDOs/havens-compass/havens-compass-3.png",
    ],
  },
];

export const LINKS: { [key: number]: string } = {
  1337: "http://localhost:8545",
  5: "https://goerli.etherscan.io",
  11155111: "https://sepolia.etherscan.io/",
  8453: "https://basescan.org",
};

export const RPC_URL: { [key: number]: string } = {
  1337: "http://localhost:8545",
  5: process.env.NEXT_PUBLIC_GOERLI_RPC_URL as string,
  11155111: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL as string,
  8453: process.env.NEXT_PUBLIC_BASE_RPC_URL as string,
};

export const TOKENS_TO_SYMBOL: Record<string, string> = {
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": "USDC",
  "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA": "USDbC",
};

export const NAV = [
  {
    title: "Home",
    href: "/",
    icon: home,
    page: Page.home,
  },
  {
    title: "SamNFT",
    href: "/nft",
    icon: nft,
    page: Page.nft,
  },
  {
    title: "Launchpad",
    href: "/launchpad",
    icon: rocket,
    page: Page.launchpad,
  },
  // {
  //   title: 'Sanka',
  //   href: '#',
  //   icon: sanka,
  //   page: Page.sanka,
  // },
  {
    title: "Tokens",
    href: "/tokens",
    icon: token,
    page: Page.tokens,
  },
  {
    title: "Incubation",
    href: "/incubation",
    icon: incubation,
    page: Page.incubation,
  },
];

export const SOCIALS = [
  {
    svg: twitterX,
    href: "https://twitter.com/SamuraiStarter",
    class: "scale-100",
  },
  { svg: telegram, href: "https://t.me/SamuraiStarter", class: "scale-100" },
  {
    svg: medium,
    href: "https://medium.com/samurai-starter",
    class: "scale-100",
  },
  {
    svg: linkedin,
    href: "https://www.linkedin.com/company/samurai-starter/",
    class: "scale-50",
  },
];
