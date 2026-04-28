import { motion } from "framer-motion";
import { Megaphone, BarChart3, HelpCircle, Bell, Trophy, Clock, CheckCircle, BookOpen } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ReminderCard from "@/components/ReminderCard";
import BadgeCard from "@/components/BadgeCard";
import { mockAnnouncements, mockReminders, mockBadges } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="gradient-hero rounded-2xl p-6 md:p-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Good morning, {firstName} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening in your classes today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Upcoming Deadlines" value={4} icon={<Clock className="w-5 h-5" />} trend="1 due today" colorClass="bg-reminder-light text-reminder" />
        <StatsCard title="Unread Announcements" value={2} icon={<Megaphone className="w-5 h-5" />} trend="1 pinned" colorClass="bg-announcement-light text-announcement" />
        <StatsCard title="Unresolved Doubts" value={3} icon={<HelpCircle className="w-5 h-5" />} trend="1 reply pending" colorClass="bg-doubt-light text-doubt" />
        <StatsCard title="Badges Earned" value={4} icon={<Trophy className="w-5 h-5" />} trend="1 new this week" colorClass="bg-cb-badge-light text-cb-badge" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Announcements Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-announcement" /> Recent Announcements
          </h2>
          {mockAnnouncements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="bg-card rounded-xl border p-5 card-hover">
                <div className="flex items-center gap-2 mb-2">
                  {a.targetClasses.map(c => (
                    <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{c}</span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary mt-0.5">
                    {a.author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                  </div>
                </div>
                {!a.isRead && (
                  <div className="mt-3 flex justify-end">
                    <button className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark as Read
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Deadlines */}
          <div className="space-y-3">
            <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-reminder" /> Upcoming Deadlines
            </h2>
            {mockReminders.slice(0, 3).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ReminderCard reminder={r} />
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cb-badge" /> Recent Badges
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {mockBadges.filter(b => b.earned).slice(0, 4).map(badge => (
                <div key={badge.id} className="min-w-[120px]">
                  <BadgeCard badge={badge} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
