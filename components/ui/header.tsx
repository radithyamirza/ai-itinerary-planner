import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";
import { GiAstronautHelmet } from 'react-icons/gi';
import Link from 'next/link';

export default function Header() {
  return (
    <div className='w-full dark:bg-black py-2'>
      <div className='w-11/12 mx-auto  flex justify-between items-center'>
        <Link href={'/'}>
            <h4 className='text-white text-2xl font-bold flex items-center'>
              <GiAstronautHelmet className='mr-4' />
              Planit
            </h4>
        </Link>
        <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton userProfileUrl='/profile'/>
        </SignedIn>
        </div>
      </div>
    </div>
  );
}
