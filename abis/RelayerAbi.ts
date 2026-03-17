export const ABI = [
  {
    "type": "struct",
    "name": "lst::relayer::interface::RelayerConfig",
    "members": [
      { "name": "max_delegators", "type": "core::integer::u32" },
      { "name": "vrf", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "delegator_class_hash", "type": "core::starknet::class_hash::ClassHash" },
      { "name": "max_share_threshold_bps", "type": "core::integer::u128" },
      { "name": "max_commission_bps", "type": "core::integer::u16" }
    ]
  },
  {
    "type": "function",
    "name": "update_supported_tokens",
    "inputs": [
      { "name": "tokens", "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "update_initial_stake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "initial_stake", "type": "core::integer::u128" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "add_delegator",
    "inputs": [
      { "name": "validator", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "switch_validator",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "delegator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "new_validator", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "stake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "amount", "type": "core::integer::u128" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "update_unstake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "unstake_action",
    "inputs": [
      { "name": "delegator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "start_unstake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "amount", "type": "core::integer::u128" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "get_supported_token",
    "inputs": [
      { "name": "index", "type": "core::integer::u64" }
    ],
    "outputs": [
      { "type": "(core::starknet::contract_address::ContractAddress, core::integer::u64)" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "get_unstake_delegators",
    "inputs": [],
    "outputs": [
      { "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "get_config",
    "inputs": [],
    "outputs": [
      { "type": "lst::relayer::interface::RelayerConfig" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "get_max_stake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "type": "core::integer::u128" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "get_validator_stake_share",
    "inputs": [
      { "name": "validator", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "type": "core::integer::u128" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "set_delegator_weight",
    "inputs": [
      { "name": "delegators", "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>" },
      { "name": "validator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "weights", "type": "core::array::Array::<core::integer::u128>" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_update_unstake_delegator",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "delegator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "unstake_amount", "type": "core::integer::u128" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_config",
    "inputs": [
      { "name": "config", "type": "lst::relayer::interface::RelayerConfig" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_max_stake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "max_stake", "type": "core::integer::u128" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "upgrade",
    "inputs": [
      { "name": "new_class_hash", "type": "core::starknet::class_hash::ClassHash" },
      {
        "name": "eic_data",
        "type": "starkware_utils::components::replaceability::interface::EICData"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "is_paused",
    "inputs": [
      { "name": "functional_unit", "type": "lst::governor::interface::FunctionalUnit" }
    ],
    "outputs": [
      { "type": "core::bool" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "governor",
    "inputs": [],
    "outputs": [
      { "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "operational_unit",
    "inputs": [],
    "outputs": [
      { "type": "lst::governor::interface::OperationalUnit" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "event",
    "name": "UpdateSupportedTokens",
    "inputs": [
      { "name": "tokens", "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>" }
    ]
  },
  {
    "type": "event",
    "name": "UpdateInitialStake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "initial_stake", "type": "core::integer::u128" }
    ]
  },
  {
    "type": "event",
    "name": "DelegatorSwitched",
    "inputs": [
      { "name": "old_validator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "new_validator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "delegator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "old_share", "type": "core::integer::u128" },
      { "name": "new_share", "type": "core::integer::u128" },
      { "name": "old_commission", "type": "core::integer::u16" },
      { "name": "new_commission", "type": "core::integer::u16" }
    ]
  },
  {
    "type": "event",
    "name": "ValidatorStaked",
    "inputs": [
      { "name": "validator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "stake_amount", "type": "core::integer::u128" }
    ]
  },
  {
    "type": "event",
    "name": "ValidatorUnstake",
    "inputs": [
      { "name": "validator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "unstake_amount", "type": "core::integer::u128" }
    ]
  },
  {
    "type": "event",
    "name": "UpdateUnstake",
    "inputs": [
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "updated_delegators", "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>" },
      { "name": "amount_sent_to_withdraw_queue", "type": "core::integer::u128" }
    ]
  },
  {
    "type": "event",
    "name": "UnstakeAction",
    "inputs": [
      { "name": "delegator", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "token", "type": "core::starknet::contract_address::ContractAddress" }
    ]
  }
] as const;
