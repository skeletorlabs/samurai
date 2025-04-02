import { Inter } from "next/font/google";
import { formattedDate, formattedDate2 } from "@/app/utils/formattedDate";
import Image from "next/image";
import {
  IDO_v3,
  StringToBoolean,
  StringToNumber,
  StringToString,
} from "@/app/utils/interfaces";
import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

const inter = Inter({
  subsets: ["latin"],
});

interface UserList {
  IDOs: IDO_v3[];
  allocations: StringToNumber;
  phases: StringToString;
  tgesUnlocked: StringToBoolean;
  tgesClaimed: StringToBoolean;
  filterChain: string;
  filterStatus: string;
  onResetFilters: () => void;
}

export default function UserList({
  IDOs,
  allocations,
  phases,
  tgesUnlocked,
  tgesClaimed,
  filterChain,
  filterStatus,
  onResetFilters,
}: UserList) {
  const [idoList, setIdoList] = useState<IDO_v3[]>([]);

  const goToIdo = (url: string) => {
    window.location.href = url;
  };

  const filter = useCallback(() => {
    let list = [...IDOs];

    if (filterChain !== "All Networks")
      list = list.filter((item) => item.tokenNetwork?.name === filterChain);

    switch (filterStatus) {
      case "Vesting":
        list = list.filter((item) => phases[item.id] === "Vesting");
        break;
      case "Completed":
        list = list.filter((item) => phases[item.id] === "Completed");
        break;
      case "TGE Unlocked":
        list = list.filter((item) => tgesUnlocked[item.id]);
        break;
      case "TGE Claimed":
        list = list.filter((item) => tgesClaimed[item.id]);
        break;
      default:
        break;
    }

    setIdoList(list);
  }, [filterChain, filterStatus, setIdoList]);

  useEffect(() => {
    filter();
  }, [filterChain, filterStatus]);

  useEffect(() => {
    filter();
  }, []);

  return (
    <div className={`overflow-x-auto ${inter.className}`}>
      {idoList.length > 0 ? (
        <>
          {/* DESKTOP */}
          <table className="hidden lg:block w-full text-white border-collapse">
            <thead>
              <tr className="bg-white/10 text-left px-2 lg:px-8 xl:px-16">
                <th className="p-4 px-2 lg:px-8 xl:px-16 text-samurai-red">
                  Project
                </th>
                <th className="p-4 px-2 lg:px-8 xl:px-12 text-samurai-red">
                  Network
                </th>
                <th className="p-4 px-2 lg:px-8 xl:px-16 text-samurai-red">
                  Allocated
                </th>
                <th className="p-4 px-2 lg:px-8 xl:px-16 text-samurai-red">
                  TGE Date
                </th>
                <th className="p-4 px-2 lg:px-8 xl:px-16 text-samurai-red">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody>
              {idoList.map((ido, index) => (
                <tr
                  key={index}
                  className={`odd:bg-neutral-800 even:bg-white/5 border-t border-white/20 transition-all odd:hover:opacity-85 even:hover:bg-white/10 hover:cursor-pointer`}
                  onClick={() => goToIdo(ido.url)}
                >
                  <td className="p-4 flex items-center gap-5 lg:px-8 xl:px-16">
                    <Image
                      src={ido?.idoImageSrc}
                      alt={ido?.projectName}
                      width={50}
                      height={50}
                      className="rounded-full w-[60px] h-[60px] border border-white/30 bg-black/50 p-1"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-bold">{ido?.projectName}</p>
                      <p className="bg-white/10 text-white rounded-full px-3 py-[2px] text-xs border border-white/20 w-max">
                        {phases[ido.id]}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 lg:px-8 xl:px-12">
                    <div className="flex items-center gap-3 text-sm border border-white/20 bg-white/10 rounded-full py-[6px] px-5 w-max">
                      <Image
                        src={ido?.networkImageSrc}
                        alt={ido?.projectName}
                        width={20}
                        height={20}
                        className="rounded-full bg-black/60 border border-white/20"
                      />
                      <span>{ido?.tokenNetwork.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-lg lg:px-8 xl:px-16">
                    {allocations[ido.id].toLocaleString("en-us")} USDC
                  </td>
                  <td className="p-4 text-lg lg:px-8 xl:px-16">
                    {formattedDate2(ido?.end)}
                    <br />
                    {(ido.vesting ||
                      ido.id === "grizzy" ||
                      ido.id === "grizzy-private") && (
                      <div className="flex items-center gap-1 text-xs">
                        <span
                          className={classNames({
                            "flex justify-center items-center p-1 px-2 rounded-full":
                              true,
                            "bg-green-500": tgesUnlocked[ido.id],
                            "bg-samurai-red": !tgesUnlocked[ido.id],
                          })}
                        >
                          {tgesUnlocked[ido.id] === true
                            ? "Unlocked"
                            : "Locked"}
                        </span>
                        <span
                          className={classNames({
                            "flex justify-center items-center p-1 px-2 rounded-full":
                              true,
                            "bg-green-500": tgesClaimed[ido.id],
                            "bg-samurai-red": !tgesClaimed[ido.id],
                          })}
                        >
                          {tgesClaimed[ido.id] === true
                            ? "Claimed"
                            : "Not Claimed"}
                        </span>
                        <span
                          className={classNames({
                            "justify-center items-center p-1 px-2 rounded-full bg-green-500":
                              true,
                            flex:
                              ido.id === "grizzy" ||
                              ido.id === "grizzy-private",
                            hidden: ido.id !== "grizzy" || ido.id !== "grizzy",
                          })}
                        >
                          Refunded
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-lg lg:px-8 xl:px-16">
                    {ido?.vestingDescription}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MOBILE */}
          <div className="flex lg:hidden flex-col gap-2">
            {idoList.map((ido, index) => (
              <div
                key={index}
                className={`flex flex-col odd:bg-neutral-800 even:bg-white/5 border-t border-white/20 transition-all odd:hover:opacity-85 even:hover:bg-white/10 hover:cursor-pointer`}
                onClick={() => goToIdo(ido.url)}
              >
                <p className="p-4 flex items-center gap-5 lg:px-8 xl:px-16">
                  <Image
                    src={ido?.idoImageSrc}
                    alt={ido?.projectName}
                    width={50}
                    height={50}
                    className="rounded-full w-[60px] h-[60px] border border-white/30 bg-black/50 p-1"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">{ido?.projectName}</p>
                    <div className="flex items-center gap-2">
                      <p className="bg-white/10 text-white rounded-full px-3 py-[2px] text-xs border border-white/20 w-max">
                        {phases[ido.id]}
                      </p>
                      <div className="flex items-center gap-1 text-sm border border-white/20 bg-white/10 rounded-full py-[2px] px-3 w-max">
                        <Image
                          src={ido?.networkImageSrc}
                          alt={ido?.projectName}
                          width={14}
                          height={14}
                          className="rounded-full bg-black/60 border border-white/20"
                        />
                        <span className="text-xs">
                          {ido?.tokenNetwork.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </p>
                <p className="flex flex-col py-3 px-4 text-lg">
                  <span className="text-xs">Allocated</span>
                  {allocations[ido.id].toLocaleString("en-us")} USDC
                </p>
                <p className="flex flex-col py-3 px-4 text-lg">
                  <span className="text-xs">TGE Date</span>
                  {formattedDate2(ido?.end)}
                  <br />
                  {(ido.vesting ||
                    ido.id === "grizzy" ||
                    ido.id === "grizzy-private") && (
                    <div className="flex items-center gap-1 text-xs">
                      <span
                        className={classNames({
                          "flex justify-center items-center p-1 px-2 rounded-full":
                            true,
                          "bg-green-500": tgesUnlocked[ido.id],
                          "bg-samurai-red": !tgesUnlocked[ido.id],
                        })}
                      >
                        {tgesUnlocked[ido.id] === true ? "Unlocked" : "Locked"}
                      </span>
                      <span
                        className={classNames({
                          "flex justify-center items-center p-1 px-2 rounded-full":
                            true,
                          "bg-green-500": tgesClaimed[ido.id],
                          "bg-samurai-red": !tgesClaimed[ido.id],
                        })}
                      >
                        {tgesClaimed[ido.id] === true
                          ? "Claimed"
                          : "Not Claimed"}
                      </span>
                      <span
                        className={classNames({
                          "justify-center items-center p-1 px-2 rounded-full bg-green-500":
                            true,
                          flex:
                            ido.id === "grizzy" || ido.id === "grizzy-private",
                          hidden: ido.id !== "grizzy" || ido.id !== "grizzy",
                        })}
                      >
                        Refunded
                      </span>
                    </div>
                  )}
                </p>
                <p className="flex flex-col py-3 px-4 text-lg">
                  <span className="text-xs">Distribution</span>
                  {ido?.vestingDescription}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 px-4 lg:px-8 xl:px-16">
          <span>No allocations found, please</span>
          <button
            onClick={onResetFilters}
            className="underline hover:text-samurai-red transition-all"
          >
            try reseting your filters
          </button>
        </div>
      )}
    </div>
  );
}
