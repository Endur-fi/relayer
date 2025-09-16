export const ABI = [
  {
    "type": "impl",
    "name": "ValidatorRegistryAdminImpl",
    "interface_name": "lst::validator_registry::interface::IValidatorRegistryAdmin"
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
    "type": "struct",
    "name": "lst::swap_extensions::interface::ISwapExtensionBaseDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::TokenConfig",
    "members": [
      {
        "name": "lst_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "withdrawal_queue",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "swap_extension",
        "type": "lst::swap_extensions::interface::ISwapExtensionBaseDispatcher"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::ValidatorRegistrySettings",
    "members": [
      {
        "name": "rewards_fee_bps",
        "type": "core::integer::u128"
      },
      {
        "name": "treasury",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::Validator",
    "members": [
      {
        "name": "address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "weight",
        "type": "core::integer::u8"
      },
      {
        "name": "is_allowed",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::TokenStakeInfo",
    "members": [
      {
        "name": "is_supported",
        "type": "core::bool"
      },
      {
        "name": "staked_amount",
        "type": "core::integer::u128"
      },
      {
        "name": "pending_stake_amount",
        "type": "core::integer::u128"
      },
      {
        "name": "last_epoch",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::DelegatorInfo",
    "members": [
      {
        "name": "delegator_index",
        "type": "core::integer::u32"
      },
      {
        "name": "validator_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "interface",
    "name": "lst::validator_registry::interface::IValidatorRegistryAdmin",
    "items": [
      {
        "type": "function",
        "name": "add_validator",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "weight",
            "type": "core::integer::u8"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_validator",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "weight",
            "type": "core::integer::u8"
          },
          {
            "name": "is_allowed",
            "type": "core::bool"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_supported_token",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "config",
            "type": "lst::validator_registry::interface::TokenConfig"
          },
          {
            "name": "is_supported",
            "type": "core::bool"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "add_delegator",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "delegator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "initial_stake",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_settings",
        "inputs": [
          {
            "name": "settings",
            "type": "lst::validator_registry::interface::ValidatorRegistrySettings"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_validator",
        "inputs": [
          {
            "name": "validator_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "lst::validator_registry::interface::Validator"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_validator_by_index",
        "inputs": [
          {
            "name": "index",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "lst::validator_registry::interface::Validator"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_validator_token_info",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "lst::validator_registry::interface::TokenStakeInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_token_config",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "lst::validator_registry::interface::TokenConfig"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_delegator",
        "inputs": [
          {
            "name": "delegator_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "lst::validator_registry::interface::DelegatorInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_delegator_by_index",
        "inputs": [
          {
            "name": "validator_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "index",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "(core::starknet::contract_address::ContractAddress, lst::validator_registry::interface::DelegatorInfo)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_validators",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_delegators_for_validator",
        "inputs": [
          {
            "name": "validator_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_settings",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::validator_registry::interface::ValidatorRegistrySettings"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_unassigned_stake",
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
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ValidatorRegistryImpl",
    "interface_name": "lst::validator_registry::interface::IValidatorRegistry"
  },
  {
    "type": "struct",
    "name": "lst::withdrawal_queue::interface::IWithdrawalQueueDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
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
    "type": "struct",
    "name": "staking::staking::interface::IStakingDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "interface",
    "name": "lst::validator_registry::interface::IValidatorRegistry",
    "items": [
      {
        "type": "function",
        "name": "set_validator_stake",
        "inputs": [
          {
            "name": "validator_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "new_stake",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "send_to_withdrawal_queue",
        "inputs": [
          {
            "name": "withdraw_queue",
            "type": "lst::withdrawal_queue::interface::IWithdrawalQueueDispatcher"
          },
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
        "name": "on_switch",
        "inputs": [
          {
            "name": "new_validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "receive_funds",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "stake_to_validator",
        "inputs": [
          {
            "name": "delegator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "claim_rewards_for_validator",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "should_claim_rewards",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
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
        "name": "total_stake",
        "inputs": [
          {
            "name": "token",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_staking_contract",
        "inputs": [],
        "outputs": [
          {
            "type": "staking::staking::interface::IStakingDispatcher"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ValidatorMigrationImpl",
    "interface_name": "lst::validator_registry::interface::IValidatorMigration"
  },
  {
    "type": "interface",
    "name": "lst::validator_registry::interface::IValidatorMigration",
    "items": [
      {
        "type": "function",
        "name": "migrate_delegators",
        "inputs": [
          {
            "name": "validator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "delegators",
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
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
        "name": "staking_contract",
        "type": "staking::staking::interface::IStakingDispatcher"
      },
      {
        "name": "settings",
        "type": "lst::validator_registry::interface::ValidatorRegistrySettings"
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
    "name": "lst::utils::common::CommonComp::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "lst::validator_registry::interface::Events::ValidatorAdded",
    "kind": "struct",
    "members": [
      {
        "name": "address",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "weight",
        "type": "core::integer::u8",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::validator_registry::interface::Events::ValidatorUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "address",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_weight",
        "type": "core::integer::u8",
        "kind": "data"
      },
      {
        "name": "is_allowed",
        "type": "core::bool",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::validator_registry::interface::Events::TokenInfoUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "config",
        "type": "lst::validator_registry::interface::TokenConfig",
        "kind": "data"
      },
      {
        "name": "is_supported",
        "type": "core::bool",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::validator_registry::interface::Events::DelegatorUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "delegator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "delegator_index",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "is_active",
        "type": "core::bool",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::validator_registry::interface::Events::FundsReceived",
    "kind": "struct",
    "members": [
      {
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
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
    "name": "lst::validator_registry::interface::Events::Stake",
    "kind": "struct",
    "members": [
      {
        "name": "validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "delegator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
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
    "name": "lst::validator_registry::interface::Events::RewardsClaimed",
    "kind": "struct",
    "members": [
      {
        "name": "validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "claim_amount",
        "type": "core::integer::u128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::validator_registry::interface::Events::ValidatorSwitched",
    "kind": "struct",
    "members": [
      {
        "name": "delegator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "old_validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_validator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::validator_registry::validator_registry::ValidatorRegistry::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        "kind": "flat"
      },
      {
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "CommonCompEvent",
        "type": "lst::utils::common::CommonComp::Event",
        "kind": "flat"
      },
      {
        "name": "ValidatorAdded",
        "type": "lst::validator_registry::interface::Events::ValidatorAdded",
        "kind": "nested"
      },
      {
        "name": "ValidatorUpdated",
        "type": "lst::validator_registry::interface::Events::ValidatorUpdated",
        "kind": "nested"
      },
      {
        "name": "TokenInfoUpdated",
        "type": "lst::validator_registry::interface::Events::TokenInfoUpdated",
        "kind": "nested"
      },
      {
        "name": "DelegatorUpdated",
        "type": "lst::validator_registry::interface::Events::DelegatorUpdated",
        "kind": "nested"
      },
      {
        "name": "FundsReceived",
        "type": "lst::validator_registry::interface::Events::FundsReceived",
        "kind": "nested"
      },
      {
        "name": "Stake",
        "type": "lst::validator_registry::interface::Events::Stake",
        "kind": "nested"
      },
      {
        "name": "RewardsClaimed",
        "type": "lst::validator_registry::interface::Events::RewardsClaimed",
        "kind": "nested"
      },
      {
        "name": "ValidatorSwitched",
        "type": "lst::validator_registry::interface::Events::ValidatorSwitched",
        "kind": "nested"
      }
    ]
  }
];