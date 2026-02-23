/**
 * ABI for the Relayer V2 contract (IRelayer).
 * Update RelayerConfig and types when the deployed contract's JSON ABI is available.
 */
export const ABI = [
  {
    type: "impl",
    name: "RelayerImpl",
    interface_name: "relayer::interface::IRelayer",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "relayer::interface::RelayerConfig",
    members: [
      { name: "supported_tokens_len", type: "core::integer::u64" },
    ],
  },
  {
    type: "interface",
    name: "relayer::interface::IRelayer",
    items: [
      {
        type: "function",
        name: "add_delegator",
        inputs: [
          { name: "validator", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "switch_validator",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
          { name: "delegator", type: "core::starknet::contract_address::ContractAddress" },
          { name: "new_validator", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "stake",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
          { name: "amount", type: "core::integer::u128" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "unstake_action",
        inputs: [
          { name: "delegator", type: "core::starknet::contract_address::ContractAddress" },
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "start_unstake",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
          { name: "amount", type: "core::integer::u128" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_unstake",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_supported_token",
        inputs: [
          { name: "index", type: "core::integer::u64" },
        ],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_unstake_delegators",
        inputs: [],
        outputs: [
          { type: "core::array::Array::<core::starknet::contract_address::ContractAddress>" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_config",
        inputs: [],
        outputs: [
          { type: "relayer::interface::RelayerConfig" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_max_stake",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [
          { type: "core::integer::u128" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_validator_stake_share",
        inputs: [
          { name: "validator", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [
          { type: "core::integer::u128" },
        ],
        state_mutability: "view",
      },
    ],
  },
] as const;
