import { Menu, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings, CheckCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useNotificationStore } from '@/store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEventSelection } from '@/contexts/EventSelectionContext';
import { useEventStore } from '@/store/eventStore';
import { Globe } from 'lucide-react';

const notifColors: Record<string, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
};

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const { selectedEventId, setShowDialog, clearSelection } = useEventSelection();
  const { events } = useEventStore();
  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 backdrop-blur-sm px-4 shadow-soft">
      {/* Hamburger menu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 mr-2">
        {selectedEvent && user?.role === 'admin' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDialog(true)}
            className="hidden md:flex items-center gap-2 h-9 px-3 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all text-xs font-semibold"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="max-w-[150px] truncate">{selectedEvent.conference}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        >
          {theme === 'light'
            ? <Moon className="h-4 w-4" />
            : <Sun className="h-4 w-4 text-warning" />
          }
        </Button>

        {/* Notifications bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/80">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-elevated">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.slice(0, 5).map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer',
                    !n.read && 'bg-primary/5'
                  )}
                >
                  <div className={cn('mt-0.5 h-2 w-2 rounded-full shrink-0', notifColors[n.type]?.split(' ')[0])} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-semibold', !n.read && 'text-foreground')}>{n.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{n.date}</p>
                  </div>
                  {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border">
              <button
                onClick={() => navigate('/notifications')}
                className="w-full text-center text-xs text-primary hover:bg-primary/5 rounded-md py-1.5 font-medium transition-colors"
              >
                View all notifications →
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 hover:bg-secondary/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-foreground leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-muted-foreground capitalize leading-tight">{user?.role || 'role'}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 shadow-elevated">
            <DropdownMenuLabel className="py-2">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                const profileRoutes: Record<string, string> = {
                  author: '/author/profile',
                  reviewer: '/reviewer/profile',
                  admin: '/admin/profile'
                };
                navigate(profileRoutes[user?.role || 'author'] || '/author/profile');
              }} 
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { clearSelection(); logout(); navigate('/login'); }}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
