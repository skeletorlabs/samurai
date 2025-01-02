import { useCallback, useEffect, useState } from "react";
import SSButton from "./ssButton";

export default function KYC() {
  const [open, setOpen] = useState(true);
  const [kyc, setKyc] = useState("");
  const messageReceiver = useCallback((message: any) => {
    // React only messages from ID iframe
    if (message.origin === "https://app.fractal.id") {
      if (message.data.error) {
        setKyc(
          `KYC process failed with: ${JSON.stringify(message.data.error)}`
        );
        // Hide iframe ...
      } else if (message.data.open) {
        // If you want to use wallet-sign-in, this is required
        // since there are security limitations, especially with
        // opening metamask protocol link in mobile device
        window.open(
          message.data.open,
          message.data.target,
          message.data.features
        );
      } else {
        setKyc(`KYC process is completed.`);
        // Hide iframe, load data, etc...
        // Oauth2 attributes are presented in the message data
        // {
        //    "code": "MXES5XpDzMRAHyMI3Jx5K3nrxzZjWjEr-Cskq3Jevso",
        //    "sub1": "MXES5XpDzMRAHyMI3Jx5K3nrxzZjWjEr-Cskq3Jevso",
        //    "state": "state_arg"
        // }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", messageReceiver);

    return () => window.removeEventListener("message", messageReceiver);
  }, []);
  return (
    <div
      className={`${
        open ? "flex" : "hidden"
      } absolute top-0 left-0 bg-black/80 backdrop-blur-sm w-[100%] h-[100%] flex-col items-center z-20 p-10 lg:pt-24 gap-3`}
    >
      <iframe
        className="flex rounded-lg w-[500px] max-w-[500px] h-[600px] max-h-[600px] border-4 border-black/80 shadow-2xl shadow-samurai-red/30 bg-white"
        allow="camera *; fullscreen *"
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        src="https://app.fractal.id/authorize?client_id=l7NtCD-yjCnj_uYtIP_AOSxhEaDtWcct01BoOkgOhQk&redirect_uri=https%3A%2F%2Fwww.samuraistarter.com%2F&response_type=code&ensure_wallet=0x&scope=contact%3Aread%20verification.basic%3Aread%20verification.basic.details%3Aread%20verification.liveness%3Aread%20verification.liveness.details%3Aread"
      />

      <div className="w-[500px] max-w-[500px]">
        <SSButton flexSize click={() => setOpen(false)}>
          Cancel
        </SSButton>
      </div>
    </div>
  );
}
