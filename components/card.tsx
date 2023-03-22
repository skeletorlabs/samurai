import { Project } from "@/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
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
    <Link
      href="#"
      className="flex flex-col justify-end w-[280px] h-[380px] rounded-xl border border-neutral-700 relative transition-all hover:scale-[1.03] hover:border-samurai-red hover:shadow-xl hover:shadow-white/10 bg-neutral-800 hover:bg-samurai-red"
    >
      <div className="flex flex-col justify-center items-center w-full h-[190px] rounded-b-xl text-center px-4 z-10">
        <h1 className="font-bold text-xl">{project.name}</h1>
        <p className="font-light text-xs leading-tight">
          {project.description.substring(0, 140)}...
        </p>
        <button className="bg-black rounded-full w-20 py-1 mt-5 font-normal text-sm">
          Button
        </button>
      </div>
      <Image
        src={`https://samuraistarter.com/_nuxt/img/inwarium.0518d58.png`}
        width={280}
        height={180}
        alt=""
        className="absolute top-0 left-0 z-0 rounded-t-xl max-h-[190px]"
      />
    </Link>
  );
}
