import { useEffect, useState } from "react";

type IdoAllocationProgress = {
  maxAllocations: number;
  raised: number;
};

export default function IdoAllocationProgress({
  maxAllocations,
  raised,
}: IdoAllocationProgress) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (raised > 0) {
      setPercentage((raised / maxAllocations) * 100);
    }
  }, [maxAllocations, raised]);
  return (
    <div className="flex flex-col gap-3 px-4 xl:px-0">
      <div className="flex flex-row justify-between items-center w-full h-[20px] rounded-full border">
        <div
          className={`flex justify-center items-center h-full bg-gradient-to-r from-samurai-red/60 to-samurai-red ${
            percentage === 100 ? "rounded-full" : "rounded-l-full"
          }`}
          style={{
            width: `${percentage > 0 && percentage < 1.2 ? 1.2 : percentage}%`,
          }}
        />
      </div>
      <div className="flex justify-between items-center px-1 text-sm">
        <span>
          RAISED:{" "}
          {percentage.toLocaleString("en-us", { maximumFractionDigits: 2 })}%
        </span>
        <span>TOTAL ALLOCATION: ${maxAllocations.toLocaleString("en-us")}</span>
      </div>
    </div>
  );
}
