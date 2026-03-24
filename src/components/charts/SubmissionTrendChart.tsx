import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate daily mock data for each month
function generateMonthlyData(month: string) {
  const monthIndex = months.indexOf(month);
  const daysInMonth = new Date(2024, monthIndex + 1, 0).getDate();
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    data.push({
      day: `${month} ${d}`,
      submissions: Math.floor(Math.random() * 8) + 1,
    });
  }
  return data;
}

// Weekly aggregation
function aggregateWeekly(dailyData: { day: string; submissions: number }[]) {
  const weeks: { week: string; submissions: number }[] = [];
  for (let i = 0; i < dailyData.length; i += 7) {
    const slice = dailyData.slice(i, i + 7);
    const total = slice.reduce((s, d) => s + d.submissions, 0);
    weeks.push({ week: `Week ${weeks.length + 1}`, submissions: total });
  }
  return weeks;
}

// Overall trend data (all months summary)
const overallData = months.map(m => ({
  month: m,
  submissions: Math.floor(Math.random() * 60) + 10,
}));
// Override with original data for months with known data
overallData[0].submissions = 89; // Jan
overallData[1].submissions = 74; // Feb
overallData[8].submissions = 12; // Sep
overallData[9].submissions = 28; // Oct
overallData[10].submissions = 45; // Nov
overallData[11].submissions = 62; // Dec

export function SubmissionTrendChart() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const chartData = useMemo(() => {
    if (selectedMonth === 'all') return overallData;
    const daily = generateMonthlyData(selectedMonth);
    return aggregateWeekly(daily);
  }, [selectedMonth]);

  const dataKey = selectedMonth === 'all' ? 'month' : 'week';

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        {selectedMonth === 'all' ? (
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="submissionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(234,89%,57%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(234,89%,57%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={dataKey} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="submissions"
              stroke="hsl(234,89%,57%)"
              strokeWidth={2.5}
              fill="url(#submissionGrad)"
              dot={{ fill: 'hsl(234,89%,57%)', r: 4, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={dataKey} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            />
            <Bar dataKey="submissions" fill="hsl(234,89%,57%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
