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
  facebook,
  dextools,
  dexscreener,
  coingecko,
  coinmarketcap,
  ventures,
} from "@/app/utils/svgs";
import { Page } from "./enums";
import { IDO, IDO_v2 } from "./interfaces";
import {
  galaxyGamesHauntedSpace,
  havensCompass,
  orangedx,
  interswap,
  unibit,
  kip,
  artx,
  kvants,
  memepad,
  nexis,
  skywalker,
} from "@/public/IDOs/svgs";
import {
  PARTICIPATOR_ABI,
  PARTICIPATOR_V2_ABI,
  PARTICIPATOR_NFT_ABI,
  PARTICIPATOR_NFT_ETH,
  PARTICIPATOR_V2_2,
  IDO_ABI,
} from "@/app/contracts_integrations/abis";

export const simplifiedPhases = [
  { title: "Upcoming", buttonTitle: "" },
  {
    title: "Participation",
    buttonTitle: "PARTICIPATE",
  },
  { title: "Completed", buttonTitle: "" },
];

export const simplifiedPhasesV2 = [
  { title: "Upcoming", buttonTitle: "" },
  { title: "Registration", buttonTitle: "REGISTER" },
  {
    title: "Participation",
    buttonTitle: "PARTICIPATE",
  },
  { title: "Completed", buttonTitle: "" },
];

export const phases = [
  { title: "Upcoming", buttonTitle: "" },
  { title: "Registration", buttonTitle: "REGISTER" },
  {
    title: "Participation",
    buttonTitle: "PARTICIPATE",
  },
  { title: "Vesting", buttonTitle: "" },
];

export const VestingType: { [key: number]: string } = {
  0: "Cliff Vesting",
  1: "Linear",
  2: "Periodic",
};

export const NEW_IDOS: IDO_v2[] = [
  {
    id: "launchpad-v3/skywalker",
    logo: skywalker,
    idoImageSrc: "/IDOs/skywalker.png",
    acceptedTokenSymbol: "fUSDC",
    tokenNetwork: "Solana",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/SOLANA.svg",
    projectName: "Skywalker",
    projectListDescription:
      "Introducing Skywalker (SKR), your ticket to the digital cosmos. Join the force and embark on a thrilling journey.",
    projectDescription:
      "Unleash the power of Skywalker (SKR). This innovative token is your passport to a new galaxy of opportunities. Experience the future of finance, technology, and community. May the force be with your investments!",
    projectTokenSymbol: "$SKR",
    projectBigDescription: `
    <div style="display: flex; flex-direction: column; gap: 15px;">
      <p>Prepare to be amazed as Skywalker (SKR) revolutionizes the way you interact with digital assets. This groundbreaking token is not just about financial gain; it's a gateway to a vibrant community united by a shared vision of innovation.</p>
      <p>With SKR, you're not just an investor; you're a pioneer exploring uncharted territories. Backed by cutting-edge technology and a dedicated team, Skywalker is poised to become a cornerstone of the digital economy.</p>
      <p>Embrace the future with SKR. Join a movement that empowers individuals and drives positive change. The possibilities are endless. Are you ready to take flight?</p>
    </div>
`,
    price: 0.008,
    allocation: 100_000,
    date: 1723831200,
    fcfs: 1723831200 + 86_400 / 2,
    investmentRound: "Private",
    fdv: 10_000_000,
    exchangeListingPrice: 0.01,
    marketCapAtTGE: 375_000,
    socials: [
      {
        svg: globe,
        href: "https://memepad.ai/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/MemePadSol",
      },
      {
        svg: telegram,
        href: "https://t.me/Memepad_Community",
      },
    ],
    contract: "0x3f124b180d56a721442c95a81f6d139fe8c91162",
    abi: IDO_ABI,
    // images: [
    //   "/IDOs/memepad/1.png",
    //   "/IDOs/memepad/2.png",
    //   "/IDOs/memepad/3.png",
    //   "/IDOs/memepad/4.png",
    // ],
  },
  //   {
  //     id: "launchpad-v3/skywalker",
  //     logo: skywalker,
  //     idoImageSrc: "/IDOs/skywalker.png",
  //     acceptedTokenSymbol: "fUSDC",
  //     tokenNetwork: "Solana",
  //     crowdsaleNetwork: "BASE",
  //     networkImageSrc: "/chain-logos/SOLANA.svg",
  //     projectName: "Skywalker",
  //     projectListDescription:
  //       "Introducing Skywalker (SKR), your ticket to the digital cosmos. Join the force and embark on a thrilling journey.",
  //     projectDescription:
  //       "Unleash the power of Skywalker (SKR). This innovative token is your passport to a new galaxy of opportunities. Experience the future of finance, technology, and community. May the force be with your investments!",
  //     projectTokenSymbol: "$SKR",
  //     projectBigDescription: `
  //     <div style="display: flex; flex-direction: column; gap: 15px;">
  //       <p>Prepare to be amazed as Skywalker (SKR) revolutionizes the way you interact with digital assets. This groundbreaking token is not just about financial gain; it's a gateway to a vibrant community united by a shared vision of innovation.</p>
  //       <p>With SKR, you're not just an investor; you're a pioneer exploring uncharted territories. Backed by cutting-edge technology and a dedicated team, Skywalker is poised to become a cornerstone of the digital economy.</p>
  //       <p>Embrace the future with SKR. Join a movement that empowers individuals and drives positive change. The possibilities are endless. Are you ready to take flight?</p>
  //     </div>
  // `,
  //     price: 0.008,
  //     allocation: 100_000,
  //     date: 1723723200,
  //     fcfs: 1723723200 + 86400 / 2,
  //     investmentRound: "Private",
  //     fdv: 6000000,
  //     exchangeListingPrice: 0.01,
  //     marketCapAtTGE: 182250,
  //     socials: [
  //       {
  //         svg: globe,
  //         href: "https://memepad.ai/",
  //       },
  //       {
  //         svg: twitterX,
  //         href: "https://twitter.com/MemePadSol",
  //       },
  //       {
  //         svg: telegram,
  //         href: "https://t.me/Memepad_Community",
  //       },
  //     ],
  //     contract: "0x915Fd4218E1593129c9938a2117dc308632650e8",
  //     abi: IDO_ABI,
  //     // images: [
  //     //   "/IDOs/memepad/1.png",
  //     //   "/IDOs/memepad/2.png",
  //     //   "/IDOs/memepad/3.png",
  //     //   "/IDOs/memepad/4.png",
  //     // ],
  //   },
  //   {
  //     id: "launchpad-v3/whatever",
  //     logo: memepad,
  //     idoImageSrc: "/IDOs/memepad.png",
  //     acceptedTokenSymbol: "USDC",
  //     tokenNetwork: "Solana",
  //     crowdsaleNetwork: "BASE",
  //     networkImageSrc: "/chain-logos/SOLANA.svg",
  //     projectName: "Whatever",
  //     projectListDescription:
  //       "MemePad is set to become the number-one dedicated memecoin launchpad in crypto!",
  //     projectDescription:
  //       "MemePad is here to bring order to the chaos of the memecoin space. With strict vetting procedures and built-in anti-rug protection, they're creating a secure, high-quality launchpad for the 'hottest memecoins on Solana and beyond' where degens can chase 100x moonshots with confidence.",
  //     projectTokenSymbol: "$MPAD",
  //     projectBigDescription: `
  //     <div style="display: flex; flex-direction: column; gap: 15px;">
  //       <p>MemePad is setting out to solve the trifecta of problems plaguing the memecoin space: low-quality projects, a lack of transparency from teams, and security risks. They do this by sourcing only top-quality projects with doxxed teams, subjecting them to rigorous due diligence, and launching them with built-in protection against rug pulls</p>
  //       <p>Only top-tier memecoins are selected to join the MemeVerse (MemePad's line-up of launchpad alumni). To pass initial screening, a project has to have a strong long-term vision for the token growth, community, and utility.</p>
  //       <p>MemePad also implements strict security procedures to keep your investments safe. We're talking audits, mandatory KYC, locked team tokens, and more. They will also run their own insurance funds, used to compensate the community in the unlikely event that a MemeVerse project is compromised and goes to zero.</p>
  //       <p>$MPAD holders have the option to participate for the main token sales, or go in on exclusive early 'Ape In' rounds with cheaper prices and special bonuses.</p>
  //       <p>And as a reward for participating on the platform, holders will also be getting regularly showered with airdrops sourced form MemePad's featured projects!</p>
  //     </div>
  // `,
  //     price: 0.1,
  //     allocation: 50_000,
  //     date: 1723377600,
  //     fcfs: 1723377600 + 86400 / 2,
  //     investmentRound: "Private",
  //     fdv: 6000000,
  //     exchangeListingPrice: 0.6,
  //     marketCapAtTGE: 182250,
  //     socials: [
  //       {
  //         svg: globe,
  //         href: "https://memepad.ai/",
  //       },
  //       {
  //         svg: twitterX,
  //         href: "https://twitter.com/MemePadSol",
  //       },
  //       {
  //         svg: telegram,
  //         href: "https://t.me/Memepad_Community",
  //       },
  //     ],
  //     contract: "0x915Fd4218E1593129c9938a2117dc308632650e8",
  //     abi: IDO_ABI,
  //     images: [
  //       "/IDOs/memepad/1.png",
  //       "/IDOs/memepad/2.png",
  //       "/IDOs/memepad/3.png",
  //       "/IDOs/memepad/4.png",
  //     ],
  //   },
];

export const IDO_LIST: IDO[] = [
  {
    id: "launchpad-v2/nexis",
    logo: nexis,
    idoImageSrc: "/IDOs/nexis.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "TBA",
    projectName: "Nexis Network",
    projectListDescription:
      "Nexis Network is an innovative new Layer-1 blockchain, tailored to host the next generation of data-intensive AI and RWA applications.",
    projectDescription:
      "Nexis' mission is to build a secure, scalable, lightning-fast blockchain which solves all of the problems currently inhibiting the growth of AI projects in Web3. With block confirmations five times faster than Solana (and for a third of the cost) they’re building the blockchain infrastructure needed to meet the high data demands of next-gen machine learning and RWA projects.",
    projectTokenSymbol: "$NZT",
    totalAllocation: 200_000,
    price: "0.01125",
    registrationStartsAt: 1719410792,
    participationStartsAt: 1719489600,
    participationEndsAt: 1719532800,
    publicParticipationStartsAt: 1719532800,
    publicParticipationEndsAt: 1719619200,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 7,
    cliff: 86400 * 30,
    investmentRound: "Private Round",
    fdv: "30000000",
    exchangeListingPrice: 0.03,
    marketCapAtTGE: 650250,
    vesting: "7% at TGE, 1 mo. cliff, 10 month vesting (daily)",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      { svg: globe, href: "https://nexis.network/" },
      {
        svg: twitterX,
        href: "https://twitter.com/Nexis_Network",
      },
      {
        svg: telegram,
        href: "https://t.me/Nexis_Network",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>Nexis is an innovative new Layer-1 blockchain, specifically tailored to meet the high throughput demands of AI and RWA projects. It's custom built to host the next generation of AI-powered products, which require cheap, high-volume, lightning-fast transactions.</p>
        <p>The base layer of the Nexis Network is its EVM-compatible L1 blockchain, developed using Delegated Proof-of-Stake consensus. Running on top of this foundational EVM blockchain is a second tech layer: a parallel zkEVM (Zero-knowledge Ethereum Virtual Machine) chain.</p>
        <p>This dual-chain architecture allows Nexis Network to offload processing tasks to this parallel chain, increasing the speed of transactions while also allowing developers to utilize the inherent privacy and security of zero-knowledge proofs when processing sensitive data. It also means that Nexis enjoys seamless interoperability with EVM and zkEVM chains, as well as boasting compatibility with Rust-based chains (such as Solana).</p>
        <p>As a result, Nexis Network smashes the competition on basically every key metric. According to the testnet figures, Nexis is able to exceed Solana's TPS, process blocks over five times faster, and also process transactions for just 30% of the cost!</p>
      </div>
  `,
    contract: "0x071F2d6Fc096da78fcE7918aa5A2a8fd59C6a183",
    abi: PARTICIPATOR_V2_2,
    type: "v2",
  },
  {
    id: "launchpad-v2/kvants",
    logo: kvants,
    idoImageSrc: "/IDOs/kvants.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "Kvants",
    projectListDescription:
      "The Kvants platform makes high-level institutional quantitative trading strategies available to the masses.",
    projectDescription:
      "Kvants is on a mission to democratize investment by creating a self-custodial platform where users can browse and invest in a wide range of complex quant trading strategy pools, allowing each of us to 'invest like the elite' with just a few clicks. $KVAI holders will enjoy effortless access to high-performing institutional investment models.",
    projectTokenSymbol: "$KVAI",
    totalAllocation: 150_000,
    price: "0.013",
    registrationStartsAt: 1718108260,
    participationStartsAt: 1718109000,
    participationEndsAt: 1718152200,
    publicParticipationStartsAt: 1718152200,
    publicParticipationEndsAt: 1718195400 + 86400 * 6,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 5,
    cliff: 86400 * 30,
    investmentRound: "Strategic Round",
    fdv: "15000000",
    exchangeListingPrice: 0.015,
    marketCapAtTGE: 336000,
    vesting: "8% at TGE, 1 month cliff, 7 months vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "http://www.kvants.ai/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/KvantsAI",
      },
      {
        svg: telegram,
        href: "https://t.me/kvantsai",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>Built by a team of quantitative trading experts with experience at top TradFi institutions, Kvants is a non-custodial Asset Management Platform offering retail investors the chance to invest using institutional-grade trading strategies developed by professional hedge funds.<p>
        <p>These quantitative strategies make use of complex, systematic trading models with algorithms which are constantly optimised through AI-powered machine learning. Such trading models constantly monitor a wide range of market analytics, automatically closing and opening positions based on a predefined set of complex rules.<p>
        <p>These sophisticated trading strategies have traditionally been out of reach of retail crypto investors, but that is about to change. The Kvants platform is built to make investing with institutional-grade trading strategies accessible to the everyday investor.<p>
        <p>Kvants+ is the platform where all of this action takes place. Here you'll be able to browse a wide range of carefully-audited quantitative trading strategies, each with its own unique algorithms, risk profile, and past performance data. You can then deploy funds directly into DeFi pools which utilise these strategies (and enjoy monthly dividends as a result).<p>
      </div>
  `,
    contract: "0x730B7100590c8205F9Bf22bA28DF6227E0b28E38",
    abi: PARTICIPATOR_V2_2,
    images: [
      "/IDOs/kvants/1.jpeg",
      "/IDOs/kvants/2.jpeg",
      "/IDOs/kvants/3.jpeg",
      "/IDOs/kvants/4.jpeg",
    ],
    type: "v2",
  },
  {
    id: "launchpad-v2/mpad-round2",
    logo: memepad,
    idoImageSrc: "/IDOs/memepad.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "Solana",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/SOLANA.svg",
    projectName: "MemePad",
    projectListDescription:
      "MemePad is set to become the number-one dedicated memecoin launchpad in crypto!",
    projectDescription:
      "MemePad is here to bring order to the chaos of the memecoin space. With strict vetting procedures and built-in anti-rug protection, they're creating a secure, high-quality launchpad for the 'hottest memecoins on Solana and beyond' where degens can chase 100x moonshots with confidence.",
    projectTokenSymbol: "$MPAD",
    totalAllocation: 50_000,
    price: "0.345",
    registrationStartsAt: 1718193600,
    participationStartsAt: 1718294400,
    participationEndsAt: 1718337600,
    publicParticipationStartsAt: 1718337600,
    publicParticipationEndsAt: 1718380800,
    simplified: true,
    tgeDate: 1718582400,
    tgePercentage: 8,
    cliff: 0,
    investmentRound: "Round 2",
    fdv: "6000000",
    exchangeListingPrice: 0.6,
    marketCapAtTGE: 182250,
    vesting: "8% TGE + 3 month monthly vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://memepad.ai/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/MemePadSol",
      },
      {
        svg: telegram,
        href: "https://t.me/Memepad_Community",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>MemePad is setting out to solve the trifecta of problems plaguing the memecoin space: low-quality projects, a lack of transparency from teams, and security risks. They do this by sourcing only top-quality projects with doxxed teams, subjecting them to rigorous due diligence, and launching them with built-in protection against rug pulls</p>
        <p>Only top-tier memecoins are selected to join the MemeVerse (MemePad's line-up of launchpad alumni). To pass initial screening, a project has to have a strong long-term vision for the token growth, community, and utility.</p>
        <p>MemePad also implements strict security procedures to keep your investments safe. We're talking audits, mandatory KYC, locked team tokens, and more. They will also run their own insurance funds, used to compensate the community in the unlikely event that a MemeVerse project is compromised and goes to zero.</p>
        <p>$MPAD holders have the option to participate for the main token sales, or go in on exclusive early 'Ape In' rounds with cheaper prices and special bonuses.</p>
        <p>And as a reward for participating on the platform, holders will also be getting regularly showered with airdrops sourced form MemePad's featured projects!</p>
      </div>
  `,
    contract: "0x7848a6da9bb576caf244c087cbf55d5555d4abbc",
    abi: PARTICIPATOR_V2_2,
    images: [
      "/IDOs/memepad/1.png",
      "/IDOs/memepad/2.png",
      "/IDOs/memepad/3.png",
      "/IDOs/memepad/4.png",
    ],
    type: "v2",
  },
  {
    id: "launchpad-v2/memepad",
    logo: memepad,
    idoImageSrc: "/IDOs/memepad.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "Solana",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/SOLANA.svg",
    projectName: "MemePad",
    projectListDescription:
      "MemePad is set to become the number-one dedicated memecoin launchpad in crypto!",
    projectDescription:
      "MemePad is here to bring order to the chaos of the memecoin space. With strict vetting procedures and built-in anti-rug protection, they're creating a secure, high-quality launchpad for the 'hottest memecoins on Solana and beyond' where degens can chase 100x moonshots with confidence.",
    projectTokenSymbol: "$MPAD",
    totalAllocation: 100_000,
    price: "0.345",
    registrationStartsAt: 1718193600,
    participationStartsAt: 1718280000,
    participationEndsAt: 1718323200,
    publicParticipationStartsAt: 1718323200,
    publicParticipationEndsAt: 1718366400,
    simplified: true,
    tgeDate: 1718582400,
    tgePercentage: 8,
    cliff: 0,
    investmentRound: "Strategic",
    fdv: "6000000",
    exchangeListingPrice: 0.6,
    marketCapAtTGE: 182250,
    vesting: "8% TGE + 3 month monthly vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://memepad.ai/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/MemePadSol",
      },
      {
        svg: telegram,
        href: "https://t.me/Memepad_Community",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>MemePad is setting out to solve the trifecta of problems plaguing the memecoin space: low-quality projects, a lack of transparency from teams, and security risks. They do this by sourcing only top-quality projects with doxxed teams, subjecting them to rigorous due diligence, and launching them with built-in protection against rug pulls</p>
        <p>Only top-tier memecoins are selected to join the MemeVerse (MemePad's line-up of launchpad alumni). To pass initial screening, a project has to have a strong long-term vision for the token growth, community, and utility.</p>
        <p>MemePad also implements strict security procedures to keep your investments safe. We're talking audits, mandatory KYC, locked team tokens, and more. They will also run their own insurance funds, used to compensate the community in the unlikely event that a MemeVerse project is compromised and goes to zero.</p>
        <p>$MPAD holders have the option to participate for the main token sales, or go in on exclusive early 'Ape In' rounds with cheaper prices and special bonuses.</p>
        <p>And as a reward for participating on the platform, holders will also be getting regularly showered with airdrops sourced form MemePad's featured projects!</p>
      </div>
  `,
    contract: "0x669c013F8861B2d00f5C5f417fdc5F66E7DaF65b",
    abi: PARTICIPATOR_V2_2,
    images: [
      "/IDOs/memepad/1.png",
      "/IDOs/memepad/2.png",
      "/IDOs/memepad/3.png",
      "/IDOs/memepad/4.png",
    ],
    type: "v2",
  },
  {
    id: "launchpad-nft-eth/artx",
    logo: artx,
    idoImageSrc: "/IDOs/artx.png",
    acceptedTokenSymbol: "ETH",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "ARTX - NFT",
    projectListDescription:
      "Level up your portfolio with ARTX's suite of AI-assisted trading and asset management tools.",
    projectDescription:
      "The Artxnauts NFT is your access pass to ARTX's AI-powered portfolio management tools. Set a custom risk level and effortlessly grow your portfolio using their sophisticated AI trading bot. Each of these 500 exclusive NFTs also grants lifetime DAO membership and early access to all future ARTX products!",
    projectTokenSymbol: "NFT",
    totalAllocation: 150,
    price: "0.065",
    registrationStartsAt: 0,
    participationStartsAt: 1716465600,
    participationEndsAt: 1716811200,
    publicParticipationStartsAt: 0,
    publicParticipationEndsAt: 0,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 0,
    cliff: 0,
    investmentRound: "SAMURAI ROUND",
    fdv: "",
    exchangeListingPrice: 0.08,
    marketCapAtTGE: 0,
    vesting: "NOT APPLICABLE",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://artx.capital/",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/ArtxTrading",
      },
      {
        svg: telegram,
        href: "https://t.me/artxcommunity",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">ARTX NFT</h1>
        <p>Running the ARTX trading bot is like having your own personal asset manager constantly monitoring and optimising your portfolio, to make sure your funds are performing to their optimal potential. It does this with the power of a powerful AI engine. Set your custom risk appetite level, deploy the bot on a CEX account (or soon, directly on your Web3 wallet of choice) and let it do the rest.</p>
        <p>Holding an Artxnaut NFT gives lifetime access to the trading bot, with no hidden fees. But thats not all — becoming an Artxnaut will also put you at the very heart of the ARTX project, with DAO membership and early access to every future product in their ever-expanding suite of AI-assisted trading tools.</p>
        <p>The first of these is already well on the way: a Smart Index system built in collaboration with crypto index fund specialists Phuture. These next-gen Smart Indexes will operate as baskets of cryptocurrencies managed via an AI which can constantly optimise and rebalance the index's portfolio on the fly to maximise gains for holders.</p>
        <p>Lifetime access to all this and more is granted through the Artxnaut NFTs. With a max supply of just 500 being minted (and some killer artwork) expect these to be snapped up quick.</p>
      </div>
  `,
    contract: "0x00778bB6d5A185F9661F7A0Baf95E6b6E4d165b1",
    abi: PARTICIPATOR_NFT_ETH,
    images: [
      "/IDOs/artx/1.jpg",
      "/IDOs/artx/2.jpg",
      "/IDOs/artx/3.jpg",
      "/IDOs/artx/4.jpg",
    ],
    type: "NFT-ETH",
  },
  {
    id: "launchpad-nft/kip-protocol",
    logo: kip,
    idoImageSrc: "/IDOs/kip-protocol.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "KIP Protocol",
    projectListDescription:
      "The mission critical Web3 base layer for AI' where data suppliers, model creators, and app developers can securely transact.",
    projectDescription:
      "KIP Protocol boasts top-tier VC backing, founders with world-class academic credentials, and a clear vision for creating 'the mission critical Web3 Base Layer for AI'. KIP Checker Nodes regulate the actions of every entity operating on the network, ensuring security and transparency for everyone involved.",
    projectTokenSymbol: "NODE",
    totalAllocation: 200,
    price: "620",
    registrationStartsAt: 0,
    participationStartsAt: 1715598000,
    participationEndsAt: 1715641200,
    publicParticipationStartsAt: 1715641200,
    publicParticipationEndsAt: 1715727600,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 10,
    cliff: 0,
    investmentRound: "Node",
    fdv: "12000000",
    exchangeListingPrice: 0.012,
    marketCapAtTGE: 340800,
    vesting: "NOT APPLIED",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "http://kip.pro",
      },
      {
        svg: twitterX,
        href: "x.com/KIPprotocol",
      },
      {
        svg: discord,
        href: "http://discord.com/invite/kipprotocol",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">KIP PROTOCOL</h1>
        <p>What does the interchange of data and value look like on the KIP Protocol network? For example, a firm which builds complex AI models can list their products on the network to easily monetize their work. Through the platform, these AI models can then be licensed by developers looking to build user-facing apps such as AI agents.</p>
        <p>In order to optimize these AI applications, developers also require large sets of data to train the models on specific tasks — these they can also access via feeds from the various data providers integrated with the KIP Protocol network. In essence, it's a next-gen Web3 framework where all of the players in the AI industry can seamlessly and securely transact with one another.</p>
        <p>Application builders get quick and reliable access to the models and data they need, while the providers of these models and data can easily monetise their work through the power of Web3. The latter simply deploy their creations onto the network as 'Knowledge Assets' and receive revenues directly to their wallet whenever these assets are utilized.</p>
        <p>KIP Protocol handles the interchange of data, transfer of funds, and records of data ownership for all of these processes. And of course, ensures that users transacting on the network can do so with full trust in the quality and security of the entities they're interacting with. </p>
        <p>This is where the Checker Nodes come in. Their job is to periodically ping the API endpoint of these AI suppliers and service providers to check three crucial things: uptime, data accuracy, and cost.</p>
        <p>As a reward for doing so, node operators receive $KIP token reward — 20% of total supply is set aside for node rewards over the first three years. $KIP rewards will begin being generated 7 days after TGE, and paid out to operators every 15 minutes. There's no cliff, so you'll be able to claim your rewards whenever you want, with a 30-day cooldown after each withdrawal.</p>
        <p>Each node license comes with DAO voting rights which can be used to vote on the outcome of these disputes, with bonus rewards being paid out for participation.</p>

      </div>
  `,
    contract: "0x29173B5F859C55B07225704ce94e3cbF471e6D5a",
    abi: PARTICIPATOR_NFT_ABI,
    // images: [
    //   "/IDOs/orangedx/1.png",
    //   "/IDOs/orangedx/2.png",
    //   "/IDOs/orangedx/3.png",
    //   "/IDOs/orangedx/4.png",
    // ],
    type: "NFT",
  },
  {
    id: "launchpad/unibit",
    logo: unibit,
    idoImageSrc: "/IDOs/unibit.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "UniBit",
    projectListDescription:
      "UniBit is a suite of DeFi products built to enrich the BRC-20 ecosystem by connecting it with the flexibility of EVM chains.",
    projectDescription:
      "UniBit's ever-expanding range of products is poised to unlock deeper layers of utility for new and existing BTC-native tokens. Their token bridging protocol, inscriptions dashboard, native DEX, NFT marketplace and yield farming products will offer myriad ways for BRC-20 fanatics to create, trade, and monetize their Bitcoin-based assets!",
    projectTokenSymbol: "$UIBT",
    totalAllocation: 150_000,
    price: "0.008",
    registrationStartsAt: 0,
    participationStartsAt: 1712142000,
    participationEndsAt: 1712228400,
    publicParticipationStartsAt: 1712228400,
    publicParticipationEndsAt: 1712314800,
    simplified: true,
    tgeDate: 1712534400,
    tgePercentage: 10,
    cliff: 0,
    investmentRound: "Private Round",
    fdv: "12000000",
    exchangeListingPrice: 0.012,
    marketCapAtTGE: 340800,
    vesting: "10% at TGE, 9-month monthly vesting",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      {
        svg: globe,
        href: "https://www.unibit.app/#home",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/Unibit_bridge",
      },
      {
        svg: telegram,
        href: "https://t.me/unibitprotocol",
      },
      {
        svg: facebook,
        href: "https://www.facebook.com/profile.php?id=61556631025126",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <h1 style="font-weight: bold; font-size: 1.2em;">Unibit - $UIBT</h1>
        <p>UniBit's mission is to enrich the BRC-20 ecosystem by enhancing the utility of BTC-based assets. This means seamlessly connecting these exciting new assets with the programmable functionality and deep liquidity of EVM blockchains. To do this, they're developing an ever-expanding suite of innovative products.</p>
        <p>The core of the project is UniBit's flagship dual-sided token bridge, which facilitates the seamless transfer of assets back and forth between the Bitcoin blockchain and 10 EVM chains. This allows users to access enhanced liquidity with their BRC-20 tokens, and to take advantage of yield farming opportunities like UniBit's own dynamic liquidity staking pools.</p>
        <p>For builders, UniBit also makes it simple for projects to launch their own Bitcoin-based assets, with a suite of tools for easily creating, deploying, and managing inscriptions.</p>
        <p>It's the $UIBT utility token which powers all of the products in the UniBit arsenal. Holders will be entitled to DAO voting rights, as well as a share of the revenues generated through the cross-chain bridging protocol. This means that simply holding the token is enough to generate passive yield!</p>

      </div>
  `,
    contract: "0xc528523345f4e8f39aac8Ce56Cc5DF7F1Eb03D24",
    abi: PARTICIPATOR_V2_ABI,
    // images: [
    //   "/IDOs/orangedx/1.png",
    //   "/IDOs/orangedx/2.png",
    //   "/IDOs/orangedx/3.png",
    //   "/IDOs/orangedx/4.png",
    // ],
  },
  {
    id: "launchpad/interswap",
    logo: interswap,
    idoImageSrc: "/IDOs/interswap.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/ido-sample.svg",
    projectName: "InterSwap",
    projectListDescription:
      "InterSwap is a first-of-its-kind cross-chain liquidity engine, pushing DeFi forward towards an interoperable future.",
    projectDescription:
      "InterSwap is both a DEX and a powerful liquidity engine which utilizes the power of blockchain interoperability to unify disparate liquidity pools across different blockchains. These virtual super-pools negate the need for token bridges entirely, solving DeFi's problems of inefficiency, fragmented liquidity, and cross-chain security all at once!",
    projectTokenSymbol: "$ISWAP",
    totalAllocation: 150_000,
    price: "0.15",
    registrationStartsAt: 0,
    participationStartsAt: 1711623600,
    participationEndsAt: 1711666800,
    publicParticipationStartsAt: 1711666800,
    publicParticipationEndsAt: 1711753200,
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
        href: "https://interswap.io",
      },
      {
        svg: twitterX,
        href: "https://x.com/@InterSwap_io",
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
    contract: "0x13dCed544b5c45Bd60d6E34C89820B1F2EAe4d2c",
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
    tokenNetwork: "TBA",
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
    registrationStartsAt: 0,
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
    tokenNetwork: "TBA",
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
    registrationStartsAt: 0,
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
    tokenNetwork: "TBA",
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
    registrationStartsAt: 0,
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
  11155111: "https://sepolia.etherscan.io",
  8453: "https://basescan.org",
  84532: "https://sepolia.basescan.org",
};

export const RPC_URL: { [key: number]: string } = {
  1337: "http://localhost:8545",
  5: process.env.NEXT_PUBLIC_GOERLI_RPC_URL as string,
  11155111: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL as string,
  8453: process.env.NEXT_PUBLIC_BASE_RPC_URL as string,
  84532: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL as string,
};

export const TOKENS_TO_SYMBOL: Record<string, string> = {
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": "USDC",
  "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA": "USDbC",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3": "USDC", // MOCKED TOKEN
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512": "USDbC", // MOCKED TOKEN
  "0x888f2e45d3c27d9cae72aca93174c530dfb3d4d8": "SKR", // SKYEWALKER
  "0x2a064000D0252d16c57FAFD1586bE7ce5deD8320": "fUSDC", // FakeUSDC
};

export const TOKENS_TO_ICON: Record<string, string> = {
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": "/usdc-icon.svg",
  "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA": "usdc-icon.svg",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3": "/usdc-icon.svg", // MOCKED TOKEN
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512": "/usdc-icon.svg", // MOCKED TOKEN
  "0x888f2e45d3c27d9cae72aca93174c530dfb3d4d8": "/skr-icon.svg", // SKYEWALKER
  "0x2a064000D0252d16c57FAFD1586bE7ce5deD8320": "/fusdc-icon.svg", // FakeUSDC
};

export const CHAIN_TO_ICON: Record<number, string> = {
  1: "/chain-logos/ETH.png", // ETHEREUM
  43114: "/chain-logos/AVAX.png", // AVALANCHE
  137: "/chain-logos/MATIC.png", // POLYGON
  56: "/chain-logos/BSC.png", // BNB
  8453: "/chain-logos/Base_Symbol_Blue.svg", // BASE
};

export const CHAIN_TO_CURRENCY: Record<number, string> = {
  1: "ETH", // ETHEREUM
  43114: "AVAX", // AVALANCHE
  137: "MATIC", // POLYGON
  56: "BNB", // BNB
  8453: "ETH", // BASE
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
  {
    title: "Ventures",
    href: "/ventures",
    icon: ventures,
    page: Page.ventures,
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
  {
    svg: coinmarketcap,
    href: "#",
    class: "",
  },
  {
    svg: coingecko,
    href: "https://www.coingecko.com/en/coins/samurai-starter",
    class: "",
  },
  {
    svg: dextools,
    href: "https://www.dextools.io/app/en/base/pair-explorer/0x598299fb3f3829f7ba08662948706cdff7ec2350?t=1714671643659",
    class: "",
  },
  {
    svg: dexscreener,
    href: "https://dexscreener.com/base/0x598299fb3f3829f7ba08662948706cdff7ec2350",
    class: "",
  },
];

export const SAM_NFT = "0x519eD34150300dC0D04d50a5Ff401177A92b4406";
export const SAM_LOCK_ADDRESS = "0xfb691697BDAf1857C748C004cC7dab3d234E062E";
export const SAM_ADDRESS = "0xed1779845520339693CDBffec49a74246E7D671b";
export const SAM_CLAIM_VESTING = "0xDD687b579c5C542A14874e79E404b83E78e6E18a"; // BASE MAINNET
export const SAM_TIERS = "0xdB0Ee72eD5190e9ef7eEC288a92f73c5cf3B3c74";
export const SAM_FACTORY = "0x9Da8A3AA7eF8FC968b169104f119Ec4522daB742";
