import {
  medium,
  twitter,
  telegram,
  linkedin,
  home,
  nft,
  rocket,
  token,
  incubation,
} from "@/utils/svgs";
import { Page } from "./enums";
import { IDONEW } from "./interfaces";

export const IDO_LIST: IDONEW[] = [
  {
    id: "launchpad/slp",
    idoImageSrc: "/IDOs/slp.png",
    acceptedToken: "USDC",
    network: "BASE",
    networkImageSrc: "/ido-sample.svg",
    type: "Public Round",
    projectName: "Axie Infinity",
    projectDescription:
      "Loren ipsum dolor sit amet, some stuff text another one ipsum dolor sit amet dolor amet dorum.",
    projectTokenSymbol: "SLP",
    raised: "100,000",
    price: "0.07",
    idoDate: 1707577630,
    registrationDate: 1706195232,
    simplified: true,
    tgeDate: 1706195232,
    tgePercentage: 10,
    cliff: 86400 * 30 * 4,
    releaseType: "Linear",
    currentPhase: "Participation",
  },
  {
    id: "launchpad/shiba",
    idoImageSrc: "/IDOs/shibainu.png",
    acceptedToken: "USDC",
    network: "BASE",
    networkImageSrc: "/ido-sample.svg",
    type: "Public Round",
    projectName: "Shiba Inu",
    projectDescription:
      "Loren ipsum dolor sit amet, some stuff text another one ipsum dolor sit amet dolor amet dorum.",
    projectTokenSymbol: "SHIB",
    raised: "100,000",
    price: "0.07",
    idoDate: 1707577630,
    registrationDate: 1706195232,
    simplified: true,
    tgeDate: 1706195232,
    tgePercentage: 10,
    cliff: 86400 * 30 * 4,
    releaseType: "Linear",
    currentPhase: "Participation",
  },

  {
    id: "launchpad/ethereum",
    idoImageSrc: "/IDOs/ethereum.png",
    acceptedToken: "ETH",
    network: "BASE",
    networkImageSrc: "/ido-sample.svg",
    type: "Public Round",
    projectName: "Ethereum",
    projectDescription:
      "Loren ipsum dolor sit amet, some stuff text another one ipsum dolor sit amet dolor amet dorum.",
    projectTokenSymbol: "ETH",
    raised: "300,000",
    price: "0.1",
    idoDate: 1707577630,
    registrationDate: 1706195232,
    simplified: true,
    tgeDate: 1706195232,
    tgePercentage: 10,
    cliff: 86400 * 30 * 4,
    releaseType: "Linear",
    currentPhase: "TGE",
  },

  {
    id: "launchpad/babylon",
    idoImageSrc: "/IDOs/babylon.jpeg",
    acceptedToken: "USDC",
    network: "BASE",
    networkImageSrc: "/ido-sample.svg",
    type: "Public Round",
    projectName: "Babylon",
    projectDescription:
      "Loren ipsum dolor sit amet, some stuff text another one ipsum dolor sit amet dolor amet dorum.",
    projectTokenSymbol: "BAB",
    raised: "100,000",
    price: "0.03",
    idoDate: 1707577630,
    registrationDate: 1706195232,
    simplified: true,
    tgeDate: 1706195232,
    tgePercentage: 10,
    cliff: 86400 * 30 * 4,
    releaseType: "Linear",
    currentPhase: "Release",
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
    svg: twitter,
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
