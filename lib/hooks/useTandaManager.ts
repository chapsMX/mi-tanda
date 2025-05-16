import { useContractRead } from 'wagmi';
import { TANDA_MANAGER_ADDRESS, TANDA_MANAGER_ABI } from '../contracts';

export function useActiveTandas() {
  const result = useContractRead({
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'getActiveTandaIds'
  });

  console.log('Active Tandas Result:', {
    data: result.data,
    isError: result.isError,
    error: result.error,
    isLoading: result.isLoading
  });

  return result;
}

export function useTandaData(tandaId: bigint, options?: { enabled?: boolean }) {
  const result = useContractRead({
    address: TANDA_MANAGER_ADDRESS,
    abi: TANDA_MANAGER_ABI,
    functionName: 'getTandaData',
    args: [tandaId],
    query: {
      enabled: options?.enabled !== undefined ? options.enabled : true
    }
  });

  console.log(`Tanda Data Result for ID ${tandaId}:`, {
    data: result.data,
    isError: result.isError,
    error: result.error,
    isLoading: result.isLoading
  });

  return result;
} 