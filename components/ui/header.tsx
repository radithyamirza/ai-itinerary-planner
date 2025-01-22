import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-end p-3 absolute top-0 left-0 right-0 z-50">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
