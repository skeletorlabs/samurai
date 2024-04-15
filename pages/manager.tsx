import { useCallback, useContext, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the CSS for styling
import { useAccount } from "wagmi";

import SSButton from "@/components/ssButton";
import {
  addToWhitelist,
  general,
  isWhitelisted,
  releaseWhitelistAssets,
  startWhitelistRound,
  togglePause,
} from "@/contracts_integrations/nft";
import { StateContext } from "@/context/StateContext";
import Layout from "@/components/layout";
import TopLayout from "@/components/topLayout";
import { WhitelistDataType } from "@/utils/interfaces";
import { getNetwork } from "@wagmi/core";

type Pinned = {
  imagesCID: string;
  metadataCID: string;
};

export default function Manager() {
  const [pinned, setPinned] = useState<Pinned | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[] | []>(
    []
  );
  const [percentage, setPercentage] = useState(40);
  const [whitelistData, setWhitelistData] = useState<WhitelistDataType | null>(
    null
  );
  const { signer, isLoading, setIsLoading } = useContext(StateContext);
  const { address } = useAccount();
  const { chain } = getNetwork();

  const onTextAreaChange = (value: string) => {
    const addresses: string[] = value
      .toString()
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .split(",");
    setWhitelistAddresses(addresses);
  };

  const getGeneralData = useCallback(async () => {
    setIsLoading(true);
    const response = await general();
    setData(response);
    setIsLoading(false);
  }, [setData, setIsLoading]);

  const onTogglePause = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported) await togglePause(signer);

    await getGeneralData();
    setIsLoading(false);
  }, [chain, signer, setIsLoading]);

  const onStartWhitelistRound = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported)
      await startWhitelistRound(signer);

    await getGeneralData();
    setIsLoading(false);
  }, [chain, signer]);

  const onSplitAssets = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported)
      await releaseWhitelistAssets(signer, percentage);

    await getGeneralData();
    setIsLoading(false);
  }, [chain, signer, setIsLoading]);

  const onAddToWhitelist = useCallback(async () => {
    setIsLoading(true);

    if (
      signer &&
      chain &&
      !chain.unsupported &&
      whitelistAddresses.length > 0
    ) {
      await addToWhitelist(signer, whitelistAddresses);
    }

    setIsLoading(false);
  }, [chain, signer, whitelistAddresses, setIsLoading]);

  const getWhiteListInfos = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported && data && !data.isPaused) {
      const checkWhitelist = await isWhitelisted(signer);
      setWhitelistData(checkWhitelist as WhitelistDataType);
    }
    setIsLoading(false);
  }, [chain, signer, data, setIsLoading, setWhitelistData]);

  const checkOwnership = useCallback(() => {
    if (signer && address && chain && !chain.unsupported)
      return data && data.owner === address;

    return false;
  }, [chain, signer, data, address]);

  const createMetadata = useCallback(async () => {
    const response: any = await fetch("/api/pinata");
    setPinned(response);
  }, []);

  const handlePinConfirm = () => {
    // Perform the pinning action here
    createMetadata();
  };

  const handlePinButtonClick = () => {
    confirmAlert({
      overlayClassName: "custom-overlay",
      title: "Confirm Pin",
      message: "Are you sure you want to pin?",
      buttons: [
        {
          label: "Cancel",
          onClick: () => {},
        },
        {
          label: "Pin",
          onClick: handlePinConfirm,
        },
      ],
    });
  };

  useEffect(() => {
    getWhiteListInfos();
  }, [signer, data]);

  useEffect(() => {
    getGeneralData();
  }, []);

  return (
    <Layout>
      <TopLayout>
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col w-full h-full justify-center items-center mt-20 mb-10">
            {isLoading ? (
              <span>You're not allowed to check this page! Get out.</span>
            ) : signer && checkOwnership() ? (
              <div className="flex flex-col gap-14 w-full">
                <div className="flex items-center gap-5 bg-black border-b border-t border-gray-800 py-8 px-12">
                  <SSButton click={handlePinButtonClick}>Pin</SSButton>
                </div>
                <div className="flex items-center gap-5 bg-black border-b border-t border-gray-800 py-8 px-12">
                  <SSButton click={onTogglePause}>
                    {isLoading
                      ? "Loading..."
                      : data?.isPaused
                      ? "Unpause Contract"
                      : "Pause Contract"}
                  </SSButton>
                  {whitelistData && whitelistData?.whitelistFinishAt === 0 && (
                    <SSButton click={onStartWhitelistRound}>
                      {isLoading ? "Loading..." : "Init Whitelist Round"}
                    </SSButton>
                  )}
                </div>
                {whitelistData &&
                  whitelistData?.whitelistFinishAt > 0 &&
                  data &&
                  data?.maxSupplyRetained === 0 &&
                  data?.maxSupplyReleased === 0 && (
                    <div className="flex items-center gap-5 bg-black border-b border-t border-gray-800 py-8 px-12">
                      <SSButton click={onSplitAssets}>
                        {isLoading
                          ? "Loading..."
                          : "Release OG Assets Not Minted"}
                      </SSButton>
                      <div className="flex items-center ">
                        <button
                          className="w-8 h-8"
                          onClick={() =>
                            percentage > 0 ? setPercentage(percentage - 1) : {}
                          }
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5L8.25 12l7.5-7.5"
                            ></path>
                          </svg>
                        </button>
                        <span className="text-white text-center rounded-xl text-2xl">
                          {percentage}
                        </span>

                        <button
                          className="w-8 h-8"
                          onClick={() =>
                            percentage < 100
                              ? setPercentage(percentage + 1)
                              : {}
                          }
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            ></path>
                          </svg>
                        </button>
                        <span>% to retain</span>
                      </div>
                    </div>
                  )}

                <div className="flex flex-col gap-5 bg-black border-b border-t border-gray-800 py-8 px-12">
                  <label>
                    Enter the addresses to be whitelisteds (max 1200 per
                    transaction)
                  </label>
                  <textarea
                    name=""
                    cols={30}
                    rows={10}
                    placeholder="Enter the wallets (separated by comma)"
                    className="text-black rounded-[8px] w-[600px]"
                    onChange={(e) => onTextAreaChange(e.target.value)}
                  ></textarea>
                  <div>
                    <SSButton click={onAddToWhitelist}>
                      {isLoading ? "Loading..." : "Add to Whitelist"}
                    </SSButton>
                  </div>
                </div>
              </div>
            ) : (
              <span>You're not allowed to check this page! Get out.</span>
            )}
          </div>
        </div>
      </TopLayout>
    </Layout>
  );
}
