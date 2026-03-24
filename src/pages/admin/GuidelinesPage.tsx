import { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { RichTextEditor } from '@/components/shared/RichTextEditor';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEventSelection } from '@/contexts/EventSelectionContext';
import { create } from 'zustand';

// Guidelines store
interface GuidelinesState {
  guidelines: Record<string, { author: string; reviewer: string }>;
  getGuidelines: (eventId: string, role: 'author' | 'reviewer') => string;
  setGuidelines: (eventId: string, role: 'author' | 'reviewer', content: string) => void;
}

const useGuidelinesStore = create<GuidelinesState>((set, get) => ({
  guidelines: {},
  getGuidelines: (eventId, role) => {
    return get().guidelines[eventId]?.[role] || '';
  },
  setGuidelines: (eventId, role, content) =>
    set(state => ({
      guidelines: {
        ...state.guidelines,
        [eventId]: {
          ...(state.guidelines[eventId] || { author: '', reviewer: '' }),
          [role]: content,
        },
      },
    })),
}));

type Tab = 'author' | 'reviewer';

export default function GuidelinesPage() {
  const { selectedEventId } = useEventSelection();
  const { getGuidelines, setGuidelines } = useGuidelinesStore();
  const [tab, setTab] = useState<Tab>('author');

  const eventId = selectedEventId || 'EVT-001';
  const content = getGuidelines(eventId, tab);

  const handleSave = () => {
    toast.success(`${tab === 'author' ? 'Author' : 'Reviewer'} guidelines saved!`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Guidelines"
        subtitle="Create and edit guidelines for authors and reviewers"
        icon={FileText}
        actions={
          <Button className="gradient-primary text-white border-0 hover:opacity-90" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save Guidelines
          </Button>
        }
      />

      {/* Tab switch */}
      <div className="flex gap-1 bg-secondary/60 p-1 rounded-xl w-fit">
        {(['author', 'reviewer'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 capitalize',
              tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t} Guidelines
          </button>
        ))}
      </div>

      <RichTextEditor
        content={content}
        onChange={(html) => setGuidelines(eventId, tab, html)}
        placeholder={`Write ${tab} guidelines here... Use the toolbar for formatting, images, and more.`}
      />
    </div>
  );
}
