export const ABI = [
  {
    "type": "impl",
    "name": "IDelegatorImpl",
    "interface_name": "lst::delegator::interface::IDelegator"
  },
  {
    "type": "struct",
    "name": "starkware_utils::time::time::Timestamp",
    "members": [
      {
        "name": "seconds",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::option::Option::<starkware_utils::time::time::Timestamp>",
    "variants": [
      {
        "name": "Some",
        "type": "starkware_utils::time::time::Timestamp"
      },
      {
        "name": "None",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "staking::pool::interface::PoolMemberInfoV1",
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
        "type": "core::option::Option::<starkware_utils::time::time::Timestamp>"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::IValidatorRegistryABIDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::delegator::interface::IDelegatorConfig",
    "members": [
      {
        "name": "validator_registry",
        "type": "lst::validator_registry::interface::IValidatorRegistryABIDispatcher"
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
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
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
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "update_unstake_intent",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "switch_pool",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "new_staker",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "unstake_action",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "send_to_withdraw_queue",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "get_pool_member_info",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "staking::pool::interface::PoolMemberInfoV1"
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
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "initializer",
        "inputs": [
          {
            "name": "calldata",
            "type": "core::array::Array::<core::felt252>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "CommonCompImpl",
    "interface_name": "lst::utils::common::ICommon"
  },
  {
    "type": "enum",
    "name": "lst::governor::interface::OperationalUnit",
    "variants": [
      {
        "name": "NONE",
        "type": "()"
      },
      {
        "name": "LST",
        "type": "()"
      },
      {
        "name": "WQ",
        "type": "()"
      },
      {
        "name": "DELEGATORS",
        "type": "()"
      },
      {
        "name": "VALIDATOR_REGISTRY",
        "type": "()"
      },
      {
        "name": "SWAP_EXTENSION",
        "type": "()"
      },
      {
        "name": "LST_WRAPPER",
        "type": "()"
      }
    ]
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
        "name": "governor",
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
        "name": "operational_unit",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::governor::interface::OperationalUnit"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "governor",
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
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "lst::delegator::interface::Events::RewardsClaimed",
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
    "name": "lst::delegator::interface::Events::UnstakeIntentStarted",
    "kind": "struct",
    "members": [
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_amount",
        "type": "core::integer::u128",
        "kind": "data"
      },
      {
        "name": "old_amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::interface::Events::UnstakeAction",
    "kind": "struct",
    "members": [
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::interface::Events::Stake",
    "kind": "struct",
    "members": [
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::delegator::interface::Events::SwitchPool",
    "kind": "struct",
    "members": [
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_staker",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_pool",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "old_pool",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
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
        "kind": "key"
      },
      {
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
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
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event",
        "kind": "flat"
      },
      {
        "name": "RewardsClaimed",
        "type": "lst::delegator::interface::Events::RewardsClaimed",
        "kind": "nested"
      },
      {
        "name": "UnstakeIntentStarted",
        "type": "lst::delegator::interface::Events::UnstakeIntentStarted",
        "kind": "nested"
      },
      {
        "name": "UnstakeAction",
        "type": "lst::delegator::interface::Events::UnstakeAction",
        "kind": "nested"
      },
      {
        "name": "Stake",
        "type": "lst::delegator::interface::Events::Stake",
        "kind": "nested"
      },
      {
        "name": "SwitchPool",
        "type": "lst::delegator::interface::Events::SwitchPool",
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
