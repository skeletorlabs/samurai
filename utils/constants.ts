import {
  medium,
  twitter,
  telegram,
  discord,
  linkedin,
  home,
  nft,
  rocket,
  sanka,
  token,
  incubation,
} from '@/utils/svgs'
import { Page } from './enums'

export const NAV = [
  {
    title: 'SamNFT',
    href: '#',
    icon: nft,
    page: Page.nft,
  },
  {
    title: 'Launchpad',
    href: '/launchpad',
    icon: rocket,
    page: Page.launchpad,
  },
  {
    title: 'Sanka',
    href: '#',
    icon: sanka,
    page: Page.sanka,
  },
  {
    title: 'Tokens',
    href: '#',
    icon: token,
    page: Page.tokens,
  },
  {
    title: 'Incubation',
    href: '/incubation',
    icon: incubation,
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
