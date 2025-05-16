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
import { useAccount, useChainId } from 'wagmi';
import { TANDA_MANAGER_ADDRESS, TANDA_MANAGER_ABI } from '@/lib/contracts/tanda';

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
        <h1 className="ml-2 text-xl font-bold">MiTanda</h1>
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

function getTandaStatusText(status: any): string {
  if (!status) return 'Unknown';
  
  if (status.isCompleted) return 'Completed';
  if (!status.isActive) return 'Inactive';
  if (!status.isOpen) return 'Closed';
  if (!status.payoutOrderAssigned) return 'Open for Participants';
  
  return 'Active';
}

function getTandaStatusColor(status: any): string {
  if (!status) return 'gray';
  
  if (status.isCompleted) return 'green';
  if (!status.isActive) return 'red';
  if (!status.isOpen) return 'orange';
  if (!status.payoutOrderAssigned) return 'blue';
  
  return 'green';
}

export default function TandaDetail() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { handleTransactionSuccess, handleTransactionError } = useTransactionHandler();
  const [id, setId] = useState<bigint | null>(null);
  const [networkError, setNetworkError] = useState(false);
  
  // Extract the id from params
  useEffect(() => {
    if (params?.id && typeof params.id === 'string') {
      try {
        console.log("Extracting ID from params:", params.id);
        const numericId = BigInt(params.id);
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

  // Destructure tanda data
  const [generalInfo, currentStatus, payoutOrderInfo] = tandaData;
  
  // Prepare contracts for transactions
  const joinTandaContract = {
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'joinTanda',
    args: [generalInfo?.tandaId || id]
  };

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

  // Calculate if user is a participant (would need contract call in a real implementation)
  const isUserParticipant = address && currentStatus && currentStatus.participantListLength > 0;
  
  // Determine status
  const statusText = getTandaStatusText(currentStatus);
  const statusColor = getTandaStatusColor(currentStatus);

  // Format the tanda ID for display and create Basescan URL
  const tandaIdDisplay = generalInfo?.tandaId ? 
    `${generalInfo.tandaId.toString()}` : 
    id?.toString() || '';
  
  // Base explorer URL for smart contracts
  const basescanUrl = `https://basescan.org/address/${generalInfo?.tandaAddress || ''}`;

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
        {/* Join Tanda Button - Always show it if user is not a participant */}
        {!isUserParticipant && (
          <>
            {!currentStatus?.isOpen && (
              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-700 text-sm">
                This tanda is not open for new participants at this time.
              </div>
            )}
            <Transaction
              chainId={base.id}
              contracts={[joinTandaContract]}
              onSuccess={handleTransactionSuccess}
              onError={handleTransactionError}
            >
              <div className="w-full">
                <TransactionButton
                  text="Join Tanda"
                  disabled={networkError || !currentStatus?.isOpen}
                  className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white py-3 rounded-lg font-medium"
                />
              </div>
              <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
              </TransactionStatus>
            </Transaction>
          </>
        )}

        {/* Contribute Button - Show only if tanda is active and user is a participant */}
        {currentStatus?.isActive && isUserParticipant && (
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
        {currentStatus?.isActive && isUserParticipant && (
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
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Contribution Amount</p>
          <p className="text-xl font-bold">
            {generalInfo?.contributionAmount ? formatUnits(generalInfo.contributionAmount, 6) : '0'} USDC
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Current Cycle</p>
          <p className="text-xl font-bold">
            {currentStatus?.currentCycle ? currentStatus.currentCycle.toString() : '0'} of {generalInfo?.participantCount || '0'}
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Funds</p>
          <p className="text-xl font-bold">
            {currentStatus?.totalFunds ? formatUnits(currentStatus.totalFunds, 6) : '0'} USDC
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Participants</p>
          <p className="text-xl font-bold">
            {currentStatus?.totalParticipants ? Number(currentStatus.totalParticipants) : '0'} / {generalInfo?.participantCount || '0'}
          </p>
        </div>
      </div>

      {/* Cycle Information */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
        <h3 className="p-4 bg-gray-50 font-bold border-b">Cycle Information</h3>
        
        <div className="grid grid-cols-2 gap-y-4 p-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Next Payout</p>
            <p className="font-medium">
              {currentStatus?.nextPayoutTimestamp ? formatDate(currentStatus.nextPayoutTimestamp) : '--'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Payout Recipient</p>
            <p className="font-medium">
              {payoutOrderInfo && Array.isArray(payoutOrderInfo) && payoutOrderInfo.length > 0 && payoutOrderInfo[0]
                ? `0x${payoutOrderInfo[0].toString(16)}`.slice(0, 6) + '...' + `0x${payoutOrderInfo[0].toString(16)}`.slice(-4)
                : '0x0000...0000'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Payout Interval</p>
            <p className="font-medium">
              {generalInfo?.payoutInterval ? (Number(generalInfo.payoutInterval) / 86400).toFixed(0) : '0'} days
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Grace Period</p>
            <p className="font-medium">
              {generalInfo?.gracePeriod ? (Number(generalInfo.gracePeriod) / 86400).toFixed(0) : '0'} days
            </p>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
        <h3 className="p-4 bg-gray-50 font-bold border-b">Tanda Status</h3>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">Open for Participants: {currentStatus?.isOpen ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">Active: {currentStatus?.isActive ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.payoutOrderAssigned ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="font-medium">Payout Order Assigned: {currentStatus?.payoutOrderAssigned ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${currentStatus?.isCompleted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="font-medium">Completed: {currentStatus?.isCompleted ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      {currentStatus?.totalParticipants && Number(currentStatus.totalParticipants) > 0 ? (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
          <h3 className="p-4 bg-gray-50 font-bold border-b">
            Participants ({generalInfo?.participantCount || '0'})
          </h3>
          
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2 pb-2 border-b text-sm font-medium text-gray-500">
              <div>ADDRESS</div>
              <div>STATUS</div>
              <div>PAID UNTIL</div>
              <div>PAYOUT ORDER</div>
            </div>
            
            {/* In a real app we would map through participants here */}
            <div className="py-4 text-center text-gray-500">
              Participant data not available
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-[var(--app-card-border)] overflow-hidden">
          <h3 className="p-4 bg-gray-50 font-bold border-b">
            Participants (0/{generalInfo?.participantCount || '0'})
          </h3>
          
          <div className="p-6 text-center text-gray-500">
            No participants have joined this tanda yet
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
} 