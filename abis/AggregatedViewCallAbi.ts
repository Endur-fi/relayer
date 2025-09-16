export const ABI = [
  {
    "members": [
      {
        "name": "to",
        "offset": 0,
        "type": "felt"
      },
      {
        "name": "selector",
        "offset": 1,
        "type": "felt"
      },
      {
        "name": "data_offset",
        "offset": 2,
        "type": "felt"
      },
      {
        "name": "data_len",
        "offset": 3,
        "type": "felt"
      }
    ],
    "name": "CallArray",
    "size": 4,
    "type": "struct"
  },
  {
    "inputs": [
      {
        "name": "call_array_len",
        "type": "felt"
      },
      {
        "name": "call_array",
        "type": "CallArray*"
      },
      {
        "name": "calldata_len",
        "type": "felt"
      },
      {
        "name": "calldata",
        "type": "felt*"
      }
    ],
    "name": "aggregate",
    "outputs": [
      {
        "name": "block_number",
        "type": "felt"
      },
      {
        "name": "retdata_len",
        "type": "felt"
      },
      {
        "name": "retdata",
        "type": "felt*"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];