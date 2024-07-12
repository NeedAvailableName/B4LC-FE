import Link from 'next/link';
import React from 'react';
// import { Toggle } from "../components";
import { Typography } from '@mui/material';
import Image from 'next/image';
import { useDisconnect } from 'wagmi';
import Logo from '../assets/LC_Logo.png';
import AppDropDown from '../components/AppDropDown';

interface IHeader {
  search?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ search }: IHeader) {
  const { disconnect } = useDisconnect();
  return (
    <header className="w-full flex justify-center items-center border-b p-2 border-border-light dark:border-border-dark">
      <div className=" w-1/3 ml-2">
        <Link href={'/'} className="flex items-center w-fit">
          <Image
            className="cursor-pointer"
            src={Logo}
            alt="B4LC"
            height={40}
            width={40}
          />
          <Typography className="text-2xl font-semibold text-primary ml-3">
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
