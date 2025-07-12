export default function validateInput(username, password) {
  if (!username || !password) return 'Both fields are required.';
  if (typeof username !== 'string' || typeof password !== 'string') return 'Invalid input';
  if (password.length < 4) return 'Password must be at least 4 characters';
  return null;
}
