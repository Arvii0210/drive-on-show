import { cn } from '@/lib/utils';
import type { SubmissionStatus } from '@/data/mockData';

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  draft: { label: 'Draft', dot: 'bg-muted-foreground', badge: 'bg-muted text-muted-foreground' },
  submitted: { label: 'Submitted', dot: 'bg-info', badge: 'bg-info/10 text-info' },
  under_review: { label: 'Under Review', dot: 'bg-warning animate-pulse', badge: 'bg-warning/10 text-warning' },
  revision_required: { label: 'Revision Required', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  accepted: { label: 'Accepted', dot: 'bg-success', badge: 'bg-success/10 text-success' },
  rejected: { label: 'Rejected', dot: 'bg-destructive', badge: 'bg-destructive/10 text-destructive' },
  pending: { label: 'Pending', dot: 'bg-warning animate-pulse', badge: 'bg-warning/10 text-warning' },
  completed: { label: 'Completed', dot: 'bg-success', badge: 'bg-success/10 text-success' },
  active: { label: 'Active', dot: 'bg-success', badge: 'bg-success/10 text-success' },
  inactive: { label: 'Inactive', dot: 'bg-muted-foreground', badge: 'bg-muted text-muted-foreground' },
  upcoming: { label: 'Upcoming', dot: 'bg-info', badge: 'bg-info/10 text-info' },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, dot: 'bg-muted-foreground', badge: 'bg-muted text-muted-foreground' };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full border border-transparent whitespace-nowrap',
      config.badge,
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
    )}>
      <span className={cn('rounded-full shrink-0', config.dot, size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
      {config.label}
    </span>
  );
}

export function getStatusLabel(status: SubmissionStatus): string {
  return statusConfig[status]?.label ?? status;
}
