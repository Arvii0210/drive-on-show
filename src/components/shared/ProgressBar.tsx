import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const sizeMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
const variantMap = {
  default: 'gradient-primary',
  success: 'gradient-success',
  warning: 'gradient-warning',
  destructive: 'gradient-destructive',
};

function getVariant(pct: number): 'success' | 'warning' | 'destructive' | 'default' {
  if (pct >= 80) return 'success';
  if (pct >= 50) return 'default';
  if (pct >= 25) return 'warning';
  return 'destructive';
}

export function ProgressBar({ value, max = 100, label, showPercent = true, size = 'md', variant }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const effectiveVariant = variant ?? getVariant(pct);

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-foreground">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-muted-foreground tabular-nums">{pct}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-secondary overflow-hidden', sizeMap[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', variantMap[effectiveVariant])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
