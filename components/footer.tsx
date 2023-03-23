import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/utils/constants";

const links = [
  { title: "Launchpad", href: "#" },
  { title: "Sanka", href: "#" },
  { title: "SamNFT", href: "#" },
  { title: "Tokens", href: "#" },
  { title: "$SAM Liquidity", href: "#" },
  { title: "Incubation", href: "#" },
];

export default function Footer() {
  return (
    <div className="h-60 bg-black px-8 bg-gradient-to-t from-gray-500 via-transparent to-transparent opacity-70 border-t border-zinc-800">
      <div className="flex gap-10">
        <div className="flex flex-col">
          <Link
            href="/"
            className="transition-all hover:opacity-75"
            onClick={() => {}}
          >
            <Image
              src="/logo.svg"
              width={0}
              height={0}
              alt="logo"
              className="mr-10 mt-12 mb-6 w-[200px] h-[50px]"
            />
          </Link>

          <div className="flex items-center gap-6 ml-3 mt-[0px]">
            {SOCIALS.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="transition-all hover:opacity-75"
                target="_blank"
              >
                {item.svg}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col h-full w-full mt-[62px] gap-10 text-white">
          <div className="flex h-full justify-end w-full gap-4 font-light text-sm flex-wrap">
            {links.map((item, index) => (
              <Link key={index} href={item.href} className="hover:border-b">
                {item.title}
              </Link>
            ))}
          </div>
          <span className="flex ml-3 font-thin text-sm justify-end">
            © 2023 Samurai Starter
          </span>
        </div>
      </div>
    </div>
  );
}
