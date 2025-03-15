"use client";
import Link from "next/link";
import { NAV } from "@/app/utils/constants";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/app/context/StateContext";
import { Turn as Hamburger } from "hamburger-react";
import Image from "next/image";
import ConnectButton from "./connectbutton";

export default function Burger() {
  const [isOpen, setOpen] = useState(false);
  const { page } = useContext(StateContext);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      <nav
        className={`${
          isOpen ? "fixed top-0 left-0 w-screen h-screen" : "hidden"
        } lg:hidden bg-black/70 backdrop-blur-md z-50`}
      >
        <div className="flex flex-col justify-center w-max h-full mx-auto gap-5 text-4xl">
          <div className="flex flex-col mb-10 gap-3">
            <Image
              src="/logo.svg"
              width={0}
              height={0}
              alt="logo"
              className="min-w-[300px]"
            />
            <ConnectButton mobile />
          </div>

          {NAV.map((item, index) => (
            <Link
              onClick={() => setOpen(false)}
              key={index}
              href={item.href}
              className={`transition-all ${
                item.page === page
                  ? "text-white "
                  : "text-white/40 hover:text-white/60 hover:scale-x-110"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className="w-[42px] h-[42px]">{item.icon}</div>
                <span>{item.title.toUpperCase()}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>
      <nav className="fixed lg:hidden bottom-5 right-5 w-12 h-12 z-50 text-white bg-samurai-red rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110">
        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
          direction="right"
          size={20}
        />
      </nav>
    </>
  );
}
