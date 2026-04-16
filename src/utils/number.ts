export function safeInteger(value: unknown): number {
  if (Number.isNaN(value) || !Number.isInteger(value)) {
    return 0;
  }

  return value as number;
}