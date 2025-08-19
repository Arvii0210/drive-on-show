import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon, BriefcaseIcon, PhotoIcon, ArrowLeftOnRectangleIcon, ChevronDoubleLeftIcon
} from '@heroicons/react/24/outline';
import { authService } from '../../services/authService';
import Swal from 'sweetalert2';

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />,
    bg: "bg-blue-100"
  },
  {
    to: "/admin/projects",
    label: "Latest Projects",
    icon: <BriefcaseIcon className="w-6 h-6 text-pink-600" />,
    bg: "bg-pink-100"
  },
  {
    to: "/admin/gallery",
    label: "Gallery",
    icon: <PhotoIcon className="w-6 h-6 text-emerald-600" />,
    bg: "bg-emerald-100"
  },
];

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    const confirmed = await authService.confirmLogout();
    if (confirmed) {
      authService.logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out!',
        showConfirmButton: false,
        timer: 1200
      }).then(() => {
        navigate('/login');
      });
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-all"
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full flex flex-col
          bg-white/80 backdrop-blur-xl shadow-2xl border-r border-blue-100
          transition-all duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          lg:translate-x-0
          ${isMobile ? 'max-w-[80vw]' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg,rgba(255,255,255,0.95) 70%,#e0f2fe 100%)',
        }}
      >
        {/* Logo/Header */}
        <div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'justify-start'} border-b border-blue-100`}>
          <img className="h-10 w-10 rounded-lg shadow-md bg-white" src="/photos/keerthi-logo.png" alt="Logo" />
          {!isCollapsed && (
            <span className="ml-3 text-xl font-extrabold bg-gradient-to-r from-blue-700 via-pink-600 to-emerald-600 bg-clip-text text-transparent drop-shadow">
              Keerthi Admin
            </span>
          )}
        </div>
        {/* Nav */}
        <nav className="flex-1 pt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              onClick={() => isMobile && toggleSidebar()}
              className={({ isActive }) => `
                group flex items-center gap-4 font-medium px-6 py-3 rounded-xl mx-2 my-1
                transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-blue-100 to-white shadow text-blue-900 font-bold'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shadow-sm ${item.bg} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-base">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        {/* Collapse & Logout */}
        <div className="mt-auto space-y-2 border-t border-blue-100 p-4">
          {/* Collapse Button (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              hidden lg:flex w-full items-center gap-4 rounded-lg px-4 py-3 text-gray-500
              transition-colors duration-200
              hover:bg-blue-50 hover:text-blue-700
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              flex w-full items-center gap-4 rounded-lg px-4 py-3 text-red-500
              transition-colors duration-200
              hover:bg-red-100 hover:text-red-700
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
