import { useMemo } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { useEventSelection } from '@/contexts/EventSelectionContext';
import { useEventStore } from '@/store/eventStore';
import type { Reviewer, Submission } from '@/data/mockData';

/**
 * Custom hook that returns reviewers filtered by the currently selected event
 * Used by admin pages to ensure reviewer lists are scoped to the selected conference/event
 */
export function useEventFilteredReviewers(): Reviewer[] {
  const { reviewers } = useReviewStore();
  const { submissions } = useSubmissionStore();
  const { selectedEventId } = useEventSelection();
  const { events } = useEventStore();

  return useMemo(() => {
    if (!selectedEventId) return [];

    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return [];

    // Strategy: Filter reviewers who are either:
    // 1. Assigned to at least one submission in this conference
    // 2. (Mock only) Included if their institution or department matches a simple pattern,
    //    but for this implementation, we'll check their presence in conference submissions.
    
    const conferenceSubmissions = submissions.filter(s => s.conference === selectedEvent.conference);
    const assignedReviewerNames = new Set(
      conferenceSubmissions.flatMap(s => s.assignedReviewers)
    );

    // For better mock UX, we'll return reviewers who have assignments in this conference 
    // OR we can just return all reviewers if they are "global" (but labeled as belonging to the conference).
    // The requirement says "load data ONLY for selected event". 
    // In a real system, reviewers are often registered PER conference.
    
    return reviewers.filter(r => assignedReviewerNames.has(r.name));
  }, [reviewers, submissions, selectedEventId, events]);
}

/**
 * Custom hook to get authors filtered by the currently selected event
 */
export function useEventFilteredAuthors() {
  const { submissions } = useSubmissionStore();
  const { selectedEventId } = useEventSelection();
  const { events } = useEventStore();

  return useMemo(() => {
    if (!selectedEventId) return [];

    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return [];

    // Get unique authors from submissions in this conference
    const conferenceSubmissions = submissions.filter(s => s.conference === selectedEvent.conference);
    
    // Map to author objects
    const authorsMap = new Map();
    conferenceSubmissions.forEach(s => {
      if (!authorsMap.has(s.authorEmail)) {
        authorsMap.set(s.authorEmail, {
          name: s.author,
          email: s.authorEmail,
          institution: s.institution,
          department: s.department,
          submissions: 0
        });
      }
      authorsMap.get(s.authorEmail).submissions += 1;
    });

    return Array.from(authorsMap.values());
  }, [submissions, selectedEventId, events]);
}
