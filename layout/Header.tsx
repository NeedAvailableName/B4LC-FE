import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import Link from 'next/link';
// import { Toggle } from "../components";
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
import { useDisconnect } from 'wagmi';
import { Button, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import AppDropDown from '../components/AppDropDown';
import Logo from '../assets/LC_Logo.png';

interface IHeader {
  search?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ search }: IHeader) {
  const { disconnect } = useDisconnect();
  return (
    <header className="w-full flex justify-center items-center border-b p-4 border-border-light dark:border-border-dark">
      <div className=" w-1/3">
        <Link href={'/'} className="flex items-center">
          <Image
            className="cursor-pointer"
            src={Logo}
            alt="B4LC"
            height={50}
            width={50}
          />
          <Typography className="text-2xl font-semibold text-primary">
            B4LC
          </Typography>
        </Link>
      </div>
      <div className=" w-1/3 flex justify-center items-center">
        {search ? (
          <input
            type="text"
            onChange={(e) => search(e.target.value)}
            placeholder="Type to search"
            className=" border-0 bg-transparent focus:outline-none dark:text-white"
          />
        ) : null}
      </div>

      <div className=" w-1/3 flex justify-end items-center">
        <div className="ml-10 flex">
          <AppDropDown></AppDropDown>
        </div>
      </div>
    </header>
  );
}
