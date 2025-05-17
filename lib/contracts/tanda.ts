

export const TANDA_MANAGER_ADDRESS = '0x8bf9da65f4c8479f042156e2a9d723273774898b' as const

export const TANDA_MANAGER_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_vrfCoordinator', type: 'address' },
      { internalType: 'uint256', name: '_subscriptionId', type: 'uint256' },
      { internalType: 'bytes32', name: '_gasLane', type: 'bytes32' },
      { internalType: 'uint32', name: '_callbackGasLimit', type: 'uint32' },
      { internalType: 'address', name: '_usdcAddress', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      { internalType: 'address', name: 'have', type: 'address' },
      { internalType: 'address', name: 'want', type: 'address' }
    ],
    name: 'OnlyCoordinatorCanFulfill',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: 'have', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'coordinator', type: 'address' }
    ],
    name: 'OnlyOwnerOrCoordinator',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'vrfCoordinator', type: 'address' }
    ],
    name: 'CoordinatorSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'OwnershipTransferRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'PayoutOrderAssigned',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tandaId', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'requestId', type: 'uint256' }
    ],
    name: 'RandomnessRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tandaId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'tandaAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'contributionAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'payoutInterval', type: 'uint256' },
      { indexed: false, internalType: 'uint16', name: 'participantCount', type: 'uint16' },
      { indexed: false, internalType: 'uint256', name: 'gracePeriod', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'creator', type: 'address' }
    ],
    name: 'TandaCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'newSubscriptionId', type: 'uint256' },
      { indexed: false, internalType: 'bytes32', name: 'newGasLane', type: 'bytes32' },
      { indexed: false, internalType: 'uint32', name: 'newCallbackGasLimit', type: 'uint32' },
      { indexed: false, internalType: 'uint16', name: 'newRequestConfirmations', type: 'uint16' },
      { indexed: false, internalType: 'uint32', name: 'newNumWords', type: 'uint32' },
      { indexed: false, internalType: 'bool', name: 'newNativePayment', type: 'bool' }
    ],
    name: 'VRFConfigUpdated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'activeTandas',
    outputs: [
      { internalType: 'bool', name: '', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_contributionAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_payoutInterval', type: 'uint256' },
      { internalType: 'uint16', name: '_participantCount', type: 'uint16' },
      { internalType: 'uint256', name: '_gracePeriod', type: 'uint256' }
    ],
    name: 'createTanda',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getActiveTandaIds',
    outputs: [
      { internalType: 'uint256[]', name: '', type: 'uint256[]' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'getTandaAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'getTandaData',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tandaId', type: 'uint256' },
          { internalType: 'uint256', name: 'contributionAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'payoutInterval', type: 'uint256' },
          { internalType: 'uint16', name: 'participantCount', type: 'uint16' },
          { internalType: 'uint256', name: 'gracePeriod', type: 'uint256' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'address', name: 'usdcTokenAddress', type: 'address' },
          { internalType: 'address', name: 'managerAddress', type: 'address' },
          { internalType: 'address', name: 'tandaAddress', type: 'address' }
        ],
        internalType: 'struct GeneralInfo',
        name: 'generalInfo',
        type: 'tuple'
      },
      {
        components: [
          { internalType: 'enum Tanda.TandaState', name: 'state', type: 'uint8' },
          { internalType: 'uint256', name: 'currentCycle', type: 'uint256' },
          { internalType: 'uint256', name: 'totalParticipants', type: 'uint256' },
          { internalType: 'uint256', name: 'totalFunds', type: 'uint256' },
          { internalType: 'uint256', name: 'nextPayoutTimestamp', type: 'uint256' },
          { internalType: 'uint256', name: 'startTimestamp', type: 'uint256' },
          { internalType: 'bool', name: 'payoutOrderAssigned', type: 'bool' },
          { internalType: 'bool', name: 'isActive', type: 'bool' },
          { internalType: 'bool', name: 'isOpen', type: 'bool' },
          { internalType: 'bool', name: 'isCompleted', type: 'bool' },
          { internalType: 'uint256', name: 'participantListLength', type: 'uint256' }
        ],
        internalType: 'struct CurrentStatus',
        name: 'currentStatus',
        type: 'tuple'
      },
      { internalType: 'uint256[]', name: 'payoutOrderInfo', type: 'uint256[]' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getUsdcAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getVRFConfig',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'uint32', name: '', type: 'uint32' },
      { internalType: 'uint16', name: '', type: 'uint16' },
      { internalType: 'uint32', name: '', type: 'uint32' },
      { internalType: 'bool', name: '', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'isTandaActive',
    outputs: [
      { internalType: 'bool', name: '', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextTandaId',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestId', type: 'uint256' },
      { internalType: 'uint256[]', name: 'randomWords', type: 'uint256[]' }
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'requestRandomnessForTanda',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'requestRandomnessForTandaTest',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 's_vrfCoordinator',
    outputs: [
      { internalType: 'contract IVRFCoordinatorV2Plus', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vrfCoordinator', type: 'address' }
    ],
    name: 'setCoordinator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'tandaIdToAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_subscriptionId', type: 'uint256' },
      { internalType: 'bytes32', name: '_gasLane', type: 'bytes32' },
      { internalType: 'uint32', name: '_callbackGasLimit', type: 'uint32' },
      { internalType: 'uint16', name: '_requestConfirmations', type: 'uint16' },
      { internalType: 'uint32', name: '_numWords', type: 'uint32' },
      { internalType: 'bool', name: '_nativePayment', type: 'bool' }
    ],
    name: 'updateVRFConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'usdcAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'vrfRequestIdToTandaId',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'joinTanda',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'contribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tandaId', type: 'uint256' }
    ],
    name: 'claimPayout',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

// Base network configuration
export const BASE_CHAIN_ID = 8453

// USDC token address on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

// USDC token ABI (minimal for approval and balance)
export const USDC_ABI = [
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const 