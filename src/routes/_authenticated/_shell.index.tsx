import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarCheck2,
  Search,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/_shell/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity" },
      {
        name: "description",
        content:
          "Your AI-powered workplace command center: emails, meeting notes, planning, research, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Email Generator",
    desc: "Draft polished emails in seconds",
    icon: Mail,
    href: "/email",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Meeting Summary",
    desc: "Turn transcripts into action items",
    icon: FileText,
    href: "/meeting",
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    title: "AI Planner",
    desc: "Generate weekly task plans",
    icon: CalendarCheck2,
    href: "/planner",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Research Assistant",
    desc: "Deep-dive any topic instantly",
    icon: Search,
    href: "/research",
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    title: "AI Chat",
    desc: "Your always-on workplace co-pilot",
    icon: Bot,
    href: "/chat",
    color: "from-indigo-500/20 to-violet-500/10",
  },
] as const;

const stats = [
  { label: "Productivity Score", value: "87", trend: "+12%", icon: TrendingUp },
  { label: "Emails Drafted", value: "24", trend: "this week", icon: Mail },
  { label: "Tasks Completed", value: "18/22", trend: "82%", icon: CheckCircle2 },
  { label: "Hours Saved", value: "11.4", trend: "via AI", icon: Clock },
];

const activity = [
  { what: "Generated email to Acme Corp", when: "5m ago", icon: Mail },
  { what: "Summarized Q3 planning meeting", when: "1h ago", icon: FileText },
  { what: "Created weekly plan for Launch", when: "3h ago", icon: CalendarCheck2 },
  { what: "Researched 'EU AI Act'", when: "Yesterday", icon: Search },
];

function Dashboard() {
  return (
    <>
      <PageHeader
        icon={Sparkles}
        eyebrow="Welcome back"
        title="Good to see you again 👋"
        description="Here's your AI command center. Jump into any tool to get more done in less time."
      />

      {/* Stats grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass glass-hover rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-success">
                {s.trend}
              </span>
            </div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight">
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* AI Tools */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Quick AI shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link
              key={t.href}
              to={t.href}
              className="glass glass-hover rounded-2xl p-5 group relative overflow-hidden"
            >
              <div
                className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.color} blur-2xl opacity-60`}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl gradient-bg shadow-[0_0_24px_-6px_oklch(0.65_0.2_265/0.7)]">
                    <t.icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold mb-1">{t.title}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity + Today */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent AI activity
          </h2>
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 shrink-0">
                  <a.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.what}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {a.when}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck2 className="h-4 w-4 text-primary" />
            Today's focus
          </h2>
          <ul className="space-y-2.5">
            {[
              { t: "Finalize launch comms", p: "High" },
              { t: "Review Q3 retrospective", p: "Medium" },
              { t: "Customer call — Acme Corp", p: "High" },
              { t: "Pair on real-time sync", p: "Medium" },
            ].map((task, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors"
              >
                <div className="h-4 w-4 rounded border border-border shrink-0" />
                <span className="text-sm flex-1 min-w-0 truncate">{task.t}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    task.p === "High"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  {task.p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
