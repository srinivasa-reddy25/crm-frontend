import { ModeToggle } from '@/components/mode-toggle';
import { BrandMark } from '@/components/brand-mark';
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return <div className="flex min-h-svh flex-col bg-muted/30">
    <header className="flex h-20 shrink-0 items-center justify-between px-6 sm:px-10">
      <Link href="/auth/login" className="flex items-center gap-2.5 text-base font-semibold tracking-tight"><BrandMark className="size-8" />MyCRM</Link>
      <ModeToggle />
    </header>
    <main className="flex flex-1 items-center justify-center pb-16">{children}</main>
  </div>;
}
