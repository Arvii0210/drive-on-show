
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BookOpen,
  Users,
  LayoutDashboard,
  FileText,
  Calculator,
  RotateCcw,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
      active
        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-primary'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-soft'
    }`;

  return (
    <Sidebar className="w-full sm:w-72 min-w-[60px] border-r-0" collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground min-h-screen">
        {/* Header with Gradient */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="gradient-primary rounded-xl p-4 text-center">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
              <img
                src="Assets/kalachuvadu-logo.jpg"
                alt="Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            {!collapsed && (
              <div className="text-white font-bold text-base animate-fade-in">
                Kalachuvadu Publication
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2">
          {/* Dashboard */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/" end className={getNavClass(isActive('/'))}>
                      <LayoutDashboard className="h-5 w-5" />
                      {!collapsed && <span>Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* People */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/people" className={getNavClass(isActive('/people'))}>
                      <Users className="h-5 w-5" />
                      {!collapsed && <span>People</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Books */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/books" className={getNavClass(isActive('/books'))}>
                      <BookOpen className="h-5 w-5" />
                      {!collapsed && <span>Books</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Agreements */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/agreements" className={getNavClass(isActive('/agreements'))}>
                      <FileText className="h-5 w-5" />
                      {!collapsed && <span>Rights</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Royalty Calculations */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/royalty-calculations" className={getNavClass(isActive('/royalty-calculations'))}>
                      <Calculator className="h-5 w-5" />
                      {!collapsed && <span>Own Publishing</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Agreement Renewals */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/renewals" className={getNavClass(isActive('/renewals'))}>
                      <RotateCcw className="h-5 w-5" />
                      {!collapsed && <span>Agreement Renewals</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Master Settings */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/settings" className={getNavClass(isActive('/settings'))}>
                      <Settings className="h-5 w-5" />
                      {!collapsed && <span>Master Settings</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
