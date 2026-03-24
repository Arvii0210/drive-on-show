import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/lib/utils';

const typeConfig = {
  info: { icon: Info, color: 'text-info bg-info/10', border: 'border-info/20' },
  success: { icon: CheckCircle, color: 'text-success bg-success/10', border: 'border-success/20' },
  warning: { icon: AlertTriangle, color: 'text-warning bg-warning/10', border: 'border-warning/20' },
  error: { icon: XCircle, color: 'text-destructive bg-destructive/10', border: 'border-destructive/20' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNotificationStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        icon={Bell}
        actions={
          unread > 0 ? (
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={markAllNotificationsRead}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-2.5">
        {notifications.map(n => {
          const cfg = typeConfig[n.type] ?? typeConfig.info;
          const Ico = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-card',
                !n.read ? 'bg-card border-border' : 'bg-secondary/30 border-transparent opacity-70'
              )}
            >
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', cfg.color)}>
                <Ico className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm font-semibold', !n.read ? 'text-foreground' : 'text-muted-foreground')}>{n.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    <p className="text-[11px] text-muted-foreground whitespace-nowrap">{n.date}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </div>
  );
}
