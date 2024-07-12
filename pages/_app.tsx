import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  fantomTestnet,
  mainnet,
  optimism,
  sepolia,
  zora,
} from 'wagmi/chains';
import '../styles/globals.css';

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, optimism, arbitrum, base, zora, sepolia, fantomTestnet],

  ssr: true,
});

const client = new QueryClient();
const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to B4LC',
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <title>B4LC | Blockchain-based L/C managing system</title>
      </Head>
      <WagmiProvider config={config}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <QueryClientProvider client={client}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider coolMode>
                <Component {...pageProps} />
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
