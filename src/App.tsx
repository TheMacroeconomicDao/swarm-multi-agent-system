import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RocketScience from "./pages/RocketScience";
import SwarmDemo from "./pages/SwarmDemo";
import GlobalMissionDemo from "./pages/GlobalMissionDemo";
import CollectiveIntelligencePage from "./pages/CollectiveIntelligencePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter 
        future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}
      >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rocket-science" element={<RocketScience />} />
                <Route path="/demo" element={<SwarmDemo />} />
                <Route path="/global-mission" element={<GlobalMissionDemo />} />
                <Route path="/collective-intelligence" element={<CollectiveIntelligencePage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
