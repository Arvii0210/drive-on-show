import { useState, useEffect, useMemo, useRef } from 'react';
import { Bell, Send, Eye, Users, UserCheck, Plus, Trash2, X, ChevronLeft, ChevronRight, Mail, Table2, Paperclip, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';
import { useReviewStore } from '@/store/reviewStore';
import { useEventStore } from '@/store/eventStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
  type: 'reviewer_invite' | 'result_publish' | 'reminder' | 'custom';
}

// Dynamic parameters for templates
const DYNAMIC_PARAMS = [
  { key: '{{name}}', label: 'Recipient Name' },
  { key: '{{title}}', label: 'Submission Title' },
  { key: '{{category}}', label: 'Category' },
  { key: '{{final_category}}', label: 'Final Category' },
  { key: '{{final_status}}', label: 'Final Status' },
  { key: '{{conference}}', label: 'Conference Name' },
  { key: '{{deadline}}', label: 'Deadline Date' },
];

// Persist templates in localStorage
function loadTemplates(): EmailTemplate[] {
  try { return JSON.parse(localStorage.getItem('email_templates') || '[]'); } catch { return []; }
}
function saveTemplates(templates: EmailTemplate[]) {
  localStorage.setItem('email_templates', JSON.stringify(templates));
}

export default function NotificationCenter() {
  const submissions = useEventFilteredSubmissions();
  const { reviewers } = useReviewStore();
  const { addEmailLog } = useEventStore();

  const [templates, setTemplates] = useState<EmailTemplate[]>(loadTemplates);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<EmailTemplate, 'id'>>({ label: '', subject: '', body: '', type: 'custom' });

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [group, setGroup] = useState<'all' | 'authors' | 'reviewers'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [includeTable, setIncludeTable] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const attachInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Sync templates to localStorage
  useEffect(() => { saveTemplates(templates); }, [templates]);

  const allAuthors = [...new Map(submissions.map(s => [s.authorEmail, {
    name: s.author,
    email: s.authorEmail,
    submissions: submissions.filter(sub => sub.authorEmail === s.authorEmail),
  }])).values()];
  const allReviewers = reviewers.map(r => ({ name: r.name, email: r.email, submissions: [] as typeof submissions }));
  const recipients = group === 'authors' ? allAuthors : group === 'reviewers' ? allReviewers : [...allAuthors, ...allReviewers];

  const selectAll = () => setSelected(recipients.map(r => r.email));
  const deselectAll = () => setSelected([]);
  const toggleRecipient = (email: string) => setSelected(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);

  const resolveBody = (templateBody: string, recipientName: string, recipientSubmissions?: typeof submissions) => {
    let resolved = templateBody
      .replace(/\{\{name\}\}/gi, recipientName)
      .replace(/\{\{conference\}\}/gi, 'Current Conference');

    if (recipientSubmissions && recipientSubmissions.length > 0) {
      resolved = resolved
        .replace(/\{\{title\}\}/gi, recipientSubmissions[0].title)
        .replace(/\{\{category\}\}/gi, recipientSubmissions[0].category)
        .replace(/\{\{final_category\}\}/gi, recipientSubmissions[0].category)
        .replace(/\{\{final_status\}\}/gi, recipientSubmissions[0].status.replace(/_/g, ' '));
    }

    return resolved;
  };

  // Build table for submissions
  const buildSubmissionTable = (subs: typeof submissions) => {
    if (subs.length === 0) return '';
    return subs.map((s, i) =>
      `${i + 1}. ${s.title} | ${s.category} | ${s.status.replace(/_/g, ' ')}`
    ).join('\n');
  };

  const getPreviewRecipients = () => {
    const recipientEmails = selected.length > 0 ? selected : recipients.map(r => r.email);
    return recipients.filter(r => recipientEmails.includes(r.email));
  };

  const handleAddTemplate = () => {
    if (!newTemplate.label || !newTemplate.subject || !newTemplate.body) {
      toast.error('Please fill in all template fields');
      return;
    }
    setTemplates(prev => [...prev, { ...newTemplate, id: `TPL-${Date.now()}` }]);
    setNewTemplate({ label: '', subject: '', body: '', type: 'custom' });
    setShowAddTemplate(false);
    toast.success('Template created successfully');
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.info('Template removed');
  };

  const applyTemplate = (t: EmailTemplate) => {
    setSubject(t.subject);
    setBody(t.body);
  };

  const insertParam = (param: string) => {
    setBody(prev => prev + param);
  };

  const handleSend = () => {
    if (!subject) { toast.error('Please enter a subject'); return; }
    if (!body) { toast.error('Please enter a message'); return; }
    const recipientList = selected.length > 0 ? selected : recipients.map(r => r.email);
    addEmailLog({ id: `EMAIL-${Date.now()}`, subject, recipients: recipientList.join(', '), sentAt: new Date().toISOString(), status: 'sent' });
    toast.success(`Email sent to ${recipientList.length} recipient(s)!`, { description: subject });
    setSubject(''); setBody(''); setSelected([]); setAttachments([]);
  };

  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const openPreview = () => { setPreviewIndex(0); setPreview(true); };
  const previewRecipients = getPreviewRecipients();

  const templateTypeLabel = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'reviewer_invite': return 'Reviewer Invite';
      case 'result_publish': return 'Result Publish';
      case 'reminder': return 'Reminder';
      default: return 'Custom';
    }
  };

  const templateTypeColor = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'reviewer_invite': return 'bg-primary/10 text-primary';
      case 'result_publish': return 'bg-success/10 text-success';
      case 'reminder': return 'bg-warning/10 text-warning';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Communication Center" subtitle="Send emails, manage templates with dynamic parameters" icon={Bell} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Templates */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Email Templates</h3>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setShowAddTemplate(true)}>
                <Plus className="h-3.5 w-3.5" /> Add Template
              </Button>
            </div>

            {templates.length === 0 && !showAddTemplate && (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No templates yet. Create one to get started.</p>
                <p className="text-[10px] mt-1 opacity-60">Supported types: Reviewer Invite, Result Publish, Reminder</p>
              </div>
            )}

            {templates.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {templates.map(t => (
                  <div key={t.id} className="group relative text-left px-3 py-2.5 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-150">
                    <button onClick={() => applyTemplate(t)} className="w-full text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-xs font-semibold text-foreground truncate">{t.label}</p>
                        <Badge variant="secondary" className={cn('text-[8px] px-1 py-0', templateTypeColor(t.type))}>
                          {templateTypeLabel(t.type)}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{t.subject}</p>
                    </button>
                    <button onClick={() => deleteTemplate(t.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1 rounded-md transition-all">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddTemplate && (
              <div className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-primary">New Template</h4>
                  <button onClick={() => setShowAddTemplate(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Template Name *</Label>
                    <Input placeholder="e.g. Reviewer Invite" value={newTemplate.label} onChange={e => setNewTemplate(p => ({ ...p, label: e.target.value }))} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Template Type *</Label>
                    <Select value={newTemplate.type} onValueChange={v => setNewTemplate(p => ({ ...p, type: v as EmailTemplate['type'] }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reviewer_invite">Reviewer Invite</SelectItem>
                        <SelectItem value="result_publish">Result Publish</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Subject *</Label>
                  <Input placeholder="Email subject line..." value={newTemplate.subject} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))} className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Body *</Label>
                  </div>
                  {/* Dynamic param chips */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {DYNAMIC_PARAMS.map(p => (
                      <button
                        key={p.key}
                        onClick={() => setNewTemplate(prev => ({ ...prev, body: prev.body + p.key }))}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder={"Dear {{name}},\n\nYour message here...\n\nBest regards,\nConference Committee"} value={newTemplate.body} onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))} rows={5} className="resize-none text-xs" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowAddTemplate(false)}>Cancel</Button>
                  <Button size="sm" className="h-8 text-xs gradient-primary text-white border-0" onClick={handleAddTemplate}>Save Template</Button>
                </div>
              </div>
            )}
          </div>

          {/* Compose */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-4">
            <h3 className="text-sm font-bold">Compose Email</h3>
            <div className="space-y-1.5">
              <Label>Subject *</Label>
              <Input placeholder="Email subject..." value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Message *</Label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Switch checked={includeTable} onCheckedChange={setIncludeTable} className="scale-75" />
                    <span className="text-[10px] text-muted-foreground">Include submission table</span>
                  </div>
                </div>
              </div>
              {/* Dynamic param chips for compose */}
              <div className="flex flex-wrap gap-1">
                {DYNAMIC_PARAMS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => insertParam(p.key)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <Textarea placeholder={"Dear {{name}},\n\nWrite your message here..."} value={body} onChange={e => setBody(e.target.value)} rows={8} className="resize-none" />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Attachments</Label>
                <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => attachInputRef.current?.click()}>
                  <Paperclip className="h-3.5 w-3.5" /> Add File
                </Button>
                <input type="file" ref={attachInputRef} className="hidden" multiple onChange={handleAttachFiles} />
              </div>
              {attachments.length > 0 && (
                <div className="space-y-1.5">
                  {attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-secondary/60 rounded-lg px-3 py-2 border border-border">
                      <FileIcon className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={openPreview} disabled={!subject || !body}>
                <Eye className="h-4 w-4 mr-2" /> Preview All
              </Button>
              <Button className="flex-1 gradient-primary text-white border-0 hover:opacity-90" onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" /> Send Email {attachments.length > 0 && `(${attachments.length} file${attachments.length > 1 ? 's' : ''})`}
              </Button>
            </div>
          </div>
        </div>

        {/* Recipient Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-4">
          <h3 className="text-sm font-bold">Select Recipients</h3>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All', icon: Users },
              { value: 'authors', label: 'Authors', icon: Users },
              { value: 'reviewers', label: 'Reviewers', icon: UserCheck },
            ].map(g => (
              <button key={g.value} onClick={() => { setGroup(g.value as typeof group); setSelected([]); }}
                className={cn('flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all duration-150',
                  group === g.value ? 'gradient-primary text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}>{g.label}</button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{selected.length}/{recipients.length} selected</span>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-primary hover:underline font-medium">All</button>
              <button onClick={deselectAll} className="text-xs text-muted-foreground hover:underline">None</button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {recipients.map(r => {
              const isChecked = selected.includes(r.email);
              return (
                <label key={r.email} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-150',
                  isChecked ? 'bg-primary/8 border border-primary/20' : 'hover:bg-secondary/60'
                )}>
                  <Checkbox checked={isChecked} onCheckedChange={() => toggleRecipient(r.email)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{r.email}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Email Preview</DialogTitle>
          </DialogHeader>
          {previewRecipients.length > 0 && (
            <div className="flex-1 overflow-y-auto space-y-4 mt-2">
              <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-4 py-3">
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => setPreviewIndex(i => Math.max(0, i - 1))} disabled={previewIndex === 0}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">{previewIndex + 1} of {previewRecipients.length}</p>
                  <p className="text-[10px] text-muted-foreground">Recipients</p>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => setPreviewIndex(i => Math.min(previewRecipients.length - 1, i + 1))} disabled={previewIndex === previewRecipients.length - 1}>
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              {(() => {
                const recipient = previewRecipients[previewIndex];
                if (!recipient) return null;
                const resolvedBody = resolveBody(body, recipient.name, recipient.submissions);
                const tableContent = includeTable && recipient.submissions.length > 0
                  ? '\n\n--- Submission Summary ---\n' + buildSubmissionTable(recipient.submissions)
                  : '';
                return (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/40 px-5 py-4 space-y-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {recipient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{recipient.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{recipient.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-2 text-xs"><span className="text-muted-foreground font-medium shrink-0">Subject:</span><span className="font-semibold text-foreground">{subject}</span></div>
                        <div className="flex gap-2 text-xs"><span className="text-muted-foreground font-medium shrink-0">To:</span><span className="text-foreground">{recipient.email}</span></div>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <p className="text-sm whitespace-pre-wrap text-foreground leading-relaxed">{resolvedBody}{tableContent}</p>
                    </div>
                    {includeTable && recipient.submissions.length > 0 && (
                      <div className="px-5 pb-5">
                        <table className="w-full text-xs border-collapse border border-border rounded-lg overflow-hidden">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-3 py-2 text-left border border-border">S.No</th>
                              <th className="px-3 py-2 text-left border border-border">Title</th>
                              <th className="px-3 py-2 text-left border border-border">Final Category</th>
                              <th className="px-3 py-2 text-left border border-border">Final Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipient.submissions.map((s, i) => (
                              <tr key={s.id}>
                                <td className="px-3 py-1.5 border border-border">{i + 1}</td>
                                <td className="px-3 py-1.5 border border-border">{s.title}</td>
                                <td className="px-3 py-1.5 border border-border">{s.category}</td>
                                <td className="px-3 py-1.5 border border-border capitalize">{s.status.replace(/_/g, ' ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="bg-secondary/30 rounded-xl p-4">
                <p className="text-xs font-bold text-foreground mb-2">All Recipients ({previewRecipients.length})</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                  {previewRecipients.map((r, i) => (
                    <button key={r.email} onClick={() => setPreviewIndex(i)} className={cn(
                      'text-left px-3 py-2 rounded-lg text-xs transition-all duration-150',
                      i === previewIndex ? 'bg-primary/10 border border-primary/30 text-primary font-semibold' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                    )}>
                      <p className="truncate font-medium">{r.name}</p>
                      <p className="truncate text-[10px] opacity-70">{r.email}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full gradient-primary text-white border-0 hover:opacity-90" onClick={() => { setPreview(false); handleSend(); }}>
                <Send className="h-4 w-4 mr-2" /> Send to {previewRecipients.length} Recipient(s)
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
