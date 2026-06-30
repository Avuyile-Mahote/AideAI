import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Copy,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Target,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockSummarize } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/meeting")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Lovable AI" },
      { name: "description", content: "Turn meeting transcripts into action items." },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof mockSummarize>> | null>(null);
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!transcript.trim()) {
      toast.error("Paste a transcript first");
      return;
    }
    setLoading(true);
    setResult(await mockSummarize(transcript));
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        icon={FileText}
        eyebrow="Meeting Notes Summarizer"
        title="From transcript to action plan"
        description="Paste any meeting transcript and get a clean summary, decisions, action items, and risks."
      />

      <div className="glass rounded-2xl p-6 mb-5">
        <Textarea
          placeholder="Paste your meeting transcript here..."
          rows={8}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="resize-none"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            onClick={summarize}
            disabled={loading}
            className="gradient-bg border-0 text-white hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Summarize
          </Button>
          {result && (
            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                toast.success("Copied summary");
              }}
            >
              <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
          )}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Summary
            </h3>
            <p className="text-sm leading-relaxed">{result.summary}</p>
            <p className="text-xs text-muted-foreground mt-3">{result.meta}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" /> Key decisions
            </h3>
            <ul className="space-y-2">
              {result.decisions.map((d, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-primary">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
              <Target className="h-3.5 w-3.5" /> Action items
            </h3>
            <ul className="space-y-3">
              {result.actions.map((a, i) => (
                <li key={i} className="text-sm">
                  <div className="font-medium">{a.what}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span>{a.who}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {a.due}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-destructive mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Risks
            </h3>
            <ul className="space-y-2">
              {result.risks.map((r, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-destructive">!</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
