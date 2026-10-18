export function normalizeTesterAllowlist(raw: string): string[] {
  return [...new Set(raw.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

export function isApprovedTester(email: string | null | undefined, allowlist: string[]): boolean {
  if (!email) return false;
  return allowlist.includes(email.trim().toLowerCase());
}
