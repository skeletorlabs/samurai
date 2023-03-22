import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/utils/constants";

export default function Footer() {
  return (
    <div className="h-80 bg-black px-8 bg-gradient-to-t from-samurai-red via-transparent to-transparent opacity-70 border-t border-zinc-800">
      <div className="flex items-center">
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
          <span className="ml-3 mt-[100px] mb-10 font-thin text-sm">
            © 2023 Samurai Starter
          </span>
        </div>
      </div>
    </div>
  );
}
