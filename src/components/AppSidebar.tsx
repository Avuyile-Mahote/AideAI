import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck2,
  Search,
  Bot,
  Settings,
  Sparkles,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/meeting", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck2 },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "AI Chatbot", url: "/chat", icon: Bot },
] as const;

function useCurrentUser() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return email;
}

function useSignOut() {
  const navigate = useNavigate();
  return async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const email = useCurrentUser();
  const signOut = useSignOut();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-bg shadow-[0_0_24px_-4px_oklch(0.65_0.2_265/0.7)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-sm font-bold gradient-text">Lovable AI</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Workplace Assist
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
                active
                  ? "text-foreground bg-sidebar-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r gradient-bg" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active && "text-primary",
                )}
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
            pathname === "/profile"
              ? "text-foreground bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
          )}
        >
          <UserCircle className="h-4 w-4 shrink-0" />
          Profile
        </Link>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
            pathname === "/settings"
              ? "text-foreground bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="grid h-7 w-7 place-items-center rounded-full gradient-bg text-[11px] font-bold text-white shrink-0">
            {email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{email ?? "Guest"}</div>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mobileItems = [
    items[0],
    items[1],
    items[3],
    items[5],
    { title: "Settings", url: "/settings", icon: Settings },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar/95 backdrop-blur border-t border-sidebar-border">
      <div className="grid grid-cols-5">
        {mobileItems.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate max-w-full px-1">{item.title.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
