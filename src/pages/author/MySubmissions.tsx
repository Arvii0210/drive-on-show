import { useState, useMemo } from 'react';
import { FileText, Search, Eye, Trash2, Edit, XCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AbstractModal } from '@/components/shared/AbstractModal';
import SubmissionVersionHistory from '@/components/shared/SubmissionVersionHistory';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventStore } from '@/store/eventStore';
import type { Submission } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const STATUSES = ['all', 'draft', 'submitted', 'under_review', 'revision_required', 'accepted', 'rejected', 'withdrawn'];
const PAGE_SIZE = 5;

export default function MySubmissions() {
  const { submissions, withdrawSubmission, updateSubmissionStatus, checkCanEditSubmission } = useSubmissionStore();
  const { events } = useEventStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewSub, setViewSub] = useState<Submission | null>(null);
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [versionHistoryId, setVersionHistoryId] = useState<string | null>(null);

  const mySubmissions = submissions;

  // Get first active event for permission checking
  const eventId = events[0]?.id || '';

  const filtered = useMemo(() => mySubmissions.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  }), [mySubmissions, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const canWithdraw = (status: string) => ['draft', 'submitted', 'under_review'].includes(status);
  
  const canEditSubmission = (submission: Submission) => {
    return checkCanEditSubmission(submission.id, eventId);
  };

  const handleWithdraw = () => {
    if (withdrawId) {
      updateSubmissionStatus(withdrawId, 'withdrawn' as any);
      toast.warning('Submission withdrawn');
      setWithdrawId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="My Submissions" subtitle={`${mySubmissions.length} submission(s)`} icon={FileText} />

      {/* Submission info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total submissions card */}
        <div className="bg-card rounded-xl border border-border shadow-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">Total Submissions</p>
              <p className="text-2xl font-bold text-foreground">{mySubmissions.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Submission limit card */}
        {events.length > 0 && (
          <div className="bg-card rounded-xl border border-border shadow-card p-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">Submissions for {events[0]?.conference}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {mySubmissions.filter(s => s.conference === events[0]?.conference && s.status !== 'withdrawn').length}
                </p>
                <p className="text-sm text-muted-foreground">/ {events[0]?.maxSubmissionsPerAuthor || 5}</p>
              </div>
            </div>
          </div>
        )}

        {/* Deadline card */}
        {events.length > 0 && (
          <div className="bg-card rounded-xl border border-border shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Submission Deadline</p>
                <p className="text-sm font-bold text-foreground">{events[0]?.submissionDeadline}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(events[0]?.submissionDeadline || '') > new Date() ? '✓ Deadline Open' : '✗ Deadline Passed'}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title or ID..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              {['ID', 'Title', 'Category', 'Submitted', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {paginated.map(s => (
              <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3.5">
                  <button onClick={() => setViewSub(s)} className="text-xs font-mono text-primary font-semibold hover:underline">
                    {s.id}
                  </button>
                </td>
                <td className="px-4 py-3.5 max-w-64">
                  <p className="text-xs font-semibold text-foreground line-clamp-2">{s.title}</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.category}</td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.submissionDate}</td>
                <td className="px-4 py-3.5"><StatusBadge status={s.status} size="sm" /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setViewSub(s)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    
                    {/* Edit button with permission checking */}
                    {['draft', 'submitted', 'revision_required'].includes(s.status) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={cn(
                                'h-7 px-2',
                                canEditSubmission(s).allowed
                                  ? 'text-primary hover:text-primary hover:bg-primary/10'
                                  : 'text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent'
                              )}
                              onClick={() => {
                                if (canEditSubmission(s).allowed) {
                                  navigate(`/author/submit?edit=${s.id}`);
                                } else {
                                  toast.error(canEditSubmission(s).reason || 'Cannot edit this submission');
                                }
                              }}
                              disabled={!canEditSubmission(s).allowed}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          {!canEditSubmission(s).allowed && (
                            <TooltipContent>
                              <div className="flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span>{canEditSubmission(s).reason}</span>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {/* Version history button */}
                    {s.versionHistory && s.versionHistory.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => setVersionHistoryId(s.id)}
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    {/* Withdraw button */}
                    {canWithdraw(s.status) && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setWithdrawId(s.id)}>
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} total</p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <Button key={n} size="sm" variant={n === page ? 'default' : 'ghost'} className={cn('h-7 w-7 text-xs p-0', n === page && 'bg-primary text-primary-foreground')} onClick={() => setPage(n)}>{n}</Button>
            ))}
            <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <AbstractModal submission={viewSub} open={!!viewSub} onClose={() => setViewSub(null)} />
      <AlertDialog open={!!withdrawId} onOpenChange={() => setWithdrawId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Submission?</AlertDialogTitle>
            <AlertDialogDescription>This will mark the submission as withdrawn. The admin will see the withdrawn status.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleWithdraw}>
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Version history modal */}
      {versionHistoryId && (
        <SubmissionVersionHistory
          versions={submissions.find(s => s.id === versionHistoryId)?.versionHistory || []}
          currentVersion={submissions.find(s => s.id === versionHistoryId)?.currentVersion}
          open={!!versionHistoryId}
          onClose={() => setVersionHistoryId(null)}
        />
      )}
    </div>
  );
}
