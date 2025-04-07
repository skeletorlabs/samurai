import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LoadingBox {
  open: boolean;
  css?: string;
}

export default function LoadingBlocker({ open, css }: LoadingBox) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div
      className={classNames({
        "top-0 left-0 w-screen h-screen bg-black/80 backdrop-blur-lg rounded-lg border border-black flex justify-center items-center z-50":
          true,
        fixed: open,
        hidden: !open,
      })}
    >
      <Image src="/three-dots.svg" width={48} height={48} alt="loading..." />
    </div>
  );
}
