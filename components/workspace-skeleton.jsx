import { Skeleton } from '@/components/ui/skeleton';

export function WorkspaceSkeleton({ variant = 'rows', label = 'Loading content' }) {
  const cards = variant === 'cards' || variant === 'dashboard';
  return <div role="status" aria-label={label} className="w-full space-y-4">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true" className={cards ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'overflow-hidden rounded-xl border divide-y'}>
      {Array.from({ length: cards ? 6 : 8 }, (_, i) => <div key={i} className={cards ? 'rounded-xl border p-5 space-y-4' : 'flex items-center gap-4 px-4 py-3'}>
        <Skeleton className="size-8 shrink-0 rounded-lg motion-reduce:animate-none" />
        <div className="flex-1 space-y-2"><Skeleton className="h-3 w-32 max-w-full motion-reduce:animate-none" /><Skeleton className="h-2.5 w-24 motion-reduce:animate-none" /></div>
        <Skeleton className="hidden h-4 w-20 sm:block motion-reduce:animate-none" />
        {!cards && <Skeleton className="hidden h-4 w-28 md:block motion-reduce:animate-none" />}
      </div>)}
    </div>
  </div>;
}
