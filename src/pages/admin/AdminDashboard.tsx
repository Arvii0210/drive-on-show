import { FileText, Users, UserCheck, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useReviewStore } from '@/store/reviewStore';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { SubmissionTrendChart } from '@/components/charts/SubmissionTrendChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ReviewBarChart } from '@/components/charts/ReviewBarChart';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import { useEventFilteredReviews } from '@/hooks/useEventFilteredReviews';
import { useEventFilteredReviewers, useEventFilteredAuthors } from '@/hooks/useEventFilteredUsers';

export default function AdminDashboard() {
  const submissions = useEventFilteredSubmissions();
  const reviews = useEventFilteredReviews();
  const reviewers = useEventFilteredReviewers();
  const authors = useEventFilteredAuthors();
  const navigate = useNavigate();
  const totalAuthors = authors.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const accepted = submissions.filter(s => s.status === 'accepted').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;

  const recentActivity = [
    { text: 'New abstract submitted by Dr. Chen', time: '5 min ago', type: 'success' },
    { text: 'Review completed for ABS-2024-001', time: '24 min ago', type: 'info' },
    { text: 'Abstract ABS-2024-005 rejected', time: '1 hr ago', type: 'warning' },
    { text: 'Reviewer Dr. Wilson assigned to 2 abstracts', time: '2 hr ago', type: 'default' },
    { text: 'Abstract ABS-2024-008 accepted', time: '3 hr ago', type: 'success' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Conference management overview and analytics"
        icon={Activity}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Abstracts" value={submissions.length} icon={FileText} trend={{ value: 12, label: 'this month' }} />
        <StatCard title="Total Authors" value={totalAuthors} icon={Users} trend={{ value: 8, label: 'this month' }} />
        <StatCard title="Total Reviewers" value={reviewers.length} icon={UserCheck} />
        <StatCard title="Pending Reviews" value={pendingReviews} icon={Clock} variant="warning" />
        <StatCard title="Accepted" value={accepted} icon={CheckCircle} variant="success" />
        <StatCard title="Rejected" value={rejected} icon={XCircle} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Submission Trends</h3>
              <p className="text-xs text-muted-foreground">Monthly abstract submissions</p>
            </div>
            <span className="text-xs bg-success/10 text-success font-semibold px-2 py-0.5 rounded-full">+23% this month</span>
          </div>
          <SubmissionTrendChart />
        </div>
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">Category Distribution</h3>
            <p className="text-xs text-muted-foreground">By research area</p>
          </div>
          <CategoryPieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">Reviewer Progress</h3>
            <p className="text-xs text-muted-foreground">Completed vs pending reviews per reviewer</p>
          </div>
          <ReviewBarChart />
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  item.type === 'success' ? 'bg-success' : item.type === 'warning' ? 'bg-warning' : item.type === 'info' ? 'bg-info' : 'bg-muted-foreground'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Recent Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {['ID', 'Title', 'Category', 'Author', 'Date', 'Status'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {submissions.slice(0, 6).map(s => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/admin/submissions`)}>
                  <td className="py-3 pr-4 text-xs font-mono text-primary font-semibold hover:underline">{s.id}</td>
                  <td className="py-3 pr-4 max-w-52">
                    <p className="text-xs font-medium text-foreground truncate">{s.title}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{s.category}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{s.author}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{s.submissionDate}</td>
                  <td className="py-3"><StatusBadge status={s.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
