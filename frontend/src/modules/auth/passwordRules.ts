// Must match isStrongPassword in backend/src/modules/auth/passwordPolicy.ts.
export const PASSWORD_RULES: Array<{ label: string; test: (password: string) => boolean }> = [
  { label: 'At least 8 characters', test: password => password.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: password => /[A-Z]/.test(password) },
  { label: 'One lowercase letter (a-z)', test: password => /[a-z]/.test(password) },
  { label: 'One number (0-9)', test: password => /[0-9]/.test(password) },
  { label: 'One special character (!@#$...)', test: password => /[^A-Za-z0-9]/.test(password) },
];

export const isStrongPassword = (password: string) =>
  PASSWORD_RULES.every(rule => rule.test(password)) && new TextEncoder().encode(password).length <= 72;
