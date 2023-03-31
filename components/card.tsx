import { Project } from "@/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});
// import { useCallback, useEffect } from "react";
interface Card {
  project: Project;
}
export default function Card({ project }: Card) {
  console.log(project.img);

  // const getImage = useCallback(async () => {
  //   const response = await fetch(
  //     "https://dev-fs.cyberfi.tech/api/file/upcoming/maya.png"
  //   );

  //   console.log(response);
  // }, []);

  // useEffect(() => {
  //   getImage();
  // }, []);

  return (
    // <Link
    //   href="#"
    //   className="flex flex-col justify-end w-[420px] h-[400px] rounded-xl border-2 relative transition-all hover:scale-[1.03] border-samurai-red hover:shadow-xl  bg-samurai-red shadow-md shadow-samurai-red"
    // >
    //   <div className="flex flex-col justify-center items-center w-full h-[160px] rounded-b-xl text-center px-4 z-10">
    //     <h1 className="font-bold text-xl">{project.name}</h1>
    //     <p className={`text-sm leading-tight ${inter.className}`}>
    //       {project.description.substring(0, 140)}...
    //     </p>
    //     <button className="bg-black rounded-full w-20 py-1 mt-5 font-normal text-sm">
    //       Button
    //     </button>
    //   </div>
    //   <Image
    //     src={`https://samuraistarter.com/_nuxt/img/inwarium.0518d58.png`}
    //     width={420}
    //     height={180}
    //     alt=""
    //     className="absolute top-0 left-0 z-0 rounded-t-xl max-h-[240px]"
    //   />
    //   <Image
    //     src={`/chain-logos/${project.network}.svg`}
    //     width={20}
    //     height={20}
    //     alt=""
    //     className="absolute top-2 right-2 max-h-[20px]"
    //   />
    // </Link>
    <Link href="#" className="flex flex-col w-full">
      <Image
        src={`/ethereum.png`}
        width={426}
        height={0}
        alt=""
        className="rounded-2xl border-2 hover:border-samurai-red transition-all w-full lg:w-[426px]"
      />

      <div className="flex flex-col w-full z-10 mt-4">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="font-bold text-3xl text-samurai-red">
            {project.name}
          </h1>
          <button
            className={`border border-samurai-red text-samurai-red rounded-full w-16 py-1 font-normal text-xs transition-all hover:scale-[1.03] ${inter.className}`}
          >
            Button
          </button>
        </div>
        <p className={`text-lg mt-2 ${inter.className}`}>
          {project.description.substring(0, 260)}...
        </p>
      </div>
    </Link>
  );
}
