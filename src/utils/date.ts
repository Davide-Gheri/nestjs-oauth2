
export function toEpochSeconds(date: Date | number): number {
  if (date instanceof Date) {
    return Math.floor(date.getTime() / 1000);
  }
  return Math.floor(date / 1000);
}
