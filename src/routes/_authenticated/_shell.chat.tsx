import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockChat } from "@/lib/mock-ai";

export const Route = createFileRoute("/_authenticated/_shell/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Lovable AI" },
      { name: "description", content: "Your always-on workplace AI co-pilot." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "ai"; content: string };

const prompts = [
  "Draft a marketing strategy for Q4",
  "Summarize my last meeting",
  "Create a SWOT for our new product",
  "Write a job description for a senior PM",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setLoading(true);
    const reply = await mockChat(content);
    setMessages((m) => [...m, { role: "ai", content: reply }]);
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        icon={Bot}
        eyebrow="AI Chatbot"
        title="Your workplace co-pilot"
        description="Ask anything — emails, plans, research, ideas. I'm here to help."
      />

      <div className="glass rounded-2xl flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center">
              <div className="max-w-md">
                <div className="grid h-14 w-14 mx-auto place-items-center rounded-2xl gradient-bg shadow-[0_0_32px_-4px_oklch(0.65_0.2_265/0.6)] mb-4">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  How can I help today?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Try one of these prompts or type your own.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="text-left text-sm p-3 rounded-xl glass hover:border-primary/40 transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "ai" && (
                  <div className="grid h-8 w-8 place-items-center rounded-lg gradient-bg shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "gradient-bg text-white"
                      : "glass"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-bg shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span
                  className="h-2 w-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="h-2 w-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3 md:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 items-end"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message AI assistant..."
              rows={1}
              className="resize-none min-h-[44px] max-h-32"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 px-4 gradient-bg border-0 text-white hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
