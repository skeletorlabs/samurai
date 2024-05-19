import { useRouter } from "next/router";
import { useState, useEffect, createContext, useCallback } from "react";
import { BrowserProvider, ethers } from "ethers";

declare let window: any;

import { Page } from "../utils/enums";
import { NAV } from "../utils/constants";
import { Project } from "@/utils/interfaces";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

export const StateContext = createContext({
  page: Page.home,
  setPage: (value: Page) => {},

  isLoading: false,
  setIsLoading: (value: boolean) => {},

  signer: null,
  setSigner: (value: ethers.Signer | null) => {},

  account: "",
  setAccount: (value: string) => {},

  projects: [] as Project[] | [],
  setProjects: (value: Project[] | []) => {},
});

type Props = {
  children?: React.ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(Page.home);
  const [isLoading, setIsLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState("");
  const [projects, setProjects] = useState<Project[] | []>([]);

  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    if (router.isReady) {
      const page = NAV.find((item) => item.href === router.pathname);
      setPage(page?.page as Page);
    }
  }, [router, setPage]);

  useEffect(() => {
    const getSigner = async () => {
      if (walletProvider) {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    };

    getSigner();
  }, [walletProvider]);

  useEffect(() => {
    setAccount(address || "");
  }, [address]);

  return (
    <StateContext.Provider
      value={{
        page,
        setPage,
        isLoading,
        setIsLoading,
        signer,
        setSigner,
        account,
        setAccount,
        projects,
        setProjects,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
