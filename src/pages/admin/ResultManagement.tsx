import { useState } from 'react';
import { Award, Download, Globe, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import { useSubmissionStore } from '@/store/submissionStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubmissionStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tabs = ['All', 'Accepted', 'Rejected'] as const;
type Tab = typeof tabs[number];

export default function ResultManagement() {
  const submissions = useEventFilteredSubmissions();
  const { updateSubmissionStatus } = useSubmissionStore();
  const [tab, setTab] = useState<Tab>('All');

  const filteredByConf = submissions;

  const all = filteredByConf.sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
  const accepted = filteredByConf.filter(s => s.status === 'accepted').sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
  const rejected = filteredByConf.filter(s => s.status === 'rejected');

  const currentData = tab === 'All' ? all : tab === 'Accepted' ? accepted : rejected;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Result Management"
        subtitle="Review and publish conference results"
        icon={Award}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs" onClick={() => toast.success('Results published!')}>
              <Globe className="h-4 w-4 mr-1.5" /> Publish Results
            </Button>
            <Button variant="outline" className="h-9 text-xs" onClick={() => toast.info('Exporting Excel...')}>
              <Download className="h-4 w-4 mr-1.5" /> Excel
            </Button>
            <Button variant="outline" className="h-9 text-xs" onClick={() => toast.info('Exporting PDF...')}>
              <Download className="h-4 w-4 mr-1.5" /> PDF
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', count: all.length, icon: Trophy, cls: 'text-primary bg-primary/10 border-primary/20' },
          { label: 'Accepted', count: accepted.length, icon: CheckCircle, cls: 'text-success bg-success/10 border-success/20' },
          { label: 'Rejected', count: rejected.length, icon: XCircle, cls: 'text-destructive bg-destructive/10 border-destructive/20' },
        ].map(({ label, count, icon: Icon, cls }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-xl border ${cls}`}>
            <Icon className="h-6 w-6" />
            <div>
              <p className="text-xl font-bold tabular-nums">{count}</p>
              <p className="text-xs font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/60 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
            tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}>{t}</button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              {['ID', 'Title', 'Category', 'Author', 'Conference', 'Score', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {currentData.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{s.id}</td>
                <td className="px-4 py-3.5 max-w-52"><p className="text-xs font-semibold text-foreground truncate">{s.title}</p></td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                  {s.category}
                  {s.subcategory && <span className="opacity-60"> › {s.subcategory}</span>}
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.author}</td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.conference || '—'}</td>
                <td className="px-4 py-3.5">
                  {s.averageScore !== null
                    ? <span className={cn('text-sm font-bold tabular-nums', s.averageScore >= 8 ? 'text-success' : s.averageScore >= 6 ? 'text-primary' : 'text-warning')}>{s.averageScore.toFixed(2)}/10</span>
                    : <span className="text-xs text-muted-foreground">—</span>
                  }
                </td>
                <td className="px-4 py-3.5">
                  <Select 
                    value={s.status} 
                    onValueChange={(newStatus) => {
                      updateSubmissionStatus(s.id, newStatus as SubmissionStatus);
                      toast.success(`Status updated for ${s.id}`);
                    }}
                  >
                    <SelectTrigger className="h-8 w-32 text-[11px] font-semibold border-0 bg-transparent p-0 focus:ring-0">
                      <div className="flex items-center">
                        <StatusBadge status={s.status} size="sm" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="revision_required">Revision Required</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
