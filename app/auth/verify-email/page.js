'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import AuthContext from '@/components/providers/AuthProvider';
import { authErrorMessage } from '@/lib/auth-errors';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const { user, loading, logout, sendVerification, checkVerification, verificationError, verificationSentAt } = useContext(AuthContext);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const remaining = Math.max(0, Math.ceil((verificationSentAt + 60000 - now) / 1000));
  async function check() {
    setBusy('check'); setError('');
    try { if (!await checkVerification()) setError('Your email is not verified yet. Open the link in your inbox, then try again.'); }
    catch (err) { setError(authErrorMessage(err)); }
    finally { setBusy(''); }
  }
  async function resend() {
    setBusy('send'); setError('');
    try { await sendVerification(); setSent(true); setNow(Date.now()); }
    catch (err) { setError(authErrorMessage(err)); }
    finally { setBusy(''); }
  }
  return <div className="flex w-full justify-center p-4"><section className="w-full max-w-md rounded-2xl border bg-card p-7 sm:p-9 space-y-5" aria-labelledby="verify-title">
    <MailCheck className="size-8" aria-hidden="true" />
    <h1 id="verify-title" className="text-2xl font-medium tracking-tight">Verify your email</h1>
    {loading ? <p role="status" className="text-sm text-muted-foreground">Loading your account…</p> : !user ? <>
      <p className="text-sm text-muted-foreground">After opening your verification link, sign in to finish setting up your account.</p>
      <Button asChild className="w-full"><Link href="/auth/login">Continue to sign in</Link></Button>
    </> : <>
      <p className="text-sm text-muted-foreground">Open the verification link sent to <strong className="break-all text-foreground font-medium">{user.email}</strong>, then return here to continue. Check your spam folder if it hasn’t arrived.</p>
      {(error || verificationError) && <p role="alert" className="rounded-lg border p-3 text-sm">{error || verificationError}</p>}
      {(sent || verificationSentAt > 0) && !verificationError && <p role="status" className="text-sm text-muted-foreground">Verification email sent.</p>}
      <Button className="w-full" onClick={check} disabled={!!busy}>{busy === 'check' ? 'Checking…' : 'I’ve verified my email'}</Button>
      <Button variant="outline" className="w-full" onClick={resend} disabled={!!busy || remaining > 0}>{busy === 'send' ? 'Sending…' : remaining > 0 ? `Resend in ${remaining}s` : 'Resend verification email'}</Button>
      <Button variant="ghost" className="w-full" disabled={!!busy} onClick={() => logout().catch(err => setError(authErrorMessage(err)))}>Use another account</Button>
    </>}
  </section></div>;
}
