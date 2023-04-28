import { useRouter } from "next/router";
import React from "react";

import { Page } from "../utils/enums";
import { NAV } from "../utils/constants";

export const StateContext = React.createContext({
  page: Page.home,
  setPage: (value: Page) => {},

  isLoading: false,
  setIsLoading: (value: boolean) => {},
});

type Props = {
  children?: React.ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const router = useRouter();
  const [page, setPage] = React.useState(Page.home);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
