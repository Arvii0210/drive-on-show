import { useState } from 'react';
import { ClipboardList, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AssignReviewerModal } from '@/components/shared/AssignReviewerModal';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import type { Submission } from '@/data/mockData';

export default function AssignReviewers() {
  const submissions = useEventFilteredSubmissions();
  const [assignSub, setAssignSub] = useState<Submission | null>(null);

  const needsReviewers = submissions.filter(s => s.status !== 'draft' && s.status !== 'rejected');

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Assign Reviewers"
        subtitle="Assign peer reviewers to submitted abstracts"
        icon={ClipboardList}
      />

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              {['ID', 'Title', 'Category', 'Status', 'Assigned Reviewers', 'Reviews Done', 'Avg Score', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {needsReviewers.map(s => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{s.id}</td>
                <td className="px-4 py-3.5 max-w-52">
                  <p className="text-xs font-semibold text-foreground line-clamp-2">{s.title}</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.category}</td>
                <td className="px-4 py-3.5"><StatusBadge status={s.status} size="sm" /></td>
                <td className="px-4 py-3.5">
                  {s.assignedReviewers.length === 0 ? (
                    <span className="text-xs text-muted-foreground/60">None</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {s.assignedReviewers.map((name, i) => (
                        <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          {name.split(' ').slice(-1)[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground text-center">—</td>
                <td className="px-4 py-3.5">
                  {s.averageScore !== null
                    ? <span className="text-sm font-bold text-primary">{s.averageScore}</span>
                    : <span className="text-xs text-muted-foreground">—</span>
                  }
                </td>
                <td className="px-4 py-3.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs hover:border-primary hover:text-primary" onClick={() => setAssignSub(s)}>
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Assign
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignReviewerModal submission={assignSub} open={!!assignSub} onClose={() => setAssignSub(null)} />
    </div>
  );
}
