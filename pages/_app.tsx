import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Heebo } from '@next/font/google';

const cyber = Heebo({
  subsets: ['latin'],
  weight: ['400'],
});



const activeChain = "base";

function MyApp({ Component, pageProps }: AppProps) {
return (
<ThirdwebProvider activeChain={activeChain}>
<main className={`${cyber.className} overflow-hidden`}>
<Component {...pageProps} />
</main>
</ThirdwebProvider>
);
}


export default MyApp;
