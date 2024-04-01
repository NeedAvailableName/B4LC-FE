import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Link from "next/link";
// import { Toggle } from "../components";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
interface IHeader {
  search?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ search }: IHeader) {
  return (
    <header className="w-full flex justify-between h-20 items-center border-b p-4 border-border-light dark:border-border-dark">
      {/* <div className=" w-1/3">
        <Link href={"/home"}>
          <Image
            className="cursor-pointer"
            src="/logo.png"
            alt="Decentralized YouTube"
            height={80}
            width={100}
          />
        </Link>
      </div> */}
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
        {/* <Link href="/upload">
          <HiOutlineDocumentPlus
            size="30px"
            className="mr-8 dark:fill-icons-dark cursor-pointer"
          />
        </Link> */}
        {/* <Toggle /> */}
        <div className="ml-10">
          <ConnectButton
            label="Connect Wallet"
            // accountStatus="address"
            showBalance={true}
            chainStatus="none"
          />
        </div>
      </div>
    </header>
  );
}
