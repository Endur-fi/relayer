export function toBigInt(value: string | undefined) {
  if (!value) return BigInt(0);

  return BigInt(value.toString());
}
