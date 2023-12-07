import { useCallback, useContext, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the CSS for styling

import SSButton from "@/components/ssButton";
import { general, togglePause } from "@/contracts_integrations/nft";
import { StateContext } from "@/context/StateContext";
import Layout from "@/components/layout";
import TopLayout from "@/components/topLayout";

type Pinned = {
  imagesCID: string;
  metadataCID: string;
};

export default function Manager() {
  const [pinned, setPinned] = useState<Pinned | null>(null);
  const [data, setData] = useState<any | null>(null);
  const { signer, isLoading, setIsLoading } = useContext(StateContext);

  const getGeneralData = useCallback(async () => {
    const response = await general();
    setData(response);
  }, [setData]);

  const onTogglePause = useCallback(async () => {
    setIsLoading(true);
    if (signer) await togglePause(signer);

    await getGeneralData();
    setIsLoading(false);
  }, [signer]);

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
    getGeneralData();
  }, []);

  return (
    <Layout>
      <TopLayout>
        <div className="flex items-center justify-center w-full h-full p-10">
          <div className="flex w-full h-full justify-center items-center p-[400px]">
            {/* <SSButton click={handlePinButtonClick}>Pin</SSButton> */}
            {signer && (
              <SSButton click={onTogglePause}>
                {isLoading
                  ? "Loading..."
                  : data?.isPaused
                  ? "Unpause"
                  : "Pause"}
              </SSButton>
            )}
          </div>
        </div>
      </TopLayout>
    </Layout>
  );
}
