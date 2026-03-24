import { LayoutDashboard, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSubmissionStore } from '@/store/submissionStore';
import { useReviewStore } from '@/store/reviewStore';
import { useEventStore } from '@/store/eventStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ReviewerDashboard() {
  const { submissions } = useSubmissionStore();
  const { reviews } = useReviewStore();
  const { events } = useEventStore();
  const navigate = useNavigate();

  const assigned = reviews.filter(r => r.status === 'pending').length;
  const completed = reviews.filter(r => r.status === 'completed').length;
  const total = reviews.length;

  // Get active conference name
  const activeEvent = events.find(e => e.status === 'active') || events[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Conference Name Banner */}
      {activeEvent && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/15 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-0.5">Currently Reviewing For</p>
          <h2 className="text-lg font-bold text-foreground">{activeEvent.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{activeEvent.conference} · Submission Deadline: {activeEvent.submissionDeadline}</p>
        </div>
      )}

      <PageHeader
        title="Reviewer Dashboard"
        subtitle="Manage your abstract review assignments"
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Abstracts"
          value={total}
          icon={ClipboardList}
          onClick={() => navigate('/reviewer/assigned')}
        />
        <StatCard
          title="Pending Reviews"
          value={assigned}
          icon={Clock}
          variant="warning"
          onClick={() => navigate('/reviewer/assigned?filter=pending')}
        />
        <StatCard
          title="Completed Reviews"
          value={completed}
          icon={CheckCircle}
          variant="success"
          onClick={() => navigate('/reviewer/completed')}
        />
      </div>

      {/* Assigned abstracts table */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">Assigned Abstracts</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate('/reviewer/assigned')}>View all →</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['ID', 'Title', 'Category', 'Assigned', 'Status', 'Action'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {submissions.filter(s => s.assignedReviewers.length > 0).slice(0, 5).map(s => {
                const review = reviews.find(r => r.submissionId === s.id);
                return (
                  <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 pr-4 text-xs font-mono text-muted-foreground">{s.id}</td>
                    <td className="py-3 pr-4 max-w-48"><p className="text-xs font-semibold text-foreground truncate">{s.title}</p></td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{s.category}</td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{s.submissionDate}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={review?.status || 'pending'} size="sm" />
                    </td>
                    <td className="py-3">
                      {review?.status === 'completed' ? (
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate(`/reviewer/review/${s.id}?mode=view`)}>
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs hover:border-primary hover:text-primary" onClick={() => navigate(`/reviewer/review/${s.id}?mode=re-review`)}>
                            Re-Review
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 text-xs hover:border-primary hover:text-primary" onClick={() => navigate(`/reviewer/review/${s.id}`)}>
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
