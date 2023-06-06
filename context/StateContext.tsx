import { useRouter } from "next/router";
import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";

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

  // const { data: walletSigner } = useSigner();

  useEffect(() => {
    if (router.isReady) {
      console.log(router.pathname);
      const page = NAV.find((item) => item.href === router.pathname);
      setPage(page?.page as Page);
    }
  }, [router]);

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
