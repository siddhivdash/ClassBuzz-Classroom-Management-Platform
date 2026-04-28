import { motion } from "framer-motion";
import { Megaphone, BarChart3, HelpCircle, Trophy, Plus, Users, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import PostCard from "@/components/PostCard";
import { mockFeedPosts, weeklyEngagement } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[1] || 'Teacher';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="gradient-hero rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">Welcome back, {firstName} 👋</h1>
            <p className="text-muted-foreground mt-1">Here's your classroom overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm"><Plus className="w-4 h-4 mr-1.5" /> New Post</Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={115} icon={<Users className="w-5 h-5" />} trend="3 classes" colorClass="bg-primary/10 text-primary" />
        <StatsCard title="Active Polls" value={2} icon={<BarChart3 className="w-5 h-5" />} trend="109 votes" colorClass="bg-poll-light text-poll" />
        <StatsCard title="Pending Doubts" value={5} icon={<HelpCircle className="w-5 h-5" />} trend="2 high priority" colorClass="bg-doubt-light text-doubt" />
        <StatsCard title="Announcements" value={3} icon={<Megaphone className="w-5 h-5" />} trend="This week" colorClass="bg-announcement-light text-announcement" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Megaphone className="w-4 h-4" />, label: "+ New Announcement", color: "bg-announcement-light text-announcement hover:bg-announcement/20" },
          { icon: <BarChart3 className="w-4 h-4" />, label: "+ New Poll", color: "bg-poll-light text-poll hover:bg-poll/20" },
          { icon: <Clock className="w-4 h-4" />, label: "+ Set Deadline", color: "bg-reminder-light text-reminder hover:bg-reminder/20" },
          { icon: <Trophy className="w-4 h-4" />, label: "Award Badge", color: "bg-cb-badge-light text-cb-badge hover:bg-cb-badge/20" },
        ].map(action => (
          <button key={action.label} className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-medium transition-colors ${action.color}`}>
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          {mockFeedPosts.slice(0, 4).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* Engagement Chart */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg">Weekly Engagement</h2>
          <div className="bg-card rounded-xl border p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="replies" fill="hsl(var(--badge))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="polls" fill="hsl(var(--poll))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
