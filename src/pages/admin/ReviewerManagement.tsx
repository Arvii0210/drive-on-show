import { useState, useMemo } from 'react';
import { UserCheck, Mail, AlertTriangle, UserMinus, UserPlus, RefreshCw, Search, Bell, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useEventFilteredReviewers } from '@/hooks/useEventFilteredUsers';
import { useReviewStore } from '@/store/reviewStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

type ReviewStatusFilter = 'all' | 'not_started' | 'in_progress' | 'completed';

export default function ReviewerManagement() {
  const reviewers = useEventFilteredReviewers();
  const { reviews, reassignReviewer, removeReviewerFromSubmission } = useReviewStore();
  const { submissions } = useSubmissionStore();
  const filteredSubmissions = useEventFilteredSubmissions();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>('all');
  const [noTemplateAlert, setNoTemplateAlert] = useState(false);

  // Reassignment modal state
  const [reassignModal, setReassignModal] = useState<{
    submissionId: string;
    oldReviewerName: string;
    submissionTitle: string;
  } | null>(null);
  const [newReviewerName, setNewReviewerName] = useState('');

  // Bulk invite modal
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');

  // Get templates from localStorage
  const getTemplates = (): EmailTemplate[] => {
    try {
      return JSON.parse(localStorage.getItem('email_templates') || '[]');
    } catch { return []; }
  };

  const sendReminder = (reviewerName: string) => {
    const templates = getTemplates();
    const reminderTemplate = templates.find(t =>
      t.label.toLowerCase().includes('reminder') ||
      t.subject.toLowerCase().includes('reminder')
    );

    if (!reminderTemplate) {
      setNoTemplateAlert(true);
      return;
    }

    toast.success(`Reminder sent to ${reviewerName}`, {
      description: `Subject: ${reminderTemplate.subject}`,
    });
  };

  // Compute reviewer review status details
  const reviewerDetails = useMemo(() => {
    return reviewers.map(r => {
      const assignedReviews = reviews.filter(rev =>
        rev.reviewerName === r.name &&
        filteredSubmissions.some(s => s.id === rev.submissionId)
      );
      const completedReviews = assignedReviews.filter(rev => rev.status === 'completed');
      const pendingReviews = assignedReviews.filter(rev => rev.status === 'pending');
      const notStarted = r.assignedReviews > 0 && r.completedReviews === 0;

      let reviewStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started';
      if (r.completedReviews > 0 && r.completedReviews >= r.assignedReviews) {
        reviewStatus = 'completed';
      } else if (r.completedReviews > 0) {
        reviewStatus = 'in_progress';
      }

      return {
        ...r,
        assignedReviewsList: assignedReviews,
        completedReviewsList: completedReviews,
        pendingReviewsList: pendingReviews,
        notStarted,
        reviewStatus,
        pct: r.assignedReviews > 0 ? Math.round((r.completedReviews / r.assignedReviews) * 100) : 0,
      };
    });
  }, [reviewers, reviews, filteredSubmissions]);

  // Filter reviewers
  const filtered = useMemo(() => {
    return reviewerDetails.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.institution.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.reviewStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [reviewerDetails, search, statusFilter]);

  // Overall stats
  const overallPct = filtered.length > 0
    ? Math.round(filtered.reduce((acc, r) => acc + r.pct, 0) / filtered.length)
    : 0;

  const handleReassign = () => {
    if (!reassignModal || !newReviewerName) {
      toast.error('Select a new reviewer');
      return;
    }
    reassignReviewer(reassignModal.submissionId, reassignModal.oldReviewerName, newReviewerName);
    toast.success(`Reassigned review from ${reassignModal.oldReviewerName} to ${newReviewerName}`);
    setReassignModal(null);
    setNewReviewerName('');
  };

  const handleRemoveReviewer = (submissionId: string, reviewerName: string) => {
    removeReviewerFromSubmission(submissionId, reviewerName);
    toast.success(`Removed ${reviewerName} from submission ${submissionId}`);
  };

  const handleBulkInvite = () => {
    const emails = inviteEmails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);
    if (emails.length === 0) {
      toast.error('Enter at least one email');
      return;
    }
    emails.forEach(email => {
      const namePart = email.split('@')[0].replace(/[._]/g, ' ');
      const password = `${namePart.split(' ')[0]}@123`;
      toast.info(`Credentials for ${email}: Password: ${password}`, { duration: 5000 });
    });
    toast.success(`${emails.length} reviewer(s) invited`);
    setInviteEmails('');
    setInviteModal(false);
  };

  // Get submissions assigned to a reviewer
  const getReviewerSubmissions = (reviewerName: string) => {
    return filteredSubmissions.filter(s => s.assignedReviewers.includes(reviewerName));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Reviewer & Review Monitoring"
        subtitle={`${reviewers.length} reviewers · ${overallPct}% overall completion`}
        icon={UserCheck}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setInviteModal(true)}>
              <UserPlus className="h-4 w-4 mr-1.5" /> Invite Reviewer
            </Button>
          </div>
        }
      />

      {/* Overall Progress */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold">Overall Review Completion</h3>
            <p className="text-xs text-muted-foreground">Across all filtered reviewers</p>
          </div>
          <span className="text-3xl font-bold gradient-text tabular-nums">{overallPct}%</span>
        </div>
        <ProgressBar value={overallPct} size="lg" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, institution..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as ReviewStatusFilter)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Review Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviewer Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Reviewer</th>
              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Institution</th>
              <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Assigned</th>
              <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Completed</th>
              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Progress</th>
              <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Review Status</th>
              <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                      {r.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-foreground">{r.institution}</p>
                  <p className="text-[10px] text-muted-foreground">{r.department}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-bold text-foreground tabular-nums">{r.assignedReviews}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-bold text-success tabular-nums">{r.completedReviews}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="w-28">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">{r.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge variant="secondary" className={cn(
                    'text-[10px] font-semibold',
                    r.reviewStatus === 'completed' && 'bg-success/10 text-success border-success/20',
                    r.reviewStatus === 'in_progress' && 'bg-primary/10 text-primary border-primary/20',
                    r.reviewStatus === 'not_started' && 'bg-warning/10 text-warning border-warning/20',
                  )}>
                    {r.reviewStatus === 'not_started' ? 'Not Started' :
                     r.reviewStatus === 'in_progress' ? 'In Progress' : 'Completed'}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {/* Remind button */}
                    {r.notStarted && (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-warning text-warning-foreground hover:bg-warning/90"
                        onClick={() => sendReminder(r.name)}
                      >
                        <Bell className="h-3 w-3 mr-1" /> Remind
                      </Button>
                    )}
                    {!r.notStarted && r.reviewStatus !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => sendReminder(r.name)}
                      >
                        <Mail className="h-3 w-3 mr-1" /> Mail
                      </Button>
                    )}
                    {/* Reassign dropdown for each submission */}
                    {r.reviewStatus !== 'completed' && getReviewerSubmissions(r.name).length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-warning hover:text-warning"
                        onClick={() => {
                          const subs = getReviewerSubmissions(r.name);
                          if (subs.length === 1) {
                            setReassignModal({
                              submissionId: subs[0].id,
                              oldReviewerName: r.name,
                              submissionTitle: subs[0].title,
                            });
                          } else {
                            // For multiple, show first for now
                            setReassignModal({
                              submissionId: subs[0].id,
                              oldReviewerName: r.name,
                              submissionTitle: subs[0].title,
                            });
                          }
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Reassign
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No reviewers found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reviewer Submission Detail - per-reviewer breakdown */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold">Assignment Details</h3>
          <p className="text-xs text-muted-foreground mt-0.5">View assigned submissions per reviewer with review status</p>
        </div>
        <div className="divide-y divide-border/50">
          {filtered.map(r => {
            const subs = getReviewerSubmissions(r.name);
            if (subs.length === 0) return null;
            return (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-white text-[10px] font-bold shrink-0">
                    {r.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <Badge variant="secondary" className="text-[10px]">{subs.length} submissions</Badge>
                </div>
                <div className="grid gap-2 pl-10">
                  {subs.map(sub => {
                    const review = reviews.find(rev => rev.submissionId === sub.id && rev.reviewerName === r.name);
                    const reviewStatus = review?.status || 'pending';
                    return (
                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-xs font-semibold text-foreground truncate">{sub.title}</p>
                          <p className="text-[10px] text-muted-foreground">{sub.id} · {sub.category}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className={cn(
                            'text-[10px]',
                            reviewStatus === 'completed' && 'bg-success/10 text-success',
                            reviewStatus === 'pending' && 'bg-warning/10 text-warning',
                            reviewStatus === 'not_reviewed' && 'bg-muted text-muted-foreground',
                          )}>
                            {reviewStatus === 'completed' ? 'Completed' :
                             reviewStatus === 'pending' ? 'Pending' : 'Not Reviewed'}
                          </Badge>
                          {reviewStatus !== 'completed' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-1.5 text-[10px] text-warning hover:text-warning"
                                onClick={() => setReassignModal({
                                  submissionId: sub.id,
                                  oldReviewerName: r.name,
                                  submissionTitle: sub.title,
                                })}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-1.5 text-[10px] text-destructive hover:text-destructive"
                                onClick={() => handleRemoveReviewer(sub.id, r.name)}
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reassignment Modal */}
      <Dialog open={!!reassignModal} onOpenChange={() => setReassignModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-warning" /> Reassign Reviewer
            </DialogTitle>
            <DialogDescription>
              Replace <span className="font-semibold">{reassignModal?.oldReviewerName}</span> for submission "{reassignModal?.submissionTitle}"
            </DialogDescription>
          </DialogHeader>
          <Select value={newReviewerName} onValueChange={setNewReviewerName}>
            <SelectTrigger><SelectValue placeholder="Select new reviewer..." /></SelectTrigger>
            <SelectContent>
              {reviewers
                .filter(r => r.name !== reassignModal?.oldReviewerName && r.status === 'active')
                .map(r => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.name} — {r.institution}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setReassignModal(null)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleReassign}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Invite Modal */}
      <Dialog open={inviteModal} onOpenChange={setInviteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Invite Reviewers
            </DialogTitle>
            <DialogDescription>
              Enter email addresses (comma or newline separated). Credentials will be generated as name@123.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={"john.smith@university.edu\njane.doe@institute.org"}
            value={inviteEmails}
            onChange={e => setInviteEmails(e.target.value)}
            rows={5}
            className="resize-none text-sm"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setInviteModal(false)}>Cancel</Button>
            <Button className="flex-1 gradient-primary text-white border-0" onClick={handleBulkInvite}>
              <Mail className="h-4 w-4 mr-1.5" /> Send Invites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No Template Alert */}
      <Dialog open={noTemplateAlert} onOpenChange={setNoTemplateAlert}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              No Reminder Template Found
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Please create a reminder email template in the Communication section first. The template name or subject should contain the word "reminder".
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setNoTemplateAlert(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setNoTemplateAlert(false); navigate('/admin/notifications'); }}>
              Go to Communication
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
