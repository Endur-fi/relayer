export const ABI = [
  {
    "type": "impl",
    "name": "WithdrawalQueueImpl",
    "interface_name": "lst::withdrawal_queue::interface::IWithdrawalQueue",
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128",
      },
      {
        "name": "high",
        "type": "core::integer::u128",
      },
    ],
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()",
      },
      {
        "name": "True",
        "type": "()",
      },
    ],
  },
  {
    "type": "struct",
    "name": "lst::withdrawal_queue::interface::WithdrawRequest",
    "members": [
      {
        "name": "amountSTRK",
        "type": "core::integer::u256",
      },
      {
        "name": "amountkSTRK",
        "type": "core::integer::u256",
      },
      {
        "name": "isClaimed",
        "type": "core::bool",
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
      },
      {
        "name": "claimTime",
        "type": "core::integer::u64",
      },
    ],
  },
  {
    "type": "struct",
    "name": "lst::withdrawal_queue::interface::QueueState",
    "members": [
      {
        "name": "last_fill_id",
        "type": "core::integer::u128",
      },
      {
        "name": "max_request_id",
        "type": "core::integer::u128",
      },
      {
        "name": "unprocessed_withdraw_queue_amount",
        "type": "core::integer::u256",
      },
      {
        "name": "intransit_amount",
        "type": "core::integer::u256",
      },
    ],
  },
  {
    "type": "interface",
    "name": "lst::withdrawal_queue::interface::IWithdrawalQueue",
    "items": [
      {
        "type": "function",
        "name": "request_withdrawal",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256",
          },
          {
            "name": "shares",
            "type": "core::integer::u256",
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [
          {
            "type": "core::integer::u128",
          },
        ],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "claim_withdrawal",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u128",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "claim_withdrawal_to",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u128",
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "take_funds",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "reduce_total_queue_amount",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "get_request_info",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u128",
          },
        ],
        "outputs": [
          {
            "type": "lst::withdrawal_queue::interface::WithdrawRequest",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "get_queue_state",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::withdrawal_queue::interface::QueueState",
          },
        ],
        "state_mutability": "view",
      },
    ],
  },
  {
    "type": "impl",
    "name": "CommonCompImpl",
    "interface_name": "lst::utils::common::ICommon",
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
            "type": "core::starknet::class_hash::ClassHash",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "pause",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "unpause",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "is_paused",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "renounce_ownership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external",
      },
    ],
  },
  {
    "type": "impl",
    "name": "ERC721MixinImpl",
    "interface_name": "openzeppelin_token::erc721::interface::ERC721ABI",
  },
  {
    "type": "struct",
    "name": "core::array::Span::<core::felt252>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::felt252>",
      },
    ],
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        "name": "pending_word",
        "type": "core::felt252",
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32",
      },
    ],
  },
  {
    "type": "interface",
    "name": "openzeppelin_token::erc721::interface::ERC721ABI",
    "items": [
      {
        "type": "function",
        "name": "balance_of",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [
          {
            "type": "core::integer::u256",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "owner_of",
        "inputs": [
          {
            "name": "token_id",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "safe_transfer_from",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "token_id",
            "type": "core::integer::u256",
          },
          {
            "name": "data",
            "type": "core::array::Span::<core::felt252>",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "transfer_from",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "token_id",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "approve",
        "inputs": [
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "token_id",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "set_approval_for_all",
        "inputs": [
          {
            "name": "operator",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "approved",
            "type": "core::bool",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "get_approved",
        "inputs": [
          {
            "name": "token_id",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "is_approved_for_all",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "operator",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [
          {
            "type": "core::bool",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "supports_interface",
        "inputs": [
          {
            "name": "interface_id",
            "type": "core::felt252",
          },
        ],
        "outputs": [
          {
            "type": "core::bool",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "token_uri",
        "inputs": [
          {
            "name": "token_id",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "balanceOf",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [
          {
            "type": "core::integer::u256",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "ownerOf",
        "inputs": [
          {
            "name": "tokenId",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "safeTransferFrom",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "tokenId",
            "type": "core::integer::u256",
          },
          {
            "name": "data",
            "type": "core::array::Span::<core::felt252>",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "transferFrom",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "tokenId",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "setApprovalForAll",
        "inputs": [
          {
            "name": "operator",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "approved",
            "type": "core::bool",
          },
        ],
        "outputs": [],
        "state_mutability": "external",
      },
      {
        "type": "function",
        "name": "getApproved",
        "inputs": [
          {
            "name": "tokenId",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "isApprovedForAll",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress",
          },
          {
            "name": "operator",
            "type": "core::starknet::contract_address::ContractAddress",
          },
        ],
        "outputs": [
          {
            "type": "core::bool",
          },
        ],
        "state_mutability": "view",
      },
      {
        "type": "function",
        "name": "tokenURI",
        "inputs": [
          {
            "name": "tokenId",
            "type": "core::integer::u256",
          },
        ],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray",
          },
        ],
        "state_mutability": "view",
      },
    ],
  },
  {
    "type": "struct",
    "name": "lst::lst::interface::ILSTAdditionalDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "name",
        "type": "core::byte_array::ByteArray",
      },
      {
        "name": "symbol",
        "type": "core::byte_array::ByteArray",
      },
      {
        "name": "base_uri",
        "type": "core::byte_array::ByteArray",
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
      },
      {
        "name": "lstDisp",
        "type": "lst::lst::interface::ILSTAdditionalDispatcher",
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
    "kind": "struct",
    "members": [
      {
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "token_id",
        "type": "core::integer::u256",
        "kind": "key",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
    "kind": "struct",
    "members": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "approved",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "token_id",
        "type": "core::integer::u256",
        "kind": "key",
      },
    ],
  },
  {
    "type": "event",
    "name":
      "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
    "kind": "struct",
    "members": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "approved",
        "type": "core::bool",
        "kind": "data",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Transfer",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
        "kind": "nested",
      },
      {
        "name": "Approval",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
        "kind": "nested",
      },
      {
        "name": "ApprovalForAll",
        "type":
          "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
        "kind": "nested",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "kind": "enum",
    "variants": [],
  },
  {
    "type": "event",
    "name":
      "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "kind": "struct",
    "members": [
      {
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash",
        "kind": "data",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type":
          "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        "kind": "nested",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused",
        "kind": "nested",
      },
      {
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused",
        "kind": "nested",
      },
    ],
  },
  {
    "type": "event",
    "name":
      "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    "kind": "enum",
    "variants": [],
  },
  {
    "type": "event",
    "name":
      "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
    ],
  },
  {
    "type": "event",
    "name":
      "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key",
      },
    ],
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "OwnershipTransferred",
        "type":
          "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        "kind": "nested",
      },
      {
        "name": "OwnershipTransferStarted",
        "type":
          "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        "kind": "nested",
      },
    ],
  },
  {
    "type": "event",
    "name": "lst::utils::common::CommonComp::Event",
    "kind": "enum",
    "variants": [],
  },
  {
    "type": "event",
    "name":
      "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::WithdrawQueue",
    "kind": "struct",
    "members": [
      {
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data",
      },
      {
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data",
      },
      {
        "name": "request",
        "type": "lst::withdrawal_queue::interface::WithdrawRequest",
        "kind": "data",
      },
      {
        "name": "request_id",
        "type": "core::integer::u128",
        "kind": "data",
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data",
      },
    ],
  },
  {
    "type": "event",
    "name":
      "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::ReceivedFunds",
    "kind": "struct",
    "members": [
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data",
      },
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data",
      },
      {
        "name": "unprocessed",
        "type": "core::integer::u256",
        "kind": "data",
      },
      {
        "name": "intransit",
        "type": "core::integer::u256",
        "kind": "data",
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data",
      },
    ],
  },
  {
    "type": "event",
    "name": "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "ERC721Event",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
        "kind": "flat",
      },
      {
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event",
        "kind": "flat",
      },
      {
        "name": "UpgradeableEvent",
        "type":
          "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat",
      },
      {
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event",
        "kind": "flat",
      },
      {
        "name": "ReentrancyGuardEvent",
        "type":
          "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        "kind": "flat",
      },
      {
        "name": "OwnableEvent",
        "type":
          "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        "kind": "flat",
      },
      {
        "name": "CommonCompEvent",
        "type": "lst::utils::common::CommonComp::Event",
        "kind": "flat",
      },
      {
        "name": "WithdrawQueue",
        "type":
          "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::WithdrawQueue",
        "kind": "nested",
      },
      {
        "name": "ReceivedFunds",
        "type":
          "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::ReceivedFunds",
        "kind": "nested",
      },
    ],
  },
] as const;
