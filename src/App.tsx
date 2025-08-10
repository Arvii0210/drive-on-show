
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import People from "./pages/People";
import AddPerson from "./pages/AddPerson";

import Books from "./pages/Books";

import AddBook from "./pages/AddBook";

import OwnPublishing from "./pages/OwnPublishing";
import AddOwnPublishing from "./pages/AddOwnPublishing";
import { AuthProvider } from "./contexts/AuthContext";
import AddSellingRight from "./pages/AddSellingRight";
import Reports from "./pages/Reports";
import AddBuyingRights from "./pages/AddBuyingRights";
import Agreements from "./pages/Agreements";
import ScrollToTop from "./components/ui/ScrollToTop";

const queryClient = new QueryClient();




const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <SidebarProvider>
                <DashboardLayout />
              </SidebarProvider>
            }>
              <Route index element={<Dashboard />} />
              
              {/* People Management */}
              <Route path="people" element={<People />} />
              <Route path="people/add" element={<AddPerson />} />
              <Route path="people/edit/:id" element={<AddPerson />} />
              
              {/* Books */}
              <Route path="books" element={<Books />} />
              <Route path="books/add" element={<AddBook />} />
              <Route path="books/edit/:id" element={<AddBook />} />

              
              

              
              
              {/* Rights Management (existing) */}
              <Route path="rights/own-publishing" element={<OwnPublishing />} />
              <Route path="rights/own-publishing/add" element={<AddOwnPublishing />} />
              <Route path="/rights/selling-rights/add" element={<AddSellingRight />} />
              <Route path="/rights/buying-rights/add" element={<AddBuyingRights />} />
              <Route path="/rights/buying-rights/edit/:id" element={<AddBuyingRights />} />
              <Route path="/rights/selling-rights/edit/:id" element={<AddSellingRight />} />
              
              {/* New Modules */}
              <Route path="agreements" element={<Agreements />} />
              <Route path="agreements/add" element={<div className="p-6 text-center"><h2 className="text-2xl font-bold">Add Agreement - Coming Soon</h2></div>} />
              <Route path="royalty-calculations" element={<OwnPublishing />} />
              <Route path="renewals" element={<div className="p-6 text-center"><h2 className="text-2xl font-bold">Agreement Renewals - Coming Soon</h2></div>} />
              <Route path="settings" element={<div className="p-6 text-center"><h2 className="text-2xl font-bold">Master Settings - Coming Soon</h2></div>} />
              <Route path="/reports" element={<Reports />} />
              
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
