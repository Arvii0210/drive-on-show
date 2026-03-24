import { useMemo } from 'react';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventSelection } from '@/contexts/EventSelectionContext';
import { useEventStore } from '@/store/eventStore';
import type { Submission } from '@/data/mockData';

/**
 * Custom hook that returns submissions filtered by the currently selected event
 * Used by admin pages to ensure data is scoped to the selected conference/event
 */
export function useEventFilteredSubmissions(): Submission[] {
  const { submissions } = useSubmissionStore();
  const { selectedEventId } = useEventSelection();
  const { events } = useEventStore();

  return useMemo(() => {
    if (!selectedEventId) return submissions;

    // Find the selected event to get its conference name
    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return submissions;

    // Filter submissions by conference name
    return submissions.filter(s => s.conference === selectedEvent.conference);
  }, [submissions, selectedEventId, events]);
}
