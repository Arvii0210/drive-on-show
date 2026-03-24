import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'accent';
  trend?: { value: number; label: string };
  description?: string;
  suffix?: string;
  onClick?: () => void;
}

const variantMap = {
  default: {
    icon: 'gradient-primary',
    badge: 'text-primary bg-primary/10',
    border: 'border-primary/10',
  },
  success: {
    icon: 'gradient-success',
    badge: 'text-success bg-success/10',
    border: 'border-success/10',
  },
  warning: {
    icon: 'gradient-warning',
    badge: 'text-warning bg-warning/10',
    border: 'border-warning/10',
  },
  destructive: {
    icon: 'gradient-destructive',
    badge: 'text-destructive bg-destructive/10',
    border: 'border-destructive/10',
  },
  info: {
    icon: 'gradient-info',
    badge: 'text-info bg-info/10',
    border: 'border-info/10',
  },
  accent: {
    icon: 'bg-accent',
    badge: 'text-accent bg-accent/10',
    border: 'border-accent/10',
  },
};

export function StatCard({ title, value, icon: Icon, variant = 'default', trend, description, suffix, onClick }: StatCardProps) {
  const styles = variantMap[variant];

  return (
    <div
      className={cn(
        'relative bg-card rounded-xl border shadow-card p-5 hover-lift overflow-hidden group transition-all duration-200',
        styles.border,
        onClick && 'cursor-pointer hover:border-primary/30 hover:shadow-md active:scale-[0.98]'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {/* Background gradient orb */}
      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 gradient-primary" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1 text-[11px] font-semibold mt-2 px-2 py-0.5 rounded-full',
              trend.value >= 0 ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'
            )}>
              {trend.value >= 0
                ? <TrendingUp className="h-3 w-3" />
                : <TrendingDown className="h-3 w-3" />
              }
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl shadow-sm shrink-0',
          styles.icon
        )}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
