# Email/password authentication

Firebase Authentication must have Email/Password enabled with passwords required.
Localhost and the production frontend hostname must be authorized Firebase domains.
This was enabled and checked in the configured Firebase project on 2026-09-15.

Registration creates a Firebase account, updates its name, and asks Firebase to send
its built-in verification-link email. No SMTP credentials or numeric OTP service
are needed. The verification screen supports resending, a 60-second UI cooldown,
and an explicit verification check. Firebase enforces sending quotas and validates
single-use verification links. A sending failure stays visible and can be retried.

Unverified users have no CRM session cookie. HTTP endpoints and chat reject their
Firebase tokens. After verification, the frontend reloads the Firebase user and
forces a token refresh before creating/recovering the CRM account and navigating
to the dashboard. Repeated registration requests reuse the same CRM account.
Verified email ownership is required before linking a legacy account by email.
Session restoration refreshes the cookie without logging another login activity.

Verified manual flow (including real inbox delivery confirmed by the owner):
1. Register at /auth/register using an inbox you control.
2. Confirm /auth/verify-email appears and dashboard access is blocked.
3. Open Firebase's verification email (check spam) and click its link.
4. Return to the app and select “I’ve verified my email”.
5. Confirm the dashboard loads, then sign out and sign in with the same password.

Automated checks used disposable Firebase accounts and the local backend to test
signup, unverified access rejection, applying a real Firebase verification link,
token refresh, idempotent CRM registration, password login, profile/dashboard access,
wrong-password rejection and verification-link reuse rejection. Test accounts and
CRM test records were removed afterward. A separate approved Gmail test alias received the Firebase verification email; the owner clicked the link, and its verified password login and CRM session restoration passed. Browser checks also confirmed the verification gate, dashboard navigation and persistence after refresh. Both disposable test accounts were removed.

Reference: https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
