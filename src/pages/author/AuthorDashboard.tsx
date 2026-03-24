import { LayoutDashboard, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventStore } from '@/store/eventStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AuthorDashboard() {
  const { user } = useAuth();
  const { submissions } = useSubmissionStore();
  const { events } = useEventStore();
  const navigate = useNavigate();

  const mySubmissions = submissions.slice(0, 5);
  const draft = mySubmissions.filter(s => s.status === 'draft').length;
  const underReview = mySubmissions.filter(s => s.status === 'under_review').length;
  const accepted = mySubmissions.filter(s => s.status === 'accepted').length;
  const rejected = mySubmissions.filter(s => s.status === 'rejected').length;

  // Get nearest submission deadline
  const activeEvent = events.find(e => e.status === 'active');
  const deadline = activeEvent?.submissionDeadline;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <PageHeader
          title={`Welcome, ${user?.name?.split(' ')[0] || 'Researcher'}!`}
          subtitle="Track and manage your abstract submissions"
          icon={LayoutDashboard}
          actions={
            <div className="flex gap-2">
              <Button className="gradient-primary text-white border-0 hover:opacity-90 h-9" onClick={() => navigate('/author/submit')}>
                + New Submission
              </Button>
            </div>
          }
        />
        {deadline && (
          <div className="shrink-0 px-4 py-2 rounded-xl border border-warning/30 bg-warning/10 text-warning">
            <p className="text-[10px] font-bold uppercase tracking-wider">Submission Deadline</p>
            <p className="text-sm font-bold">{deadline}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Submissions" value={mySubmissions.length} icon={FileText} />
        <StatCard title="Draft" value={draft} icon={AlertCircle} variant="default" />
        <StatCard title="Under Review" value={underReview} icon={Clock} variant="warning" />
        <StatCard title="Accepted" value={accepted} icon={CheckCircle} variant="success" />
        <StatCard title="Rejected" value={rejected} icon={XCircle} variant="destructive" />
      </div>

      {/* Recent submissions */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">Recent Submissions</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate('/author/submissions')}>View all →</Button>
        </div>
        <div className="space-y-2">
          {mySubmissions.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary-soft shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{s.title}</p>
                <p className="text-[10px] text-muted-foreground">{s.category} · {s.submissionDate}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={s.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
