'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

export default function CalendarDialog({ onApply, value }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const apply = () => {
    if (!draft?.from) return;
    const from = new Date(draft.from);
    const to = new Date(draft.to || draft.from);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    onApply({ from, to });
    setOpen(false);
  };
  return <Popover open={open} onOpenChange={next => { if (next) setDraft(value); setOpen(next); }}>
    <PopoverTrigger asChild><Button variant="outline"><CalendarDays className="size-4" />{value?.from ? `${format(value.from, 'MMM d')} – ${format(value.to || value.from, 'MMM d, yyyy')}` : 'Date range'}</Button></PopoverTrigger>
    <PopoverContent align="start" side="bottom" sideOffset={6} collisionPadding={12} className="date-range-popover w-auto p-0">
      <div className="px-4 pt-3 text-sm font-medium">Filter by date</div>
      <Calendar mode="range" defaultMonth={draft?.from || new Date()} selected={draft} onSelect={setDraft} />
      <div className="flex justify-between gap-2 border-t p-3">
        <Button variant="ghost" onClick={() => { onApply(undefined); setDraft(undefined); setOpen(false); }}>Clear</Button>
        <div className="flex gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={apply} disabled={!draft?.from}>Apply</Button></div>
      </div>
    </PopoverContent>
  </Popover>;
}
