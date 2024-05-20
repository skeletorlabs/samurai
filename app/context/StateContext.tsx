"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, createContext, useCallback } from "react";
import { BrowserProvider, ethers } from "ethers";

declare let window: any;

import { Page } from "@/app/utils/enums";
import { NAV } from "@/app/utils/constants";
import { Project } from "@/app/utils/interfaces";
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
  const pathname = usePathname();
  const [page, setPage] = useState(Page.home);
  const [isLoading, setIsLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState("");
  const [projects, setProjects] = useState<Project[] | []>([]);

  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    const page = NAV.find((item) => item.href === pathname);
    setPage(page?.page as Page);
  }, [pathname, setPage]);

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
