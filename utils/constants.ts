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
      "Tarnished gold, worn smooth by generations of grasping hands, the token whispered of lineage and loss. An intricate crest emblazoned its face, a faded reminder of a once-proud noble house. Now, clutched in a calloused palm, it was a beacon of hope, a promise of reclaiming a birthright stolen by time and treachery.",
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
    bigDescription: `Moonlight kissed the silver surface of the token, revealing intricate runes that danced in the shadows. Each twist and curve seemed to whisper forgotten secrets, tales of fallen empires and untold power. Its origin shrouded in mist, it had become a legend whispered amongst dusty tomes and firelit taverns. Was it the key to a celestial vault, its contents promising dominion over the stars? Or a harbinger of a cosmic storm, its touch sparking a chain reaction of celestial upheaval?

    Rumors swirled around the token like moths drawn to a flame. A band of treasure hunters believed it the map to a lost library carved into the side of a rogue moon. A reclusive scholar suspected it a conduit to converse with long-dead civilizations. Even whispers of dark cults and ancient pacts with otherworldly entities clung to its cold silver.
    
    For Anya, a young woman with wanderlust etched into her soul, the token was a call. The thrill of the unknown, the promise of answers to questions both spoken and unspoken, pulsed through her veins like the token's faint hum. It beckoned her from the dusty comfort of her village, whispering of adventures etched in constellations and battles waged across the fabric of time.
    
    Anya grasped the token, its chill seeping into her bones. Her heart, a drum against her ribs, echoed the token's rhythm. This was no mere heirloom, no trinket to boast about in firelit taverns. This was a compass, a promise etched in silver, an invitation to a dance with the cosmos itself. With a deep breath, Anya stepped out into the night, the token her guiding star, ready to chase the whispers into the unknown.
`,
    contract: "",
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
      "Glimmering silver, etched with runes unknown, the token pulsed with unseen energy. Whispers followed its journey, tales of forgotten empires and untold power. Was it key to a celestial vault, or a harbinger of impending doom? Each touch sent shivers down the spine, urging the bearer towards a destiny both thrilling and terrifying.",
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
    bigDescription: `
    The weight of centuries pressed into Anya's palm as she clutched the tarnished gold token. Its once-proud crest, bearing the sigil of a roaring griffin, was now a faded whisper against the worn metal. Yet, to Anya, it wasn't just an artifact, it was a birthright, a tangible thread tethering her to a lineage stolen by time and treachery.

Legends whispered of House Griffin, once rulers of a vast swathe of land, their banners heralding justice and prosperity. Then, whispers turned to screams, as a rival house, fueled by envy and avarice, struck in the dead of night. The Griffins were scattered, their lands seized, their legacy buried beneath the dust of ages.

The token, passed down through generations in secret, was Anya's only connection to this lost legacy. It wasn't just metal; it was a promise, a flicker of hope that the Griffin line could rise again. Anya could almost hear the whispers of her ancestors, their voices urging her to reclaim what was rightfully theirs.

She traced the worn crest with her thumb, a silent vow burning in her eyes. She would learn the forgotten history of her house, uncover the truth behind their fall. She would find the descendants, scattered like seeds on the wind, and reunite them under the banner of the griffin. Anya wouldn't be just a whisper in the annals of history; she would be the roar that reawakened a slumbering legacy.

But the path wouldn't be easy. Anya knew whispers often preceded shadows, and those who had stolen her birthright wouldn't relinquish it without a fight. Yet, with the tarnished token clutched in her hand, a beacon of defiance against the tide of time, Anya was ready to face whatever awaited. The fire of the griffin burned bright within her, a promise to reclaim what was lost, a song of vengeance etched in gold.
`,

    contract: "",
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
      "Shimmering like a captured sunset, the token thrummed with the promise of worlds unseen. Held beneath a starlit sky, it revealed constellations unknown, their patterns echoing alien landscapes. A single touch sent a jolt of anticipation, beckoning the curious towards a shimmering gateway, a threshold to the impossible.",
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
    bigDescription: `
    The weight of centuries pressed into Anya's palm as she clutched the tarnished gold token. Its once-proud crest, bearing the sigil of a roaring griffin, was now a faded whisper against the worn metal. Yet, to Anya, it wasn't just an artifact, it was a birthright, a tangible thread tethering her to a lineage stolen by time and treachery.

Legends whispered of House Griffin, once rulers of a vast swathe of land, their banners heralding justice and prosperity. Then, whispers turned to screams, as a rival house, fueled by envy and avarice, struck in the dead of night. The Griffins were scattered, their lands seized, their legacy buried beneath the dust of ages.

The token, passed down through generations in secret, was Anya's only connection to this lost legacy. It wasn't just metal; it was a promise, a flicker of hope that the Griffin line could rise again. Anya could almost hear the whispers of her ancestors, their voices urging her to reclaim what was rightfully theirs.

She traced the worn crest with her thumb, a silent vow burning in her eyes. She would learn the forgotten history of her house, uncover the truth behind their fall. She would find the descendants, scattered like seeds on the wind, and reunite them under the banner of the griffin. Anya wouldn't be just a whisper in the annals of history; she would be the roar that reawakened a slumbering legacy.

But the path wouldn't be easy. Anya knew whispers often preceded shadows, and those who had stolen her birthright wouldn't relinquish it without a fight. Yet, with the tarnished token clutched in her hand, a beacon of defiance against the tide of time, Anya was ready to face whatever awaited. The fire of the griffin burned bright within her, a promise to reclaim what was lost, a song of vengeance etched in gold.
`,
    contract: "",
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
