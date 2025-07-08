import "@/styles/globals.css";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import Navbar from "./components/navbar";


const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      
      <QueryClientProvider client={queryClient}>
        <Head>
          <script 
            src="https://checkout.razorpay.com/v1/checkout.js" 
            strategy="beforeInteractive" 
            async
          />
        </Head>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </RecoilRoot>
  );
}