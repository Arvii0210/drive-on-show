import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import type { Submission } from '@/data/mockData';

interface AbstractModalProps {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
  blindMode?: boolean;
}

export function AbstractModal({ submission, open, onClose, blindMode = false }: AbstractModalProps) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug pr-6">{submission.title}</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={submission.status} />
            <Badge variant="outline" className="text-xs">{submission.category}</Badge>
            <span className="text-xs text-muted-foreground">ID: {submission.id}</span>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* File Preview Section */}
          {submission.fileUrl && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uploaded File</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      window.open(submission.fileUrl, '_blank');
                      toast.success('Opening file in new tab');
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = submission.fileUrl!;
                      a.download = submission.fileName || `${submission.id}-submission.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      toast.success('File download started');
                    }}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg border border-border overflow-hidden">
                <iframe
                  src={submission.fileUrl}
                  className="w-full h-96"
                  title="PDF Preview"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                📄 {submission.fileName || 'submission.pdf'}
              </p>
            </div>
          )}

          {/* Keywords */}
          {submission.keywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {submission.keywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 bg-primary/8 text-primary text-xs rounded-full border border-primary/15">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Author info — hidden in blind mode */}
          {!blindMode && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/40 rounded-xl">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Author</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{submission.author}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Institution</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{submission.institution}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Department</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{submission.department}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Submitted</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{submission.submissionDate}</p>
              </div>
            </div>
          )}

          {/* Content sections */}
          {[
            { label: 'Introduction', content: submission.content.introduction },
            { label: 'Aim & Objectives', content: submission.content.aim },
            { label: 'Materials & Methods', content: submission.content.methods },
            { label: 'Results', content: submission.content.results },
            { label: 'Conclusion', content: submission.content.conclusion },
          ].map(({ label, content }) => (
            <div key={label}>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">{label}</p>
              <p className="text-sm text-foreground leading-relaxed">{content}</p>
            </div>
          ))}

          {/* Co-authors — hidden in blind mode */}
          {!blindMode && submission.coAuthors.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Co-Authors</p>
              <div className="space-y-1.5">
                {submission.coAuthors.map((ca, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{ca.name}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{ca.institution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!blindMode && submission.averageScore !== null && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/15">
              <span className="text-xs font-semibold text-muted-foreground">Average Score:</span>
              <span className="text-lg font-bold text-primary">{submission.averageScore}/10</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
