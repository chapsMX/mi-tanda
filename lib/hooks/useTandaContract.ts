import { useCallback } from 'react'
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi'
import { TANDA_MANAGER_ABI, TANDA_MANAGER_ADDRESS, USDC_ABI } from '../contracts/tanda'
import { CreateTandaParams, TandaData } from '../types/tanda'

export function useTandaContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync: writeTandaContract } = useWriteContract()
  const { writeContractAsync: writeUsdcContract } = useWriteContract()

  // Get active Tanda IDs
  const { data: activeTandaIds, refetch: refetchActiveTandas } = useReadContract({
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'getActiveTandaIds',
  })

  // Get USDC address
  const { data: usdcAddress } = useReadContract({
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'getUsdcAddress',
  })

  // Get Tanda data
  const getTandaData = useCallback(async (tandaId: bigint) => {
    if (!publicClient) return null
    
    const [generalInfo, currentStatus, payoutOrderInfo] = await publicClient.readContract({
      address: TANDA_MANAGER_ADDRESS,
      abi: TANDA_MANAGER_ABI,
      functionName: 'getTandaData',
      args: [tandaId],
    })

    return {
      generalInfo,
      currentStatus,
      payoutOrderInfo,
    } as TandaData
  }, [publicClient])

  // Create new Tanda
  const createTanda = useCallback(
    async (params: CreateTandaParams) => {
      if (!address || !usdcAddress) return

      // First approve USDC spending
      await writeUsdcContract({
        address: usdcAddress,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [TANDA_MANAGER_ADDRESS, params.contributionAmount],
      })

      // Then create Tanda
      const createTx = await writeTandaContract({
        address: TANDA_MANAGER_ADDRESS,
        abi: TANDA_MANAGER_ABI,
        functionName: 'createTanda',
        args: [
          params.contributionAmount,
          params.payoutInterval,
          params.participantCount,
          params.gracePeriod,
        ],
      })

      await refetchActiveTandas()
      return createTx
    },
    [address, usdcAddress, writeUsdcContract, writeTandaContract, refetchActiveTandas]
  )

  return {
    activeTandaIds,
    usdcAddress,
    getTandaData,
    createTanda,
    refetchActiveTandas,
  }
} 