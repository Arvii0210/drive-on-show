import { FileCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSubmissionStore } from '@/store/submissionStore';
import { useReviewStore } from '@/store/reviewStore';
import { useAuth } from '@/contexts/AuthContext';
import { REVIEW_CRITERIA, NUM_CRITERIA, calcReviewAvg, calcSubmissionAverage } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function CompletedReviews() {
  const { reviews } = useReviewStore();
  const { submissions } = useSubmissionStore();
  const { user } = useAuth();

  // Filter to only show the current reviewer's completed reviews
  const myCompleted = reviews.filter(r => r.status === 'completed' && r.reviewerName === (user?.name || ''));

  // Group by submission
  const bySubmission = myCompleted.reduce((acc, r) => {
    if (!acc[r.submissionId]) acc[r.submissionId] = [];
    acc[r.submissionId].push(r);
    return acc;
  }, {} as Record<string, typeof myCompleted>);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="My Completed Reviews"
        subtitle={`${myCompleted.length} review(s) completed across ${Object.keys(bySubmission).length} submission(s)`}
        icon={FileCheck}
      />

      {Object.keys(bySubmission).length === 0 && (
        <div className="bg-card rounded-xl border border-border shadow-card p-10 text-center">
          <FileCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">You haven't completed any reviews yet.</p>
        </div>
      )}

      {Object.entries(bySubmission).map(([subId, subReviews]) => {
        const sub = submissions.find(s => s.id === subId);

        return (
          <div key={subId} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            {/* Submission header */}
            <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">{subId}</p>
                <p className="text-sm font-semibold text-foreground">{sub?.title ?? subId}</p>
              </div>
            </div>

            {/* Review breakdown table */}
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Reviewer</th>
                  {REVIEW_CRITERIA.map(c => (
                    <th key={c.key} className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{c.label.slice(0, 4)}</th>
                  ))}
                  <th className="px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total/{NUM_CRITERIA * 10}</th>
                  <th className="px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Avg/10</th>
                  <th className="px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {subReviews.map(r => {
                  const avg = calcReviewAvg(r.scores);
                  return (
                    <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">{r.reviewerName}</p>
                        <p className="text-[10px] text-muted-foreground">{r.completedDate}</p>
                      </td>
                      {REVIEW_CRITERIA.map(c => (
                        <td key={c.key} className="px-2 py-3 text-center">
                          <span className={cn('text-sm font-bold tabular-nums',
                            r.scores[c.key] >= 8 ? 'text-success' : r.scores[c.key] >= 6 ? 'text-primary' : r.scores[c.key] >= 4 ? 'text-warning' : 'text-destructive'
                          )}>{r.scores[c.key]}</span>
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-bold text-primary tabular-nums">{r.totalScore}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={cn('text-sm font-bold tabular-nums', avg >= 8 ? 'text-success' : avg >= 6 ? 'text-primary' : 'text-warning')}>{avg}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StatusBadge status={r.recommendation === 'accept' ? 'accepted' : r.recommendation === 'reject' ? 'rejected' : 'revision_required'} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
