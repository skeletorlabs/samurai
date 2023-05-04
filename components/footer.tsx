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
    <div className="h-[500px] md:h-60 px-4 lg:px-8 border-t-[0.5px] border-zinc-800">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex flex-col items-center lg:items-start">
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

          <div className="flex items-center justify-center w-full lg:justify-start gap-10 px-24 lg:px-6">
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
        <div className="hidden lg:flex flex-col h-full w-full mt-[50px] gap-[47px] text-white">
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
        <div className="py-5">
          <script
            src="//web.webformscr.com/apps/fc3/build/loader.js"
            async
            sp-form-id="0229cc821b515da43f09d3b34f142798efa2f98d40eb42d322744cb90dca5100"
          ></script>
        </div>
      </div>
    </div>
  );
}
