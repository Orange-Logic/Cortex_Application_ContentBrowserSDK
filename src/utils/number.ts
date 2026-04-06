export function safeInteger(value: any) {
  if (Number.isNaN(value) || !Number.isInteger(value)) {
    return 0;
  }

  return value;
}