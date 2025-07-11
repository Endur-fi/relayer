export const ABI = [
  {
    type: "impl",
    name: "MyERC4626Impl",
    interface_name: "lst::lst::interface::IERC4626",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "interface",
    name: "lst::lst::interface::IERC4626",
    items: [
      {
        type: "function",
        name: "asset",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "total_assets",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "convert_to_shares",
        inputs: [
          {
            name: "assets",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "convert_to_assets",
        inputs: [
          {
            name: "shares",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "max_deposit",
        inputs: [
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "preview_deposit",
        inputs: [
          {
            name: "assets",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "deposit",
        inputs: [
          {
            name: "assets",
            type: "core::integer::u256",
          },
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "max_mint",
        inputs: [
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "preview_mint",
        inputs: [
          {
            name: "shares",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "mint",
        inputs: [
          {
            name: "shares",
            type: "core::integer::u256",
          },
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "max_withdraw",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "preview_withdraw",
        inputs: [
          {
            name: "assets",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "withdraw",
        inputs: [
          {
            name: "assets",
            type: "core::integer::u256",
          },
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "max_redeem",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "preview_redeem",
        inputs: [
          {
            name: "shares",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "redeem",
        inputs: [
          {
            name: "shares",
            type: "core::integer::u256",
          },
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "LSTAdditionalImpl",
    interface_name: "lst::lst::interface::ILSTAdditional",
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "lst::withdrawal_queue::interface::IWithdrawalQueueDispatcher",
    members: [
      {
        name: "contract_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "struct",
    name: "staking::staking::interface::IStakingDispatcher",
    members: [
      {
        name: "contract_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "struct",
    name: "lst::lst::interface::Config",
    members: [
      {
        name: "deposit_fee_bps",
        type: "core::integer::u256",
      },
      {
        name: "withdraw_fee_bps",
        type: "core::integer::u256",
      },
      {
        name: "rewards_fee_bps",
        type: "core::integer::u256",
      },
      {
        name: "treasury",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "withdraw_queue",
        type: "lst::withdrawal_queue::interface::IWithdrawalQueueDispatcher",
      },
      {
        name: "staker",
        type: "staking::staking::interface::IStakingDispatcher",
      },
      {
        name: "validator",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "lst::lst::interface::DelegatorInfo",
    members: [
      {
        name: "is_active",
        type: "core::bool",
      },
      {
        name: "delegator_index",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "interface",
    name: "lst::lst::interface::ILSTAdditional",
    items: [
      {
        type: "function",
        name: "initializer",
        inputs: [
          {
            name: "calldata",
            type: "core::array::Array::<core::felt252>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "deposit_with_referral",
        inputs: [
          {
            name: "assets",
            type: "core::integer::u256",
          },
          {
            name: "receiver",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "referral",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "set_config",
        inputs: [
          {
            name: "config",
            type: "lst::lst::interface::Config",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_config",
        inputs: [],
        outputs: [
          {
            type: "lst::lst::interface::Config",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "unclaimed_rewards",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "stake",
        inputs: [
          {
            name: "delegator",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "send_to_withdraw_queue",
        inputs: [
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "before_unstake",
        inputs: [
          {
            name: "new_amount",
            type: "core::integer::u256",
          },
          {
            name: "old_amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "add_delegator",
        inputs: [
          {
            name: "delegator",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_delegator_info",
        inputs: [
          {
            name: "delegator",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "info",
            type: "lst::lst::interface::DelegatorInfo",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "is_delegator",
        inputs: [
          {
            name: "delegator",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "claim_rewards",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "total_delegators",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_delegator",
        inputs: [
          {
            name: "index",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "CommonCompImpl",
    interface_name: "lst::utils::common::ICommon",
  },
  {
    type: "interface",
    name: "lst::utils::common::ICommon",
    items: [
      {
        type: "function",
        name: "upgrade",
        inputs: [
          {
            name: "new_class",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "pause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "unpause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "is_paused",
        inputs: [],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "AccessControlImpl",
    interface_name:
      "openzeppelin_access::accesscontrol::interface::IAccessControl",
  },
  {
    type: "interface",
    name: "openzeppelin_access::accesscontrol::interface::IAccessControl",
    items: [
      {
        type: "function",
        name: "has_role",
        inputs: [
          {
            name: "role",
            type: "core::felt252",
          },
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_role_admin",
        inputs: [
          {
            name: "role",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "grant_role",
        inputs: [
          {
            name: "role",
            type: "core::felt252",
          },
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "revoke_role",
        inputs: [
          {
            name: "role",
            type: "core::felt252",
          },
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_role",
        inputs: [
          {
            name: "role",
            type: "core::felt252",
          },
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "ERC4626MetadataImpl",
    interface_name: "openzeppelin_token::erc20::interface::IERC20Metadata",
  },
  {
    type: "interface",
    name: "openzeppelin_token::erc20::interface::IERC20Metadata",
    items: [
      {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "decimals",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u8",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "ERC20Impl",
    interface_name: "openzeppelin_token::erc20::interface::IERC20",
  },
  {
    type: "interface",
    name: "openzeppelin_token::erc20::interface::IERC20",
    items: [
      {
        type: "function",
        name: "total_supply",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "balance_of",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "allowance",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transfer_from",
        inputs: [
          {
            name: "sender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "approve",
        inputs: [
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "ERC20CamelOnlyImpl",
    interface_name: "openzeppelin_token::erc20::interface::IERC20CamelOnly",
  },
  {
    type: "interface",
    name: "openzeppelin_token::erc20::interface::IERC20CamelOnly",
    items: [
      {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "balanceOf",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transferFrom",
        inputs: [
          {
            name: "sender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "name",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "symbol",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "asset",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "config",
        type: "lst::lst::interface::Config",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    kind: "struct",
    members: [
      {
        name: "class_hash",
        type: "core::starknet::class_hash::ClassHash",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Upgraded",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Paused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Unpaused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Paused",
        type: "openzeppelin_security::pausable::PausableComponent::Paused",
        kind: "nested",
      },
      {
        name: "Unpaused",
        type: "openzeppelin_security::pausable::PausableComponent::Unpaused",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
      {
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "lst::utils::common::CommonComp::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "lst::lst::erc4626::ERC4626Component::Deposit",
    kind: "struct",
    members: [
      {
        name: "sender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "assets",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "shares",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::erc4626::ERC4626Component::Withdraw",
    kind: "struct",
    members: [
      {
        name: "sender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "receiver",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "assets",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "shares",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::erc4626::ERC4626Component::Event",
    kind: "enum",
    variants: [
      {
        name: "Deposit",
        type: "lst::lst::erc4626::ERC4626Component::Deposit",
        kind: "nested",
      },
      {
        name: "Withdraw",
        type: "lst::lst::erc4626::ERC4626Component::Withdraw",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
    kind: "struct",
    members: [
      {
        name: "from",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "value",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "spender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "value",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc20::erc20::ERC20Component::Event",
    kind: "enum",
    variants: [
      {
        name: "Transfer",
        type: "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
        kind: "nested",
      },
      {
        name: "Approval",
        type: "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "lst::utils::access_control::MyAccessControlComp::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
    kind: "struct",
    members: [
      {
        name: "role",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "sender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
    kind: "struct",
    members: [
      {
        name: "role",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "sender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
    kind: "struct",
    members: [
      {
        name: "role",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "previous_admin_role",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "new_admin_role",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "RoleGranted",
        type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
        kind: "nested",
      },
      {
        name: "RoleRevoked",
        type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
        kind: "nested",
      },
      {
        name: "RoleAdminChanged",
        type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_introspection::src5::SRC5Component::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "lst::lst::interface::DispatchToStake",
    kind: "struct",
    members: [
      {
        name: "delegator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::interface::DispatchToWithdrawQueue",
    kind: "struct",
    members: [
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::lst::LST::DelegatorUpdate",
    kind: "struct",
    members: [
      {
        name: "delegator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "info",
        type: "lst::lst::interface::DelegatorInfo",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::interface::Fee",
    kind: "struct",
    members: [
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "receiver",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::lst::LST::Referral",
    kind: "struct",
    members: [
      {
        name: "referrer",
        type: "core::byte_array::ByteArray",
        kind: "key",
      },
      {
        name: "referee",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "assets",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "lst::lst::lst::LST::Event",
    kind: "enum",
    variants: [
      {
        name: "UpgradeableEvent",
        type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        kind: "flat",
      },
      {
        name: "PausableEvent",
        type: "openzeppelin_security::pausable::PausableComponent::Event",
        kind: "flat",
      },
      {
        name: "ReentrancyGuardEvent",
        type: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        kind: "flat",
      },
      {
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
      {
        name: "CommonCompEvent",
        type: "lst::utils::common::CommonComp::Event",
        kind: "flat",
      },
      {
        name: "ERC4626Event",
        type: "lst::lst::erc4626::ERC4626Component::Event",
        kind: "flat",
      },
      {
        name: "ERC20Event",
        type: "openzeppelin_token::erc20::erc20::ERC20Component::Event",
        kind: "flat",
      },
      {
        name: "MyAccessControlCompEvent",
        type: "lst::utils::access_control::MyAccessControlComp::Event",
        kind: "flat",
      },
      {
        name: "AccessControlComponentEvent",
        type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
        kind: "flat",
      },
      {
        name: "SRC5Event",
        type: "openzeppelin_introspection::src5::SRC5Component::Event",
        kind: "flat",
      },
      {
        name: "DispatchToStake",
        type: "lst::lst::interface::DispatchToStake",
        kind: "nested",
      },
      {
        name: "DispatchToWithdrawQueue",
        type: "lst::lst::interface::DispatchToWithdrawQueue",
        kind: "nested",
      },
      {
        name: "DelegatorUpdate",
        type: "lst::lst::lst::LST::DelegatorUpdate",
        kind: "nested",
      },
      {
        name: "Fee",
        type: "lst::lst::interface::Fee",
        kind: "nested",
      },
      {
        name: "Referral",
        type: "lst::lst::lst::LST::Referral",
        kind: "nested",
      },
    ],
  },
] as const;
