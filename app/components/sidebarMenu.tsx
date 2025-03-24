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
      className="hidden lg:flex bg-black border-r border-white/20 text-white"
      onMouseOver={() => setArrowVisible(true)}
      onMouseOut={() => setArrowVisible(false)}
    >
      <div
        className={classNames({
          "flex flex-col items-center pt-10 transition-all": true,
          "w-[60px] 2xl:w-[70px]": !open,
          "w-[200px] 2xl:w-[220px]": open,
        })}
      >
        <div
          className={classNames({
            "flex items-center justify-center w-6 h-6 rounded-full cursor-pointer bg-white/20":
              true,
            visible: arrowVisible,
            invisible: !arrowVisible,
            "self-end mr-2": open,
          })}
          onClick={() => setOpen(!open)}
        >
          <BiChevronRight
            size={20}
            className={classNames({ "rotate-180": open })}
          />
        </div>
        <Link
          href="/"
          className={classNames({
            "flex flex-col transition-all hover:scale-110 hover:opacity-90 my-10":
              true,
            "w-[50px] 2xl:w-[60px]": !open,
            "w-[140px] 2xl:w-[160px]": open,
          })}
        >
          {samurai_xs}
          {open && (
            <Image src="/logo-text.svg" width={220} height={0} alt="logo" />
          )}
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={classNames({
              "flex w-full h-[55px] 2xl:h-[60px] items-center border-samurai-red hover:bg-white/10 transition-all":
                true,
              "text-samurai-red border-l bg-white/10":
                page === item.page ||
                (pathname.includes(item.href) && item.href !== "/"),
              "justify-center": !open,
              "gap-5 pl-8": open,
            })}
            onClick={() => setPage(item.page)}
          >
            <span className="w-5 h-5 2xl:w-6 2xl:h-6">{item.icon}</span>
            <span
              className={classNames({
                "transition-all": true,
                flex: open,
                hidden: !open,
              })}
            >
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
