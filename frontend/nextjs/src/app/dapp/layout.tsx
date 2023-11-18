
import React from 'react';
import { Metadata } from 'next'
import '@rainbow-me/rainbowkit/styles.css';
import {
  ConnectButton
} from '@rainbow-me/rainbowkit';
import { Sidebar } from './_components/sidebar';
import { RightSidebar } from './_components/right-sidebar';
import { Search } from '@/components/ui/forms/search';
import { Button } from '@/components/ui/button';
import { HiOutlinePencilAlt } from "react-icons/hi"
import DappProviders from './_components/providers';
import SessionProvider from "@/lib/hooks/sessionProvider";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: 'MEMM! Homepage',
}

type Props = {
  children: React.ReactNode
}

export default async function DappLayout({
  children
}: Props) {
  const session = await getServerSession();
  return (
    <>
    <SessionProvider refetchInterval={0} session={session}>
      <DappProviders>
        <header>
          <div className=" flex-col md:flex">
            <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
              <h2 className="text-lg font-semibold text-accent-3">MEMM!</h2>
              <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                <Search />
                <Button variant="ghost" aria-label='create a post' size="icon">
                  <HiOutlinePencilAlt className="h-4 w-4" />
                </Button>
                <ConnectButton
                  label="Sign in"
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "address"
                  }}
                  chainStatus="none"
                  showBalance={false}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="body">
          <div className="border-t">
            <div className="bg-background">
              <div className="grid lg:grid-cols-5">
                <Sidebar className="hidden lg:block min-h-[94vh]" />
                <div className="col-span-3 lg:col-span-4">
                  {children}
                </div>

              </div>
            </div>
          </div>
        </div>
      </DappProviders>
      </SessionProvider>
    </>
  )
}
