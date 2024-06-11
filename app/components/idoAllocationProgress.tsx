import { useEffect, useState } from "react";

type IdoAllocationProgress = {
  maxAllocations: number;
  raised: number;
  useLocale?: boolean;
  extraInfos?: any;
};

export default function IdoAllocationProgress({
  maxAllocations,
  raised,
  useLocale = true,
  extraInfos,
}: IdoAllocationProgress) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (raised > 0) {
      setPercentage((raised / maxAllocations) * 100);
    }
  }, [maxAllocations, raised]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center w-full h-[14px] rounded-full border border-white/20 bg-white/10">
        <div
          className={`flex justify-center items-center h-full bg-gradient-to-r from-samurai-red/60 to-samurai-red ${
            percentage >= 95 ? "rounded-full" : "rounded-l-full"
          }`}
          style={{
            width: `${percentage > 0 && percentage < 1.2 ? 1.2 : percentage}%`,
          }}
        />
      </div>
      <div className="flex justify-between items-center px-1 text-sm">
        <span>
          Raised:{" "}
          {percentage.toLocaleString("en-us", { maximumFractionDigits: 2 })}%
        </span>
        <span>
          Total Allocation:{" "}
          {useLocale ? maxAllocations.toLocaleString("en-us") : maxAllocations}{" "}
          {extraInfos && extraInfos}
        </span>
      </div>
    </div>
  );
}
