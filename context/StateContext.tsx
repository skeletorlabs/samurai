import { useRouter } from "next/router";
import { useState, useEffect, createContext, useCallback } from "react";
import { ethers } from "ethers";

declare let window: any;

import { useNetwork, useAccount } from "wagmi";

import { Page } from "../utils/enums";
import { NAV } from "../utils/constants";

export const StateContext = createContext({
  page: Page.home,
  setPage: (value: Page) => {},

  isLoading: false,
  setIsLoading: (value: boolean) => {},

  signer: null,
  setSigner: (value: ethers.Signer | null) => {},
});

type Props = {
  children?: React.ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(Page.home);
  const [isLoading, setIsLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);

  const account = useAccount();

  const getSigner = useCallback(async () => {
    if (window.ethereum !== null) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletSigner = await provider.getSigner();
      setSigner(walletSigner);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      console.log(router.pathname);
      const page = NAV.find((item) => item.href === router.pathname);
      setPage(page?.page as Page);
    }
  }, [router]);

  useEffect(() => {
    if (account.isConnected) {
      getSigner();
    } else {
      setSigner(null);
    }
  }, [account.isConnected]);

  useEffect(() => {}, [account.isDisconnected]);

  return (
    <StateContext.Provider
      value={{
        page,
        setPage,
        isLoading,
        setIsLoading,
        signer,
        setSigner,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
