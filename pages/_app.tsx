import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ReduxRouter } from '@lagunovsky/redux-react-router';
import store from '../redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  sepolia,
  zora,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { browserHistory } from '../helpers/history';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to B4LC',
});

function MyApp({ Component, pageProps }: AppProps <{session: Session}>) {
  return (
    <Provider store={store}>
      <ReduxRouter history={browserHistory}>
        <WagmiProvider config={config}>
          <SessionProvider refetchInterval={0} session={pageProps.session}>
            <QueryClientProvider client={client}>
              <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
                <RainbowKitProvider coolMode>
                  <Component {...pageProps} />
                </RainbowKitProvider>
              </RainbowKitSiweNextAuthProvider>
            </QueryClientProvider>
          </SessionProvider>
        </WagmiProvider>
      </ReduxRouter>
    </Provider>
  );
}

export default MyApp;
