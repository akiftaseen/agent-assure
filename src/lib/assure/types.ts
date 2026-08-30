export type Recommendation =
  | "approved"
  | "conditional"
  | "rejected"
  | "in_review"
  | "revalidation"
  | "draft";

export type Severity = "critical" | "high" | "medium" | "low";

export type FindingStatus = "open" | "accepted" | "remediated" | "wont_fix";

export type Taxonomy =
  | "authority"
  | "privacy"
  | "policy"
  | "hallucination"
  | "procedure"
  | "escalation"
  | "tool"
  | "fraud"
  | "inconsistency"
  | "bias"
  | "resilience"
  | "financial_loss"
  | "security";

export type ScenarioCategory =
  | "happy_path"
  | "ambiguous"
  | "conflicting"
  | "policy_edge"
  | "fraud"
  | "prompt_injection"
  | "sensitive_data"
  | "tool_failure"
  | "stale_data"
  | "multi_step"
  | "escalation"
  | "emotional"
  | "authority"
  | "repeated";

export type DimensionKey =
  | "policy"
  | "action"
  | "protection"
  | "privacy"
  | "security"
  | "escalation"
  | "accuracy"
  | "resilience"
  | "consistency"
  | "explainability";

export type Speaker = "customer" | "agent" | "tool" | "policy" | "system";

export type AnnotationKind = "fail" | "warn" | "ok" | "escalate" | "forbidden";

export interface ToolCall {
  name: string;
  args: Record<string, string | number | boolean | null>;
  result?: string;
  forbidden?: boolean;
  durationMs?: number;
}

export interface TurnAnnotation {
  kind: AnnotationKind;
  label: string;
}

export interface ConversationTurn {
  id: string;
  speaker: Speaker;
  text: string;
  toolCall?: ToolCall;
  annotation?: TurnAnnotation;
  at: string;
}

export interface SyntheticCustomer {
  id: string;
  name: string;
  persona: string;
  age: number;
  language: string;
  district: string;
  riskNotes: string;
}

export interface DimensionScore {
  key: DimensionKey;
  label: string;
  score: number;
  delta?: number;
}

export interface CoverageCell {
  capability: string;
  percent: number;
  scenarios: number;
  gaps: string[];
}

export interface ControlMapping {
  control: string;
  internalPolicy: string;
  regulatory: string;
  tests: number;
  pass: number;
  fail: number;
}

export interface PolicyRule {
  id: string;
  code: string;
  title: string;
  body: string;
  jurisdiction: string;
  source: string;
  machineTest: string;
  relatedScenarios: number;
  relatedFindings: string[];
}

export interface Scenario {
  id: string;
  workflowId: string;
  title: string;
  category: ScenarioCategory;
  risk: Severity;
  persona: string;
  startingState: string;
  expectedActions: string[];
  forbiddenActions: string[];
  requiredEscalation: boolean;
  passConditions: string[];
  failConditions: string[];
  regulatory: string[];
  lastResult?: "pass" | "fail" | "error";
}

export interface Finding {
  id: string;
  code: string;
  workflowId: string;
  workflowName: string;
  agentVersion: string;
  runId: string;
  title: string;
  summary: string;
  taxonomy: Taxonomy;
  severity: Severity;
  status: FindingStatus;
  frequency: string;
  confidence: number;
  reproducibility: number;
  financialImpact?: string;
  failTurnId: string;
  expected: string;
  observed: string;
  residual: string;
  controls: string[];
  conversation: ConversationTurn[];
  customer: SyntheticCustomer;
  createdAt: string;
}

export interface AgentVersion {
  id: string;
  label: string;
  model: string;
  promptHash: string;
  tools: string[];
  temperature: number;
  codeVersion: string;
  recommendation: Recommendation;
  evaluatedAt: string;
  scenarioCount: number;
  passCount: number;
  failCount: number;
  production: boolean;
  changeNotes: string;
}

export interface EvaluationRun {
  id: string;
  workflowId: string;
  versionLabel: string;
  status: "queued" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  scenarioCount: number;
  passCount: number;
  failCount: number;
  errorCount: number;
  coveragePercent: number;
  recommendation: Recommendation;
  log: { t: string; msg: string; kind?: "ok" | "fail" | "info" }[];
}

export interface WorkflowContract {
  purpose: string;
  allowed: string[];
  forbidden: string[];
  requiresHuman: string[];
  disclosures: string[];
  escalation: string;
  inputs: string[];
  tools: { name: string; purpose: string; risk: Severity }[];
}

export interface Workflow {
  id: string;
  code: string;
  name: string;
  kind: string;
  owner: string;
  risk: Severity;
  recommendation: Recommendation;
  productionVersion?: string;
  currentVersion: string;
  lastRunId?: string;
  lastRunAt?: string;
  scenarioCount: number;
  passCount: number;
  failCount: number;
  criticalOpen: number;
  highOpen: number;
  coveragePercent: number;
  jurisdiction: string;
  endpoint: string;
  contract: WorkflowContract;
  versions: AgentVersion[];
  dimensions: DimensionScore[];
  coverage: CoverageCell[];
  controls: ControlMapping[];
  residualRisk: string;
}

export interface AssurancePack {
  id: string;
  workflowId: string;
  versionLabel: string;
  title: string;
  preparedAt: string;
  preparedBy: string;
  recommendation: Recommendation;
  scope: string;
  limitations: string[];
  residualRisks: string[];
  approvals: { role: string; name: string; decision: string; at: string }[];
}

export interface OrgProfile {
  name: string;
  legalName: string;
  licence: string;
  programme: string;
  jurisdiction: string;
  classification: string;
  reviewer: string;
  reviewerRole: string;
}
