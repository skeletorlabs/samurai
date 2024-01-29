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
    id: "launchpad/babylon",
    idoImageSrc: "/IDOs/babylon.jpeg",
    acceptedToken: "USDC",
    network: "BASE",
    networkImageSrc: "/ido-sample.svg",
    type: "Public Round",
    projectName: "Babylon",
    projectDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse congue gravida lorem sit amet laoreet. Nullam tincidunt nisi dolor, a vehicula erat malesuada in. Proin sed erat ullamcorper, egestas urna eget, convallis augue. Aenean eu orci non turpis ullamcorper varius. Suspendisse at sagittis arcu. Morbi arcu enim, ornare in tellus et, interdum laoreet turpis. Praesent faucibus sed sapien nec interdum. Curabitur sodales libero eu rutrum sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque sollicitudin, arcu non tincidunt finibus, nisi velit rutrum odio, eget luctus augue quam eu dui. Proin luctus sagittis ligula, vitae scelerisque lectus laoreet suscipit. Integer egestas congue facilisis. Aliquam et dignissim turpis. Curabitur ullamcorper ante interdum nisl ullamcorper consectetur. Pellentesque ante augue, cursus sit amet dolor in, tincidunt ullamcorper nisl. Aenean mattis fermentum magna tempus molestie. Curabitur non interdum nibh. Nunc commodo in massa vitae malesuada. Vivamus non mattis justo. Nam elit augue, pulvinar quis dolor dapibus, porttitor interdum orci. Sed ornare cursus sapien ac elementum.",
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
    currentPhase: simplifiedPhases[0].title,
    socials: [
      {
        svg: twitterX,
        href: "",
        class: "scale-100",
      },
      {
        svg: telegram,
        href: "",
        class: "scale-100",
      },
      {
        svg: discord,
        href: "",
        class: "scale-100",
      },
      {
        svg: medium,
        href: "",
        class: "scale-100",
      },
    ],
  },
  {
    id: "launchpad/slp",
    idoImageSrc: "/IDOs/slp.png",
    acceptedToken: "USDC",
    network: "BASE",
    networkImageSrc: "/ido-sample.svg",
    type: "Public Round",
    projectName: "Axie Infinity",
    projectDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse congue gravida lorem sit amet laoreet. Nullam tincidunt nisi dolor, a vehicula erat malesuada in. Proin sed erat ullamcorper, egestas urna eget, convallis augue. Aenean eu orci non turpis ullamcorper varius. Suspendisse at sagittis arcu. Morbi arcu enim, ornare in tellus et, interdum laoreet turpis. Praesent faucibus sed sapien nec interdum. Curabitur sodales libero eu rutrum sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque sollicitudin, arcu non tincidunt finibus, nisi velit rutrum odio, eget luctus augue quam eu dui. Proin luctus sagittis ligula, vitae scelerisque lectus laoreet suscipit. Integer egestas congue facilisis. Aliquam et dignissim turpis. Curabitur ullamcorper ante interdum nisl ullamcorper consectetur. Pellentesque ante augue, cursus sit amet dolor in, tincidunt ullamcorper nisl. Aenean mattis fermentum magna tempus molestie. Curabitur non interdum nibh. Nunc commodo in massa vitae malesuada. Vivamus non mattis justo. Nam elit augue, pulvinar quis dolor dapibus, porttitor interdum orci. Sed ornare cursus sapien ac elementum.",
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
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "",
        class: "scale-100",
      },
      {
        svg: twitterX,
        href: "",
        class: "scale-100",
      },
      {
        svg: telegram,
        href: "",
        class: "scale-100",
      },
      {
        svg: discord,
        href: "",
        class: "scale-100",
      },
      {
        svg: medium,
        href: "",
        class: "scale-100",
      },
    ],
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse congue gravida lorem sit amet laoreet. Nullam tincidunt nisi dolor, a vehicula erat malesuada in. Proin sed erat ullamcorper, egestas urna eget, convallis augue. Aenean eu orci non turpis ullamcorper varius. Suspendisse at sagittis arcu. Morbi arcu enim, ornare in tellus et, interdum laoreet turpis. Praesent faucibus sed sapien nec interdum. Curabitur sodales libero eu rutrum sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque sollicitudin, arcu non tincidunt finibus, nisi velit rutrum odio, eget luctus augue quam eu dui. Proin luctus sagittis ligula, vitae scelerisque lectus laoreet suscipit. Integer egestas congue facilisis. Aliquam et dignissim turpis. Curabitur ullamcorper ante interdum nisl ullamcorper consectetur. Pellentesque ante augue, cursus sit amet dolor in, tincidunt ullamcorper nisl. Aenean mattis fermentum magna tempus molestie. Curabitur non interdum nibh. Nunc commodo in massa vitae malesuada. Vivamus non mattis justo. Nam elit augue, pulvinar quis dolor dapibus, porttitor interdum orci. Sed ornare cursus sapien ac elementum.",
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
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "",
        class: "scale-100",
      },
      {
        svg: twitterX,
        href: "",
        class: "scale-100",
      },
      {
        svg: telegram,
        href: "",
        class: "scale-100",
      },
      {
        svg: discord,
        href: "",
        class: "scale-100",
      },
      {
        svg: medium,
        href: "",
        class: "scale-100",
      },
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
    href: "https://twitterX.com/SamuraiStarter",
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
