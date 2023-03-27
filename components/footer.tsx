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
    <div className="h-60 px-8 border-t-[0.5px] border-zinc-800">
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
              className="mr-10 mt-[12px] mb-2 w-[400px] h-[100px]"
            />
          </Link>

          <div className="flex items-center gap-10 ml-5">
            {SOCIALS.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="transition-all hover:opacity-75 scale-[1.5]"
                target="_blank"
              >
                {item.svg}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col h-full w-full mt-[50px] gap-[47px] text-white">
          <div className="flex h-full justify-end w-full gap-4 font-light text-lg flex-wrap">
            {links.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:border-b max-h-[25px]"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <span className="flex ml-3 font-light text-md justify-end">
            © 2023 Samurai Starter
          </span>
        </div>
      </div>
    </div>
  );
}
