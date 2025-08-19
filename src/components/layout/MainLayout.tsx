import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbaradmin';

const SIDEBAR_WIDTH = 256; // 64 * 4 (w-64 in Tailwind = 16rem = 256px)

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();

  // Dynamic page title
  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/projects')) return 'Latest Projects';
    if (location.pathname.startsWith('/admin/gallery')) return 'Gallery';
    return 'Dashboard';
  };

  // Sidebar toggle
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Sidebar
        isSidebarOpen={sidebarOpen || !isMobile}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`
          flex flex-col min-w-0 transition-all duration-300
          ${!isMobile ? 'lg:ml-64' : ''}
        `}
      >
        <Navbar toggleSidebar={toggleSidebar} title={getPageTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;