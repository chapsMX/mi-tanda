'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Identity, Name, Avatar } from "@coinbase/onchainkit/identity";

export default function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="flex justify-between items-center mb-6 h-10">
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
        {isClient ? (
          <Identity className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 rounded-full" />
            <div className="flex flex-col">
              <Name className="text-sm font-medium text-[var(--app-foreground)]" />
              <span className="text-xs text-[var(--app-foreground-muted)]">
                Farcaster
              </span>
            </div>
          </Identity>
        ) : (
          <div className="animate-pulse flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex flex-col space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 