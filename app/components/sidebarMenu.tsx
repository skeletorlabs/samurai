"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { StateContext } from "../context/StateContext";
import Image from "next/image";
import { NAV } from "../utils/constants";
import { usePathname } from "next/navigation";
import { Page } from "../utils/enums";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import classNames from "classnames";
import { samurai, samurai_xs } from "@/public/IDOs/svgs";

export default function SidebarMenu() {
  const [open, setOpen] = useState(false);
  const [arrowVisible, setArrowVisible] = useState(false);
  const { page, setPage, chain } = useContext(StateContext);
  const pathname = usePathname();

  return (
    <div
      className="min-w-[70px] max-w-[200px] bg-black border-r border-white/20 text-white"
      onMouseOver={() => setArrowVisible(true)}
      onMouseOut={() => setArrowVisible(false)}
    >
      <div className="flex flex-col items-center  pt-10">
        <div
          className={`${
            arrowVisible ? "visible" : "invisible"
          } flex items-center justify-center w-6 h-6 rounded-full cursor-pointer bg-white/20`}
          onClick={() => setOpen(!open)}
        >
          <BiChevronRight
            size={20}
            className={classNames({ "rotate-180": open })}
          />
        </div>
        <Link
          href="/"
          className="w-full transition-all hover:scale-110 hover:opacity-90 mb-10"
        >
          {samurai_xs}
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex w-full h-[60px] justify-center items-center hover:border-l border-samurai-red hover:bg-white/20
              ${
                page === item.page ||
                (pathname.includes(item.href) && item.href !== "/")
                  ? "text-samurai-red"
                  : ""
              }
            `}
            onClick={() => setPage(item.page)}
          >
            {/* {item.title} */}
            <div className="w-6">{item.icon}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
