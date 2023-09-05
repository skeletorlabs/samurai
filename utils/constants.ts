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
    title: 'Home',
    href: '/',
    icon: home,
    page: Page.home,
  },
  {
    title: 'SamNFT',
    href: '/nft',
    icon: nft,
    page: Page.nft,
  },
  {
    title: 'Launchpad',
    href: '/launchpad',
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
    title: 'Tokens',
    href: '/tokens',
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
  {
    svg: twitter,
    href: 'https://twitter.com/SamuraiStarter',
    class: 'scale-100',
  },
  { svg: telegram, href: 'https://t.me/SamuraiLaunchpad', class: 'scale-100' },
  {
    svg: medium,
    href: 'https://medium.com/samurai-starter',
    class: 'scale-100',
  },
  {
    svg: linkedin,
    href: 'https://www.linkedin.com/company/samurai-starter/',
    class: 'scale-50',
  },
]

export const BASE_API_URL = 'https://samuraistarter.com/api/v1'
