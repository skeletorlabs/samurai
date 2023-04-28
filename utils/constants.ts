import {
  medium,
  twitter,
  telegram,
  discord,
  linkedin,
  home,
} from '@/utils/svgs'
import { Page } from './enums'

export const NAV = [
  {
    title: 'SamNFT',
    href: '#',
    iconHref: '/nft-icon.svg',
    page: Page.nft,
  },
  {
    title: 'Launchpad',
    href: '/launchpad',
    iconHref: '/rocketship-icon.svg',
    page: Page.launchpad,
  },
  {
    title: 'Sanka',
    href: '#',
    iconHref: '/knife-icon.svg',
    page: Page.sanka,
  },
  {
    title: 'Tokens',
    href: '#',
    iconHref: '/coin-icon.svg',
    page: Page.tokens,
  },
  {
    title: 'Incubation',
    href: '/incubation',
    iconHref: '/incubation-icon.svg',
    page: Page.incubation,
  },
]

export const SOCIALS = [
  { svg: twitter, href: 'https://twitter.com/cyberfi_tech' },
  { svg: telegram, href: 'https://t.me/SamuraiLaunchpad' },
  { svg: medium, href: 'https://medium.com/samurai-starter' },
  { svg: linkedin, href: 'https://www.linkedin.com/company/samurai-starter/' },
]

export const BASE_API_URL = 'https://samuraistarter.com/api/v1'
