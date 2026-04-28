import { Settings, Bell, Palette, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [doubtNotifs, setDoubtNotifs] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="font-heading text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <h2 className="font-heading font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h2>
          {[
            { label: 'Email notifications', desc: 'Receive email for announcements and deadlines', value: emailNotifs, set: setEmailNotifs },
            { label: 'Push notifications', desc: 'Get browser push notifications', value: pushNotifs, set: setPushNotifs },
            { label: 'Doubt reply alerts', desc: 'Notify when your doubts get replies', value: doubtNotifs, set: setDoubtNotifs },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={cn("w-11 h-6 rounded-full transition-colors relative", item.value ? "bg-primary" : "bg-muted")}
              >
                <div className={cn("w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform", item.value ? "translate-x-5" : "translate-x-0.5")} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border p-5 space-y-4">
          <h2 className="font-heading font-semibold flex items-center gap-2"><Palette className="w-5 h-5 text-poll" /> Appearance</h2>
          <p className="text-sm text-muted-foreground">Theme can be toggled using the sun/moon icon in the top bar.</p>
        </div>

        <div className="bg-card rounded-xl border p-5 space-y-4">
          <h2 className="font-heading font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-cb-badge" /> Account</h2>
          <p className="text-sm text-muted-foreground">Manage your account security and privacy settings.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
