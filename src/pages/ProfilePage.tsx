import { useAuth } from "@/contexts/AuthContext";
import { mockBadges, mockClasses } from "@/data/mockData";
import { Trophy, Flame, Star, Mail, BookOpen, Users } from "lucide-react";
import BadgeCard from "@/components/BadgeCard";

const ProfilePage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="font-heading text-2xl font-bold">Profile</h1>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <Mail className="w-4 h-4" /> {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-3">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> {isTeacher ? 'Classes Managed' : 'Enrolled Classes'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {mockClasses.slice(0, isTeacher ? 3 : 2).map(cls => (
            <div key={cls.id} className="bg-card rounded-xl border p-4">
              <h3 className="font-semibold">{cls.name}</h3>
              <p className="text-sm text-muted-foreground">{cls.subject}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" /> {cls.studentCount} students
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats (student) */}
      {!isTeacher && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-lg">Activity Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border p-4 text-center">
              <Trophy className="w-6 h-6 text-cb-badge mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">{mockBadges.filter(b => b.earned).length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
            <div className="bg-card rounded-xl border p-4 text-center">
              <Flame className="w-6 h-6 text-doubt mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">7</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="bg-card rounded-xl border p-4 text-center">
              <Star className="w-6 h-6 text-poll mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">92</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>

          <h2 className="font-heading font-semibold text-lg mt-4">Badge Collection</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {mockBadges.filter(b => b.earned).map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {isTeacher && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-lg">Teaching Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border p-4 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">115</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
            <div className="bg-card rounded-xl border p-4 text-center">
              <BookOpen className="w-6 h-6 text-announcement mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">3</p>
              <p className="text-xs text-muted-foreground">Classes</p>
            </div>
            <div className="bg-card rounded-xl border p-4 text-center">
              <Trophy className="w-6 h-6 text-cb-badge mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">28</p>
              <p className="text-xs text-muted-foreground">Badges Given</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
