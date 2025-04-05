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
import Loading from "../loading";

const inter = Inter({
  subsets: ["latin"],
});

interface UserList {
  IDOs: IDO_v3[];
  allocations: StringToNumber;
  phases: StringToString | undefined;
  tgesUnlocked: StringToBoolean | undefined;
  tgesClaimed: StringToBoolean | undefined;
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
        if (phases) list = list.filter((item) => phases[item.id] === "Vesting");
        break;
      case "Completed":
        if (phases)
          list = list.filter((item) => phases[item.id] === "Completed");
        break;
      case "TGE Unlocked":
        if (tgesUnlocked) list = list.filter((item) => tgesUnlocked[item.id]);
        break;
      case "TGE Claimed":
        if (tgesClaimed) list = list.filter((item) => tgesClaimed[item.id]);
        break;
      default:
        break;
    }

    setIdoList(list);
  }, [filterChain, filterStatus, phases, tgesUnlocked, tgesClaimed]); // ✅ Added dependencies

  useEffect(() => {
    filter();
  }, [filterChain, filterStatus, phases, tgesUnlocked, tgesClaimed]); // ✅ Added dependencies

  useEffect(() => {
    filter();
  }, []);

  return (
    <div className={`overflow-x-auto ${inter.className}`}>
      {idoList.length > 0 ? (
        <>
          {/* DESKTOP */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full table-fixed text-white border-collapse">
              <thead>
                <tr className="bg-white/10 text-left text-samurai-red text-sm">
                  <th className="py-4 pl-4 xl:pl-10 w-[22%]">Project</th>
                  <th className="py-4 pl-4 xl:pl-10 w-[15%]">Network</th>
                  <th className="py-4 pl-4 xl:pl-10 w-[15%]">Allocated</th>
                  <th className="py-4 pl-4 xl:pl-10 w-[20%]">TGE Date</th>
                  <th className="py-4 pl-4 xl:pl-10 w-[28%]">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {idoList.map((ido, index) => (
                  <tr
                    key={index}
                    className="odd:bg-neutral-800 even:bg-white/5 border-t border-white/20 transition-all hover:opacity-85 hover:cursor-pointer text-xs 2xl:text-sm"
                    onClick={() => goToIdo(ido.url)}
                  >
                    <td className="py-4 pl-4 xl:pl-10 flex items-center gap-3 2xl:gap-5">
                      <Image
                        src={ido?.idoImageSrc}
                        alt={ido?.projectName}
                        width={60}
                        height={60}
                        className="rounded-full border border-white/30 bg-black/50 p-1 w-[60px] h-[60px]"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="2xl:text-lg font-bold">
                          {ido?.projectName}
                        </p>
                        <p className="flex items-center justify-center bg-white/10 text-white rounded-full px-3 h-6 text-xs border border-white/20 w-max">
                          {phases ? phases[ido.id] : <Loading />}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 pl-4 xl:pl-10">
                      <div className="flex items-center gap-2 2xl:gap-3 border border-white/20 bg-white/10 rounded-full py-1 px-3 w-max">
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

                    <td className="py-4 pl-4 xl:pl-10 min-w-max">
                      {allocations[ido.id].toLocaleString("en-us")} USDC
                    </td>

                    <td className="py-4 pl-4 xl:pl-10">
                      {formattedDate2(ido?.end)}
                      {(ido.vesting ||
                        ido.id === "grizzy" ||
                        ido.id === "grizzy-private") && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <div
                            className={classNames(
                              "flex justify-center items-center h-6 px-2 rounded-full border border-white/20 text-xs",
                              {
                                "bg-white/10": !tgesUnlocked,
                                "bg-green-500": tgesUnlocked?.[ido.id],
                                "bg-samurai-red":
                                  tgesUnlocked && !tgesUnlocked[ido.id],
                              }
                            )}
                          >
                            {tgesUnlocked ? (
                              <span>
                                {tgesUnlocked[ido.id] ? "Unlocked" : "Locked"}
                              </span>
                            ) : (
                              <Loading />
                            )}
                          </div>

                          <div
                            className={classNames(
                              "flex justify-center items-center h-6 px-2 rounded-full border border-white/20 text-xs",
                              {
                                "bg-white/10": !tgesClaimed,
                                "bg-green-500": tgesClaimed?.[ido.id],
                                "bg-samurai-red":
                                  tgesClaimed && !tgesClaimed[ido.id],
                              }
                            )}
                          >
                            {tgesClaimed ? (
                              <span>
                                {tgesClaimed[ido.id]
                                  ? "Claimed"
                                  : "Not Claimed"}
                              </span>
                            ) : (
                              <Loading />
                            )}
                          </div>

                          {(ido.id === "grizzy" ||
                            ido.id === "grizzy-private") && (
                            <span className="flex justify-center items-center h-6 px-2 rounded-full bg-green-500 border border-white/20 text-xs">
                              Refunded
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-4 pl-4 xl:pl-10">
                      {ido?.vestingDescription}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="flex lg:hidden flex-col gap-2">
            {idoList.map((ido, index) => (
              <div
                key={index}
                className={`flex flex-col odd:bg-neutral-800 even:bg-white/10 border-t border-white/20 transition-all hover:opacity-85 hover:cursor-pointer py-2`}
                onClick={() => goToIdo(ido.url)}
              >
                <div className="p-4 flex items-center gap-5 lg:px-8 xl:px-16">
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
                        {phases ? phases[ido.id] : <Loading />}
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
                </div>
                <div className="flex flex-col py-3 px-4 text-lg">
                  <span className="text-xs text-samurai-red">Allocated</span>
                  {allocations[ido.id].toLocaleString("en-us")} USDC
                </div>
                <div className="flex flex-col py-3 px-4 text-lg">
                  <span className="text-xs text-samurai-red">TGE Date</span>
                  {formattedDate2(ido?.end)}
                  <br />
                  {(ido.vesting ||
                    ido.id === "grizzy" ||
                    ido.id === "grizzy-private") && (
                    <div className="flex items-center gap-1 text-xs">
                      {tgesUnlocked ? (
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
                      ) : (
                        <Loading />
                      )}
                      {tgesClaimed ? (
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
                      ) : (
                        <Loading />
                      )}
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
                </div>
                <div className="flex flex-col py-3 px-4 text-lg">
                  <span className="text-xs text-samurai-red">Distribution</span>
                  {ido?.vestingDescription}
                </div>
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
