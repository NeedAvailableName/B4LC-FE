import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import Head from 'next/head';

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
        <html lang="en" translate="no"></html>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="/src/assets/svgs/Infinity.svg"
          data-react-helmet="true"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Blockchain-based system for publishing and managing L/C"
        />
        <meta
          property="og:title"
          content="B4LC | Blockchain based L/C managing system"
        />
        <meta
          property="og:description"
          content="Blockchain-based system for publishing and managing L/C"
          data-rh="true"
        />
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" data-rh="true" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <title>B4LC | Blockchain based L/C managing system</title>
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
