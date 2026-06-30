import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Bell, Mail, Calendar, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_shell/profile")({
  ssr: false,
  head: () => ({ meta: [{ title: "Profile — Lovable AI" }] }),
  component: ProfilePage,
});

type ProfileForm = {
  full_name: string;
  role: string;
  timezone: string;
  notify_email_digests: boolean;
  notify_task_reminders: boolean;
  notify_weekly_report: boolean;
};

const EMPTY: ProfileForm = {
  full_name: "",
  role: "",
  timezone: "",
  notify_email_digests: true,
  notify_task_reminders: true,
  notify_weekly_report: false,
};

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(EMPTY);

  useEffect(() => {
    (async () => {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        setLoading(false);
        return;
      }
      const u = userData.user;
      setUserId(u.id);
      setEmail(u.email ?? null);
      setCreatedAt(u.created_at ?? null);
      setProvider(u.app_metadata?.provider ?? null);
      setAvatarUrl(
        (u.user_metadata?.avatar_url as string | undefined) ?? null,
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "full_name, role, timezone, notify_email_digests, notify_task_reminders, notify_weekly_report, avatar_url",
        )
        .eq("id", u.id)
        .maybeSingle();

      if (profile) {
        setForm({
          full_name: profile.full_name ?? "",
          role: profile.role ?? "",
          timezone: profile.timezone ?? "",
          notify_email_digests: profile.notify_email_digests,
          notify_task_reminders: profile.notify_task_reminders,
          notify_weekly_report: profile.notify_weekly_report,
        });
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
      } else {
        setForm((f) => ({
          ...f,
          full_name:
            (u.user_metadata?.full_name as string | undefined) ??
            (u.user_metadata?.name as string | undefined) ??
            "",
          timezone:
            typeof Intl !== "undefined"
              ? Intl.DateTimeFormat().resolvedOptions().timeZone
              : "",
        }));
      }
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      ...form,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile saved");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading profile…
      </div>
    );
  }

  return (
    <>
      <PageHeader
        icon={User}
        eyebrow="Profile"
        title="Your account"
        description="Update your details and how the assistant reaches you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-16 w-16 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full gradient-bg text-xl font-bold text-white">
                {(form.full_name || email || "?")[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {form.full_name || email || "Unnamed user"}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3" /> {email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Product Manager"
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input
                value={form.timezone}
                onChange={(e) =>
                  setForm({ ...form, timezone: e.target.value })
                }
                placeholder="e.g. Europe/London"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email ?? ""} disabled />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="gradient-bg border-0 text-white hover:opacity-90"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>

        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </h3>
          {(
            [
              { key: "notify_email_digests", label: "Email digests" },
              { key: "notify_task_reminders", label: "Task reminders" },
              { key: "notify_weekly_report", label: "Weekly AI report" },
            ] as const
          ).map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <span className="text-sm">{row.label}</span>
              <Switch
                checked={form[row.key]}
                onCheckedChange={(v) => setForm({ ...form, [row.key]: v })}
              />
            </div>
          ))}
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="outline"
            className="w-full"
          >
            Save preferences
          </Button>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              User ID
            </div>
            <div className="font-mono text-xs truncate">{userId}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Sign-in provider
            </div>
            <div className="capitalize">{provider ?? "email"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Joined
            </div>
            <div>
              {createdAt
                ? new Date(createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
