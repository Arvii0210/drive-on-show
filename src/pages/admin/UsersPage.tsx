import { useState, useMemo } from 'react';
import { Users, UserPlus, Mail, Search, Upload, RotateCcw, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { useEventFilteredReviewers } from '@/hooks/useEventFilteredUsers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InviteEntry {
  name: string;
  email: string;
  password: string;
  valid: boolean;
  duplicate: boolean;
}

type ReviewerStatus = 'active' | 'invited' | 'pending';

function generatePassword(name: string, existingPasswords: string[]): string {
  const base = name.toLowerCase().replace(/\s+/g, '').split(' ')[0] || 'user';
  let pwd = `${base}@123`;
  let counter = 1;
  while (existingPasswords.includes(pwd)) {
    pwd = `${base}${counter}@123`;
    counter++;
  }
  return pwd;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UsersPage() {
  const reviewers = useEventFilteredReviewers();
  const [search, setSearch] = useState('');
  const [singleInviteOpen, setSingleInviteOpen] = useState(false);
  const [bulkInviteOpen, setBulkInviteOpen] = useState(false);

  // Single invite
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // Bulk invite
  const [bulkText, setBulkText] = useState('');
  const [bulkEntries, setBulkEntries] = useState<InviteEntry[]>([]);
  const [bulkStep, setBulkStep] = useState<'input' | 'preview'>('input');
  const [showPasswords, setShowPasswords] = useState(false);

  const reviewerList = useMemo(() => {
    return reviewers.map(r => ({
      ...r,
      displayStatus: (r.status === 'active' ? 'active' : 'invited') as ReviewerStatus,
    })).filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
    });
  }, [reviewers, search]);

  const handleSingleInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }
    if (!isValidEmail(inviteEmail)) {
      toast.error('Invalid email address');
      return;
    }
    const pwd = generatePassword(inviteName, []);
    toast.success(`Invitation sent to ${inviteEmail}`, {
      description: `Credentials: ${inviteEmail} / ${pwd}`,
      duration: 6000,
    });
    setInviteName('');
    setInviteEmail('');
    setInviteMessage('');
    setSingleInviteOpen(false);
  };

  const parseBulkEntries = () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const passwords: string[] = [];
    const emails: string[] = [];

    const entries: InviteEntry[] = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      const name = parts[0] || '';
      const email = parts[1] || '';
      const valid = !!name && isValidEmail(email);
      const duplicate = emails.includes(email.toLowerCase());
      if (!duplicate) emails.push(email.toLowerCase());
      const password = generatePassword(name, passwords);
      passwords.push(password);
      return { name, email, password, valid, duplicate };
    });

    setBulkEntries(entries);
    setBulkStep('preview');
  };

  const handleBulkInvite = () => {
    const validEntries = bulkEntries.filter(e => e.valid && !e.duplicate);
    if (validEntries.length === 0) {
      toast.error('No valid entries to invite');
      return;
    }
    validEntries.forEach(entry => {
      toast.info(`Invited ${entry.name}: ${entry.email} / ${entry.password}`, { duration: 5000 });
    });
    toast.success(`${validEntries.length} reviewer(s) invited successfully`);
    setBulkText('');
    setBulkEntries([]);
    setBulkStep('input');
    setBulkInviteOpen(false);
  };

  const statusColors: Record<ReviewerStatus, string> = {
    active: 'bg-success/10 text-success border-success/20',
    invited: 'bg-primary/10 text-primary border-primary/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Reviewer Management"
        subtitle={`${reviewerList.length} reviewers`}
        icon={Users}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setBulkInviteOpen(true)}>
              <Upload className="h-4 w-4 mr-1.5" /> Bulk Invite
            </Button>
            <Button className="gradient-primary text-white border-0 hover:opacity-90" onClick={() => setSingleInviteOpen(true)}>
              <Mail className="h-4 w-4 mr-2" /> Invite Reviewer
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search reviewers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Reviewer Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              {['Reviewer', 'Email', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {reviewerList.map(r => (
              <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {r.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.institution}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3.5">
                  <Badge variant="secondary" className={cn('text-[10px] font-semibold capitalize', statusColors[r.displayStatus])}>
                    {r.displayStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info(`Resending invite to ${r.email}`)}>
                      <RotateCcw className="h-3 w-3 mr-1" /> Resend
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.info(`Password reset for ${r.email}`)}>
                      Reset Password
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => toast.info(`Removed ${r.name}`)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {reviewerList.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground text-sm">No reviewers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Single Invite Modal */}
      <Dialog open={singleInviteOpen} onOpenChange={setSingleInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Invite Reviewer
            </DialogTitle>
            <DialogDescription>Send an invitation with login credentials.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Reviewer Name *</Label>
              <Input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Dr. Jane Smith" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Email Address *</Label>
              <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="jane.smith@university.edu" type="email" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Optional Message</Label>
              <Textarea value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} placeholder="We'd love your expertise..." rows={3} className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setSingleInviteOpen(false)}>Cancel</Button>
            <Button className="flex-1 gradient-primary text-white border-0" onClick={handleSingleInvite}>
              <Mail className="h-4 w-4 mr-1.5" /> Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Invite Modal */}
      <Dialog open={bulkInviteOpen} onOpenChange={(open) => { setBulkInviteOpen(open); if (!open) { setBulkStep('input'); setBulkEntries([]); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> Bulk Invite Reviewers
            </DialogTitle>
            <DialogDescription>
              {bulkStep === 'input'
                ? 'Enter reviewer data as CSV: Name, Email (one per line)'
                : 'Review and confirm the entries below'}
            </DialogDescription>
          </DialogHeader>

          {bulkStep === 'input' ? (
            <>
              <Textarea
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder={"John Doe, john@example.com\nJane Smith, jane@example.com"}
                rows={8}
                className="resize-none text-sm font-mono"
              />
              <DialogFooter className="gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setBulkInviteOpen(false)}>Cancel</Button>
                <Button className="flex-1 gradient-primary text-white border-0" onClick={parseBulkEntries} disabled={!bulkText.trim()}>
                  Preview & Validate
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="max-h-64 overflow-auto border border-border rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-muted-foreground">Name</th>
                      <th className="px-3 py-2 text-left font-bold text-muted-foreground">Email</th>
                      <th className="px-3 py-2 text-left font-bold text-muted-foreground">
                        <button className="flex items-center gap-1" onClick={() => setShowPasswords(!showPasswords)}>
                          Password {showPasswords ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </th>
                      <th className="px-3 py-2 text-left font-bold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {bulkEntries.map((entry, i) => (
                      <tr key={i} className={cn(!entry.valid || entry.duplicate ? 'bg-destructive/5' : '')}>
                        <td className="px-3 py-2 font-medium">{entry.name || '—'}</td>
                        <td className="px-3 py-2 text-muted-foreground">{entry.email || '—'}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">{showPasswords ? entry.password : '••••••'}</td>
                        <td className="px-3 py-2">
                          {entry.duplicate ? (
                            <Badge variant="destructive" className="text-[9px]">Duplicate</Badge>
                          ) : !entry.valid ? (
                            <Badge variant="destructive" className="text-[9px]">Invalid</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[9px] bg-success/10 text-success">Valid</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                {bulkEntries.filter(e => e.valid && !e.duplicate).length} valid · {bulkEntries.filter(e => !e.valid || e.duplicate).length} invalid
              </p>
              <DialogFooter className="gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setBulkStep('input')}>Back</Button>
                <Button className="flex-1 gradient-primary text-white border-0" onClick={handleBulkInvite}>
                  <Mail className="h-4 w-4 mr-1.5" /> Send {bulkEntries.filter(e => e.valid && !e.duplicate).length} Invites
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
