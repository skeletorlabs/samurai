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
  instagram,
} from "@/utils/svgs";
import { Page } from "./enums";
import { IDO } from "./interfaces";
import {
  anote,
  galaxyGamesHauntedSpace,
  havensCompass,
  orangedx,
  interswap
} from "@/public/IDOs/svgs";
import {
  PARTICIPATOR_ABI,
  PARTICIPATOR_V2_ABI,
} from "@/contracts_integrations/abis";

export const simplifiedPhases = [
  { title: "Upcoming", buttonTitle: "" },
  {
    title: "Participation",
    buttonTitle: "PARTICIPATE",
  },
  { title: "Completed", buttonTitle: "" },
];

export const IDO_LIST: IDO[] = [
  {
    id: "launchpad/orangedx",
    logo: interswap,
    idoImageSrc: "/IDOs/interswap.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TO BE ANNOUNCED",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "InterSwap",
    projectListDescription:
      "InterSwap is a first-of-its-kind cross-chain liquidity engine, pushing DeFi forward towards an interoperable future.",
    projectDescription:
      "InterSwap is both a DEX and a powerful liquidity engine which utilizes the power of blockchain interoperability to unify disparate liquidity pools across different blockchains. These virtual super-pools negate the need for token bridges entirely, solving DeFi's problems of inefficiency, fragmented liquidity, and cross-chain security all at once!",
    projectTokenSymbol: "$ISWAP",
    totalAllocation: 100000000,
    price: "0.055",
    participationStartsAt: 1711623600,
    participationEndsAt: 1711710000,
    publicParticipationStartsAt: 1711710000,
    publicParticipationEndsAt: 1711796400,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 3,
    cliff: 0,
    investmentRound: "Private Round",
    fdv: "25000000",
    exchangeListingPrice: 0.25,
    marketCapAtTGE: 285000,
    vesting: "3% at TGE, 2-month cliff, 12-month monthly vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "interswap.io",
      },
      {
        svg: twitterX,
        href: "x.com/@InterSwap_io",
      },
      {
        svg: telegram,
        href: "https://t.me/+l_Rpi9naX9dlY2Yy",
      },
      {
        svg: discord,
        href: "https://discord.gg/ech5dtkHmy",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">InterSwap - $ISWAP</h1>
        <p>InterSwap is a powerful inter-chain liquidity protocol which utilizes the power of interoperability to unify liquidity across dozens of popular blockchains. Thanks to their lightning-fast, cross-chain infrastructure, no longer will users need to run their tokens through cumbersome bridge protocols, hold risky wrapped tokens, or surrender custody of their tokens to a CEX in order to trade between different blockchains.</p>
        <p>The core of their innovative solution is their 'omnichain' AMM engine, deployed on the Axelar Network. These powerful smart contracts interface with disparate liquidity pools — previously sealed off from each other on different blockchains — and combine them together into a single virtual 'master pool'.</p>
        <p>For users, that means ultra secure cross-chain swaps, carried out in native assets, without the need for any intermediaries! All that in under 20 seconds, by submitting just a single transaction on the starting chain. This is what the future of blockchain interoperability looks like, and InterSwap is at the very tip of the spear.
      </div>
  `,
    contract: "0x05dCf22b2ab52c074EF94B86c5d96d71C9f86715",
    abi: PARTICIPATOR_V2_ABI,
    // images: [
    //   "/IDOs/orangedx/1.png",
    //   "/IDOs/orangedx/2.png",
    //   "/IDOs/orangedx/3.png",
    //   "/IDOs/orangedx/4.png",
    // ],
  },
  {
    id: "launchpad/orangedx",
    logo: orangedx,
    idoImageSrc: "/IDOs/orangedx.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TO BE ANNOUNCED",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "OrangeDX",
    projectListDescription:
      "OrangeDX is ready to push the envelope for Bitcoin-native DeFi, with a full suite of BRC-20 financial products.",
    projectDescription:
      "OrangeDX is setting out to conquer the brave new world of Bitcoin-based DeFi and gain first-mover advantage over the competition. They’ve developed a complete range of DeFi solutions to unite the worlds of BRC-20 and ERC-20, all powered by the $O4DX token.",
    projectTokenSymbol: "$O4DX",
    totalAllocation: 100_000,
    price: "0.055",
    participationStartsAt: 1710165600,
    participationEndsAt: 1710244800,
    publicParticipationStartsAt: 1710244800,
    publicParticipationEndsAt: 1710334800,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 50,
    cliff: 0,
    investmentRound: "Private Round",
    fdv: "8500000",
    exchangeListingPrice: 0.085,
    marketCapAtTGE: 2370000,
    vesting: "50% at TGE and 50% after one month",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://orangedx.com/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/OrangDx_BRC20",
      },
      {
        svg: telegram,
        href: "https://t.me/OrangeDx_Official_Chat",
      },
      // {
      //   svg: discord,
      //   href: "https://discord.gg/p6zZDvgNUW",
      // },
      {
        svg: medium,
        href: "https://medium.com/@orange_dex",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">OrangeDX - $O4DX</h1>
        <p>OrangeDX is building a 'first-gen Bitcoin DeFi Hub' which will bring a host of DeFi utilities to the BTC blockchain. Their strategy to conquer the new frontiers of BRC-20 finance is four-pronged.</p>
        <p>The first is a BRC-20 to EVM token bridge, making transferring Bitcoin-based tokens to other chains seamless and safe. Second is user-friendly BRC-20 token DEX, which will aggregate a range of exchanges to ensure users get the best deals.</p>
        <p>Third is a yield platform which will offer Bitcoin-native staking and LP farming. And last but not least: a full-service launchpad suite for innovative new BRC-20 projects launching IDOs, INOs, and ILOs on the Bitcoin blockchain.</p>
        <p>Powering all of this Bitcoin DeFi action is the $O4DX token — the key to all of the ultra-bullish earning potential which the OrangeDX ecosystem has to offer.</p>
      </div>
  `,
    contract: "0x05dCf22b2ab52c074EF94B86c5d96d71C9f86715",
    abi: PARTICIPATOR_V2_ABI,
    images: [
      "/IDOs/orangedx/1.png",
      "/IDOs/orangedx/2.png",
      "/IDOs/orangedx/3.png",
      "/IDOs/orangedx/4.png",
    ],
  },
  {
    id: "launchpad/hauntedspace-gaga",
    logo: galaxyGamesHauntedSpace,
    idoImageSrc: "/IDOs/hauntedspace-gaga.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TO BE ANNOUNCED",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "Haunted Space",
    projectListDescription:
      "Prepare to confront the horrors of deep space in this genre-blending flagship title from innovative Web3 game studio Galaxy Games.",
    projectDescription:
      "Galaxy Games is preparing to launch the definitive next-gen gaming ecosystem, uniting traditional players and blockchain gamers under one banner. Their much-hyped flagship title, Haunted Space, is set to raise the bar for Web3 gaming with AAA gameplay, a captivating original world, and a fully player-driven game economy.",
    projectTokenSymbol: "$GAGA",
    totalAllocation: 50_000,
    price: "0.01",
    participationStartsAt: 1708952400,
    participationEndsAt: 1709038800,
    publicParticipationStartsAt: 1709038800,
    publicParticipationEndsAt: 1709125200,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 10,
    cliff: 86400 * 30 * 3,
    investmentRound: "Private Round",
    fdv: "24000000",
    exchangeListingPrice: 0.015,
    marketCapAtTGE: 1024800,
    vesting: "10% at TGE, 3-month cliff, 14-month monthly vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://hauntedspace.io/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/HauntedSpace_",
      },
      {
        svg: telegram,
        href: "https://t.me/hauntedspace",
      },
      {
        svg: discord,
        href: "https://discord.gg/p6zZDvgNUW",
      },
      {
        svg: medium,
        href: "https://medium.com/@hauntedspace",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">Haunted Space - GAGA</h1>
        <p>Galaxy Games is throwing open the gates of blockchain gaming and onboarding a whole new community of gamers into the world of Web3. It all begins with their first major release, Haunted Space: an innovative blend of space-sim and survival horror, coming soon to PC, Playstation, and Xbox.</p>
        <p>Players will be thrown headfirst into a galaxy infested with gargantuan monsters, and tasked with surviving against all odds. This means gathering resources to craft powerful spaceship upgrades, fighting against other players, and slaying Lovecraftian leviathans in epic boss battles.</p>
        <p>Secure your allocation of the $GAGA utility token for a slice of this much anticipated release. And remember, $GAGA is the token which will govern the entire Galaxy Games ecosystem. That means you're not just investing in Haunted Space, but also all of the future Web3 releases from this innovative crypto gaming studio.</p>
      </div>
  `,
    contract: "0x7804168cD10a219cE617D96E57174aD5453447Af",
    abi: PARTICIPATOR_V2_ABI,
    images: [
      "/IDOs/hauntedspace-gaga/1.png",
      "/IDOs/hauntedspace-gaga/2.png",
      "/IDOs/hauntedspace-gaga/3.png",
      "/IDOs/hauntedspace-gaga/4.png",
      "/IDOs/hauntedspace-gaga/5.png",
      "/IDOs/hauntedspace-gaga/6.png",
      "/IDOs/hauntedspace-gaga/7.png",
      "/IDOs/hauntedspace-gaga/8.png",
      "/IDOs/hauntedspace-gaga/9.png",
    ],
  },
  {
    id: "launchpad/havens-compass",
    logo: havensCompass,
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
    exchangeListingPrice: 0.015,
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
    abi: PARTICIPATOR_ABI,
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
  "0x5FbDB2315678afecb367f032d93F642f64180aa3": "USDC", // MOCKED TOKEN
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512": "USDbC", // MOCKED TOKEN
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
