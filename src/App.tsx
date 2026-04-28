import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import DeadlinesPage from "./pages/DeadlinesPage";
import DoubtsPage from "./pages/DoubtsPage";
import PollsPage from "./pages/PollsPage";
import FeedbackPage from "./pages/FeedbackPage";
import BadgesPage from "./pages/BadgesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="deadlines" element={<DeadlinesPage />} />
        <Route path="doubts" element={<DoubtsPage />} />
        <Route path="polls" element={<PollsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="deadlines" element={<DeadlinesPage />} />
        <Route path="doubts" element={<DoubtsPage />} />
        <Route path="polls" element={<PollsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;