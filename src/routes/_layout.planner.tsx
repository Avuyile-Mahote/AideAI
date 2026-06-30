import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck2, Sparkles, Loader2, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { mockPlan } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Lovable AI" },
      { name: "description", content: "Generate a weekly task plan with AI." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [project, setProject] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [plan, setPlan] = useState<Awaited<ReturnType<typeof mockPlan>> | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!goal.trim()) {
      toast.error("Enter at least a goal");
      return;
    }
    setLoading(true);
    setPlan(await mockPlan(goal));
    setLoading(false);
  }

  const totalHours = plan?.reduce(
    (sum, d) => sum + d.tasks.reduce((a, t) => a + t.hours, 0),
    0,
  );

  return (
    <>
      <PageHeader
        icon={CalendarCheck2}
        eyebrow="AI Task Planner"
        title="Plan your week with AI"
        description="Tell us your goal — we'll build a balanced, prioritized weekly plan."
      />

      <div className="glass rounded-2xl p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Project</Label>
          <Input
            placeholder="e.g. Q4 Product Launch"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Main goal</Label>
          <Textarea
            placeholder="What do you want to accomplish this week?"
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 flex items-end">
          <Button
            onClick={generate}
            disabled={loading}
            className="w-full md:w-auto gradient-bg border-0 text-white hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Plan
          </Button>
        </div>
      </div>

      {plan && (
        <>
          <div className="glass rounded-2xl p-5 mb-4 flex flex-wrap items-center gap-4 justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total scheduled</div>
              <div className="text-2xl font-bold">{totalHours}h this week</div>
            </div>
            <div className="flex-1 min-w-[200px] max-w-md">
              <Progress value={45} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1.5">
                45% complete · keep going!
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {plan.map((day) => (
              <div key={day.day} className="glass rounded-2xl p-4">
                <h3 className="font-semibold mb-3 flex items-center justify-between">
                  {day.day}
                  <span className="text-xs text-muted-foreground font-normal">
                    {day.tasks.reduce((a, t) => a + t.hours, 0)}h
                  </span>
                </h3>
                <ul className="space-y-2.5">
                  {day.tasks.map((t, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-lg bg-card/40 border border-border"
                    >
                      <div className="text-sm font-medium leading-snug">
                        {t.title}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            t.priority === "High"
                              ? "bg-secondary/20 text-secondary"
                              : t.priority === "Medium"
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {t.hours}h
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
