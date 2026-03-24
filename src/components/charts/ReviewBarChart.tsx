import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { useEventFilteredReviewers } from '@/hooks/useEventFilteredUsers';
import { useEventFilteredReviews } from '@/hooks/useEventFilteredReviews';

export function ReviewBarChart() {
  const reviewers = useEventFilteredReviewers();
  const reviews = useEventFilteredReviews();

  const data = reviewers.map(rev => {
    const revReviews = reviews.filter(r => r.reviewerId === rev.id);
    return {
      name: rev.name,
      completed: revReviews.filter(r => r.status === 'completed').length,
      pending: revReviews.filter(r => r.status === 'pending').length,
    };
  }).slice(0, 6);

  if (reviewers.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-muted-foreground text-xs italic">
        No reviewer data for this event
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 40 }} barSize={12} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false} tickLine={false}
          angle={-30} textAnchor="end" interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }}
        />
        <Bar dataKey="completed" name="Completed" fill="hsl(142,71%,42%)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill="hsl(38,95%,50%)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
