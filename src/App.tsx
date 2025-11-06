import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Starfield } from "@/components/background/Starfield";
import { SunBackground } from "@/components/background/SunBackground";
import Landing from "./pages/Landing";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Showcase from "./pages/Showcase";
import Judge from "./pages/Judge";
import Admin from "./pages/Admin";
import AdminJudges from "./pages/AdminJudges";
import JudgeEvaluation from "./pages/JudgeEvaluation";
import TeamWorkspace from "./pages/TeamWorkspace";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/auth/callback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Starfield />
            <SunBackground />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/events/:slug/teams/:teamId" element={<TeamWorkspace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/judge" element={<Judge />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/judges" element={<AdminJudges />} />
              <Route path="/judge/:judgeId/evaluation" element={<JudgeEvaluation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
