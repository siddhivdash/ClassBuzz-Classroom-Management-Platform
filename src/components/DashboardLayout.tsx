import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Megaphone, BarChart3, HelpCircle,
  Bell, Trophy, Settings, Search, Menu, X, Zap,
  ChevronDown, LogOut, Clock, MessageSquare, FolderOpen, User,
  Sun, Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NotificationsPanel from "@/components/NotificationsPanel";

interface NavItem {
  icon: any;
  label: string;
  path: string;
}

const teacherNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
  { icon: Megaphone, label: "Announcements", path: "/teacher/announcements" },
  { icon: Clock, label: "Deadlines", path: "/teacher/deadlines" },
  { icon: HelpCircle, label: "Doubts", path: "/teacher/doubts" },
  { icon: BarChart3, label: "Polls", path: "/teacher/polls" },
  { icon: MessageSquare, label: "Feedback", path: "/teacher/feedback" },
  { icon: Trophy, label: "Badges", path: "/teacher/badges" },
  { icon: FolderOpen, label: "Resources", path: "/teacher/resources" },
  { icon: Settings, label: "Settings", path: "/teacher/settings" },
];

const studentNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
  { icon: Megaphone, label: "Announcements", path: "/student/announcements" },
  { icon: Clock, label: "Deadlines", path: "/student/deadlines" },
  { icon: HelpCircle, label: "Doubts", path: "/student/doubts" },
  { icon: BarChart3, label: "Polls", path: "/student/polls" },
  { icon: MessageSquare, label: "Feedback", path: "/student/feedback" },
  { icon: Trophy, label: "Badges", path: "/student/badges" },
  { icon: FolderOpen, label: "Resources", path: "/student/resources" },
  { icon: User, label: "Profile", path: "/student/profile" },
];

const mobileTeacherNav = teacherNav.slice(0, 4).concat([{ icon: User, label: "Profile", path: "/teacher/profile" }]);
const mobileStudentNav = studentNav.filter(n => ["Dashboard", "Announcements", "Deadlines", "Doubts", "Profile"].includes(n.label));

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isTeacher = user?.role === "teacher";
  const navItems = isTeacher ? teacherNav : studentNav;
  const mobileNav = isTeacher ? mobileTeacherNav : mobileStudentNav;

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — desktop */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r z-50 flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-5 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">ClassBuzz</span>
          </Link>
          <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== navItems[0].path && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b h-16 flex items-center px-4 md:px-6 gap-4">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search classes, posts, doubts..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleDark}>
              {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationsOpen(true)}>
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary lg:hidden">
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-40 lg:hidden">
        <div className="flex items-center justify-around h-16">
          {mobileNav.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Notifications Panel */}
      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
