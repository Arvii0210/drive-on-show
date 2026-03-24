import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useReviewStore } from '@/store/reviewStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { toast } from 'sonner';
import type { Submission } from '@/data/mockData';

interface AssignReviewerModalProps {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
}

export function AssignReviewerModal({ submission, open, onClose }: AssignReviewerModalProps) {
  const { reviewers } = useReviewStore();
  const { assignReviewer } = useSubmissionStore();
  const [selected, setSelected] = useState<string[]>([]);

  if (!submission) return null;

  const available = reviewers.filter(r => r.status === 'active');

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleAssign = () => {
    if (selected.length === 0) { toast.error('Select at least one reviewer'); return; }
    selected.forEach(name => assignReviewer(submission.id, name));
    toast.success(`${selected.length} reviewer(s) assigned to ${submission.id}`);
    setSelected([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Reviewers</DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{submission.title}</p>
        </DialogHeader>

        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {available.map(r => {
            const alreadyAssigned = submission.assignedReviewers.includes(r.name);
            const isSelected = selected.includes(r.name);
            return (
              <label
                key={r.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                  alreadyAssigned ? 'opacity-50 cursor-not-allowed' :
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/60'
                }`}
              >
                <Checkbox
                  checked={isSelected || alreadyAssigned}
                  disabled={alreadyAssigned}
                  onCheckedChange={() => !alreadyAssigned && toggle(r.name)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.institution} · {r.department}</p>
                </div>
                <div className="text-right shrink-0">
                  {alreadyAssigned ? (
                    <Badge variant="secondary" className="text-[10px]">Assigned</Badge>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{r.completedReviews}/{r.assignedReviews} done</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleAssign} className="flex-1 gradient-primary text-white border-0">
            Assign {selected.length > 0 ? `(${selected.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
