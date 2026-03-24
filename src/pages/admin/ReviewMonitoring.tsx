import { BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useEventFilteredReviewers } from '@/hooks/useEventFilteredUsers';

export default function ReviewMonitoring() {
  const reviewers = useEventFilteredReviewers();

  const stats = reviewers.map(r => ({
    ...r,
    pct: r.assignedReviews > 0 ? Math.round((r.completedReviews / r.assignedReviews) * 100) : 0,
  })).sort((a, b) => b.pct - a.pct);

  const overall = Math.round(stats.reduce((acc, r) => acc + r.pct, 0) / stats.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Review Monitoring"
        subtitle="Track reviewer progress and completion rates"
        icon={BarChart3}
      />

      {/* Overall progress */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold">Overall Completion</h3>
            <p className="text-xs text-muted-foreground">Across all reviewers</p>
          </div>
          <span className="text-3xl font-bold gradient-text tabular-nums">{overall}%</span>
        </div>
        <ProgressBar value={overall} size="lg" />
      </div>

      {/* Per-reviewer breakdown */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold">Reviewer Breakdown</h3>
        </div>
        <div className="divide-y divide-border/50">
          {stats.map(r => (
            <div key={r.id} className="px-5 py-4 hover:bg-secondary/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-white text-xs font-bold shrink-0">
                    {r.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-sm font-bold tabular-nums">{r.completedReviews}/{r.assignedReviews}</p>
                    <p className="text-[10px] text-muted-foreground">Reviews</p>
                  </div>
                  <div className="w-32">
                    <ProgressBar value={r.completedReviews} max={r.assignedReviews || 1} showPercent={false} size="md" />
                  </div>
                  <div className={`text-sm font-bold tabular-nums w-10 text-right ${r.pct >= 80 ? 'text-success' : r.pct >= 50 ? 'text-primary' : r.pct >= 25 ? 'text-warning' : 'text-destructive'}`}>
                    {r.pct}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
