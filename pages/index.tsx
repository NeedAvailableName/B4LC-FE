import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, getAuthOptions(req)),
    },
  };
};

const Home: NextPage = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const { data: session, status } = useSession();
  const { isConnected } = useAccount();
  useEffect(() => {
    if (status === 'authenticated' && session.user.name) {
      window.location.href = '/sales-contracts';
    } else if (status === 'authenticated' && !session.user.name) {
      window.location.href = '/user/profile';
    }
  }, [status]);
  return (
    <>
      <section className="relative bg-background-light flex flex-col h-full justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-8">
            <div className="text-center pb-12 md:pb-16">
              <h1
                className="text-5xl text-text-light md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 dark:text-text-dark"
                data-aos="zoom-y-out"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  Welcome to B4LC
                </span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <h2
                  className="text-xl text-gray-400 mb-8"
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                  Manage your LCs in securer and more convenience way
                </h2>
                <div className="flex justify-center">
                  <ConnectButton
                    label="Connect Wallet"
                    accountStatus="address"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="text-xl text-gray-400 text-center"
            data-aos="zoom-y-out"
            data-aos-delay="150"
          >
            Powered by BKC Labs
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
