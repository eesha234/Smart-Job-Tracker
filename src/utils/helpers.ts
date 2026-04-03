import { differenceInDays, parseISO, format } from 'date-fns';
import { JobStatus } from '../types/job.types';

export const STATUS_STYLE: Record<JobStatus, { pill: string; dot: string; label: string }> = {
  Applied:   { pill: 'bg-blue-50 text-blue-700 border-blue-200',           dot: 'bg-blue-500',    label: 'Applied' },
  Interview: { pill: 'bg-violet-50 text-violet-700 border-violet-200',     dot: 'bg-violet-500',  label: 'Interview' },
  Offer:     { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500', label: 'Offer' },
  Rejected:  { pill: 'bg-zinc-100 text-zinc-500 border-zinc-200',          dot: 'bg-zinc-400',    label: 'Rejected' },
};

export function fmt(d: string) {
  try { return format(parseISO(d), 'd MMM yyyy'); } catch { return d; }
}

export function daysSince(d: string) {
  try { return differenceInDays(new Date(), parseISO(d)); } catch { return 0; }
}

export function isOverdue(d?: string) {
  if (!d) return false;
  try { return differenceInDays(new Date(), parseISO(d)) > 0; } catch { return false; }
}

export function isDueSoon(d?: string) {
  if (!d) return false;
  try {
    const diff = differenceInDays(parseISO(d), new Date());
    return diff >= 0 && diff <= 3;
  } catch { return false; }
}
