import { createFileRoute } from "@tanstack/react-router";
import { Settings, User, Bell, Palette, Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/_shell/settings")({
  head: () => ({
    meta: [{ title: "Settings — Lovable AI" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        icon={Settings}
        eyebrow="Settings"
        title="Manage your workspace"
        description="Profile, preferences, notifications, and security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-primary" /> Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input defaultValue="Alex Morgan" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="alex@company.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input defaultValue="Product Manager" />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input defaultValue="Europe/London" />
            </div>
          </div>
          <Button className="mt-5 gradient-bg border-0 text-white hover:opacity-90">
            Save changes
          </Button>
        </div>

        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </h3>
          {[
            { label: "Email digests", on: true },
            { label: "Task reminders", on: true },
            { label: "Weekly AI report", on: false },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm">{row.label}</span>
              <Switch defaultChecked={row.on} />
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> Appearance
          </h3>
          {[
            { label: "Reduced motion", on: false },
            { label: "Compact layout", on: false },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm">{row.label}</span>
              <Switch defaultChecked={row.on} />
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" /> Security
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Two-factor authentication adds an extra layer of security to your
            account.
          </p>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>
    </>
  );
}
