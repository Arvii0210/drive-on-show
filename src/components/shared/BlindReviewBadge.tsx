import { ShieldCheck } from 'lucide-react';

export function BlindReviewBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full px-3 py-1.5">
      <ShieldCheck className="h-4 w-4" />
      <span className="text-xs font-semibold">Blind Review Mode — Author identity hidden</span>
    </div>
  );
}
