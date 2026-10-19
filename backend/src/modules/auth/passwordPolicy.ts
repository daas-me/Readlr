// Account password rules shared by registration and recovery; bcrypt only reads the first 72 bytes.
export const PASSWORD_RULES_MESSAGE =
  'Use at least 8 characters with an uppercase letter, a lowercase letter, a number, and a special character (maximum 72 bytes).';

export function isStrongPassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 8 && Buffer.byteLength(password) <= 72 &&
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}
