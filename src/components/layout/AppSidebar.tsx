import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Send, ClipboardList, Users, UserCheck,
  Bell, Settings, Calendar, Award, FileCheck,
  LogOut, Shield, GraduationCap, BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/data/mockData';
import hallmarkLogo from '@/assets/hallmark-logo.png';

const adminNav = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Conferences', url: '/admin/events', icon: Calendar },
  { title: 'Submissions', url: '/admin/submissions', icon: FileText },
  { title: 'Reviewers & Reviews', url: '/admin/reviewers', icon: UserCheck },
  // { title: 'Assignments', url: '/admin/assignments', icon: ClipboardList },
  { title: 'Results', url: '/admin/results', icon: Award },
  { title: 'Communication', url: '/admin/notifications', icon: Bell },
  { title: 'Reviewers', url: '/admin/users', icon: Users },
  
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const authorNav = [
  { title: 'Dashboard', url: '/author', icon: LayoutDashboard },
  { title: 'Submit Abstract', url: '/author/submit', icon: Send },
  { title: 'My Submissions', url: '/author/submissions', icon: FileText },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const reviewerNav = [
  { title: 'Dashboard', url: '/reviewer', icon: LayoutDashboard },
  { title: 'Assigned Abstracts', url: '/reviewer/assigned', icon: ClipboardList },
  { title: 'Completed Reviews', url: '/reviewer/completed', icon: FileCheck },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const navMap: Record<UserRole, typeof adminNav> = { admin: adminNav, author: authorNav, reviewer: reviewerNav };

interface AppSidebarProps {
  collapsed: boolean;
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const { role, setRole, logout } = useAuth();
  const { notifications } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();
  const items = navMap[role];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar transition-all duration-300 ease-in-out shrink-0 relative z-10',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-3 py-4 border-b border-sidebar-border min-h-[64px]">
        {collapsed ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <span className="text-white font-bold text-sm">H</span>
          </div>
        ) : (
          <div className="animate-slide-in">
            <img src={hallmarkLogo} alt="Hallmark Events" className="h-10 w-auto brightness-0 invert" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-3 pb-2">Menu</p>
        )}
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          const isNotif = item.url === '/notifications' || item.url === '/admin/notifications';

          const linkContent = (
            <NavLink
              to={item.url}
              className={cn(
                'sidebar-item group text-sidebar-foreground',
                isActive ? 'sidebar-active' : 'hover:bg-white/10',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon className={cn(
                'h-[18px] w-[18px] shrink-0 transition-colors text-white/80',
                isActive && 'text-white',
                collapsed && 'h-5 w-5'
              )} />
              {!collapsed && (
                <span className="flex-1 truncate text-[13px]">{item.title}</span>
              )}
              {!collapsed && isNotif && unreadCount > 0 && (
                <Badge className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] bg-white/20 text-white border-0">
                  {unreadCount}
                </Badge>
              )}
              {collapsed && isNotif && unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-white" />
              )}
            </NavLink>
          );

          return (
            <div key={item.title} className="relative">
              {collapsed ? (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{item.title}</TooltipContent>
                </Tooltip>
              ) : linkContent}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <div className="space-y-1 animate-fade-in">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-1">Switch Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className="h-8 text-xs bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="h-3 w-3" /> Admin</div></SelectItem>
                <SelectItem value="author"><div className="flex items-center gap-2"><GraduationCap className="h-3 w-3" /> Author</div></SelectItem>
                <SelectItem value="reviewer"><div className="flex items-center gap-2"><UserCheck className="h-3 w-3" /> Reviewer</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button onClick={handleLogout} className="sidebar-item w-full justify-center text-white/60 hover:bg-white/10 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button onClick={handleLogout} className="sidebar-item w-full text-white/60 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
