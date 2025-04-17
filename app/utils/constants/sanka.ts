import { SOCIAL } from "../interfaces";
import { discord, medium, telegram, twitterX } from "../svgs";

export type Winner = {
  address: string;
  tickets: number;
  sortedWins: number;
  winAmount: number;
};

export type Giveaway = {
  id: number;
  prizes: string;
  prizeValue: number;
  ticketsToDraw: number;
  image: string;
  background: string;
  socials?: SOCIAL[];
  winners?: Winner[];
};

export const BLACKLISTED_ADDRESSES = [
  "0xcDe00Be56479F95b5e33De136AD820FfaE996009",
];

export const GIVEAWAYS_LIST: Giveaway[] = [
  {
    id: 0,
    prizes: "3 Nodes",
    prizeValue: 1000,
    ticketsToDraw: 0,
    image: "/giveaways/xrone.png",
    background: "/IDOs/xrone.png",
  },
  {
    id: 1,
    prizes: "20 SAM NFTs",
    prizeValue: 1000,
    ticketsToDraw: 0,
    image: "/nfts/1.jpg",
    background: "/giveaways/samurai.png",
  },
  {
    id: 2,
    prizes: "$AIFI Allocations",
    prizeValue: 10000,
    ticketsToDraw: 500,
    image: "/giveaways/amplify-logo.png",
    background: "/giveaways/amplify-bg.png",

    socials: [
      {
        svg: twitterX,
        href: "https://x.com/amplifi_fi",
      },
      {
        svg: telegram,
        href: "https://t.me/Amplifi_Community",
      },
      { svg: discord, href: "https://discord.gg/amplifi" },
      { svg: medium, href: "https://amplifi-fi.medium.com/" },
    ],
  },
];
