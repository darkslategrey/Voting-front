import "@/styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { Layout } from "@/components/Layout/Layout";
import { EthProvider } from "@/contexts/EthContext";

export default function App({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [hardhat, goerli],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Voting",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <EthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </EthProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
