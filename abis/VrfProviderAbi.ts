/**
 * ABI for the VRF provider contract (IVrfProvider).
 * request_random(caller, source) with Source enum: Nonce(ContractAddress) | Salt(felt252).
 */
export const ABI = [
  {
    type: "impl",
    name: "VrfProviderImpl",
    interface_name: "IVrfProvider",
  },
  {
    type: "enum",
    name: "Source",
    variants: [
      { name: "Nonce", type: "core::starknet::contract_address::ContractAddress" },
      { name: "Salt", type: "core::felt252" },
    ],
  },
  {
    type: "interface",
    name: "IVrfProvider",
    items: [
      {
        type: "function",
        name: "request_random",
        inputs: [
          { name: "caller", type: "core::starknet::contract_address::ContractAddress" },
          { name: "source", type: "Source" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
] as const;
