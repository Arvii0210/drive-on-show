import { ClipboardList } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlindReviewBadge } from '@/components/shared/BlindReviewBadge';
import { useSubmissionStore } from '@/store/submissionStore';
import { useReviewStore } from '@/store/reviewStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

export default function AssignedAbstracts() {
  const { submissions } = useSubmissionStore();
  const { reviews } = useReviewStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterStatus = searchParams.get('filter');

  const assigned = useMemo(() => {
    let list = submissions.filter(s => s.assignedReviewers.length > 0 && s.status !== 'draft');
    if (filterStatus === 'pending') {
      list = list.filter(s => {
        const review = reviews.find(r => r.submissionId === s.id);
        return !review || review.status === 'pending';
      });
    } else if (filterStatus === 'completed') {
      list = list.filter(s => {
        const review = reviews.find(r => r.submissionId === s.id);
        return review?.status === 'completed';
      });
    }
    return list;
  }, [submissions, reviews, filterStatus]);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Assigned Abstracts"
        subtitle={`Abstracts assigned to you for peer review${filterStatus ? ` · Filtered: ${filterStatus}` : ''}`}
        icon={ClipboardList}
        badge={<BlindReviewBadge />}
      />

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              {['ID', 'Title', 'Category', 'Assigned Date', 'Review Status', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {assigned.map(s => {
              const review = reviews.find(r => r.submissionId === s.id);
              const isDone = review?.status === 'completed';
              return (
                <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{s.id}</td>
                  <td className="px-4 py-3.5 max-w-56">
                    <p className="text-xs font-semibold text-foreground line-clamp-2">{s.title}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.category}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.submissionDate}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={isDone ? 'completed' : 'pending'} size="sm" />
                  </td>
                  <td className="px-4 py-3.5">
                    {isDone ? (
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate(`/reviewer/review/${s.id}?mode=view`)}>
                          View Evaluation
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs hover:border-primary hover:text-primary" onClick={() => navigate(`/reviewer/review/${s.id}?mode=re-review`)}>
                          Re-Review
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="h-7 text-xs gradient-primary text-white border-0" onClick={() => navigate(`/reviewer/review/${s.id}`)}>
                        Start Review
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {assigned.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No abstracts found matching the filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
