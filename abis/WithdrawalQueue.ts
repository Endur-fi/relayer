export const ABI = [
  {
    "name": "WithdrawalQueueImpl",
    "type": "impl",
    "interface_name": "lst::withdrawal_queue::interface::IWithdrawalQueue"
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
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
    "name": "core::bool",
    "type": "enum",
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
    "name": "lst::withdrawal_queue::interface::WithdrawRequest",
    "type": "struct",
    "members": [
      {
        "name": "amountSTRK",
        "type": "core::integer::u256"
      },
      {
        "name": "amountkSTRK",
        "type": "core::integer::u256"
      },
      {
        "name": "isClaimed",
        "type": "core::bool"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      },
      {
        "name": "claimTime",
        "type": "core::integer::u64"
      },
      {
        "name": "cumulative_requested_amount_snapshot",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "lst::withdrawal_queue::interface::QueueState",
    "type": "struct",
    "members": [
      {
        "name": "max_request_id",
        "type": "core::integer::u128"
      },
      {
        "name": "unprocessed_withdraw_queue_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "intransit_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "cumulative_requested_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "lst::lst::interface::ILSTAdditionalDispatcher",
    "type": "struct",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "name": "lst::withdrawal_queue::interface::IWithdrawalQueueConfig",
    "type": "struct",
    "members": [
      {
        "name": "lstDisp",
        "type": "lst::lst::interface::ILSTAdditionalDispatcher"
      },
      {
        "name": "token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "claim_time",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "lst::withdrawal_queue::interface::IWithdrawalQueue",
    "type": "interface",
    "items": [
      {
        "name": "request_withdrawal",
        "type": "function",
        "inputs": [
          {
            "name": "assets",
            "type": "core::integer::u256"
          },
          {
            "name": "shares",
            "type": "core::integer::u256"
          },
          {
            "name": "receiver",
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
        "name": "claim_withdrawal",
        "type": "function",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "claim_withdrawal_to",
        "type": "function",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u128"
          },
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "take_funds",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "reduce_total_queue_amount",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_request_info",
        "type": "function",
        "inputs": [
          {
            "name": "request_id",
            "type": "core::integer::u128"
          }
        ],
        "outputs": [
          {
            "type": "lst::withdrawal_queue::interface::WithdrawRequest"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_queue_state",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::withdrawal_queue::interface::QueueState"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "set_config",
        "type": "function",
        "inputs": [
          {
            "name": "config",
            "type": "lst::withdrawal_queue::interface::IWithdrawalQueueConfig"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "initializer",
        "type": "function",
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
    "name": "CommonCompImpl",
    "type": "impl",
    "interface_name": "lst::utils::common::ICommon"
  },
  {
    "name": "lst::utils::common::ICommon",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
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
        "name": "pause",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "unpause",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "is_paused",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
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
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "AccessControlImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::accesscontrol::interface::IAccessControl"
  },
  {
    "name": "openzeppelin_access::accesscontrol::interface::IAccessControl",
    "type": "interface",
    "items": [
      {
        "name": "has_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
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
        "name": "get_role_admin",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "grant_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "revoke_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_role",
        "type": "function",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "ERC721MixinImpl",
    "type": "impl",
    "interface_name": "openzeppelin_token::erc721::interface::ERC721ABI"
  },
  {
    "name": "core::array::Span::<core::felt252>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::felt252>"
      }
    ]
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "openzeppelin_token::erc721::interface::ERC721ABI",
    "type": "interface",
    "items": [
      {
        "name": "balance_of",
        "type": "function",
        "inputs": [
          {
            "name": "account",
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
        "name": "owner_of",
        "type": "function",
        "inputs": [
          {
            "name": "token_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "safe_transfer_from",
        "type": "function",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token_id",
            "type": "core::integer::u256"
          },
          {
            "name": "data",
            "type": "core::array::Span::<core::felt252>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "transfer_from",
        "type": "function",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "approve",
        "type": "function",
        "inputs": [
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "token_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "set_approval_for_all",
        "type": "function",
        "inputs": [
          {
            "name": "operator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "approved",
            "type": "core::bool"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_approved",
        "type": "function",
        "inputs": [
          {
            "name": "token_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "is_approved_for_all",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "operator",
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
        "name": "supports_interface",
        "type": "function",
        "inputs": [
          {
            "name": "interface_id",
            "type": "core::felt252"
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
        "name": "name",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "symbol",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "token_uri",
        "type": "function",
        "inputs": [
          {
            "name": "token_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "balanceOf",
        "type": "function",
        "inputs": [
          {
            "name": "account",
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
        "name": "ownerOf",
        "type": "function",
        "inputs": [
          {
            "name": "tokenId",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "safeTransferFrom",
        "type": "function",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "tokenId",
            "type": "core::integer::u256"
          },
          {
            "name": "data",
            "type": "core::array::Span::<core::felt252>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "transferFrom",
        "type": "function",
        "inputs": [
          {
            "name": "from",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "tokenId",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "setApprovalForAll",
        "type": "function",
        "inputs": [
          {
            "name": "operator",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "approved",
            "type": "core::bool"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "getApproved",
        "type": "function",
        "inputs": [
          {
            "name": "tokenId",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "isApprovedForAll",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "operator",
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
        "name": "tokenURI",
        "type": "function",
        "inputs": [
          {
            "name": "tokenId",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "symbol",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "base_uri",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "config",
        "type": "lst::withdrawal_queue::interface::IWithdrawalQueueConfig"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "token_id",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "approved",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "token_id",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "operator",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "approved",
        "type": "core::bool"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Transfer",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer"
      },
      {
        "kind": "nested",
        "name": "Approval",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval"
      },
      {
        "kind": "nested",
        "name": "ApprovalForAll",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused"
      },
      {
        "kind": "nested",
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "lst::utils::common::CommonComp::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "enum",
    "name": "lst::utils::access_control::MyAccessControlComp::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "previous_admin_role",
        "type": "core::felt252"
      },
      {
        "kind": "data",
        "name": "new_admin_role",
        "type": "core::felt252"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "RoleGranted",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted"
      },
      {
        "kind": "nested",
        "name": "RoleRevoked",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked"
      },
      {
        "kind": "nested",
        "name": "RoleAdminChanged",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::WithdrawQueue",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "request_id",
        "type": "core::integer::u128"
      },
      {
        "kind": "data",
        "name": "request",
        "type": "lst::withdrawal_queue::interface::WithdrawRequest"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::ReceivedFunds",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "kind": "key",
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "unprocessed",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "intransit",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::Event",
    "type": "event",
    "variants": [
      {
        "kind": "flat",
        "name": "ERC721Event",
        "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event"
      },
      {
        "kind": "flat",
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event"
      },
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event"
      },
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "CommonCompEvent",
        "type": "lst::utils::common::CommonComp::Event"
      },
      {
        "kind": "flat",
        "name": "MyAccessControlCompEvent",
        "type": "lst::utils::access_control::MyAccessControlComp::Event"
      },
      {
        "kind": "flat",
        "name": "AccessControlComponentEvent",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event"
      },
      {
        "kind": "nested",
        "name": "WithdrawQueue",
        "type": "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::WithdrawQueue"
      },
      {
        "kind": "nested",
        "name": "ReceivedFunds",
        "type": "lst::withdrawal_queue::withdrawal_queue::WithdrawalQueue::ReceivedFunds"
      }
    ]
  }
] as const;
