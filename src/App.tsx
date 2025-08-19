import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import RequestQuote from "./pages/RequestQuote";
import BalconyGlasswork from "./pages/services-page/BalconyGlasswork";
import WoodenGlassRailing from "./pages/services-page/WoodenGlassRailing";
import SSRailing from "./pages/services-page/SSRailing";
import MSRailing from "./pages/services-page/MSRailing";
import MainGates from "./pages/services-page/MainGates";
import SecurityDoors from "./pages/services-page/SecurityDoors";
import CustomFabrication from "./pages/services-page/CustomFabrication";
import Doors from "./pages/services-page/Doors";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ui/ScrollToTop";

// --- Admin imports ---
import AuthGuard from "./components/auth/AuthGuard";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Projects from "./pages/Admin/Project";
import GalleryAdmin from "./pages/Admin/galleryadmin";
import SSHandrailWork from "./pages/services-page/SSHandrailWork";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/services/balcony-glasswork" element={<BalconyGlasswork />} />
          <Route path="/services/ss-handrail-work" element={<SSHandrailWork />} />
          <Route path="/services/wooden-with-glass-railing" element={<WoodenGlassRailing />} />
          <Route path="/services/ss-railing" element={<SSRailing />} />
          <Route path="/services/ms-railing" element={<MSRailing />} />
          <Route path="/services/main-gates" element={<MainGates />} />
          <Route path="/services/security-doors" element={<SecurityDoors />} />
          <Route path="/services/garden-gates" element={<MainGates />} />
          <Route path="/services/compound-gates" element={<MainGates />} />
          <Route path="/services/custom-fabrication" element={<CustomFabrication />} />
          <Route path="/services/structural-work" element={<CustomFabrication />} />
          <Route path="/services/industrial-equipment" element={<CustomFabrication />} />
          <Route path="/services/maintenance" element={<CustomFabrication />} />
          <Route path="/services/doors" element={<Doors />} />
          <Route path="/services/windows" element={<Doors />} />
          <Route path="/services/bathroom-glass" element={<BalconyGlasswork />} />
          <Route path="/services/exterior-structures" element={<CustomFabrication />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="gallery" element={<GalleryAdmin />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
