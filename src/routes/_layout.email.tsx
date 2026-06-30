import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, Download, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockEmail } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator — Lovable AI" },
      { name: "description", content: "Generate polished emails with AI." },
    ],
  }),
  component: EmailPage,
});

const tones = [
  "Professional",
  "Friendly",
  "Formal",
  "Persuasive",
  "Apology",
  "Sales",
  "Thank You",
  "Follow Up",
];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!purpose.trim()) {
      toast.error("Please enter the email purpose");
      return;
    }
    setLoading(true);
    const text = await mockEmail({ recipient, purpose, tone });
    setOutput(text);
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        icon={Mail}
        eyebrow="AI Email Generator"
        title="Draft your next email in seconds"
        description="Tell us the purpose and tone — we'll handle the wording."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Sarah from Acme Corp"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Textarea
              id="purpose"
              placeholder="Briefly describe what this email should accomplish..."
              rows={5}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={generate}
            disabled={loading}
            className="w-full gradient-bg border-0 text-white hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Email
          </Button>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-3 min-h-[420px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Generated email
            </h3>
            {output && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copy}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </Button>
                <Button size="sm" variant="ghost" onClick={download}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Download
                </Button>
                <Button size="sm" variant="ghost" onClick={generate}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Regenerate
                </Button>
              </div>
            )}
          </div>
          {output ? (
            <pre className="flex-1 whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground/90">
              {output}
            </pre>
          ) : (
            <div className="flex-1 grid place-items-center text-center text-muted-foreground">
              <div>
                <Mail className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Your generated email will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
