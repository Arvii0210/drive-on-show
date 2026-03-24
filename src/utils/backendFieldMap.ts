export const abstractFieldMap = {
  id: 'submission_id',
  title: 'abstract_title',
  category: 'category_name',
  author: 'author_name',
  authorEmail: 'author_email',
  institution: 'institution_name',
  department: 'department_name',
  keywords: 'keywords',
  submissionDate: 'submitted_at',
  status: 'status',
  averageScore: 'avg_score',
  assignedReviewers: 'assigned_reviewers',
  content: 'abstract_content',
  coAuthors: 'co_authors',
} as const;

export const reviewerFieldMap = {
  id: 'reviewer_id',
  name: 'reviewer_name',
  email: 'reviewer_email',
  institution: 'institution_name',
  department: 'department_name',
  assignedReviews: 'assigned_count',
  completedReviews: 'completed_count',
  status: 'status',
} as const;

export const reviewFieldMap = {
  id: 'review_id',
  submissionId: 'submission_id',
  reviewerId: 'reviewer_id',
  scores: 'scores',
  totalScore: 'total_score',
  recommendation: 'recommendation',
  comments: 'comments',
  status: 'review_status',
  assignedDate: 'assigned_at',
  completedDate: 'completed_at',
} as const;

export const eventFieldMap = {
  id: 'event_id',
  name: 'event_name',
  conference: 'conference_code',
  startDate: 'start_date',
  submissionDeadline: 'submission_deadline',
  reviewDeadline: 'review_deadline',
  status: 'event_status',
  submissions: 'submission_count',
} as const;

export function mapToBackend<T extends Record<string, string>>(
  data: Record<string, unknown>,
  fieldMap: T
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  for (const [frontendKey, backendKey] of Object.entries(fieldMap)) {
    if (frontendKey in data) {
      mapped[backendKey] = data[frontendKey];
    }
  }
  return mapped;
}

export function mapFromBackend<T extends Record<string, string>>(
  data: Record<string, unknown>,
  fieldMap: T
): Record<string, unknown> {
  const reverseMap = Object.fromEntries(
    Object.entries(fieldMap).map(([k, v]) => [v, k])
  );
  const mapped: Record<string, unknown> = {};
  for (const [backendKey, frontendKey] of Object.entries(reverseMap)) {
    if (backendKey in data) {
      mapped[frontendKey] = data[backendKey];
    }
  }
  return mapped;
}
