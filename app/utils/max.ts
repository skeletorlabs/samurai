export function getMax(
  balance: number,
  allocation: number,
  minPerWallet: number,
  maxPerWallet: number
): string {
  // If already at max allocation, user can't allocate more
  if (allocation >= maxPerWallet) return "0";

  // Remaining allocation space after current allocation
  let maxAllocatable = maxPerWallet - allocation;

  // Ensure the user has enough balance for at least the minimum allocation
  if (balance < minPerWallet) return "0";

  // Cap the allocatable amount by the user's balance
  maxAllocatable = Math.min(maxAllocatable, balance);

  if (maxAllocatable < minPerWallet) return "0";

  return maxAllocatable.toString();
}
