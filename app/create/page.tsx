'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, useTransactionHandler } from '../components/DemoComponents';
import { useRouter } from 'next/navigation';
import { parseUnits } from 'viem';
import { useReadContract, useAccount, useChainId } from 'wagmi';
import { TANDA_MANAGER_ADDRESS, TANDA_MANAGER_ABI, USDC_ADDRESS, USDC_ABI } from '@/lib/contracts/tanda';
import { base } from 'wagmi/chains';
import Header from '../components/Header';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";

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

export default function CreateTandaPage() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { handleTransactionSuccess, handleTransactionError } = useTransactionHandler();
  
  const [formData, setFormData] = useState({
    contributionAmount: '',
    payoutInterval: '',
    gracePeriod: '',
    participantCount: ''
  });

  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, TANDA_MANAGER_ADDRESS] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && chainId === base.id,
    },
  });

  // Check network on mount and when chainId changes
  useEffect(() => {
    if (chainId && chainId !== base.id) {
      setNetworkError(true);
    } else {
      setNetworkError(false);
      // Refresh allowance when on correct network
      if (address && chainId === base.id) {
        refetchAllowance();
      }
    }
  }, [chainId, address, refetchAllowance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate network before proceeding
    if (chainId !== base.id) {
      setNetworkError(true);
      setError('Please switch to Base network before creating a tanda');
      return;
    }

    // Basic validation
    const contribution = parseFloat(formData.contributionAmount);
    if (contribution < 10) {
      setError('Contribution amount must be at least 10 USDC');
      return;
    }

    const participants = parseInt(formData.participantCount);
    if (participants < 2) {
      setError('Must have at least 2 participants');
      return;
    }
  };

  const needsApproval = 
    allowance !== undefined && 
    formData.contributionAmount && 
    parseUnits(formData.contributionAmount, 6) > allowance;

  // Prepare contracts for transactions
  const approveContract = {
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'approve',
    args: [
      TANDA_MANAGER_ADDRESS,
      formData.contributionAmount ? parseUnits(formData.contributionAmount, 6) : BigInt(0)
    ]
  };

  const createTandaContract = {
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'createTanda',
    args: [
      formData.contributionAmount ? parseUnits(formData.contributionAmount, 6) : BigInt(0),
      formData.payoutInterval ? BigInt(parseInt(formData.payoutInterval) * 24 * 60 * 60) : BigInt(0),
      formData.participantCount ? parseInt(formData.participantCount) : 0,
      formData.gracePeriod ? BigInt(parseInt(formData.gracePeriod) * 24 * 60 * 60) : BigInt(0)
    ]
  };

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
        <h1 className="text-3xl font-bold text-[#0052FF]">Create New Tanda</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[var(--app-card-border)] p-6">
        {networkError && (
          <div className="p-4 mb-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <h3 className="font-bold text-yellow-800">Wrong Network Detected</h3>
            <p className="text-yellow-700 mb-2">Please connect to Base network to create a tanda</p>
            <Link href="/tandas">
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Go Back to Tandas
              </Button>
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-[#0052FF] mb-2">
              Contribution Amount (USDC)
            </label>
            <input
              type="number"
              name="contributionAmount"
              min="10"
              step="1"
              value={formData.contributionAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent"
              placeholder="Minimum 10 USDC"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0052FF] mb-2">
              Payout Interval (days)
            </label>
            <input
              type="number"
              name="payoutInterval"
              min="1"
              step="1"
              value={formData.payoutInterval}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent"
              placeholder="Enter days between payouts"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0052FF] mb-2">
              Grace Period (days)
            </label>
            <input
              type="number"
              name="gracePeriod"
              min="1"
              step="1"
              value={formData.gracePeriod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent"
              placeholder="Enter grace period in days"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0052FF] mb-2">
              Number of Participants
            </label>
            <input
              type="number"
              name="participantCount"
              min="2"
              step="1"
              value={formData.participantCount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent"
              placeholder="Minimum 2 participants"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-4 space-y-4">
            {needsApproval && (
              <Transaction
                chainId={base.id}
                contracts={[approveContract]}
                onSuccess={handleTransactionSuccess}
                onError={handleTransactionError}
              >
                <div className="w-full mb-3">
                  <TransactionButton
                    text="Approve USDC"
                    disabled={networkError || !formData.contributionAmount}
                    className="w-full"
                  />
                </div>
                <TransactionStatus>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </TransactionStatus>
              </Transaction>
            )}
            
            <Transaction
              chainId={base.id}
              contracts={[createTandaContract]}
              onSuccess={(data) => {
                handleTransactionSuccess(data);
                router.push('/tandas');
              }}
              onError={handleTransactionError}
            >
              <div className="w-full">
                <TransactionButton
                  text="Create Tanda"
                  disabled={networkError || isSubmitting || needsApproval || !formData.contributionAmount || !formData.payoutInterval || !formData.gracePeriod || !formData.participantCount}
                  className="w-full"
                />
              </div>
              <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
              </TransactionStatus>
            </Transaction>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
} 