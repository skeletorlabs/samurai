import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/app/utils/constants";
import { linkedin, twitter, twitterX } from "@/app/utils/svgs";
import SSButton from "./ssButton";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const links = [
  { title: "SamNFT", href: "/nft" },
  { title: "Launchpad", href: "/launchpad" },
  { title: "Sanka", href: "/#sanka" },
  { title: "Tokens", href: "/tokens" },
  // { title: "$SAM Liquidity", href: "#" },
  { title: "Incubation", href: "/incubation" },
];

export default function Footer() {
  return (
    <div className="flex flex-col justify-center lg:items-center w-full h-[350px] lg:h-[300px] pb-20 pt-4 lg:pb-0 lg:pt-10 lg:h-70 border-t-[0.5px] border-zinc-700">
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between lg:items-center gap-2 lg:gap-10 w-full px-6 lg:px-8 xl:px-14">
        <Link
          href="/"
          className="transition-all hover:opacity-75 w-full flex justify-center lg:justify-start lg:mt-[-4px]"
        >
          <Image
            src="/logo.svg"
            width={0}
            height={0}
            alt="logo"
            className="min-w-[300px] lg:min-w-[340px] transition-colors grayscale hover:grayscale-0"
          />
        </Link>

        <div className="flex h-full w-full justify-center items-center text-center gap-4 font-light text-xs lg:text-md 2xl:text-xl flex-wrap text-gray-400 mt-5 lg:mt-0">
          {links.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="hover:border-b max-h-[25px]"
            >
              {item.title}
            </Link>
          ))}
          <Link
            target="blank"
            href="https://v1.samuraistarter.com"
            className="hover:border-b max-h-[25px]"
          >
            V1
          </Link>
        </div>

        <div className="flex items-center justify-center lg:justify-end w-full gap-4 flex-wrap lg:flex-nowrap opacity-75">
          {SOCIALS.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`transition-all hover:opacity-75 scale-[0.8] lg:scale-[0.9] hover:scale-110 ${
                item.svg === linkedin ? "scale-[0.7]" : ""
              }`}
              target="blank"
            >
              {item.svg}
            </Link>
          ))}
        </div>
      </div>
      <div
        className={`flex flex-col items-center justify-center bg-neutral-900 w-full h-full mt-10 text-white/70 ${inter.className}`}
      >
        <Link target="blank" href="mailto:hello@samuraistarter.com">
          Contact us -{" "}
          <span className="hover:underline">hello@samuraistarter.com</span>
        </Link>
        <span className="font-light opacity-75">© 2025 Samurai Starter</span>
      </div>
    </div>
  );
}
