import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Megaphone, BarChart3, HelpCircle, Trophy, Bell, MessageSquare, ArrowRight, CheckCircle2, Zap, Users, BookOpen, FolderOpen } from "lucide-react";

const features = [
  { icon: <Megaphone className="w-5 h-5" />, title: "Smart Announcements", desc: "Pin, schedule, and target announcements to specific classes.", color: "bg-announcement-light text-announcement" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Live Polls", desc: "Get instant feedback with beautiful real-time visualizations.", color: "bg-poll-light text-poll" },
  { icon: <HelpCircle className="w-5 h-5" />, title: "Doubt Resolution", desc: "Kanban-style Q&A with status tracking and threaded replies.", color: "bg-doubt-light text-doubt" },
  { icon: <Bell className="w-5 h-5" />, title: "Deadline Tracking", desc: "Calendar and list views with smart countdown chips.", color: "bg-reminder-light text-reminder" },
  { icon: <Trophy className="w-5 h-5" />, title: "Badges & Leaderboard", desc: "Motivate students with achievements, streaks, and rankings.", color: "bg-cb-badge-light text-cb-badge" },
  { icon: <FolderOpen className="w-5 h-5" />, title: "Resource Library", desc: "Organized folder-based file sharing with drag-and-drop upload.", color: "bg-resource-light text-resource" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">ClassBuzz</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="container mx-auto px-4 pt-20 pb-24 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" /> Smart classroom communication
            </span>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Your classroom,{" "}
              <span className="bg-gradient-to-r from-primary to-poll bg-clip-text text-transparent">supercharged</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              Announcements, polls, Q&A, deadlines, and recognition — all in one beautiful platform. 
              Keep every student engaged and every teacher organized.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link to="/login">
                <Button size="lg" className="text-base px-8">
                  Start for free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8">See features</Button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
          >
            {[
              { value: "10k+", label: "Students" },
              { value: "500+", label: "Teachers" },
              { value: "98%", label: "Satisfaction" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-heading font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Everything your classroom needs</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Six powerful tools designed to make communication effortless and engagement natural.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-card rounded-xl border p-6 card-hover"
            >
              <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">How ClassBuzz works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: <Users className="w-6 h-6" />, title: "Create your class", desc: "Set up your classroom in seconds and invite students." },
              { step: "02", icon: <MessageSquare className="w-6 h-6" />, title: "Communicate", desc: "Post announcements, polls, and reminders effortlessly." },
              { step: "03", icon: <CheckCircle2 className="w-6 h-6" />, title: "Stay on track", desc: "Track doubts, deadlines, and celebrate achievements." },
            ].map((item, i) => (
              <motion.div key={item.step} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-primary mb-2">STEP {item.step}</p>
                <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-poll rounded-2xl p-12 md:p-16 max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to transform your classroom?
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">
            Join thousands of educators who use ClassBuzz to keep students engaged and organized.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="mt-8 text-base px-8">
              Get started free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold">ClassBuzz</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ClassBuzz. Your classroom, supercharged.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
