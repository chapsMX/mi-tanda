import { Address } from 'viem'

export enum TandaState {
  PENDING = 0,
  ACTIVE = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

export interface GeneralInfo {
  tandaId: bigint
  contributionAmount: bigint
  payoutInterval: bigint
  participantCount: number
  gracePeriod: bigint
  creator: Address
  usdcTokenAddress: Address
  managerAddress: Address
  tandaAddress: Address
}

export interface CurrentStatus {
  state: TandaState
  currentCycle: bigint
  totalParticipants: bigint
  totalFunds: bigint
  nextPayoutTimestamp: bigint
  startTimestamp: bigint
  payoutOrderAssigned: boolean
  isActive: boolean
  isOpen: boolean
  isCompleted: boolean
  participantListLength: bigint
}

export interface TandaData {
  generalInfo: GeneralInfo
  currentStatus: CurrentStatus
  payoutOrderInfo: bigint[]
}

export interface CreateTandaParams {
  contributionAmount: bigint
  payoutInterval: bigint
  participantCount: number
  gracePeriod: bigint
} 