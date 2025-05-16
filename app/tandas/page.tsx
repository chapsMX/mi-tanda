'use client';

import { useActiveTandas, useTandaData } from '@/lib/hooks/useTandaManager';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import Image from 'next/image';
import { Identity, Name, Avatar } from "@coinbase/onchainkit/identity";
import { Button } from '../components/DemoComponents';

function Header() {
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
  );
}

function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-[var(--app-card-border)]">
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-[var(--app-foreground-muted)] text-xs flex items-center space-x-2"
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
  );
}

interface TandaCardProps {
  tandaId: bigint;
}

function TandaCard({ tandaId }: TandaCardProps) {
  const { data: tandaData, isLoading } = useTandaData(tandaId);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!tandaData) return null;

  const [generalInfo, currentStatus] = tandaData;
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-[var(--app-card-border)]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-[#0052FF]">
            Tanda #{tandaId.toString()}
          </h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            Created by {generalInfo.creator.slice(0, 6)}...{generalInfo.creator.slice(-4)}
          </p>
        </div>
        <Link
          href={`/tandas/${tandaId}`}
          className="px-4 py-1 text-sm font-medium text-[#0052FF] bg-blue-50 rounded-full"
        >
          Open
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Contribution:</p>
          <p className="font-medium">{formatUnits(generalInfo.contributionAmount, 6)} USDC</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Cycle:</p>
          <p className="font-medium">{currentStatus.currentCycle.toString()}/{generalInfo.participantCount}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Interval:</p>
          <p className="font-medium">{(Number(generalInfo.payoutInterval) / 86400).toFixed(0)} days</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Next Payout:</p>
          <p className="font-medium">
            {currentStatus.nextPayoutTimestamp > BigInt(0) 
              ? new Date(Number(currentStatus.nextPayoutTimestamp) * 1000).toLocaleDateString()
              : 'Not started'}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Grace Period:</p>
          <p className="font-medium">{(Number(generalInfo.gracePeriod) / 86400).toFixed(0)} days</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Total Funds:</p>
          <p className="font-medium">{formatUnits(currentStatus.totalFunds, 6)} USDC</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0052FF]">Participants:</p>
          <p className="font-medium">{Number(currentStatus.totalParticipants)}/{generalInfo.participantCount}</p>
        </div>
      </div>
    </div>
  );
}

export default function TandasPage() {
  const { data: activeTandaIds, isLoading, isError, error } = useActiveTandas();
  const [tandaIds, setTandaIds] = useState<bigint[]>([]);

  useEffect(() => {
    console.log('TandasPage Effect:', {
      activeTandaIds,
      isLoading,
      isError,
      error
    });

    if (activeTandaIds) {
      setTandaIds([...activeTandaIds]);
    }
  }, [activeTandaIds, isLoading, isError, error]);

  if (isError) {
    console.error('Error loading tandas:', error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading tandas. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Header />
      
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/"
          className="text-[#0052FF] hover:text-[#0052FF]/80 flex items-center space-x-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold text-[#0052FF]">Active Tandas</h1>
      </div>

      <div className="space-y-4">
        {tandaIds.map((tandaId) => (
          <TandaCard key={tandaId.toString()} tandaId={tandaId} />
        ))}
        {tandaIds.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--app-foreground-muted)]">No active tandas found.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 