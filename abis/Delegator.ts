export const ABI = [
  {
    "type": "impl",
    "name": "IDelegatorImpl",
    "interface_name": "lst::delegator::interface::IDelegator"
  },
  {
    "type": "enum",
    "name": "core::option::Option::<core::integer::u64>",
    "variants": [
      {
        "name": "Some",
        "type": "core::integer::u64"
      },
      {
        "name": "None",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "contracts::pool::interface::PoolMemberInfo",
    "members": [
      {
        "name": "reward_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u128"
      },
      {
        "name": "index",
        "type": "core::integer::u128"
      },
      {
        "name": "unclaimed_rewards",
        "type": "core::integer::u128"
      },
      {
        "name": "commission",
        "type": "core::integer::u16"
      },
      {
        "name": "unpool_amount",
        "type": "core::integer::u128"
      },
      {
        "name": "unpool_time",
        "type": "core::option::Option::<core::integer::u64>"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::delegator::interface::IDelegatorConfig",
    "members": [
      {
        "name": "pool",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "treasury",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "lst",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "withdrawal_queue",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "lst::delegator::interface::IDelegator",
    "items": [
      {
        "type": "function",
        "name": "claim_rewards",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u128"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "start_delegation",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "stake",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "start_unstake_intent",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "unstake_action",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_pool_member_info",
        "inputs": [],
        "outputs": [
          {
            "type": "contracts::pool::interface::PoolMemberInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_config",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::delegator::interface::IDelegatorConfig"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "set_config",
        "inputs": [
          {
            "name": "config",
            "type": "lst::delegator::interface::IDelegatorConfig"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "is_unstake_intent_active",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "CommonCompImpl",
    "interface_name": "lst::utils::common::ICommon"
  },
  {
    "type": "interface",
    "name": "lst::utils::common::ICommon",
    "items": [
      {
        "type": "function",
        "name": "upgrade",
        "inputs": [
          {
            "name": "new_class",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "pause",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "unpause",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "is_paused",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounce_ownership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "config",
        "type": "lst::delegator::interface::IDelegatorConfig"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "kind": "struct",
    "members": [
      {
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused",
        "kind": "nested"
      },
      {
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::utils::common::CommonComp::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "lst::delegator::delegator::Delegator::RewardsClaimed",
    "kind": "struct",
    "members": [
      {
        "name": "amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::delegator::Delegator::UnstakeIntentStarted",
    "kind": "struct",
    "members": [
      {
        "name": "amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::delegator::Delegator::UnstakeAction",
    "kind": "struct",
    "members": [
      {
        "name": "amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::delegator::Delegator::Stake",
    "kind": "struct",
    "members": [
      {
        "name": "amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::lst::interface::Fee",
    "kind": "struct",
    "members": [
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::delegator::Delegator::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        "kind": "flat"
      },
      {
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "CommonCompEvent",
        "type": "lst::utils::common::CommonComp::Event",
        "kind": "flat"
      },
      {
        "name": "RewardsClaimed",
        "type": "lst::delegator::delegator::Delegator::RewardsClaimed",
        "kind": "nested"
      },
      {
        "name": "UnstakeIntentStarted",
        "type": "lst::delegator::delegator::Delegator::UnstakeIntentStarted",
        "kind": "nested"
      },
      {
        "name": "UnstakeAction",
        "type": "lst::delegator::delegator::Delegator::UnstakeAction",
        "kind": "nested"
      },
      {
        "name": "Stake",
        "type": "lst::delegator::delegator::Delegator::Stake",
        "kind": "nested"
      },
      {
        "name": "Fee",
        "type": "lst::lst::interface::Fee",
        "kind": "nested"
      }
    ]
  }
] as const;
