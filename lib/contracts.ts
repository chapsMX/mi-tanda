export const TANDA_MANAGER_ADDRESS = '0x8bF9dA65F4c8479F042156e2a9D723273774898b';
export const TANDA_MANAGER_ABI = [
  {
    "inputs": [],
    "name": "getActiveTandaIds",
    "outputs": [{"internalType": "uint256[]","name": "","type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tandaId","type": "uint256"}],
    "name": "getTandaData",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256","name": "tandaId","type": "uint256"},
          {"internalType": "uint256","name": "contributionAmount","type": "uint256"},
          {"internalType": "uint256","name": "payoutInterval","type": "uint256"},
          {"internalType": "uint16","name": "participantCount","type": "uint16"},
          {"internalType": "uint256","name": "gracePeriod","type": "uint256"},
          {"internalType": "address","name": "creator","type": "address"},
          {"internalType": "address","name": "usdcTokenAddress","type": "address"},
          {"internalType": "address","name": "managerAddress","type": "address"},
          {"internalType": "address","name": "tandaAddress","type": "address"}
        ],
        "internalType": "struct GeneralInfo",
        "name": "generalInfo",
        "type": "tuple"
      },
      {
        "components": [
          {"internalType": "enum Tanda.TandaState","name": "state","type": "uint8"},
          {"internalType": "uint256","name": "currentCycle","type": "uint256"},
          {"internalType": "uint256","name": "totalParticipants","type": "uint256"},
          {"internalType": "uint256","name": "totalFunds","type": "uint256"},
          {"internalType": "uint256","name": "nextPayoutTimestamp","type": "uint256"},
          {"internalType": "uint256","name": "startTimestamp","type": "uint256"},
          {"internalType": "bool","name": "payoutOrderAssigned","type": "bool"},
          {"internalType": "bool","name": "isActive","type": "bool"},
          {"internalType": "bool","name": "isOpen","type": "bool"},
          {"internalType": "bool","name": "isCompleted","type": "bool"},
          {"internalType": "uint256","name": "participantListLength","type": "uint256"}
        ],
        "internalType": "struct CurrentStatus",
        "name": "currentStatus",
        "type": "tuple"
      },
      {
        "internalType": "uint256[]",
        "name": "payoutOrderInfo",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const; 