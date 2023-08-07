import { useCallback, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the CSS for styling

import SSButton from "@/components/ssButton";

type Pinned = {
  imagesCID: string;
  metadataCID: string;
};

export default function Manager() {
  const [pinned, setPinned] = useState<Pinned | null>(null);

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

  return (
    <div className="flex flex-col justify-center items-center w-full h-[400px]">
      <div>
        <SSButton click={handlePinButtonClick}>Pin</SSButton>
      </div>
    </div>
  );
}
