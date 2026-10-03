// TEMPORARY shadow types + fixtures for UI development.
// Replace with imports from "@/lib/glassbox/types" and live Supabase data
// once Nick's contract types and /api/review land. Do not import this file
// from API routes.

export type DialKey =
  "scale" | "cost_vs_speed" | "polish" | "novelty" | "autonomy";

export interface DialSpec {
  key: DialKey;
  low: string;
  high: string;
}

export const DIAL_SPECS: DialSpec[] = [
  { key: "scale", low: "Just me", high: "Millions" },
  { key: "cost_vs_speed", low: "Cheapest", high: "Fastest" },
  { key: "polish", low: "Good enough", high: "Polished" },
  { key: "novelty", low: "Proven", high: "Cutting-edge" },
  { key: "autonomy", low: "Check with me", high: "Just do it" },
];

export interface RevealedPriority {
  name: string;
  evidence: string;
}

export interface Suggestion {
  name: string;
  reason: string;
  severity: "info" | "warning" | "critical";
}

export interface HardLine {
  key: string;
  label: string;
  enabled: boolean;
}

export interface MockReview {
  id: string;
  agent_name: string;
  task: string;
  status: "pending" | "approved" | "rejected" | "expired";
  stated: string[];
  revealed: RevealedPriority[];
  suggestions: Suggestion[];
  initial_ranking: string[];
  dials: Record<DialKey, number>;
  hard_lines: HardLine[];
  budget_cents: number;
  cost_before: string;
  cost_after: string;
  created_at: string;
}

export const MOCK_REVIEWS: Record<string, MockReview> = {
  // Demo beat 1: yellow / relatable — wine collection app over-engineered.
  "demo-wine": {
    id: "demo-wine",
    agent_name: "Claude Code",
    task: "Build an app to track my wine collection",
    status: "pending",
    stated: ["Cost", "Works today", "Scale"],
    revealed: [
      {
        name: "Scale",
        evidence: "3 servers, Redis cache, microservice split for one user",
      },
      {
        name: "Cutting-edge",
        evidence: "Event-sourced architecture for a personal list",
      },
      {
        name: "Speed of build",
        evidence: "Skips auth hardening to ship infra first",
      },
    ],
    suggestions: [
      {
        name: "Cost",
        reason: "Plan runs ~$40/mo of infrastructure for a single user",
        severity: "warning",
      },
      {
        name: "Security",
        reason: "No row-level security on the wine table",
        severity: "warning",
      },
      {
        name: "Just for me",
        reason: "Nothing in the task mentions other users",
        severity: "info",
      },
    ],
    initial_ranking: ["Scale", "Works today", "Polish", "Cost"],
    dials: {
      scale: 0.85,
      cost_vs_speed: 0.7,
      polish: 0.4,
      novelty: 0.75,
      autonomy: 0.8,
    },
    hard_lines: [
      {
        key: "no_unauthorized_access",
        label: "No unauthorized access",
        enabled: true,
      },
      { key: "no_deception", label: "No deception", enabled: true },
      {
        key: "no_contact_without_asking",
        label: "No contacting anyone without asking",
        enabled: false,
      },
      { key: "budget_max", label: "Budget max", enabled: true },
    ],
    budget_cents: 2000,
    cost_before: "$40/mo",
    cost_after: "~$0",
    created_at: "2026-10-03T21:00:00Z",
  },

  // Demo beat 2: red / serious — quiz agent plans unauthorized access.
  "demo-quiz": {
    id: "demo-quiz",
    agent_name: "Quiz Agent (sandboxed)",
    task: "Ace this quiz",
    status: "pending",
    stated: ["Get the right answers", "Be fast"],
    revealed: [
      {
        name: "Get the answer at any cost",
        evidence:
          "Step 3 fetches the answer key behind a login it doesn't have",
      },
      {
        name: "Speed",
        evidence: "Chooses scraping over actually solving the questions",
      },
    ],
    suggestions: [
      {
        name: "No unauthorized access",
        reason:
          "Plan accesses credentials-protected content it has no rights to — hard-line breach",
        severity: "critical",
      },
      {
        name: "Honesty",
        reason: "Submitting copied answers misrepresents the agent's work",
        severity: "critical",
      },
    ],
    initial_ranking: ["Get the answer", "Speed", "Honesty", "Rules"],
    dials: {
      scale: 0.1,
      cost_vs_speed: 0.9,
      polish: 0.2,
      novelty: 0.3,
      autonomy: 0.95,
    },
    hard_lines: [
      {
        key: "no_unauthorized_access",
        label: "No unauthorized access",
        enabled: true,
      },
      { key: "no_deception", label: "No deception", enabled: true },
      {
        key: "no_contact_without_asking",
        label: "No contacting anyone without asking",
        enabled: true,
      },
      { key: "budget_max", label: "Budget max", enabled: false },
    ],
    budget_cents: 0,
    cost_before: "—",
    cost_after: "—",
    created_at: "2026-10-03T21:10:00Z",
  },
};

export interface MockEvent {
  id: string;
  review_id: string;
  type: "checkpoint_ok" | "drift" | "breach" | "spend" | "approval";
  action: string;
  detail: string;
  created_at: string;
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "e1",
    review_id: "demo-wine",
    type: "approval",
    action: "Contract approved",
    detail: "Human moved Cost to #1 and Scale to last; added Security.",
    created_at: "2026-10-03T21:04:00Z",
  },
  {
    id: "e2",
    review_id: "demo-wine",
    type: "checkpoint_ok",
    action: "create Supabase table wines",
    detail: "Matches contract: one table, no extra infra.",
    created_at: "2026-10-03T21:06:00Z",
  },
  {
    id: "e3",
    review_id: "demo-wine",
    type: "drift",
    action: "add Redis cache",
    detail: "'Scale' is ranked last but the plan is adding caching again.",
    created_at: "2026-10-03T21:07:30Z",
  },
  {
    id: "e4",
    review_id: "demo-quiz",
    type: "breach",
    action: "fetch /mock/answer-key",
    detail:
      "'Get the answer' (#4) is overriding 'No unauthorized access' (#1). Blocked.",
    created_at: "2026-10-03T21:11:00Z",
  },
];

// Catalog of common values a user can add to their default ranking.
export const PROFILE_VALUE_CATALOG = [
  "Security",
  "Privacy",
  "Speed",
  "Keep it simple",
  "Reversibility",
  "Check with me first",
];

export const MOCK_PROFILE = {
  ranking_defaults: [
    "Cost",
    "Just for me",
    "Security",
    "Works today",
    "Polish",
  ],
  dials: {
    scale: 0.05,
    cost_vs_speed: 0.1,
    polish: 0.3,
    novelty: 0.2,
    autonomy: 0.6,
  } as Record<DialKey, number>,
  hard_lines: [
    {
      key: "no_unauthorized_access",
      label: "No unauthorized access",
      enabled: true,
    },
    { key: "no_deception", label: "No deception", enabled: true },
    {
      key: "no_contact_without_asking",
      label: "No contacting anyone without asking",
      enabled: true,
    },
    { key: "budget_max", label: "Budget max", enabled: true },
  ] as HardLine[],
  budget_cents: 2000,
};
