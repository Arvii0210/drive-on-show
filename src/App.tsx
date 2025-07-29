// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/components/ui/PrivateRoute";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Pages
import Index from "@/pages/Index";
import AssetList from "@/pages/Assest-list";
import Category from "@/pages/Category";
import Login from "./pages/login";
import Register from "@/pages/Register"; 
import NotFound from "@/pages/NotFound";
import AccountPage from "@/pages/AccountPage";
import DownloadsPage from "@/pages/DownloadsPage";
import PlanPage from "@/pages/PlanPage";
import ImageViewPage from "@/pages/ImageViewPage";
import VerifyOtp from "./pages/Verifyotp";
import SubscriptionPlansPage from "./pages/subscription/SubscriptionPlansPage";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/category" element={<Category />} />
              <Route path="/photos" element={<AssetList />} />
              <Route path="/plans" element={<SubscriptionPlansPage />} />
              <Route path="/image/:id" element={<ImageViewPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              {/* Protected Profile Pages */}
              <Route
                path="/profile/account"
                element={
                  <PrivateRoute>
                    <AccountPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/downloads"
                element={
                  <PrivateRoute>
                    <DownloadsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/plan"
                element={
                  <PrivateRoute>
                    <PlanPage />
                  </PrivateRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
