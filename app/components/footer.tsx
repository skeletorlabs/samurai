import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/app/utils/constants";
import { linkedin, twitter } from "@/app/utils/svgs";
import SSButton from "./ssButton";

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
    <div className="w-full h-[300px] lg:h-60 px-4 lg:px-8 border-t-[0.5px] border-zinc-700">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex flex-col items-center lg:items-start">
          <Link href="/" className="transition-all hover:opacity-75">
            <Image
              src="/logo.svg"
              // placeholder="blur"
              // blurDataURL="/logo.svg"
              width={0}
              height={0}
              alt="logo"
              className="md:mr-10 mt-10 mb-3 md:mb-6 w-[300px]"
            />
          </Link>

          <div className="flex items-center justify-center w-full lg:justify-start gap-6 md:gap-10 lg:px-5 flex-wrap lg:flex-nowrap scale-75 md:scale-100">
            {SOCIALS.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`transition-all hover:opacity-75 text-white ${
                  item.svg === linkedin
                    ? "scale-[1.08]"
                    : item.svg === twitter
                    ? "scale-[1.2]"
                    : "scale-[1.3]"
                }`}
                target="blank"
              >
                {item.svg}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col h-full w-full lg:mt-[50px] gap-[47px] text-white">
          <div className="hidden lg:flex h-full justify-end w-full gap-4 font-light text-lg flex-wrap">
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
          <div className="flex mt-[-14px] lg:mt-0 lg:ml-3 gap-5 font-light text-md justify-center lg:justify-end">
            <span>© 2024 Samurai Starter</span>
            <Link
              target="blank"
              href="https://v1.samuraistarter.com"
              className="lg:hidden hover:border-b max-h-[25px]"
            >
              V1
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
