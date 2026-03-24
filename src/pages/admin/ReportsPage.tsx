import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { SubmissionTrendChart } from '@/components/charts/SubmissionTrendChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ReviewBarChart } from '@/components/charts/ReviewBarChart';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import { useReviewStore } from '@/store/reviewStore';
import { StatCard } from '@/components/shared/StatCard';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { useEventFilteredReviews } from '@/hooks/useEventFilteredReviews';

export default function ReportsPage() {
  const submissions = useEventFilteredSubmissions();
  const reviews = useEventFilteredReviews();
  const accepted = submissions.filter(s => s.status === 'accepted').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;
  const completedReviews = reviews.filter(r => r.status === 'completed').length;
  const acceptRate = submissions.length > 0 ? Math.round((accepted / submissions.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Conference performance insights and data exports"
        icon={BarChart3}
        actions={
          <Button variant="outline" className="h-9 text-xs" onClick={() => toast.info('Generating full report...')}>
            <Download className="h-4 w-4 mr-1.5" /> Full Report
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Submissions" value={submissions.length} icon={FileText} />
        <StatCard title="Acceptance Rate" value={`${acceptRate}%`} icon={CheckCircle} variant="success" />
        <StatCard title="Rejection Rate" value={`${100 - acceptRate}%`} icon={XCircle} variant="destructive" />
        <StatCard title="Reviews Done" value={completedReviews} icon={Clock} variant="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-bold mb-1">Submission Trends</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly abstract submissions over time</p>
          <SubmissionTrendChart />
        </div>
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-bold mb-1">Category Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown by research area</p>
          <CategoryPieChart />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-bold mb-1">Reviewer Performance</h3>
        <p className="text-xs text-muted-foreground mb-4">Completed vs pending reviews per reviewer</p>
        <ReviewBarChart />
      </div>
    </div>
  );
}
