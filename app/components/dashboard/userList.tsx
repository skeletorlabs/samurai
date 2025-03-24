import { Inter } from "next/font/google";
import { formattedDate } from "@/app/utils/formattedDate";
import Image from "next/image";
import { IDO_v3 } from "@/app/utils/interfaces";

const inter = Inter({
  subsets: ["latin"],
});

interface UserList {
  IDOs: IDO_v3[];
}

export default function UserList({ IDOs }: UserList) {
  return (
    <div className={`overflow-x-auto ${inter.className}`}>
      <table className="w-full text-white border-collapse">
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
          {IDOs.map((ido, index) => (
            <tr
              key={index}
              className={`odd:bg-neutral-800 even:bg-black/20 border-t border-white/20`}
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
                    Vesting
                  </p>
                </div>
              </td>
              <td className="p-4 lg:px-8 xl:px-12">
                <div className="flex items-center gap-3 text-sm font-bold border border-white/20 bg-white/10 rounded-full py-[6px] px-5 w-max">
                  <Image
                    src={ido?.networkImageSrc}
                    alt={ido?.projectName}
                    width={20}
                    height={20}
                    className="rounded-full bg-black/60 border border-white/20"
                  />
                  <span>{ido?.tokenNetwork}</span>
                </div>
              </td>
              <td className="p-4 text-lg font-bold lg:px-8 xl:px-16">
                {Number(1000).toLocaleString("en-us")} USDC
              </td>
              <td className="p-4 text-xl font-bold lg:px-8 xl:px-16">
                {formattedDate(ido?.end)}
              </td>
              <td className="p-4 text-lg font-bold lg:px-8 xl:px-16">
                {ido?.vestingDescription}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
