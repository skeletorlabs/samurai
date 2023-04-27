import {
  medium,
  twitter,
  telegram,
  discord,
  linkedin,
  home,
} from '@/utils/svgs'

export const NAV = [
  {
    title: 'SamNFT',
    href: '#',
    iconHref: '/nft-icon.svg',
  },
  {
    title: 'Launchpad',
    href: 'launchpad',
    iconHref: '/rocketship-icon.svg',
  },
  {
    title: 'Sanka',
    href: '#',
    iconHref: '/knife-icon.svg',
  },
  {
    title: 'Tokens',
    href: '#',
    iconHref: '/coin-icon.svg',
  },
  {
    title: 'Incubation',
    href: '/incubation',
    iconHref: '/incubation-icon.svg',
  },
]

export const SOCIALS = [
  { svg: twitter, href: 'https://twitter.com/cyberfi_tech' },
  { svg: telegram, href: 'https://t.me/SamuraiLaunchpad' },
  { svg: medium, href: 'https://medium.com/samurai-starter' },
  { svg: linkedin, href: 'https://www.linkedin.com/company/samurai-starter/' },
]

export const BASE_API_URL = 'https://samuraistarter.com/api/v1'
