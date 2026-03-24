import { useState } from 'react';
import { Calendar, Plus, Mail, MapPin, Clock, Users, CheckCircle2, ChevronLeft, ChevronRight, Copy, Link2, Edit, Eye, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/shared/RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useEventStore, type Event } from '@/store/eventStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function EventsPage() {
  const { events, addEvent, updateEvent } = useEventStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);

  // Step 1
  const [conference, setConference] = useState('');
  const [submissionStartDate, setSubmissionStartDate] = useState<Date>();
  const [submissionEndDate, setSubmissionEndDate] = useState<Date>();
  const [eventDate, setEventDate] = useState<Date>();
  const [location, setLocation] = useState('');
  const [maxSubmissionsPerAuthor, setMaxSubmissionsPerAuthor] = useState('5');

  // Step 2
  const [authorGuidelines, setAuthorGuidelines] = useState('');
  const [reviewerGuidelines, setReviewerGuidelines] = useState('');

  const slug = slugify(conference || 'conference');
  const registrationLink = `/register/${slug}`;

  const resetForm = () => {
    setStep(1);
    setEditingEvent(null);
    setConference(''); setSubmissionStartDate(undefined); setSubmissionEndDate(undefined);
    setEventDate(undefined); setLocation(''); setAuthorGuidelines(''); setReviewerGuidelines('');
    setMaxSubmissionsPerAuthor('5');
  };

  const openEdit = (ev: Event) => {
    setEditingEvent(ev);
    setConference(ev.conference);
    setSubmissionStartDate(ev.submissionStartDate ? new Date(ev.submissionStartDate) : undefined);
    setSubmissionEndDate(new Date(ev.submissionDeadline));
    setEventDate(ev.eventDate ? new Date(ev.eventDate) : new Date(ev.startDate));
    setLocation(ev.location || '');
    setMaxSubmissionsPerAuthor(String(ev.maxSubmissionsPerAuthor || 5));
    setAuthorGuidelines(ev.authorGuidelines || '');
    setReviewerGuidelines(ev.reviewerGuidelines || '');
    setStep(1);
    setOpen(true);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!conference || !submissionStartDate || !submissionEndDate || !eventDate) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleCreate = () => {
    const eventData = {
      name: conference,
      conference,
      slug,
      startDate: format(eventDate!, 'yyyy-MM-dd'),
      submissionStartDate: format(submissionStartDate!, 'yyyy-MM-dd'),
      submissionDeadline: format(submissionEndDate!, 'yyyy-MM-dd'),
      reviewDeadline: format(eventDate!, 'yyyy-MM-dd'),
      eventDate: format(eventDate!, 'yyyy-MM-dd'),
      location,
      categories: [],
      authorGuidelines,
      reviewerGuidelines,
      status: 'upcoming' as const,
      maxSubmissionsPerAuthor: parseInt(maxSubmissionsPerAuthor) || 5,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, { ...eventData, slug: slugify(conference) });
      toast.success('Conference updated successfully!');
    } else {
      addEvent({ ...eventData, id: `EVT-${Date.now()}`, submissions: 0 });
      toast.success('Conference created successfully!');
    }
    setOpen(false);
    resetForm();
  };

  const copyEventLink = (evSlug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/register/${evSlug}`);
    toast.success('Registration link copied!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${registrationLink}`);
    toast.success('Registration link copied!');
  };

  const handleSendEmail = (eventName: string) => {
    toast.success(`Email notifications sent for "${eventName}"`);
  };

  const stepLabels = ['Basic Information', 'Guidelines', 'Registration Link'];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Conferences"
        subtitle="Manage conferences and deadlines"
        icon={Calendar}
        actions={
          <Button onClick={() => { resetForm(); setOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Create Conference
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {events.map(ev => (
          <div key={ev.id} className="bg-card rounded-xl border border-border shadow-card hover-lift overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <StatusBadge status={ev.status} />
              </div>
              <button onClick={() => setViewEvent(ev)} className="text-left group">
                <h3 className="font-bold text-sm text-foreground leading-snug mt-1 group-hover:text-primary transition-colors">{ev.name}</h3>
              </button>
              <p className="text-xs text-primary font-semibold mt-0.5">{ev.conference}</p>
              <div className="space-y-2 mt-4">
                {ev.location && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /><span>{ev.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Conference Date: <span className="text-foreground font-medium">{ev.eventDate || ev.startDate}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Submission Deadline: <span className="text-foreground font-medium">{ev.submissionDeadline}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Review Deadline: <span className="text-foreground font-medium">{ev.reviewDeadline}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span><span className="text-foreground font-bold">{ev.submissions}</span> submissions</span>
                </div>
                {ev.slug && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    <span className="text-primary font-medium truncate flex-1">{window.location.origin}/register/{ev.slug}</span>
                    <button onClick={() => copyEventLink(ev.slug)} className="text-primary hover:text-primary/80 shrink-0">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-t border-border divide-x divide-border">
              <button onClick={() => openEdit(ev)} className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setViewEvent(ev)} className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                <Eye className="h-3.5 w-3.5" /> View
              </button>
              <button onClick={() => handleSendEmail(ev.name)} className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                <Mail className="h-3.5 w-3.5" /> Email
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Conference Dialog */}
      <Dialog open={!!viewEvent} onOpenChange={() => setViewEvent(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewEvent?.name}</DialogTitle></DialogHeader>
          {viewEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={viewEvent.status} />
                <span className="text-xs text-muted-foreground font-mono">{viewEvent.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Conference</span><p className="font-semibold text-foreground">{viewEvent.conference}</p></div>
                {viewEvent.location && <div><span className="text-muted-foreground text-xs">Location</span><p className="font-semibold text-foreground">{viewEvent.location}</p></div>}
                <div><span className="text-muted-foreground text-xs">Conference Date</span><p className="font-semibold text-foreground">{viewEvent.eventDate || viewEvent.startDate}</p></div>
                <div><span className="text-muted-foreground text-xs">Submission Deadline</span><p className="font-semibold text-foreground">{viewEvent.submissionDeadline}</p></div>
                <div><span className="text-muted-foreground text-xs">Review Deadline</span><p className="font-semibold text-foreground">{viewEvent.reviewDeadline}</p></div>
                <div><span className="text-muted-foreground text-xs">Submissions</span><p className="font-semibold text-foreground">{viewEvent.submissions}</p></div>
                <div><span className="text-muted-foreground text-xs">Max Submissions Per Author</span><p className="font-semibold text-foreground">{viewEvent.maxSubmissionsPerAuthor || 5}</p></div>
              </div>
              {viewEvent.authorGuidelines && (
                <div><span className="text-muted-foreground text-xs">Author Guidelines</span><p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{viewEvent.authorGuidelines}</p></div>
              )}
              {viewEvent.reviewerGuidelines && (
                <div><span className="text-muted-foreground text-xs">Reviewer Guidelines</span><p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{viewEvent.reviewerGuidelines}</p></div>
              )}
              <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                <span className="text-muted-foreground text-xs">Registration Link</span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-xs text-primary font-mono truncate">{window.location.origin}/register/{viewEvent.slug}</code>
                  <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={() => copyEventLink(viewEvent.slug)}>
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { setViewEvent(null); openEdit(viewEvent); }}>
                  <Edit className="h-4 w-4 mr-1" /> Edit Conference
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Conference Creation/Edit Wizard */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Conference' : 'Create New Conference'}</DialogTitle>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center gap-2 my-4">
            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all',
                    isDone ? 'bg-primary text-primary-foreground' :
                    isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    'bg-secondary text-muted-foreground'
                  )}>{isDone ? '✓' : stepNum}</div>
                  <span className={cn('text-xs font-medium hidden sm:block', isActive ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
                  {i < stepLabels.length - 1 && <div className={cn('flex-1 h-0.5 rounded-full', isDone ? 'bg-primary' : 'bg-border')} />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Conference Name *</Label>
                <Input placeholder="KERACON 2026" value={conference} onChange={e => setConference(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Submission Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !submissionStartDate && 'text-muted-foreground')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {submissionStartDate ? format(submissionStartDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={submissionStartDate} onSelect={setSubmissionStartDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Submission End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !submissionEndDate && 'text-muted-foreground')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {submissionEndDate ? format(submissionEndDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={submissionEndDate} onSelect={setSubmissionEndDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Review Deadline Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !eventDate && 'text-muted-foreground')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={eventDate} onSelect={setEventDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Location</Label>
                  <Input placeholder="Kochi, Kerala" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Max Submissions Per Author *</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="50" 
                    placeholder="5" 
                    value={maxSubmissionsPerAuthor} 
                    onChange={e => setMaxSubmissionsPerAuthor(e.target.value)} 
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of submissions allowed per author for this conference</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guidelines */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Author Guidelines</Label>
                <RichTextEditor
                  content={authorGuidelines}
                  onChange={setAuthorGuidelines}
                  placeholder="Write author submission guidelines... Use formatting, images, and lists."
                  minHeight="160px"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Reviewer Guidelines</Label>
                <RichTextEditor
                  content={reviewerGuidelines}
                  onChange={setReviewerGuidelines}
                  placeholder="Write reviewer evaluation guidelines..."
                  minHeight="160px"
                />
              </div>
            </div>
          )}

          {/* Step 3: Registration Link */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-secondary/50 rounded-xl p-6 border border-border text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                  <Link2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Author Abstract Submission Link</h3>
                  <p className="text-xs text-muted-foreground mt-1">Share this link with authors to submit abstract for the conference</p>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg border border-border p-3">
                  <code className="flex-1 text-sm text-primary font-mono truncate">
                    {window.location.origin}{registrationLink}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNext} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={handleCreate} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {editingEvent ? 'Save Changes' : 'Create Conference'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
