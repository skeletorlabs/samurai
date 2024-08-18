import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateContext";
import SSButton from "./ssButton";
import {
  fillIDOToken,
  IDO_GENERAL_INFO,
  setIDOToken,
  totalLeftToFill,
} from "../contracts_integrations/idoFull";

interface AdminRanges {
  idoIndex: number;
  generalInfo: IDO_GENERAL_INFO;
}

export default function AdminIDOToken({ idoIndex, generalInfo }: AdminRanges) {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [max, setMax] = useState("");
  const [loading, setLoading] = useState(false);
  const { signer, account } = useContext(StateContext);

  const onInputChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setAmount(value);
    }

    return false;
  };

  const onSetToken = useCallback(async () => {
    setLoading(true);
    if (signer && account) setIDOToken(idoIndex, token, signer);
    setLoading(false);
  }, [account, idoIndex, token, signer]);

  const onFillContract = useCallback(async () => {
    setLoading(true);
    if (signer && account)
      fillIDOToken(idoIndex, generalInfo, amount.toString(), signer);
    setLoading(false);
  }, [account, idoIndex, generalInfo, amount, signer]);

  const onLoadAmountToFill = useCallback(async () => {
    if (generalInfo && signer) {
      const amountLeftToFill = await totalLeftToFill(
        idoIndex,
        generalInfo,
        signer
      );

      setAmount(amountLeftToFill.toString());
      setMax(amountLeftToFill.toString());
    }
  }, [idoIndex, generalInfo, signer, setAmount, setMax]);

  useEffect(() => {
    onLoadAmountToFill();
  }, [idoIndex, generalInfo, signer]);

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
            <SSButton
              disabled={
                loading ||
                generalInfo.token !==
                  "0x0000000000000000000000000000000000000000"
              }
              click={onSetToken}
            >
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
              onChange={(e) => onInputChange(e.target.value)}
              value={amount}
            />
            <SSButton
              disabled={loading || Number(amount) > Number(max)}
              click={onFillContract}
            >
              {loading ? "Loading..." : "Fill"}
            </SSButton>
          </div>
        </div>
      </div>
    </div>
  );
}
