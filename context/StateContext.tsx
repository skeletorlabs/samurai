import { useRouter } from "next/router";
import { useState, useEffect, createContext, useCallback } from "react";
import { ethers } from "ethers";

declare let window: any;

import { useNetwork, useAccount } from "wagmi";

import { Page } from "../utils/enums";
import { NAV } from "../utils/constants";
import { Project } from "@/utils/interfaces";
import fetchProjects from "@/pages/api/projects";

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

  idoModalOpen: false,
  setIdoModalOpen: (value: boolean) => {},
});

type Props = {
  children?: React.ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(Page.home);
  const [isLoading, setIsLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<string>("");
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [idoModalOpen, setIdoModalOpen] = useState(false);

  const wallet = useAccount();

  const getSigner = useCallback(async () => {
    if (window.ethereum !== null) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletSigner = await provider.getSigner();
      setSigner(walletSigner);
    }
  }, [setSigner]);

  const getInfos = useCallback(async () => {
    const projects = await fetchProjects();
    setProjects(
      projects.filter(
        (project) =>
          project.key === "maya" ||
          project.key === "d-etf-second" ||
          project.key === "devvio"
      )
    );
  }, [setProjects]);

  useEffect(() => {
    if (router.isReady) {
      const page = NAV.find((item) => item.href === router.pathname);
      setPage(page?.page as Page);
    }
  }, [router, setPage]);

  useEffect(() => {
    if (wallet.address && wallet.address !== account) {
      // console.log(wallet.address);
      getSigner();
    } else {
      setSigner(null);
    }

    setAccount(wallet?.address as string);
  }, [wallet.address, setSigner]);

  useEffect(() => {
    // getInfos();
  }, []);

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
        idoModalOpen,
        setIdoModalOpen,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
