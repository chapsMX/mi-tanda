"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Card, Icon } from "./components/DemoComponents";
import Image from "next/image";
import Link from 'next/link';

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)]"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF]">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-2 h-10">
          <div className="flex items-center">
            <Image
              src="/miTanda_logo.png"
              alt="Mi Tanda Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Identity className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 rounded-full" />
              <div className="flex flex-col">
                <Name className="text-sm font-medium text-[var(--app-foreground)]" />
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  Farcaster
                </span>
              </div>
            </Identity>
          </div>
        </header>

        <main className="flex-1">
          <div className="mb-2 text-center">
            <h1 className="text-4xl font-bold text-[#0052FF]">
              Mi Tanda
            </h1>
            <p className="text-xl text-[var(--app-foreground-muted)]">
              Traditional savings, reimagined.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[var(--app-foreground-muted)] leading-relaxed">
              Tandas, also known as ROSCAs,are informal, 
              community-based savings mechanisms widely used across Latin America, Africa, Southeast 
              Asia, and immigrant communities worldwide. In a tanda, a group of individuals agrees 
              to contribute a fixed amount of money at regular intervals. At each interval, or "round", 
              one member receives the total pooled amount. The cycle continues until all members have 
              received a payout.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-2">
            {/* Secure & Trustless */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-2 rounded-full bg-[var(--app-card-border)]">
                <svg width="24" height="24">
                  <use href="/styles/svg/sprites.svg#icon-trust" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-2 text-[#0052FF]">
                Secure & Trustless
              </h3>
              <p className="text-xs text-[var(--app-foreground-muted)]">
                Smart contracts ensure all funds are secure and distributed fairly without middlemen.
              </p>
            </div>

            {/* Flexible Cycles */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-2 rounded-full bg-[var(--app-card-border)]">
                <svg width="24" height="24">
                  <use href="/styles/svg/sprites.svg#icon-flexible" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-2 text-[#0052FF]">
                Flexible &nbsp; Cycles
              </h3>
              <p className="text-xs text-[var(--app-foreground-muted)]">
                Choose between 2-week or 30-day cycles that fit your saving goals.
              </p>
            </div>

            {/* Community Powered */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-2 rounded-full bg-[var(--app-card-border)]">
                <svg width="24" height="24">
                  <use href="/styles/svg/sprites.svg#icon-community" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-2 text-[#0052FF]">
                Community Powered
              </h3>
              <p className="text-xs text-[var(--app-foreground-muted)]">
                Join existing circles or create your own with friends, family, or coworkers.
              </p>
            </div>
          </div>

          <Card>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={<Icon name="plus" />}
                asChild
              >
                <Link href="/create">Create new tanda</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                icon={<Icon name="star" />}
                asChild
              >
                <Link href="/tandas">View Active Tandas</Link>
              </Button>
            </div>
          </Card>
        </main>

        <footer className="mt-4 pt-4 border-t border-[var(--app-card-border)] flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
            <div>{saveFrameButton}</div>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--app-foreground-muted)] text-xs flex items-center space-x-2"
              onClick={() => openUrl("https://base.org/builders/minikit")}
            >
              <span>Built on Base</span>
              <Image 
                src="/builtBase.png" 
                alt="Built on Base" 
                width={50} 
                height={20} 
                className="ml-2"
              />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
