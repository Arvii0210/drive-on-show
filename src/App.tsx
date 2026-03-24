import React, { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EventSelectionProvider } from "@/contexts/EventSelectionContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { initDemoAccounts } from "@/utils/demoAccounts";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AuthorRegisterPage from "@/pages/auth/AuthorRegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Author pages
import AuthorDashboard from "@/pages/author/AuthorDashboard";
import AuthorProfile from "@/pages/author/AuthorProfile";
import SubmitAbstract from "@/pages/author/SubmitAbstract";
import MySubmissions from "@/pages/author/MySubmissions";

// Reviewer pages
import ReviewerDashboard from "@/pages/reviewer/ReviewerDashboard";
import ReviewerProfile from "@/pages/reviewer/ReviewerProfile";
import AssignedAbstracts from "@/pages/reviewer/AssignedAbstracts";
import CompletedReviews from "@/pages/reviewer/CompletedReviews";
import ReviewAbstract from "@/pages/reviewer/ReviewAbstract";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProfile from "@/pages/admin/AdminProfile";
import SubmissionsManagement from "@/pages/admin/SubmissionsManagement";
import ReviewerManagement from "@/pages/admin/ReviewerManagement";
import AssignReviewers from "@/pages/admin/AssignReviewers";
import ResultManagement from "@/pages/admin/ResultManagement";
import NotificationCenter from "@/pages/admin/NotificationCenter";
import EventsPage from "@/pages/admin/EventsPage";
import UsersPage from "@/pages/admin/UsersPage";
import SettingsPage from "@/pages/admin/SettingsPage";


// Shared pages
import NotificationsPage from "@/pages/shared/NotificationsPage";
import ProfilePage from "@/pages/shared/ProfilePage";
import NotFound from "@/pages/NotFound";

import type { UserRole } from "@/data/mockData";

const queryClient = new QueryClient();

function RoleRedirect() {
  const { role } = useAuth();
  const routes: Record<UserRole, string> = { admin: '/admin', author: '/author', reviewer: '/reviewer' };
  return <Navigate to={routes[role]} replace />;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <RoleRedirect />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      <Route path="/register/:eventSlug" element={<AuthorRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin routes */}
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRole="admin"><AppLayout><AdminProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute allowedRole="admin"><AppLayout><EventsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/submissions" element={<ProtectedRoute allowedRole="admin"><AppLayout><SubmissionsManagement /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/reviewers" element={<ProtectedRoute allowedRole="admin"><AppLayout><ReviewerManagement /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/assignments" element={<ProtectedRoute allowedRole="admin"><AppLayout><AssignReviewers /></AppLayout></ProtectedRoute>} />
      {/* Reviews route removed - merged into Reviewers */}
      <Route path="/admin/results" element={<ProtectedRoute allowedRole="admin"><AppLayout><ResultManagement /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRole="admin"><AppLayout><NotificationCenter /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AppLayout><UsersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      

      {/* Author routes */}
      <Route path="/author" element={<ProtectedRoute allowedRole="author"><AppLayout><AuthorDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/author/profile" element={<ProtectedRoute allowedRole="author"><AppLayout><AuthorProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/author/submit" element={<ProtectedRoute allowedRole="author"><AppLayout><SubmitAbstract /></AppLayout></ProtectedRoute>} />
      <Route path="/author/submissions" element={<ProtectedRoute allowedRole="author"><AppLayout><MySubmissions /></AppLayout></ProtectedRoute>} />

      {/* Reviewer routes */}
      <Route path="/reviewer" element={<ProtectedRoute allowedRole="reviewer"><AppLayout><ReviewerDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/reviewer/profile" element={<ProtectedRoute allowedRole="reviewer"><AppLayout><ReviewerProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/reviewer/assigned" element={<ProtectedRoute allowedRole="reviewer"><AppLayout><AssignedAbstracts /></AppLayout></ProtectedRoute>} />
      <Route path="/reviewer/completed" element={<ProtectedRoute allowedRole="reviewer"><AppLayout><CompletedReviews /></AppLayout></ProtectedRoute>} />
      <Route path="/reviewer/review/:id" element={<ProtectedRoute allowedRole="reviewer"><AppLayout><ReviewAbstract /></AppLayout></ProtectedRoute>} />

      {/* Shared routes */}
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  useEffect(() => {
    initDemoAccounts();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <EventSelectionProvider>
            <TooltipProvider>
              <Sonner position="top-right" richColors />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </EventSelectionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
