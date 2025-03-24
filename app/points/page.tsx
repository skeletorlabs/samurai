"use client";
import { Inter } from "next/font/google";
import { useCallback, useContext, useEffect, useState } from "react";
import TopLayout from "@/app/components/topLayout";
import {
  grantRole,
  isPointsOwner,
  revokeRole,
} from "../contracts_integrations/points";
import { StateContext } from "../context/StateContext";
import LoadingBox from "../components/loadingBox";

const inter = Inter({
  subsets: ["latin"],
});

enum Roles {
  booster = "BOOSTER",
  minter = "MINTER",
  burner = "BURNER",
}

const roles = [Roles.booster, Roles.minter, Roles.burner];

export default function Points() {
  const [selectedRole, setSelectedRole] = useState(0);
  const [contract, setContract] = useState("");
  const [owner, setOwner] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signer, chain } = useContext(StateContext);

  const onTextChange = (value: string) => {
    setContract(value);
  };

  const onCheckOwner = async () => {
    setLoading(true);
    if (signer) {
      const response = await isPointsOwner(signer, chain);
      if (response) setOwner(response?.isOwner);
    }
    setLoading(false);
  };

  const onRevokeRole = async () => {
    setLoading(true);
    if (signer) {
      await revokeRole(selectedRole, contract, signer);
    }
    setLoading(false);
  };

  const onGrantRole = async () => {
    setLoading(true);
    if (signer) {
      await grantRole(selectedRole, contract, signer);
    }
    setLoading(false);
  };

  useEffect(() => {
    onCheckOwner();
  }, [signer]);

  return (
    <TopLayout background="bg-samurai-incubator">
      <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-14 pt-10 lg:pt-24">
        <div className="relative">
          <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-samurai-red">
            <span className="text-white">Samuria</span> Points
          </h1>
          <p
            className={`leading-normal lg:leading-relaxed pt-6 lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
          >
            Manager for points
          </p>
        </div>

        <div className="flex flex-col gap-5 min-w-[600px] min-h-[400px] relative">
          {owner ? (
            <>
              <div className="text-2xl">Select a Role to grant/revoke</div>
              <div className="flex items-center gap-5">
                {roles.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRole(index)}
                    className={`p-2 px-4 text-white hover:enabled:opacity-80 ${
                      selectedRole === index ? "bg-samurai-red" : "bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="text-2xl">Paste the contract</div>
              <input
                type="text"
                value={contract}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="contract"
                className="text-black"
              />

              <div className="flex items-center gap-2">
                <button
                  disabled={contract === ""}
                  onClick={onRevokeRole}
                  className="w-full p-2 px-4 disabled:bg-white/5 enabled:bg-yellow-300 disabled:text-white/20 enabled:text-black hover:enabled:opacity-80 rounded-full"
                >
                  Revoke Role
                </button>

                <button
                  disabled={contract === ""}
                  onClick={onGrantRole}
                  className="w-full p-2 px-4 disabled:bg-white/5 enabled:bg-samurai-red disabled:text-white/20 enabled:text-white hover:enabled:opacity-80 rounded-full"
                >
                  Grant Role
                </button>
              </div>
            </>
          ) : (
            <>Fuck you!</>
          )}

          {loading && <LoadingBox />}
        </div>
      </div>
    </TopLayout>
  );
}
