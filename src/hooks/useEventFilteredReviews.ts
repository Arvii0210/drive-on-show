import { useMemo } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventSelection } from '@/contexts/EventSelectionContext';
import { useEventStore } from '@/store/eventStore';
import type { Review } from '@/data/mockData';

/**
 * Custom hook that returns reviews filtered by the currently selected event
 * Used by admin pages to ensure review data is scoped to the selected conference/event
 */
export function useEventFilteredReviews(): Review[] {
  const { reviews } = useReviewStore();
  const { submissions } = useSubmissionStore();
  const { selectedEventId } = useEventSelection();
  const { events } = useEventStore();

  return useMemo(() => {
    if (!selectedEventId) return [];

    // Find the selected event to get its conference name
    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return [];

    // 1. Get IDs of submissions in this conference
    const conferenceSubmissionIds = new Set(
      submissions
        .filter(s => s.conference === selectedEvent.conference)
        .map(s => s.id)
    );

    // 2. Filter reviews that belong to those submissions
    return reviews.filter(r => conferenceSubmissionIds.has(r.submissionId));
  }, [reviews, submissions, selectedEventId, events]);
}
