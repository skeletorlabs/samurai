"use client"; // Ensures this runs on the client side

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Modal } from "@/app/context/web3modal";
import SidebarMenu from "@/app/components/sidebarMenu";
import Footer from "@/app/components/footer";
import Burger from "@/app/components/burgerMenu";

const queryClient = new QueryClient();

export default function AppClient({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        containerId="toast-notification"
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Web3Modal>
        <div className="flex flex-row w-full h-full text-white/90">
          <SidebarMenu />
          <div className="flex flex-col w-full">{children}</div>
        </div>
      </Web3Modal>

      <Footer />
      <Burger />
    </QueryClientProvider>
  );
}
