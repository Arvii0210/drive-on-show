import { useState, useMemo } from 'react';
import { FileText, Search, Download, Eye, UserPlus, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AbstractModal } from '@/components/shared/AbstractModal';
import { AssignReviewerModal } from '@/components/shared/AssignReviewerModal';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventStore } from '@/store/eventStore';
import { useReviewStore } from '@/store/reviewStore';
import { useGradeCriteriaStore } from '@/store/gradeCriteriaStore';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import { useEventFilteredReviewers } from '@/hooks/useEventFilteredUsers';
import { REVIEW_CRITERIA, calcReviewAvg, calcReviewTotal, type Review } from '@/data/mockData';
import { useCategoryStore } from '@/store/categoryStore';
import { useFinalCategoryStore } from '@/store/finalCategoryStore';
import type { Submission, SubmissionStatus } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUSES = ['all', 'draft', 'submitted', 'under_review', 'revision_required', 'accepted', 'rejected', 'withdrawn'];
const PAGE_SIZE = 6;

function generateAbstractDoc(sub: Submission): string {
  const lines = [
    sub.title, '',
    `Author: ${sub.author}`, `Email: ${sub.authorEmail}`, `Institution: ${sub.institution}`,
    `Department: ${sub.department}`, `Category: ${sub.category}`, `Keywords: ${sub.keywords.join(', ')}`,
    `Submission Date: ${sub.submissionDate}`, `Status: ${sub.status}`, '',
    '--- ABSTRACT ---', '',
    'Introduction:', sub.content.introduction, '', 'Aim:', sub.content.aim, '',
    'Methods:', sub.content.methods, '', 'Results:', sub.content.results, '',
    'Conclusion:', sub.content.conclusion,
  ];
  if (sub.coAuthors.length > 0) {
    lines.push('', 'Co-Authors:');
    sub.coAuthors.forEach(ca => lines.push(`  - ${ca.name} (${ca.email}, ${ca.institution})`));
  }
  return lines.join('\n');
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─── Score Breakdown Modal (Full-Width) ─── */
function ScoreBreakdownModal({ submission, reviews, open, onClose }: {
  submission: Submission | null; reviews: Review[]; open: boolean; onClose: () => void;
}) {
  if (!submission) return null;
  const subReviews = reviews.filter(r => r.submissionId === submission.id && r.status === 'completed');

  const criteriaAverages: Record<string, number> = {};
  REVIEW_CRITERIA.forEach(c => {
    const vals = subReviews.map(r => r.scores[c.key]).filter(v => v > 0);
    criteriaAverages[c.key] = vals.length > 0 ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
  });

  const overallAvg = subReviews.length > 0
    ? +(subReviews.reduce((sum, r) => sum + calcReviewAvg(r.scores), 0) / subReviews.length).toFixed(2) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Score Breakdown — {submission.id}
          </DialogTitle>
          <DialogDescription className="text-sm">{submission.title}</DialogDescription>
        </DialogHeader>

        {subReviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No completed reviews yet.</div>
        ) : (
          <div className="space-y-6">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-primary/5 rounded-xl p-5 text-center border border-primary/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overall Average</p>
                <p className={cn('text-4xl font-bold tabular-nums mt-1', overallAvg >= 8 ? 'text-success' : overallAvg >= 6 ? 'text-primary' : 'text-warning')}>
                  {overallAvg}<span className="text-base text-muted-foreground">/10</span>
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-5 text-center border border-border">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Reviewers</p>
                <p className="text-4xl font-bold tabular-nums text-foreground mt-1">{subReviews.length}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-5 text-center border border-border">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Criteria Evaluated</p>
                <p className="text-4xl font-bold tabular-nums text-foreground mt-1">{REVIEW_CRITERIA.length}</p>
              </div>
            </div>

            {/* Full-width table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground min-w-[160px]">Reviewer</th>
                    {REVIEW_CRITERIA.map(c => (
                      <th key={c.key} className="px-3 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{c.label}</th>
                    ))}
                    <th className="px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total</th>
                    <th className="px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Avg</th>
                    <th className="px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {subReviews.map(r => {
                    const avg = calcReviewAvg(r.scores);
                    const total = calcReviewTotal(r.scores);
                    return (
                      <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-foreground">{r.reviewerName}</p>
                          <p className="text-xs text-muted-foreground">{r.completedDate}</p>
                        </td>
                        {REVIEW_CRITERIA.map(c => (
                          <td key={c.key} className="px-3 py-4 text-center">
                            <span className={cn('text-base font-bold tabular-nums',
                              r.scores[c.key] >= 8 ? 'text-success' : r.scores[c.key] >= 6 ? 'text-primary' :
                              r.scores[c.key] >= 4 ? 'text-warning' : 'text-destructive'
                            )}>{r.scores[c.key]}</span>
                          </td>
                        ))}
                        <td className="px-4 py-4 text-center">
                          <span className="text-base font-bold text-primary tabular-nums">{total}</span>
                          <span className="text-xs text-muted-foreground">/{REVIEW_CRITERIA.length * 10}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn('text-base font-bold tabular-nums', avg >= 8 ? 'text-success' : avg >= 6 ? 'text-primary' : 'text-warning')}>{avg}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={r.recommendation === 'accept' ? 'accepted' : r.recommendation === 'reject' ? 'rejected' : 'revision_required'} size="sm" />
                        </td>
                      </tr>
                    );
                  })}
                  {/* Averages row */}
                  <tr className="bg-primary/5 font-semibold border-t-2 border-primary/20">
                    <td className="px-5 py-4"><p className="text-sm font-bold text-primary">AVERAGE</p></td>
                    {REVIEW_CRITERIA.map(c => (
                      <td key={c.key} className="px-3 py-4 text-center">
                        <span className={cn('text-base font-bold tabular-nums',
                          criteriaAverages[c.key] >= 8 ? 'text-success' : criteriaAverages[c.key] >= 6 ? 'text-primary' :
                          criteriaAverages[c.key] >= 4 ? 'text-warning' : 'text-destructive'
                        )}>{criteriaAverages[c.key]}</span>
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center">
                      <span className="text-base font-bold text-primary tabular-nums">{Object.values(criteriaAverages).reduce((a, b) => a + b, 0).toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn('text-base font-bold tabular-nums', overallAvg >= 8 ? 'text-success' : overallAvg >= 6 ? 'text-primary' : 'text-warning')}>{overallAvg}</span>
                    </td>
                    <td className="px-4 py-4 text-center">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Reviewer Comments</h4>
              {subReviews.map(r => (
                <div key={r.id} className="bg-secondary/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{r.reviewerName}</p>
                    <StatusBadge status={r.recommendation === 'accept' ? 'accepted' : r.recommendation === 'reject' ? 'rejected' : 'revision_required'} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.comments || 'No comments provided.'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function SubmissionsManagement() {
  const filteredSubmissions = useEventFilteredSubmissions();
  const { reviews } = useReviewStore();
  const reviewers = useEventFilteredReviewers();
  const { getStatusForScore } = useGradeCriteriaStore();
  const { getCategoriesForConference } = useCategoryStore();
  const { getFinalCategoriesForConference } = useFinalCategoryStore();
  const { events } = useEventStore();
  
  // Get categories for the first event (conference-specific)
  const categories = useMemo(
    () => getCategoriesForConference(events[0]?.id || ''),
    [getCategoriesForConference, events]
  );

  // Get final categories for the first event
  const finalCategories = useMemo(
    () => getFinalCategoriesForConference(events[0]?.id || ''),
    [getFinalCategoriesForConference, events]
  );
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewSub, setViewSub] = useState<Submission | null>(null);
  const [assignSub, setAssignSub] = useState<Submission | null>(null);
  const [scoreSub, setScoreSub] = useState<Submission | null>(null);
  const [viewReviewersFor, setViewReviewersFor] = useState<Submission | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkReviewers, setBulkReviewers] = useState<string[]>([]);
  const [bulkFinalCatOpen, setBulkFinalCatOpen] = useState(false);
  const [bulkFinalCat, setBulkFinalCat] = useState('');
  const [singleFinalCatSub, setSingleFinalCatSub] = useState<Submission | null>(null);
  const [singleFinalCatOpen, setSingleFinalCatOpen] = useState(false);
  const [singleFinalCat, setSingleFinalCat] = useState('');

  const enrichedSubmissions = useMemo(() => filteredSubmissions.map(s => {
    if (s.averageScore !== null && s.status !== 'withdrawn') {
      const autoStatus = getStatusForScore(s.averageScore);
      if (autoStatus) return { ...s, status: autoStatus };
    }
    return s;
  }), [filteredSubmissions, getStatusForScore]);

  const filtered = useMemo(() => enrichedSubmissions.filter(s => {
    const sSearch = search.toLowerCase();
    const matchSearch = s.title.toLowerCase().includes(sSearch) ||
      s.author.toLowerCase().includes(sSearch) ||
      s.id.toLowerCase().includes(sSearch);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  }), [enrichedSubmissions, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    const pageIds = paginated.map(s => s.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    else setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
  };

  const handleBulkAssign = () => {
    if (bulkReviewers.length === 0) { toast.error('Select at least one reviewer'); return; }
    const { assignReviewer } = useSubmissionStore.getState();
    selectedIds.forEach(id => {
      bulkReviewers.forEach(reviewer => assignReviewer(id, reviewer));
    });
    toast.success(`Assigned ${bulkReviewers.length} reviewer(s) to ${selectedIds.length} submission(s)`);
    setSelectedIds([]); setBulkAssignOpen(false); setBulkReviewers([]);
  };

  const toggleReviewer = (reviewer: string) => {
    setBulkReviewers(prev => 
      prev.includes(reviewer)
        ? prev.filter(r => r !== reviewer)
        : [...prev, reviewer]
    );
  };

  const handleBulkFinalCategoryChange = () => {
    if (!bulkFinalCat) { toast.error('Select a final category'); return; }
    const { updateSubmission } = useSubmissionStore.getState();
    selectedIds.forEach(id => {
      const sub = filteredSubmissions.find(s => s.id === id);
      if (sub) {
        updateSubmission(id, { ...sub, finalCategory: bulkFinalCat });
      }
    });
    toast.success(`Changed final category to ${bulkFinalCat} for ${selectedIds.length} submission(s)`);
    setSelectedIds([]); setBulkFinalCatOpen(false); setBulkFinalCat('');
  };

  const handleSingleFinalCategoryChange = () => {
    if (!singleFinalCatSub || !singleFinalCat) { toast.error('Select a final category'); return; }
    const { updateSubmission } = useSubmissionStore.getState();
    updateSubmission(singleFinalCatSub.id, { ...singleFinalCatSub, finalCategory: singleFinalCat });
    toast.success(`Changed final category to ${singleFinalCat}`);
    setSingleFinalCatSub(null); setSingleFinalCatOpen(false); setSingleFinalCat('');
  };

  const handleDownload = (sub: Submission) => {
    downloadTextFile(generateAbstractDoc(sub), `${sub.id}-abstract.doc`);
    toast.success('Abstract downloaded');
  };

  const handleBulkDownload = () => {
    const allContent = filtered.map(sub => `${'='.repeat(60)}\n${generateAbstractDoc(sub)}\n`).join('\n\n');
    downloadTextFile(allContent, 'all-abstracts.doc');
    toast.success(`${filtered.length} abstracts exported`);
  };

  const activeReviewers = reviewers.filter(r => r.status === 'active');


  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Submissions Management"
        subtitle={`${filtered.length} submission(s)`}
        icon={FileText}
        actions={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => setBulkAssignOpen(true)}>
                  <Users className="h-4 w-4 mr-1.5" /> Bulk Assign ({selectedIds.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => setBulkFinalCatOpen(true)}>
                  📋 Bulk Change Category ({selectedIds.length})
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleBulkDownload}>
              <Download className="h-4 w-4 mr-1.5" /> Export All
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title, author, ID..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox checked={paginated.length > 0 && paginated.every(s => selectedIds.includes(s.id))} onCheckedChange={toggleAll} />
                </th>
                {['ID', 'Title', 'Author', 'Category', 'Status', 'Score', 'Final Category', 'Reviewers', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginated.map(s => (
                <tr key={s.id} className={cn("hover:bg-muted/20 transition-colors", selectedIds.includes(s.id) && "bg-primary/5")}>
                  <td className="px-4 py-3.5">
                    <Checkbox checked={selectedIds.includes(s.id)} onCheckedChange={() => toggleSelect(s.id)} />
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setViewSub(s)} className="text-xs font-mono text-primary font-semibold hover:underline">{s.id}</button>
                  </td>
                  <td className="px-4 py-3.5 max-w-56">
                    <p className="text-xs font-semibold text-foreground truncate">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground">{s.submissionDate}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.author}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.category}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5">
                    {s.averageScore !== null ? (
                      <button onClick={() => setScoreSub(s)} className="text-sm font-bold text-primary tabular-nums hover:underline underline-offset-2 cursor-pointer transition-colors hover:text-primary/80 flex items-center gap-1">
                        {s.averageScore}/10
                        
                      </button>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-xs">
                    <div className="flex items-center gap-2">
                      {s.finalCategory ? (
                        <>
                          <span className="text-muted-foreground">{s.finalCategory}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setSingleFinalCatSub(s);
                              setSingleFinalCat(s.finalCategory || '');
                              setSingleFinalCatOpen(true);
                            }}
                          >
                            ✏️
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[11px] text-primary hover:bg-primary/10"
                          onClick={() => {
                            setSingleFinalCatSub(s);
                            setSingleFinalCat('');
                            setSingleFinalCatOpen(true);
                          }}
                        >
                          + Add
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs">
                    {s.assignedReviewers.length > 0
                      ? <button onClick={() => setViewReviewersFor(s)} className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer">{s.assignedReviewers.length} assigned</button>
                      : <span className="text-muted-foreground/60">None</span>
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setViewSub(s)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setAssignSub(s)}><UserPlus className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => handleDownload(s)}><Download className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <Button key={n} size="sm" variant={n === page ? 'default' : 'ghost'} className={cn('h-7 w-7 text-xs p-0', n === page && 'bg-primary text-primary-foreground')} onClick={() => setPage(n)}>{n}</Button>
            ))}
            <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {/* Bulk Assign Modal */}
      <Dialog open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Assign Reviewers</DialogTitle>
            <DialogDescription>Select reviewers to assign to {selectedIds.length} selected submission(s)</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activeReviewers.map((r) => (
              <div key={r.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={bulkReviewers.includes(r.name)}
                  onCheckedChange={() => toggleReviewer(r.name)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.institution}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 text-xs text-muted-foreground">
            {bulkReviewers.length} reviewer(s) selected
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setBulkAssignOpen(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleBulkAssign}>Assign</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Final Category Change Modal */}
      <Dialog open={bulkFinalCatOpen} onOpenChange={setBulkFinalCatOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bulk Change Final Category</DialogTitle>
            <DialogDescription>Change final category for {selectedIds.length} selected submission(s)</DialogDescription>
          </DialogHeader>
          <Select value={bulkFinalCat} onValueChange={setBulkFinalCat}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select final category..." /></SelectTrigger>
            <SelectContent>
              {finalCategories.map(fc => <SelectItem key={fc.id} value={fc.name}>{fc.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setBulkFinalCatOpen(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleBulkFinalCategoryChange}>Change</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Single Final Category Change Modal */}
      <Dialog open={singleFinalCatOpen} onOpenChange={setSingleFinalCatOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Final Category</DialogTitle>
            <DialogDescription>Change final category for {singleFinalCatSub?.id}</DialogDescription>
          </DialogHeader>
          <Select value={singleFinalCat} onValueChange={setSingleFinalCat}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select final category..." /></SelectTrigger>
            <SelectContent>
              {finalCategories.map(fc => <SelectItem key={fc.id} value={fc.name}>{fc.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setSingleFinalCatOpen(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSingleFinalCategoryChange}>Change</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviewers List Modal */}
      <Dialog open={!!viewReviewersFor} onOpenChange={() => setViewReviewersFor(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assigned Reviewers</DialogTitle>
            <DialogDescription>{viewReviewersFor?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {viewReviewersFor?.assignedReviewers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviewers assigned</p>
            ) : (
              <div className="space-y-2">
                {viewReviewersFor?.assignedReviewers.map((reviewer, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {reviewer.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{reviewer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ScoreBreakdownModal submission={scoreSub} reviews={reviews} open={!!scoreSub} onClose={() => setScoreSub(null)} />
      <AbstractModal submission={viewSub} open={!!viewSub} onClose={() => setViewSub(null)} />
      <AssignReviewerModal submission={assignSub} open={!!assignSub} onClose={() => setAssignSub(null)} />
    </div>
  );
}
