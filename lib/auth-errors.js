export function authErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/wrong-password': 'Incorrect email or password. Please try again.',
    'auth/user-not-found': 'Incorrect email or password. Please try again.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/email-already-in-use': 'An account already uses this email. Sign in or reset your password.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/password-does-not-meet-requirements': 'Your password does not meet the required password rules.',
    'auth/operation-not-allowed': 'Email/password sign-in is unavailable. Please contact support.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Connection failed. Check your internet connection and try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/requires-recent-login': 'Please sign in again before continuing.',
    'auth/popup-blocked': 'Google sign-in could not open. Check your browser popup settings.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled. Please try again.',
    'auth/unauthorized-domain': 'This site is not authorized for sign-in. Please contact support.',
  };
  if (error instanceof TypeError || error?.name === 'TimeoutError') return 'Could not reach the CRM server. Please try again.';
  return messages[error?.code] || (error?.code?.startsWith('auth/') ? 'Sign-in could not finish. Please try again.' : error?.message) || 'Something went wrong. Please try again.';
}
