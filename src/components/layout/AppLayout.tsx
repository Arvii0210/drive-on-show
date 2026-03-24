import { useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { EventSelectionModal } from '@/components/shared/EventSelectionModal';
import { useAuth } from '@/contexts/AuthContext';
import { useEventSelection } from '@/contexts/EventSelectionContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { role, isAuthenticated } = useAuth();
  const { selectedEventId, showDialog, setShowDialog } = useEventSelection();

  // Show event selection modal for admin users who haven't selected an event
  useEffect(() => {
    if (isAuthenticated && role === 'admin' && !selectedEventId) {
      setShowDialog(true);
    }
  }, [isAuthenticated, role, selectedEventId, setShowDialog]);

  const isBlockingSelection = isAuthenticated && role === 'admin' && !selectedEventId;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isBlockingSelection && <AppSidebar collapsed={collapsed} />}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {!isBlockingSelection && <TopNavbar onToggleSidebar={() => setCollapsed(c => !c)} />}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="animate-fade-in">
            {isBlockingSelection ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-muted-foreground font-medium">Loading conference management...</p>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
      <EventSelectionModal 
        open={(showDialog || isBlockingSelection) && role === 'admin'} 
        onClose={() => setShowDialog(false)} 
      />
    </div>
  );
}
