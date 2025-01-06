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
import { IDO, IDO_v3, SINGLE_CARD } from "./interfaces";
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
  xrone,
  smartnodes,
  dyor,
  alpaca,
} from "@/public/IDOs/svgs";
import {
  PARTICIPATOR_ABI,
  PARTICIPATOR_V2_ABI,
  PARTICIPATOR_NFT_ABI,
  PARTICIPATOR_NFT_ETH,
  PARTICIPATOR_V2_2,
  PARTICIPATOR_NFT_OPEN,
  PARTICIPATOR_NFT_V2_ABI,
  PRIVATE_PARTICIPATOR_ABI,
  LATEST_PARTICIPATOR_TOKENS_ABI,
  VESTING_ABI,
  VESTING_ABI_V2,
  VESTING_ABI_V3,
} from "@/app/contracts_integrations/abis";
import { base } from "../context/web3modal";

export const VestingType: { [key: number]: string } = {
  0: "Cliff Vesting",
  1: "Linear",
  2: "Periodic",
};

export const VestingPeriodType: { [key: number]: string } = {
  0: "None",
  1: "Seconds",
  2: "Days",
  3: "Weeks",
  4: "Months",
};

export const VestingPeriodTranslator: { [key: string]: string } = {
  None: "",
  Seconds: "",
  Days: "Daily",
  Weeks: "Weekly",
  Months: "Monthly",
};

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
  { title: "Participation", buttonTitle: "PARTICIPATE" },
  { title: "Completed", buttonTitle: "" },
];

export const simplifiedPhasesV3 = [
  { title: "Upcoming", buttonTitle: "" },
  // { title: "Registration", buttonTitle: "REGISTER" },
  { title: "Participation", buttonTitle: "PARTICIPATE" },
  { title: "Vesting", buttonTitle: "" },
  { title: "Completed", buttonTitle: "" },
];

export const IDOs_card: SINGLE_CARD[] = [
  {
    id: "bluai",
    url: "https://bluai.samuraistarter.com",
    logo: alpaca,
    idoImageSrc: "/IDOs/bluai.png",
    acceptedTokenSymbol: "ETH",
    tokenNetwork: "ARBITRUM",
    crowdsaleNetwork: "ARBITRUM",
    networkImageSrc: "/chain-logos/ARBITRUM.svg",
    projectName: "BLU AI",
    projectListDescription:
      "Web3's Intelligence Layer - turn your data and your mobile device into your most valuable asset.",
    investmentRound: "NODES",
    price: 0.1,
    allocation: 210,
    allocationToken: "NODES",
    date: 1734544800,
    phase: "upcoming",
    prices: ["T2: 0.1466 ETH", "T3: 0.1729 ETH", "T4 0.2041 ETH"],
  },
];

export const IDOs: IDO_v3[] = [
  {
    id: "kvants",
    url: "launchpad-v3/kvants",
    logo: kvants,
    idoImageSrc: "/IDOs/kvants.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "BNB",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/BSC.png",
    projectName: "Kvants",
    projectListDescription:
      "The Kvants platform makes high-level institutional quantitative trading strategies available to the masses.",
    projectDescription:
      "Kvants is on a mission to democratize investment by creating a self-custodial platform where users can browse and invest in a wide range of complex quant trading strategy pools, allowing each of us to 'invest like the elite' with just a few clicks. $KVAI holders will enjoy effortless access to high-performing institutional investment models.",
    projectTokenSymbol: "$KVAI",
    projectBigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>Built by a team of quantitative trading experts with experience at top TradFi institutions, Kvants is a non-custodial Asset Management Platform offering retail investors the chance to invest using institutional-grade trading strategies developed by professional hedge funds.<p>
        <p>These quantitative strategies make use of complex, systematic trading models with algorithms which are constantly optimised through AI-powered machine learning. Such trading models constantly monitor a wide range of market analytics, automatically closing and opening positions based on a predefined set of complex rules.<p>
        <p>These sophisticated trading strategies have traditionally been out of reach of retail crypto investors, but that is about to change. The Kvants platform is built to make investing with institutional-grade trading strategies accessible to the everyday investor.<p>
        <p>Kvants+ is the platform where all of this action takes place. Here you'll be able to browse a wide range of carefully-audited quantitative trading strategies, each with its own unique algorithms, risk profile, and past performance data. You can then deploy funds directly into DeFi pools which utilise these strategies (and enjoy monthly dividends as a result).<p>
      </div>
  `,
    price: 0.013,
    tge: 8,
    allocation: 100_000,
    date: 1736172000,
    fcfs: 0,
    end: 1736344800,
    investmentRound: "Strategic Round",
    fdv: 15_000_000,
    exchangeListingPrice: 0.0025,
    marketCapAtTGE: 448_500,
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
    contract: "0x282e96253bf868abc8a0b67ec694acd8750921e7",
    abi: LATEST_PARTICIPATOR_TOKENS_ABI,
    images: [
      "/IDOs/kvants/1.jpeg",
      "/IDOs/kvants/2.jpeg",
      "/IDOs/kvants/3.jpeg",
      "/IDOs/kvants/4.jpeg",
    ],
    register: false,
    vestingDescription: "8% at TGE, 1 month cliff, 7 month linear",
    // vesting: "0x8C8Fa0152eFF48700c9e10b64aCa1B81f259F54B",
    // vestingChain: base,
    // vestingABI: VESTING_ABI_V2,
    type: "v3",
    linkedWallet: false,
    ether: false,
    // nftsToBlock: [
    //   107, 212, 213, 214, 215, 216, 217, 218, 502, 544, 831, 876, 877, 941, 980,
    //   1071, 1073, 1154, 1155, 1156, 1364, 1455, 1462, 1626, 1627, 1629, 1630,
    //   2120,
    // ],
  },
  {
    id: "alpaca",
    url: "launchpad-v3/alpaca",
    logo: alpaca,
    idoImageSrc: "/IDOs/alpaca.svg",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "BASE",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/BASE.svg",
    projectName: "ALPACA",
    projectListDescription:
      "A platform custom-made for the democratized development and utilization of next-gen AI agent models.",
    projectDescription:
      "Alpaca is Base chain's new innovation hub for AI agents, where developers can take their ideas through the whole process of incubation, development, launching, and monetization. At the core of Alpaca Network is a decentralized taskboard where powerful AI agents are deployed in tandem with human experts to solve real-world problems.",
    projectTokenSymbol: "$PACA",
    projectBigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>Alpaca's suite of DeAI tools are designed to facilitate the entire process of creating and deploying AI agents on-chain. Built on Base by a team of AI industry veterans, the platform is aiming to become the go-to hub for AI innovators in Web3. Let's take a look at each of the products in their lineup:</p>
        <p>
          <u><b>PacaLab</b></u><br />
          When a developer has an idea for an innovative AI agent model, they can join this 'decentralized R&D lab' to benefit from the incubation and acceleration services of Alpaca's AI experts (both the team themselves and a community of vetted professionals). Small-time developers can also apply for access to crucial computing power resources.
        </p>
        <p>
          <u><b>PacaLaunch</b></u><br />
          Once the developer is ready to raise funding for their idea, they can present it to the Alpaca community via this decentralized crowdfunding platform - a launchpad specializing in IMOs (Initial Model Offerings). In return, IMO participants benefit from revenue share opportunities once the AI agent hits the marketplace, with their ownership validated on-chain via NFTs. Already there are 50+ AI projects in the pipeline, set to drop on PacaLaunch throughout 2025!
        </p>
        <p>
          <u><b>Paca Marketplace</b></u><br />
          When an AI agent is ready to hit the market, it's deployed onto Alpaca Network's own native marketplace. This will feature a wide range of models - both those incubated by Alpaca and many more from independent developers - for a plethora of different functions. Users such as crypto traders or small business owners can shop around for the ideal solution to meet their needs.
        </p>
        <p>
          <u><b>TaskPaca</b></u><br />
          Perhaps the most innovative and exciting feature of Alpaca Network, this is a decentralized taskboard where AI agents work alongside a community of vetted experts to solve real problems. Users from both Web3 and traditional industries (such as healthcare, logistics, and finance) can post problem-solving requests - along with token bounties - which are then tackled by a network of intelligent programs and 'AI-augmented' human specialists. This is what Alpaca calls 'the AI task layer of Web3'.
        </p>
        <p>$PACA is the native token of Alpaca Network, used as a medium of exchange in the Paca Marketplace, for posting bounties on the TaskPaca platform, and for gaining access to IMOs on PacaLaunch. On top of these utilities, it will also play a crucial role in platform governance: holders will be able to have their say in which AI agent projects receive seed funding, resources, launchpad access, and marketplace listings.</p>
      </div>
  `,
    price: 0.0025,
    tge: 100,
    allocation: 100_000,
    date: 1733832000,
    fcfs: 1733875200,
    end: 1733918400,
    investmentRound: "Public",
    fdv: 3_000_000,
    exchangeListingPrice: 0.0025,
    marketCapAtTGE: 1_360_800,
    socials: [
      { svg: globe, href: "https://alpacanetwork.ai" },
      {
        svg: twitterX,
        href: "https://x.com/AlpacaNetworkAI",
      },
      {
        svg: telegram,
        href: "https://t.me/alpacanetworkai",
      },
    ],
    contract: "0x3A76C6e3e6a0B136eE92b66B9Ba25d099BBC5882",
    abi: LATEST_PARTICIPATOR_TOKENS_ABI,
    // images: [
    //   "/IDOs/smartnodes/1.png",
    //   "/IDOs/smartnodes/2.png",
    //   "/IDOs/smartnodes/3.png",
    //   "/IDOs/smartnodes/4.png",
    //   "/IDOs/smartnodes/5.png",
    //   "/IDOs/smartnodes/6.png",
    // ],
    register: true,
    vestingDescription: "100% TGE unlock, No cliff, No vesting",
    vesting: "0x8C8Fa0152eFF48700c9e10b64aCa1B81f259F54B",
    vestingChain: base,
    vestingABI: VESTING_ABI_V2,
    type: "v3",
    linkedWallet: false,
    ether: false,
    nftsToBlock: [
      107, 212, 213, 214, 215, 216, 217, 218, 502, 544, 831, 876, 877, 941, 980,
      1071, 1073, 1154, 1155, 1156, 1364, 1455, 1462, 1626, 1627, 1629, 1630,
      2120,
    ],
  },
  {
    id: "earnm-r2",
    url: "launchpad-v3/earnm-r2",
    logo: smartnodes,
    idoImageSrc: "/IDOs/earnm.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "BASE",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/BASE.svg",
    projectName: "EARN'M",
    projectListDescription:
      "A Web3 MobileFi rewards ecosystem that allows you to farm the deflationary $EARNM token as a SmartNode operator.",
    projectDescription:
      "$EARNM is a deflationary rewards token from Mode Mobile: the fastest-growing US software company of 2023. Their tech and token is designed for seamless plug-and-play integration with any platform in Web3 or Web2, allowing users to earn for their engagement. Meanwhile, the entire EARN'M ecosystem profits from innovative revenue share and token burn mechanisms.",
    projectTokenSymbol: "$EARNM",
    projectBigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>EARN'M is an exciting new Web3 rewards ecosystem, built by Deloitte's fastest-growing software company of 2023: Mode Mobile. EARN'M is their MobileFi rewards infrastructure which turns smartphones into EarnPhones. With it, users are able to earn hundreds of dollars a month just by completing everyday activities on their phone: listening to music, watching live streams, trading crypto, and more.</p>
        <p>Already the Web2 iteration of the ecosystem has generated strong revenues and drawn in huge clients including Binance and Coinbase. Now they're taking this rewards ecosystem on-chain with their very own token: $EARNM!
        <p>This is the native token of the ecosystem, used for paying out rewards, node operator fees, and platform revenue share rewards. The core mechanism of the EARN'M rewards ecosystem is the Mystery Box: a package earned by platform users which contains vested $EARNM tokens, and can also be pre-loaded with any other custom bonus rewards (both blockchain assets and Web2 prizes).</p>
        <p>These mystery boxes can be integrated into Web2 and Web3 platforms as a way to gamify participation in any kind of activity: listening to music, watching videos, engaging on social media, using a DApp, and so on. Users earn Mystery Boxes, while EARN'M ecosystem participants profit from a revenue share system whenever the prizes inside these boxes are claimed.</p>
        <p>Depending on the vesting schedule chosen by the holder, varying amounts of $EARNM are re-distributed among ecosystem participants and/or burned, removing them from circulation. Ultimately, this model is designed to make $EARNM deflationary over time!</p>
        <p>In addition to this base utility, $EARNM can also be staked in large quantities by partner projects to access white-label versions of EARN'M products.</p>
      </div>
  `,
    price: 0.01,
    tge: 15,
    allocation: 32_077,
    date: 1733490000,
    fcfs: 1733576400,
    end: 1733662800,
    investmentRound: "Round 2 - Tiers",
    fdv: 50_000_000,
    exchangeListingPrice: 0.01,
    marketCapAtTGE: 1_113_000,
    socials: [
      { svg: globe, href: "https://www.earnm.com/" },
      {
        svg: twitterX,
        href: "https://twitter.com/EARNMrewards",
      },
      {
        svg: telegram,
        href: "https://medium.com/earnm",
      },
      {
        svg: discord,
        href: "https://discord.com/invite/earnm",
      },
      {
        svg: medium,
        href: "https://medium.com/earnm",
      },
    ],
    contract: "0x10fAEe84F27Beb0aAEcAA6aDa97fA67d21Dd61e1",
    abi: LATEST_PARTICIPATOR_TOKENS_ABI,
    images: [
      "/IDOs/smartnodes/1.png",
      "/IDOs/smartnodes/2.png",
      "/IDOs/smartnodes/3.png",
      "/IDOs/smartnodes/4.png",
      "/IDOs/smartnodes/5.png",
      "/IDOs/smartnodes/6.png",
    ],
    register: true,
    vestingDescription: "15% TGE unlock, 2-month cliff, 7-month DAILY vesting",
    vesting: "0xC0421C139D8912E68b50523A492Da20aa6C00514",
    vestingChain: base,
    vestingABI: VESTING_ABI_V3,
    type: "v3",
    linkedWallet: false,
    ether: false,
  },
  {
    id: "earnm-r1",
    url: "launchpad-private/earnm-r1",
    logo: smartnodes,
    idoImageSrc: "/IDOs/earnm.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "BASE",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/BASE.svg",
    projectName: "EARN'M",
    projectListDescription:
      "A Web3 MobileFi rewards ecosystem that allows you to farm the deflationary $EARNM token as a SmartNode operator.",
    projectDescription:
      "$EARNM is a deflationary rewards token from Mode Mobile: the fastest-growing US software company of 2023. Their tech and token is designed for seamless plug-and-play integration with any platform in Web3 or Web2, allowing users to earn for their engagement. Meanwhile, the entire EARN'M ecosystem profits from innovative revenue share and token burn mechanisms.",
    projectTokenSymbol: "$EARNM",
    projectBigDescription: `
    <div style="display: flex; flex-direction: column; gap: 15px;">
      <p>EARN'M is an exciting new Web3 rewards ecosystem, built by Deloitte's fastest-growing software company of 2023: Mode Mobile. EARN'M is their MobileFi rewards infrastructure which turns smartphones into EarnPhones. With it, users are able to earn hundreds of dollars a month just by completing everyday activities on their phone: listening to music, watching live streams, trading crypto, and more.</p>
      <p>Already the Web2 iteration of the ecosystem has generated strong revenues and drawn in huge clients including Binance and Coinbase. Now they're taking this rewards ecosystem on-chain with their very own token: $EARNM!
      <p>This is the native token of the ecosystem, used for paying out rewards, node operator fees, and platform revenue share rewards. The core mechanism of the EARN'M rewards ecosystem is the Mystery Box: a package earned by platform users which contains vested $EARNM tokens, and can also be pre-loaded with any other custom bonus rewards (both blockchain assets and Web2 prizes).</p>
      <p>These mystery boxes can be integrated into Web2 and Web3 platforms as a way to gamify participation in any kind of activity: listening to music, watching videos, engaging on social media, using a DApp, and so on. Users earn Mystery Boxes, while EARN'M ecosystem participants profit from a revenue share system whenever the prizes inside these boxes are claimed.</p>
      <p>Depending on the vesting schedule chosen by the holder, varying amounts of $EARNM are re-distributed among ecosystem participants and/or burned, removing them from circulation. Ultimately, this model is designed to make $EARNM deflationary over time!</p>
      <p>In addition to this base utility, $EARNM can also be staked in large quantities by partner projects to access white-label versions of EARN'M products.</p>
    </div>
`,
    price: 0.01,
    tge: 15,
    allocation: 25_000,
    date: 1733400000,
    fcfs: 0,
    end: 1733486400,
    investmentRound: "Round 1 - Whitelist",
    fdv: 50_000_000,
    exchangeListingPrice: 0.01,
    marketCapAtTGE: 1_113_000,
    socials: [
      { svg: globe, href: "https://www.earnm.com/" },
      {
        svg: twitterX,
        href: "https://twitter.com/EARNMrewards",
      },
      {
        svg: telegram,
        href: "https://medium.com/earnm",
      },
      {
        svg: discord,
        href: "https://discord.com/invite/earnm",
      },
      {
        svg: medium,
        href: "https://medium.com/earnm",
      },
    ],
    contract: "0x562f715F49a7D9183Ac8b138B2557dbDD2C3D820",
    abi: PRIVATE_PARTICIPATOR_ABI,
    images: [
      "/IDOs/smartnodes/1.png",
      "/IDOs/smartnodes/2.png",
      "/IDOs/smartnodes/3.png",
      "/IDOs/smartnodes/4.png",
      "/IDOs/smartnodes/5.png",
      "/IDOs/smartnodes/6.png",
    ],
    register: false,
    vestingDescription: "15% TGE unlock, 2-month cliff, 7-month DAILY vesting",
    // vesting: "0x0f2f6ec1e113e45ac368a2ffed60c1956975b2a3",
    // vestingChain: base,
    type: "private",
    linkedWallet: false,
    ether: false,
  },
  {
    id: "dyor",
    url: "launchpad-v3/dyor",
    logo: dyor,
    idoImageSrc: "/IDOs/dyor.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "BASE",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/BASE.svg",
    projectName: "DYOR",
    projectListDescription:
      "DYOR is an integrated 'Web3 command centre' for traders and developers, bringing the best aspects of centralized platforms on chain.",
    projectDescription:
      "Designed to enhance the entire on-chain experience for both traders and project developers, DYOR is a next-generation multi-chain trading, research, marketing, and token management dashboard which combines the best aspects of dozens of existing platforms into one. Already they've secured backing of over 50 top KOLs with a combined audience of over 26 million!",
    projectTokenSymbol: "$DYOR",
    projectBigDescription: `
    <div style="display: flex; flex-direction: column; gap: 15px;">
      <p>The team at DYOR Labs is raising the bar for on-chain user experience, on a mission to replace all of the many outdated, clunky, and expensive platforms which currently have a stranglehold on Web3.</p>
      <p>To do this, they're building an integrated 'Web3 command centre' which brings all of the best aspects of centralized platforms (live customer support, advanced charting/analytics, limit orders, etc.) on chain. Not only that, they're also developing a whole suite of features geared towards developers, allowing them to launch, manage, and market their tokens all from within one unified dashboard.</p>
      <p>For traders, this means access to advanced charting and TA tools, with multi-chart layouts and custom presets. The DYOR DEX and DEX aggregator make use of enhanced features like limit orders and anti-honeypot scam prevention, all designed to make the on-chain trading experience as intuitive and secure as on the very best CEXs. All of this while executing cheaper and faster trades than UniSwap and 1inch.</p>
      <p>For developers, DYOR offers a unified dashboard for every aspect of token creation, liquidity provision, project operations, and community growth. These include enterprise-grade services such as audits, market making, and KOL matchmaking built into the platform, as well as a directory of carefully vetted third-party service providers for everything from copywriting to legal services.</p>
      <p>The 'public beta version of the platform' is already live, with more than 37,000 traders participating so far. Also on board is a veritable army of KOLs who have been brought on board to promote DYOR to the masses.</p>
      <p>All in all, over 50 KOLs are signed on with a combined Twitter following of over 26 million! You'll recognize some familiar names on the list: Lark Davis, Crypto Banter, Ivan on Tech, Altcoin Daily, and many, many more.</p>
    </div>
`,
    price: 0.0105,
    tge: 30,
    allocation: 100_000,
    date: 1732795200,
    fcfs: 0,
    end: 1732795200 + 86400 * 2,
    investmentRound: "Round 2",
    fdv: 10_500_000,
    exchangeListingPrice: 0.0105,
    marketCapAtTGE: 1_249_000,
    socials: [
      {
        svg: globe,
        href: "https://dyorlabs.com",
      },
      {
        svg: twitterX,
        href: "https://twitter.com/DyorLabs_",
      },
      {
        svg: telegram,
        href: "dyorlabs.com",
      },
      { svg: discord, href: "https://discord.gg/PWxkhnAd8A" },
    ],
    contract: "0xf4801b6fE6B77F8C4e4fc2580D82f4E3E2a5aE09",
    abi: PARTICIPATOR_V2_2,
    register: true,
    vestingDescription:
      "30% TGE unlock, 1-month cliff, 5-month Monthly vesting",
    vesting: "0xCFe4E1e1dDB2c5AcaF57Af30271FA2996Bc1aF9F",
    vestingChain: base,
    vestingABI: VESTING_ABI,
    type: "v3",
    linkedWallet: false,
    ether: false,
  },
];

export const IDO_LIST: IDO[] = [
  // {
  //   id: "earnm",
  //   url: "launchpad-private/earnm",
  //   logo: smartnodes,
  //   idoImageSrc: "/IDOs/earnm.png",
  //   acceptedTokenSymbol: "USDC",
  //   tokenNetwork: "Polygon",
  //   crowdsaleNetwork: "BASE",
  //   networkImageSrc: "/chain-logos/polygon.svg",
  //   projectName: "EARN'M",
  //   projectListDescription:
  //     "A Web3 MobileFi rewards ecosystem that allows you to farm the deflationary $EARNM token as a SmartNode operator.",
  //   projectDescription:
  //     "$EARNM is a deflationary rewards token from Mode Mobile: the fastest-growing US software company of 2023. Their tech and token is designed for seamless plug-and-play integration with any platform in Web3 or Web2, allowing users to earn for their engagement. Meanwhile, the entire EARN'M ecosystem profits from innovative revenue share and token burn mechanisms.",
  //   projectTokenSymbol: "$EARNM",
  //   totalAllocation: 25_000,
  //   price: "0.01",
  //   registrationStartsAt: 1730721600,
  //   participationStartsAt: 1730808000,
  //   participationEndsAt: 1730894400,
  //   publicParticipationStartsAt: 0,
  //   publicParticipationEndsAt: 0,
  //   simplified: true,
  //   tgeDate: 1731456000,
  //   tgePercentage: 15,
  //   cliff: 0,
  //   investmentRound: "Private Tier",
  //   fdv: "50000000",
  //   exchangeListingPrice: 0.01,
  //   marketCapAtTGE: 485000,
  //   vesting: "15% TGE unlock, 2-month cliff, 7-month DAILY vesting",
  //   releaseType: "Linear",
  //   currentPhase: simplifiedPhases[1].title,
  //   socials: [
  //     { svg: globe, href: "https://www.earnm.com/" },
  //     {
  //       svg: twitterX,
  //       href: "https://twitter.com/EARNMrewards",
  //     },
  //     {
  //       svg: telegram,
  //       href: "https://medium.com/earnm",
  //     },
  //     {
  //       svg: discord,
  //       href: "https://discord.com/invite/earnm",
  //     },
  //     {
  //       svg: medium,
  //       href: "https://medium.com/earnm",
  //     },
  //   ],
  //   bigDescription: `
  //     <div style="display: flex; flex-direction: column; gap: 15px;">
  //       <p>EARN'M is an exciting new Web3 rewards ecosystem, built by Deloitte's fastest-growing software company of 2023: Mode Mobile. EARN'M is their MobileFi rewards infrastructure which turns smartphones into EarnPhones. With it, users are able to earn hundreds of dollars a month just by completing everyday activities on their phone: listening to music, watching live streams, trading crypto, and more.</p>
  //       <p>Already the Web2 iteration of the ecosystem has generated strong revenues and drawn in huge clients including Binance and Coinbase. Now they're taking this rewards ecosystem on-chain with their very own token: $EARNM!
  //       <p>This is the native token of the ecosystem, used for paying out rewards, node operator fees, and platform revenue share rewards. The core mechanism of the EARN'M rewards ecosystem is the Mystery Box: a package earned by platform users which contains vested $EARNM tokens, and can also be pre-loaded with any other custom bonus rewards (both blockchain assets and Web2 prizes).</p>
  //       <p>These mystery boxes can be integrated into Web2 and Web3 platforms as a way to gamify participation in any kind of activity: listening to music, watching videos, engaging on social media, using a DApp, and so on. Users earn Mystery Boxes, while EARN'M ecosystem participants profit from a revenue share system whenever the prizes inside these boxes are claimed.</p>
  //       <p>Depending on the vesting schedule chosen by the holder, varying amounts of $EARNM are re-distributed among ecosystem participants and/or burned, removing them from circulation. Ultimately, this model is designed to make $EARNM deflationary over time!</p>
  //       <p>In addition to this base utility, $EARNM can also be staked in large quantities by partner projects to access white-label versions of EARN'M products.</p>
  //     </div>
  // `,
  //   contract: "0x562f715F49a7D9183Ac8b138B2557dbDD2C3D820",
  //   abi: PRIVATE_PARTICIPATOR_ABI,
  //   images: [
  //     "/IDOs/smartnodes/1.png",
  //     "/IDOs/smartnodes/2.png",
  //     "/IDOs/smartnodes/3.png",
  //     "/IDOs/smartnodes/4.png",
  //     "/IDOs/smartnodes/5.png",
  //     "/IDOs/smartnodes/6.png",
  //   ],
  //   type: "private",
  // },
  {
    id: "smartnodes",
    url: "launchpad-nodes/smartnodes",
    logo: smartnodes,
    idoImageSrc: "/IDOs/smartnodes.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "Polygon",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/ARBITRUM.svg",
    projectName: "EARN'M SmartNodes",
    projectListDescription:
      "A Web3 MobileFi rewards ecosystem that allows you to farm the deflationary $EARNM token as a SmartNode operator.",
    projectDescription:
      "EARN'M is the Web3 evolution of one of the world's most successful MobileFi rewards ecosystems. Built by Mode Mobile — ranked as North America's 'fastest growing software company 2023' by Deloitte — the EarnApp and EarnPhone are designed to empower consumers to monetize their attention and engagement, earning rewards for simply using their phone.",
    projectTokenSymbol: "NODE",
    totalAllocation: 172,
    price: "175",
    registrationStartsAt: 1729785600,
    participationStartsAt: 1729857600,
    participationEndsAt: 1730116800,
    publicParticipationStartsAt: 0,
    publicParticipationEndsAt: 0,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 0,
    cliff: 0,
    investmentRound: "SmartNodes Tier M",
    fdv: "NOT APPLIED",
    exchangeListingPrice: 0.03,
    marketCapAtTGE: 0,
    vesting: "NOT APPLIED",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      { svg: globe, href: "https://www.earnm.com/" },
      {
        svg: twitterX,
        href: "https://twitter.com/EARNMrewards",
      },
      {
        svg: telegram,
        href: "https://medium.com/earnm",
      },
      {
        svg: discord,
        href: "https://discord.com/invite/earnm",
      },
      {
        svg: medium,
        href: "https://medium.com/earnm",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>Next up on the Samurai Starter launchpad is a dual node and token offering in an exciting new Web3 rewards ecosystem, built by the fastest-growing US software company of 2023: Mode Mobile. EARN'M is their MobileFi rewards infrastructure which turns smartphones into EarnPhones. With it, users are able to earn hundreds of dollars a month just by completing everyday activities on their phone: listening to music, watching live streams, trading crypto, and more.</p>

        <p>Meanwhile, companies in both Web2 and Web3 can incentivize engagement by integrating EARN'M rewards into their platform. Already EARN'M has secured a client base which includes some of the very top names in crypto: Binance, Coinbase, Crypto.com and RobinHood. Not to mention support from some top KOLs including PAID Network's Kyle Chasse. Now they're taking this rewards ecosystem on-chain.</p>

        <p>It's the EARN'M SmartNodes which provide the infrastructure for the rewards platform, essentially functioning as a DePIN layer. A crucial part of the nodes' functionality is bridging the gap between Web2 engagement and Web3 rewards by first validating off-chain activity, then subsequently processing the issuance of on-chain rewards. In return, node buyers enjoy:</p>
        <p>
        • Massive $EARN'M Airdrop: 10% of the EARN'M supply to be airdropped to node buyers, with 20% TGE unlock.<br />
        • Platform Rewards: Consistent $EARN'M rewards paid out through the Mystery Box claim/burn mechanism (up to 30% per box processed).<br />
        • Layer-2 Gas Fees: Once the EARN'M L2 chain is live, node operators will also earn gas fees in addition to their platform rewards.<br />
        • Governance Rights: A quarter of all DAO voting rights belong to node license holders.<br />
        • Free Phone: Buy 3 or more nodes and receive a free physical EarnPhone (max one per wallet).<br />
        • IDO Access: Each node purchased gets you whitelisted for $145 of allocation in our $EARNM token IDO on November 6!
        </p>
      </div>
  `,
    contract: "0x677BaEEbcC12fB0efD4D87BCF41e2e7dF15cdbc6",
    abi: PARTICIPATOR_NFT_V2_ABI,
    images: [
      "/IDOs/smartnodes/1.png",
      "/IDOs/smartnodes/2.png",
      "/IDOs/smartnodes/3.png",
      "/IDOs/smartnodes/4.png",
      "/IDOs/smartnodes/5.png",
      "/IDOs/smartnodes/6.png",
    ],
    type: "NODE",
  },
  {
    id: "xrone",
    url: "launchpad-nodes/xrone",
    logo: xrone,
    idoImageSrc: "/IDOs/xrone.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "Arbitrum",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/ARBITRUM.svg",
    projectName: "XR One",
    projectListDescription:
      "An innovative PvP gaming-centric L3 chain, backed by Animoca Brands and the Arbitrum Foundation.",
    projectDescription:
      "Become a validator on one of the most promising next-gen gaming blockchains, built from the ground up to support competitive player-driven economies, seamless Web3 onboarding, and AI-integrated experiences. XR One is poised to become “the home to the next wave of high-impact PvP Web3 games.",
    projectTokenSymbol: "NODE",
    totalAllocation: 160,
    price: "637",
    registrationStartsAt: 1719410792,
    participationStartsAt: 1728475200,
    participationEndsAt: 1729566000,
    publicParticipationStartsAt: 0,
    publicParticipationEndsAt: 0,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 0,
    cliff: 0,
    investmentRound: "XR ONE Hero Nodes",
    fdv: "NOT APPLIED",
    exchangeListingPrice: 0.03,
    marketCapAtTGE: 0,
    vesting: "NOT APPLIED",
    releaseType: "Linear",
    currentPhase: simplifiedPhases[1].title,
    socials: [
      { svg: globe, href: "https://xrone.network" },
      {
        svg: twitterX,
        href: "https://x.com/XR_Foundation",
      },
      {
        svg: telegram,
        href: "https://t.me/xrfoundation",
      },
      {
        svg: discord,
        href: "https://discord.com/invite/W4BdM6N8xb",
      },
    ],
    bigDescription: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <p>Created by Saltwater Games and backed by Animoca Brands and the Arbitrum Foundation, XR One is a Layer-3 blockchain custom-built for PvP game ecosystems. The chain boasts plug-and-play eSports integrations: smart contracts allowing anyone to effortlessly set up high-stakes matches, tournaments, and leagues where real assets are on the line.</p>
        <p>XR One is also pushing the envelope for AI integrations in Web3 gaming, with advanced native AI dApps and plans to build a GPU processing layer. The adrenaline-laced lifeblood powering all of this is the chain's native token: $XR.</p>
        <p>Hero Nodes are the validators of the XR One blockchain. Operators will enjoy a wealth of rewards in $XR and other assets:</p>
        <p>- $XR Incentives: 15% of the $XR token supply, paid out over the first 30 months.</p>
        <p>- $XR Airdrop: Hero Node holders will get a dedicated 25% cut of the airdrop in Q4.</p>
        <p>- Transaction Fees: 100% of txn fees go to node operators.</p>
        <p>- Ecosystem Airdrops: Free tokens from new projects deploying on XR One.</p>
        <p>- Priority Access: First-dibs access to new XR One features, games, and partner sales.</p>
        <p>- GPU Rewards: In future, node operators will also be able to contribute processing power to the XR One GPU DePIN layer.</p>
      </div>
  `,
    contract: "0xe0012252B7A08Bc7a2Fcd7F3bE9292da7C2C0063",
    abi: PARTICIPATOR_NFT_V2_ABI,
    type: "NODE",
  },
  {
    id: "nexis-tier-1",
    url: "launchpad-nft-open/nexis-tier-1",
    logo: nexis,
    idoImageSrc: "/IDOs/nexis.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "TBA",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "TBA",
    projectName: "Nexis Network Nodes",
    projectListDescription:
      "Nexis Network is an innovative new Layer-1 blockchain, tailored to host the next generation of data-intensive AI and RWA applications.",
    projectDescription:
      "Nexis' mission is to build a secure, scalable, lightning-fast blockchain which solves all of the problems currently inhibiting the growth of AI projects in Web3. With block confirmations five times faster than Solana (and for a third of the cost) they're building the blockchain infrastructure needed to meet the high data demands of next-gen machine learning and RWA projects.",
    projectTokenSymbol: "NFT",
    totalAllocation: 400,
    price: "50",
    registrationStartsAt: 1724331600,
    participationStartsAt: 1724335200,
    participationEndsAt: 1724335200 + 86400 * 4,
    publicParticipationStartsAt: 0,
    publicParticipationEndsAt: 0,
    simplified: true,
    tgeDate: 0,
    tgePercentage: 7,
    cliff: 86400 * 30,
    investmentRound: "Tier 1",
    fdv: "30000000",
    exchangeListingPrice: 0.03,
    marketCapAtTGE: 650250,
    vesting: "NOT APPLIED",
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
    contract: "0xb5Ef6bd1e7346DcaaDDd3E4d53Cd126f1EF50e1F",
    abi: PARTICIPATOR_NFT_OPEN,
    // images: [
    //   "/IDOs/orangedx/1.png",
    //   "/IDOs/orangedx/2.png",
    //   "/IDOs/orangedx/3.png",
    //   "/IDOs/orangedx/4.png",
    // ],
    type: "NFT-OPEN",
  },
  {
    id: "nexis",
    url: "launchpad-v2/nexis",
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
      "Nexis' mission is to build a secure, scalable, lightning-fast blockchain which solves all of the problems currently inhibiting the growth of AI projects in Web3. With block confirmations five times faster than Solana (and for a third of the cost) they're building the blockchain infrastructure needed to meet the high data demands of next-gen machine learning and RWA projects.",
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
    id: "kvants",
    url: "launchpad-v2/kvants",
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
    id: "mpad-round2",
    url: "launchpad-v2/mpad-round2",
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
    id: "memepad",
    url: "launchpad-v2/memepad",
    logo: memepad,
    idoImageSrc: "/IDOs/memepad.png",
    acceptedTokenSymbol: "USDC",
    tokenNetwork: "Solana",
    crowdsaleNetwork: "BASE",
    networkImageSrc: "/chain-logos/solana.svg",
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
    id: "artx",
    url: "launchpad-nft-eth/artx",
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
    id: "kip-protocol",
    url: "launchpad-nft/kip-protocol",
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
    id: "unibit",
    url: "launchpad/unibit",
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
    id: "interswap",
    url: "launchpad/interswap",
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
    id: "orangedx",
    url: "launchpad/orangedx",
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
      "OrangeDX is setting out to conquer the brave new world of Bitcoin-based DeFi and gain first-mover advantage over the competition. They've developed a complete range of DeFi solutions to unite the worlds of BRC-20 and ERC-20, all powered by the $O4DX token.",
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
    id: "hauntedspace-gaga",
    url: "launchpad/hauntedspace-gaga",
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
    id: "havens-compass",
    url: "launchpad/havens-compass",
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
// export const SAM_CLAIM_VESTING = "0xc0c3F2c99AD524310EF46BF15d3352480f1E9B4C"; // TEST BSC
// export const SAM_CLAIM_VESTING = "0xDD687b579c5C542A14874e79E404b83E78e6E18a"; // BASE MAINNET OLD
export const SAM_CLAIM_VESTING = "0xA6a638858C114Ad2e95BFD787b353EC2C70d78eF"; // BASE MAINNET

// export const SAM_CLAIM_VESTING = "0xE42c1929612bBc03572C518bAf05c38147D5d67e"; // BASE SEPOLIA
// export const SAM_TIERS = "0x2Bb8Fc0196becd84bac853E32c9c252343699186"; // Newest
export const SAM_TIERS = "0x2Bb8Fc0196becd84bac853E32c9c252343699186"; // with MULTIPLIER
export const POINTS = "0xDf0fDc572849f01CdaB35b80cA41Ce67051C8Dfe"; // BASE
export const NFT_LOCK = "0x45c085699fe78873d5c28b02d153cfd90379e424"; // BASE
