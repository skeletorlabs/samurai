import { useCallback, useContext, useState } from "react";
import { StateContext } from "../context/StateContext";
import SSButton from "./ssButton";
import { fillIDOToken, setIDOToken } from "../contracts_integrations/idoFull";

interface AdminRanges {
  idoIndex: number;
}

export default function AdminIDOToken({ idoIndex }: AdminRanges) {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { signer, account } = useContext(StateContext);

  const onSetToken = useCallback(async () => {
    setLoading(true);
    if (signer && account) setIDOToken(idoIndex, token, signer);
    setLoading(false);
  }, [account, idoIndex, token, signer]);

  const onFillContract = useCallback(async () => {
    setLoading(true);
    if (signer && account) fillIDOToken(idoIndex, amount, signer);
    setLoading(false);
  }, [account, idoIndex, amount, signer]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center flex-wrap gap-10">
        <div className="flex flex-col gap-2">
          <p>Set IDO token</p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter the token address"
              className="text-black w-[300px]"
              onChange={(e) => setToken(e.target.value)}
              value={token}
            />
            <SSButton disabled={loading} click={onSetToken}>
              {loading ? "Loading..." : "Set"}
            </SSButton>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p>Fill contract with IDO token</p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter the amount to fill"
              className="text-black w-[300px]"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
            <SSButton disabled={loading} click={onFillContract}>
              {loading ? "Loading..." : "Fill"}
            </SSButton>
          </div>
        </div>
      </div>
    </div>
  );
}
