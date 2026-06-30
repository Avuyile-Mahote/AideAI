// Mocked AI generators — replace with real Lovable AI calls when ready.
export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function mockEmail(input: {
  recipient: string;
  purpose: string;
  tone: string;
}) {
  await delay(1200);
  return `Subject: ${input.purpose}

Hi ${input.recipient || "there"},

I hope this message finds you well. I'm reaching out regarding ${input.purpose.toLowerCase()}. I wanted to share a few thoughts and outline next steps so we can move forward efficiently.

Based on our recent discussions, I believe a ${input.tone.toLowerCase()} approach will serve us best. Please let me know a time that works for a quick sync this week, or feel free to reply with any feedback at your convenience.

Thanks for your time and continued partnership.

Best regards,
[Your Name]`;
}

export async function mockSummarize(transcript: string) {
  await delay(1400);
  const lines = transcript.split("\n").filter(Boolean).length;
  return {
    summary:
      "The team reviewed Q3 priorities, aligned on the product launch timeline, and clarified ownership for the marketing rollout. Engineering raised two technical risks that need follow-up.",
    decisions: [
      "Ship v2.0 the first week of next month",
      "Move analytics dashboard to phase 2",
      "Hire a contract designer for landing pages",
    ],
    actions: [
      { who: "Sarah", what: "Finalize launch comms plan", due: "Fri" },
      { who: "James", what: "Spike on real-time sync feasibility", due: "Wed" },
      { who: "Priya", what: "Draft hiring brief for designer", due: "Mon" },
    ],
    risks: [
      "Real-time sync may slip the timeline by 1 week",
      "Designer availability is uncertain",
    ],
    meta: `${lines} lines of transcript analyzed`,
  };
}

export async function mockPlan(goal: string) {
  await delay(1500);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return days.map((day, i) => ({
    day,
    tasks: [
      {
        title: `${["Research", "Draft", "Review", "Iterate", "Ship"][i]} ${goal || "the deliverable"}`,
        hours: [2, 3, 2, 4, 3][i],
        priority: ["High", "Medium", "Medium", "High", "High"][i] as
          | "High"
          | "Medium"
          | "Low",
      },
      {
        title: `${["Stakeholder sync", "Team standup", "Pair session", "Customer call", "Retro & docs"][i]}`,
        hours: 1,
        priority: ["Medium", "Low", "Medium", "High", "Low"][i] as
          | "High"
          | "Medium"
          | "Low",
      },
    ],
  }));
}

export async function mockResearch(query: string) {
  await delay(1600);
  return {
    summary: `Here is a concise overview of "${query}". The current landscape is evolving rapidly with several key players, regulatory shifts, and emerging best practices that decision-makers should track closely.`,
    points: [
      "Market is growing ~22% YoY with enterprise adoption accelerating",
      "Three frameworks dominate: governance, interoperability, and safety",
      "Recent legislation in the EU is pushing global standards upward",
      "Tooling has matured — production-ready solutions exist for most use cases",
    ],
    references: [
      { title: "Industry report 2025", url: "https://example.com/report" },
      { title: "Regulatory overview", url: "https://example.com/reg" },
      { title: "Best practices guide", url: "https://example.com/best" },
    ],
    recommendations: [
      "Start with a 30-day discovery sprint to map internal needs",
      "Pilot with one team before expanding org-wide",
      "Establish a governance committee within the first quarter",
    ],
  };
}

export async function mockChat(message: string) {
  await delay(900);
  return `Great question. Here's how I'd think about "${message}":

1. **Clarify the goal** — what specifically should this accomplish?
2. **Identify constraints** — time, budget, stakeholders.
3. **Outline a first version** — keep it small enough to ship this week.
4. **Plan feedback loops** — schedule one check-in per phase.

Want me to draft a concrete plan, an email to your team, or a research brief on this topic?`;
}
