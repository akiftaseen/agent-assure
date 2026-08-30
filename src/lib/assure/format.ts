import type {
  Recommendation,
  Severity,
  Taxonomy,
  ScenarioCategory,
  DimensionKey,
  FindingStatus,
} from "./types";

export const RECOMMENDATION_LABEL: Record<Recommendation, string> = {
  approved: "Approved",
  conditional: "Conditional approval",
  rejected: "Rejected",
  in_review: "In review",
  revalidation: "Revalidation required",
  draft: "Draft",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const TAXONOMY_LABEL: Record<Taxonomy, string> = {
  authority: "Authority failure",
  privacy: "Privacy failure",
  policy: "Policy failure",
  hallucination: "Hallucination",
  procedure: "Procedure failure",
  escalation: "Escalation failure",
  tool: "Tool misuse",
  fraud: "Fraud susceptibility",
  inconsistency: "Inconsistency",
  bias: "Bias / fairness",
  resilience: "Resilience",
  financial_loss: "Financial loss",
  security: "Security",
};

export const CATEGORY_LABEL: Record<ScenarioCategory, string> = {
  happy_path: "Happy path",
  ambiguous: "Ambiguous",
  conflicting: "Conflicting instruction",
  policy_edge: "Policy edge",
  fraud: "Fraud",
  prompt_injection: "Prompt injection",
  sensitive_data: "Sensitive data",
  tool_failure: "Tool failure",
  stale_data: "Stale data",
  multi_step: "Multi-step",
  escalation: "Escalation",
  emotional: "Emotional manipulation",
  authority: "Authority manipulation",
  repeated: "Repeated attempt",
};

export const DIMENSION_LABEL: Record<DimensionKey, string> = {
  policy: "Policy compliance",
  action: "Action control",
  protection: "Customer protection",
  privacy: "Privacy",
  security: "Security",
  escalation: "Escalation reliability",
  accuracy: "Factual accuracy",
  resilience: "Operational resilience",
  consistency: "Consistency",
  explainability: "Explainability",
};

export const STATUS_LABEL: Record<FindingStatus, string> = {
  open: "Open",
  accepted: "Accepted risk",
  remediated: "Remediated",
  wont_fix: "Will not fix",
};

export function recTone(r: Recommendation): string {
  switch (r) {
    case "approved":
      return "text-pass";
    case "conditional":
      return "text-high";
    case "rejected":
    case "revalidation":
      return "text-critical";
    case "in_review":
      return "text-medium";
    default:
      return "text-muted";
  }
}

export function recBg(r: Recommendation): string {
  switch (r) {
    case "approved":
      return "bg-pass/15 text-pass";
    case "conditional":
      return "bg-high/15 text-high";
    case "rejected":
    case "revalidation":
      return "bg-critical/15 text-critical";
    case "in_review":
      return "bg-medium/15 text-medium";
    default:
      return "bg-elevated text-muted";
  }
}

export function sevTone(s: Severity): string {
  switch (s) {
    case "critical":
      return "text-critical";
    case "high":
      return "text-high";
    case "medium":
      return "text-medium";
    case "low":
      return "text-low";
  }
}

export function sevBg(s: Severity): string {
  switch (s) {
    case "critical":
      return "bg-critical/15 text-critical";
    case "high":
      return "bg-high/15 text-high";
    case "medium":
      return "bg-medium/15 text-medium";
    case "low":
      return "bg-low/15 text-low";
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-HK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-HK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function pct(n: number): string {
  return `${Math.round(n)}%`;
}

export function hk(n: number): string {
  return `HK$${n.toLocaleString("en-HK")}`;
}
