import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Loader2, Copy, ExternalLink, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockResearch } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Lovable AI" },
      { name: "description", content: "Research any topic with AI." },
    ],
  }),
  component: ResearchPage,
});

const suggestions = [
  "AI regulations in Europe",
  "Best practices for remote teams",
  "Trends in B2B SaaS pricing",
  "Open-source LLM landscape 2025",
];

function ResearchPage() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof mockResearch>> | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(query?: string) {
    const finalQ = query ?? q;
    if (!finalQ.trim()) {
      toast.error("Enter a topic to research");
      return;
    }
    if (query) setQ(query);
    setLoading(true);
    setResult(await mockResearch(finalQ));
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        icon={Search}
        eyebrow="AI Research Assistant"
        title="Ask anything. Get a clear brief."
        description="Type any question or topic. We'll surface a summary, key points, sources, and recommendations."
      />

      <div className="glass rounded-2xl p-5 mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Research AI regulations in Europe..."
              className="pl-10 h-12"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-6 gradient-bg border-0 text-white hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => run(s)}
              className="text-xs px-3 py-1.5 rounded-full glass hover:border-primary/40 hover:text-primary transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Executive summary
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(result.summary);
                  toast.success("Copied");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Key points
              </h3>
              <ul className="space-y-2.5">
                {result.points.map((p, i) => (
                  <li key={i} className="text-sm flex gap-3">
                    <span className="text-primary font-semibold shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5" /> Recommendations
              </h3>
              <ul className="space-y-2.5">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-secondary">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              References
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {result.references.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 p-3 rounded-lg bg-card/40 border border-border hover:border-primary/40 transition-colors"
                  >
                    <span className="text-sm truncate">{r.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
