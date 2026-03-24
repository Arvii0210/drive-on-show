import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEventFilteredSubmissions } from '@/hooks/useEventFilteredSubmissions';

const COLORS = [
  'hsl(234,89%,57%)', 'hsl(268,72%,56%)', 'hsl(142,71%,42%)',
  'hsl(38,95%,50%)', 'hsl(199,89%,46%)', 'hsl(220,9%,50%)',
];

export function CategoryPieChart() {
  const submissions = useEventFilteredSubmissions();

  // Derive category distribution from submissions
  const categoryDistribution = Object.entries(
    submissions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ 
    name, 
    value: submissions.length > 0 ? Math.round((value / submissions.length) * 100) : 0 
  })).sort((a, b) => b.value - a.value).slice(0, 6);

  if (submissions.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-muted-foreground text-xs italic">
        No submission data for this event
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={categoryDistribution}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {categoryDistribution.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="hsl(var(--card))" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }}
          formatter={(value, name) => [`${value}%`, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
