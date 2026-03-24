import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEventStore } from '@/store/eventStore';
import { useEventSelection } from '@/contexts/EventSelectionContext';
import { useState } from 'react';
import { CheckCircle2, Calendar, FileText } from 'lucide-react';

interface EventSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

export function EventSelectionModal({ open, onClose }: EventSelectionModalProps) {
  const { events } = useEventStore();
  const { selectedEventId, setSelectedEventId } = useEventSelection();
  const [selected, setSelected] = useState<string | null>(selectedEventId);

  const handleSelect = (eventId: string) => {
    setSelected(eventId);
  };

  const handleConfirm = () => {
    if (selected) {
      setSelectedEventId(selected);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'upcoming':
        return 'bg-blue/10 text-blue-600';
      case 'completed':
        return 'bg-gray/10 text-gray-600';
      default:
        return 'bg-gray/10 text-gray-600';
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing if an event is already selected
        if (!isOpen && !selectedEventId) return;
        onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Conference/Event</DialogTitle>
          <DialogDescription>
            Choose which conference or event you'd like to manage today
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events available
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleSelect(event.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selected === event.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{event.name}</h3>
                      <Badge className={`text-xs font-semibold capitalize ${getStatusColor(event.status)}`}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{event.conference}</p>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="font-medium text-foreground">
                            {new Date(event.submissionDeadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                          <p className="font-medium text-foreground">{event.submissions}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Categories</p>
                        <p className="font-medium text-foreground text-sm">{event.categories.length}</p>
                      </div>
                    </div>
                  </div>

                  {selected === event.id && (
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          {selectedEventId && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleConfirm} disabled={!selected}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
