
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const DashboardLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col sm:ml-8 ">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shadow-soft">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="text-lg font-semibold text-foreground">
              Kalachuvadu Publication
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user?.username || 'User'}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="border-border hover:bg-muted"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gradient-subtle">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
