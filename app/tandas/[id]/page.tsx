'use client';

import { useTandaData } from '@/lib/hooks/useTandaManager';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import Image from 'next/image';
import { Identity, Name, Avatar } from "@coinbase/onchainkit/identity";
import { useParams, useRouter } from 'next/navigation';
import { Button, useTransactionHandler } from '../../components/DemoComponents';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { base } from 'wagmi/chains';
import { useChainId } from 'wagmi';
import { TANDA_MANAGER_ADDRESS, TANDA_MANAGER_ABI } from '@/lib/contracts/tanda';

interface TandaStatus {
  isCompleted?: boolean;
  isActive?: boolean;
  isOpen?: boolean;
  payoutOrderAssigned?: boolean;
}

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
        <h1 className="ml-2 text-xl font-bold">Mi Tanda</h1>
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
        <span className="text-[var(--app-foreground-muted)] text-xs mr-2">Built on Base</span>
        <Image 
          src="/builtBase.png" 
          alt="Built on Base" 
          width={50} 
          height={20}
        />
      </div>
    </footer>
  );
}

function formatDate(timestamp: bigint): string {
  if (timestamp === BigInt(0)) return '--';
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
}

function getTandaStatusText(status: TandaStatus | undefined): string {
  if (!status) return 'Unknown';
  
  if (status.isCompleted) return 'Completed';
  if (!status.isActive) return 'Active';
  if (!status.isOpen) return 'Closed';
  if (!status.payoutOrderAssigned) return 'Open for Participants';
  
  return 'Active';
}

export default function TandaDetail() {
  const params = useParams();
  const router = useRouter();
  const { handleTransactionSuccess, handleTransactionError } = useTransactionHandler();
  const [id, setId] = useState<bigint | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const chainId = useChainId();
  
  // Extract the id from params
  useEffect(() => {
    if (params?.id && typeof params.id === 'string') {
      try {
        console.log("Extracting ID from params:", params.id);
        let numericId = BigInt(params.id);
        
        // La app externa comienza con ID 1, ajustar para compatibilidad
        if (numericId === BigInt(0)) {
          console.log("Adjusting tanda ID from 0 to 1 for compatibility");
          numericId = BigInt(1);
        }
        
        setId(numericId);
      } catch (e) {
        console.error('Invalid ID parameter', e);
        router.push('/tandas');
      }
    } else {
      console.error('No ID parameter found');
      router.push('/tandas');
    }
  }, [params, router]);

  // Check network on mount and when chainId changes
  useEffect(() => {
    if (chainId && chainId !== base.id) {
      setNetworkError(true);
    } else {
      setNetworkError(false);
    }
  }, [chainId]);

  // Fetch tanda data
  const { data: tandaData, isLoading, isError, error } = useTandaData(id || BigInt(0), {
    enabled: id !== null
  });

  // Add logging to debug data structure
  console.log("Tanda detail data structure:", {
    generalInfo: tandaData?.[0],
    currentStatus: tandaData?.[1],
    payoutOrderInfo: tandaData?.[2],
    tandaId: id?.toString(),
    isOpen: tandaData?.[1]?.isOpen,
    isActive: tandaData?.[1]?.isActive,
    payoutOrderAssigned: tandaData?.[1]?.payoutOrderAssigned,
    participantListLength: tandaData?.[1]?.participantListLength
  });


  // Access tanda data safely
  const generalInfo = tandaData ? tandaData[0] : undefined;
  const currentStatus = tandaData ? tandaData[1] : undefined;
  const payoutOrderInfo = tandaData ? tandaData[2] : undefined;
  
  // Prepare contracts for transactions
  const contributeContract = {
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'contribute',
    args: [generalInfo?.tandaId || id]
  };

  const claimPayoutContract = {
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'claimPayout',
    args: [generalInfo?.tandaId || id]
  };
  
  // Determine status
  const statusText = getTandaStatusText(currentStatus);

  // Format the tanda ID for display and create Basescan URL
  const tandaIdDisplay = generalInfo?.tandaId ? 
    `${generalInfo.tandaId.toString()}` : 
    id?.toString() || '';
  
  // Base explorer URL for smart contracts
  const basescanUrl = `https://basescan.org/address/${generalInfo?.tandaAddress || ''}`;

  // Display loading state
  if (isLoading || !id) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <Header />
        <div className="mb-6 flex items-center">
          <Link 
            href="/tandas"
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
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Display error state
  if (isError || !tandaData) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <Header />
        <div className="mb-6 flex items-center">
          <Link 
            href="/tandas"
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
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-red-200">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Tanda</h2>
          <p className="text-red-500">
            {error ? error.message : 'Failed to load tanda details. Please try again.'}
          </p>
          <div className="mt-4">
            <Button
              onClick={() => router.push('/tandas')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Return to Tandas
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Header />
      
      <div className="mb-6">
        <Link 
          href="/tandas"
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
      </div>

      {/* Tanda Header with Status */}
      <div className="mb-6">
        <div className="flex flex-col">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">
              Tanda #{tandaIdDisplay}
            </h2>
            <a 
              href={basescanUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-sm text-blue-500 hover:text-blue-700"
            >
              View on Basescan
            </a>
          </div>
          <div className="mt-2">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {networkError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
          <h3 className="font-bold text-yellow-800">Wrong Network Detected</h3>
          <p className="text-yellow-700 mb-2">Please connect to Base network to interact with this tanda</p>
        </div>
      )}

      {/* Action Section */}
      <div className="mb-6">
        {currentStatus?.isOpen && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
            This tanda is open for participants but the join function has been temporarily disabled. 
            To join this tanda, please visit <a href="https://app.mitanda.org/" target="_blank" rel="noopener noreferrer" className="text-blue-800 font-semibold underline">app.mitanda.org</a>
          </div>
        )}

        {/* Contribute Button - Show only if tanda is active and user is a participant */}
        {currentStatus?.isActive && (
          <Transaction
            chainId={base.id}
            contracts={[contributeContract]}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          >
            <div className="w-full">
              <TransactionButton
                text="Contribute to Current Cycle"
                disabled={networkError}
                className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white py-3 rounded-lg font-medium"
              />
            </div>
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        )}

        {/* Claim Payout Button - Show only if tanda is active and user is a participant */}
        {currentStatus?.isActive && (
          <Transaction
            chainId={base.id}
            contracts={[claimPayoutContract]}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          >
            <div className="w-full mt-4">
              <TransactionButton
                text="Claim Payout"
                disabled={networkError}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
              />
            </div>
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        )}
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
          <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Contribution Amount</p>
          <p className="text-xl font-bold text-[var(--app-foreground)]">
            {generalInfo?.contributionAmount ? formatUnits(generalInfo.contributionAmount, 6) : '0'} USDC
          </p>
        </div>
        
        <div className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
          <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Current Cycle</p>
          <p className="text-xl font-bold text-[var(--app-foreground)]">
            {currentStatus?.currentCycle ? currentStatus.currentCycle.toString() : '0'} of {generalInfo?.participantCount || '0'}
          </p>
        </div>
        
        <div className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
          <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Total Funds</p>
          <p className="text-xl font-bold text-[var(--app-foreground)]">
            {currentStatus?.totalFunds ? formatUnits(currentStatus.totalFunds, 6) : '0'} USDC
          </p>
        </div>
        
        <div className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
          <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Participants</p>
          <p className="text-xl font-bold text-[var(--app-foreground)]">
            {currentStatus?.participantListLength ? currentStatus.participantListLength.toString() : '0'} / {generalInfo?.participantCount || '0'}
          </p>
        </div>
      </div>

      {/* Cycle Information */}
      <div className="mb-6 bg-[var(--app-card-bg)] rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
        <h3 className="p-4 bg-[var(--app-gray-light)] font-bold border-b border-[var(--app-card-border)] text-[var(--app-foreground)]">Cycle Information</h3>
        
        <div className="grid grid-cols-2 gap-y-4 p-4">
          <div>
            <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Next Payout</p>
            <p className="font-medium text-[var(--app-foreground)]">
              {currentStatus?.nextPayoutTimestamp ? formatDate(currentStatus.nextPayoutTimestamp) : '--'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Current Payout Recipient</p>
            <p className="font-medium text-[var(--app-foreground)]">
              {payoutOrderInfo && Array.isArray(payoutOrderInfo) && payoutOrderInfo.length > 0 && payoutOrderInfo[0]
                ? `0x${payoutOrderInfo[0].toString(16)}`.slice(0, 6) + '...' + `0x${payoutOrderInfo[0].toString(16)}`.slice(-4)
                : '0x0000...0000'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Payout Interval</p>
            <p className="font-medium text-[var(--app-foreground)]">
              {generalInfo?.payoutInterval ? (Number(generalInfo.payoutInterval) / 86400).toFixed(0) : '0'} days
            </p>
          </div>
          
          <div>
            <p className="text-sm text-[var(--app-foreground-muted)] mb-1">Grace Period</p>
            <p className="font-medium text-[var(--app-foreground)]">
              {generalInfo?.gracePeriod ? (Number(generalInfo.gracePeriod) / 86400).toFixed(0) : '0'} days
            </p>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="mb-6 bg-[var(--app-card-bg)] rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
        <h3 className="p-4 bg-[var(--app-gray-light)] font-bold border-b border-[var(--app-card-border)] text-[var(--app-foreground)]">Tanda Status</h3>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-[var(--app-foreground)]">Open for Participants: {currentStatus?.isOpen ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-[var(--app-foreground)]">Active: {currentStatus?.isActive ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.payoutOrderAssigned ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="font-medium text-[var(--app-foreground)]">Payout Order Assigned: {currentStatus?.payoutOrderAssigned ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.isCompleted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="font-medium text-[var(--app-foreground)]">Completed: {currentStatus?.isCompleted ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      {currentStatus?.participantListLength && Number(currentStatus.participantListLength) > 0 ? (
        <div className="mb-6 bg-[var(--app-card-bg)] rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
          <h3 className="p-4 bg-[var(--app-gray-light)] font-bold border-b border-[var(--app-card-border)] text-[var(--app-foreground)]">
            Participants ({currentStatus.participantListLength.toString()}/{generalInfo?.participantCount || '0'})
          </h3>
          
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2 pb-2 border-b text-sm font-medium text-[var(--app-foreground-muted)]">
              <div>ADDRESS</div>
              <div>STATUS</div>
              <div>PAID UNTIL</div>
              <div>PAYOUT ORDER</div>
            </div>
            
            {/* In a real app we would map through participants here */}
            <div className="py-4 text-center text-[var(--app-foreground-muted)]">
              Participant data not available
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-[var(--app-card-bg)] rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
          <h3 className="p-4 bg-[var(--app-gray-light)] font-bold border-b border-[var(--app-card-border)] text-[var(--app-foreground)]">
            Participants (0/{generalInfo?.participantCount || '0'})
          </h3>
          
          <div className="p-6 text-center text-[var(--app-foreground-muted)]">
            No participants have joined this tanda yet
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
} 