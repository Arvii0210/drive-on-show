import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface EventSelectionContextType {
  selectedEventId: string | null;
  setSelectedEventId: (id: string) => void;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  clearSelection: () => void;
}

const EventSelectionContext = createContext<EventSelectionContextType | null>(null);

const STORAGE_KEY = 'admin_selected_event';

export function EventSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedEventId, setSelectedEventIdState] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });
  const [showDialog, setShowDialog] = useState(false);

  const setSelectedEventId = (id: string) => {
    setSelectedEventIdState(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
  };

  const clearSelection = () => {
    setSelectedEventIdState(null);
    setShowDialog(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  return (
    <EventSelectionContext.Provider value={{ selectedEventId, setSelectedEventId, showDialog, setShowDialog, clearSelection }}>
      {children}
    </EventSelectionContext.Provider>
  );
}

export function useEventSelection() {
  const ctx = useContext(EventSelectionContext);
  if (!ctx) throw new Error('useEventSelection must be used inside EventSelectionProvider');
  return ctx;
}
