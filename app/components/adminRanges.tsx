import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateContext";
import { WalletRange, updateRanges } from "../contracts_integrations/idoV2";
import SSButton from "./ssButton";

interface AdminRanges {
  idoIndex: number;
  ranges: WalletRange[];
}

export default function AdminRanges({ idoIndex, ranges }: AdminRanges) {
  const [walletRanges, setWalletRanges] = useState<WalletRange[] | []>([]);
  const [loading, setLoading] = useState(false);
  const { signer, account } = useContext(StateContext);

  const onUpdateRanges = useCallback(async () => {
    setLoading(true);
    if (signer && account) updateRanges(idoIndex, walletRanges, signer);
    setLoading(false);
  }, [account, idoIndex, walletRanges, signer]);

  const setRange = useCallback(
    async (index: number, type: string, value: string) => {
      const newRange = [...walletRanges];

      if (type === "min") {
        newRange[index].minPerWallet = Number(value);
      } else {
        newRange[index].maxPerWallet = Number(value);
      }

      setWalletRanges(newRange);
    },
    [walletRanges, setWalletRanges]
  );

  useEffect(() => {
    setWalletRanges(ranges);
  }, [ranges, setWalletRanges]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center flex-wrap gap-10">
        {walletRanges.map((range, index) => (
          <div key={index} className="flex flex-col mt-5 border-b pb-10">
            <span className="font-bold bg-samurai-red p-4 mt-5">
              {range.name}
            </span>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex flex-col">
                <span>Min</span>
                <input
                  type="text"
                  placeholder="Enter the wallet you want to blacklist"
                  className="text-black"
                  onChange={(e) => setRange(index, "min", e.target.value)}
                  value={range.minPerWallet}
                />
              </div>

              <div className="flex flex-col">
                <span>Max</span>
                <input
                  type="text"
                  placeholder="Enter the wallet you want to blacklist"
                  className="text-black"
                  onChange={(e) => setRange(index, "max", e.target.value)}
                  value={range.maxPerWallet}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {signer && account && (
        <div className="mt-10">
          <SSButton disabled={loading} click={onUpdateRanges}>
            {loading ? "Loading..." : "Update Ranges"}
          </SSButton>
        </div>
      )}
    </div>
  );
}
