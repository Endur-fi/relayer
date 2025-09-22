export const ABI = [
  {
    "type": "impl",
    "name": "SwapExtensionExtendedImpl",
    "interface_name": "lst::swap_extensions::interface::ISwapExtensionExtended"
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
    "name": "lst::swap_extensions::interface::Route",
    "members": [
      {
        "name": "token_from",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token_to",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "exchange_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "percent",
        "type": "core::integer::u128"
      },
      {
        "name": "additional_swap_params",
        "type": "core::array::Array::<core::felt252>"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::swap_extensions::interface::AvnuMultiRouteSwap",
    "members": [
      {
        "name": "token_from_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token_from_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "token_to_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token_to_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "token_to_min_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "beneficiary",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "integrator_fee_amount_bps",
        "type": "core::integer::u128"
      },
      {
        "name": "integrator_fee_recipient",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "routes",
        "type": "core::array::Array::<lst::swap_extensions::interface::Route>"
      }
    ]
  },
  {
    "type": "interface",
    "name": "lst::swap_extensions::interface::ISwapExtensionExtended",
    "items": [
      {
        "type": "function",
        "name": "swap",
        "inputs": [
          {
            "name": "swap_params",
            "type": "lst::swap_extensions::interface::AvnuMultiRouteSwap"
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
    "type": "impl",
    "name": "SwapExtensionComponentImpl",
    "interface_name": "lst::swap_extensions::interface::ISwapExtensionBase"
  },
  {
    "type": "struct",
    "name": "lst::validator_registry::interface::IValidatorRegistryAdminDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "struct",
    "name": "lst::swap_extensions::interface::ExtensionConfig",
    "members": [
      {
        "name": "from_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "to_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "validator_registry",
        "type": "lst::validator_registry::interface::IValidatorRegistryAdminDispatcher"
      }
    ]
  },
  {
    "type": "interface",
    "name": "lst::swap_extensions::interface::ISwapExtensionBase",
    "items": [
      {
        "type": "function",
        "name": "push",
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
        "name": "pull",
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
        "name": "get_config",
        "inputs": [],
        "outputs": [
          {
            "type": "lst::swap_extensions::interface::ExtensionConfig"
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
        "name": "validator_registry",
        "type": "lst::validator_registry::interface::IValidatorRegistryAdminDispatcher"
      },
      {
        "name": "governor",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "from_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "to_token",
        "type": "core::starknet::contract_address::ContractAddress"
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
    "name": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "lst::utils::common::CommonComp::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "lst::swap_extensions::swap_component::SwapExtensionComponent::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "lst::swap_extensions::interface::Events::Swap",
    "kind": "struct",
    "members": [
      {
        "name": "from_token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "to_token",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "from_token_amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "to_token_amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "lst::swap_extensions::swap_extension::SwapExtension::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        "kind": "flat"
      },
      {
        "name": "CommonCompEvent",
        "type": "lst::utils::common::CommonComp::Event",
        "kind": "flat"
      },
      {
        "name": "SwapExtensionEvent",
        "type": "lst::swap_extensions::swap_component::SwapExtensionComponent::Event",
        "kind": "flat"
      },
      {
        "name": "Swap",
        "type": "lst::swap_extensions::interface::Events::Swap",
        "kind": "nested"
      }
    ]
  }
]