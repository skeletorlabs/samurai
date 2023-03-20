import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/utils/constants";

export default function Footer() {
  return (
    <div className="h-60 bg-black px-8 border-t-[0.5px] border-red-500">
      <div className="flex items-center">
        <div className="flex flex-col">
          <Link
            href="/"
            className="transition-all hover:opacity-75"
            onClick={() => {}}
          >
            <Image
              src="/logo.svg"
              width={300}
              height={100}
              alt="logo"
              className="mr-10"
            />
          </Link>

          <div className="flex items-center gap-8 ml-12 mt-[-10px]">
            {SOCIALS.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="transition-all hover:opacity-75"
                onClick={() => {}}
              >
                {item.svg}
              </Link>
            ))}
          </div>
          <span className="ml-12 mt-20 font-thin text-sm">
            © 2023 Samurai Starter
          </span>
        </div>
      </div>
    </div>
  );
}
