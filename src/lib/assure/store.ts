import { create } from "zustand";
import { FINDINGS, PACKS, POLICIES, RUNS, SCENARIOS, WORKFLOWS } from "./seed";
import type {
  EvaluationRun,
  Finding,
  PolicyRule,
  Scenario,
  Workflow,
} from "./types";

export interface GeneratedTest {
  title: string;
  category: string;
  risk: string;
  expected: string;
  forbidden: string;
  pass: string;
  fail: string;
}

interface AssureState {
  workflows: Workflow[];
  findings: Finding[];
  runs: EvaluationRun[];
  policies: PolicyRule[];
  scenarios: Scenario[];
  generated: GeneratedTest[];
  liveRunId: string | null;
  addWorkflow: (wf: Workflow) => void;
  addGenerated: (tests: GeneratedTest[]) => void;
  startRun: (workflowId: string) => string;
  tickRun: (runId: string, patch: Partial<EvaluationRun>) => void;
  completeRun: (runId: string) => void;
}

export const useAssure = create<AssureState>((set, get) => ({
  workflows: WORKFLOWS,
  findings: FINDINGS,
  runs: RUNS,
  policies: POLICIES,
  scenarios: SCENARIOS,
  generated: [],
  liveRunId: null,
  addWorkflow: (wf) => set({ workflows: [wf, ...get().workflows] }),
  addGenerated: (tests) => set({ generated: [...tests, ...get().generated] }),
  startRun: (workflowId) => {
    const wf = get().workflows.find((w) => w.id === workflowId);
    const id = `run-live-${Date.now()}`;
    const run: EvaluationRun = {
      id,
      workflowId,
      versionLabel: wf?.currentVersion ?? "dev",
      status: "running",
      startedAt: new Date().toISOString(),
      scenarioCount: wf?.scenarioCount || 200,
      passCount: 0,
      failCount: 0,
      errorCount: 0,
      coveragePercent: 0,
      recommendation: "in_review",
      log: [{ t: clock(), msg: `Evaluation started for ${wf?.name ?? workflowId}`, kind: "info" }],
    };
    set({ runs: [run, ...get().runs], liveRunId: id });
    return id;
  },
  tickRun: (runId, patch) =>
    set({
      runs: get().runs.map((r) => (r.id === runId ? { ...r, ...patch } : r)),
    }),
  completeRun: (runId) => {
    const wf = get().workflows.find(
      (w) => w.id === get().runs.find((r) => r.id === runId)?.workflowId,
    );
    const fail = wf?.failCount ?? 12;
    const total = wf?.scenarioCount || 200;
    const pass = Math.max(0, total - fail);
    set({
      liveRunId: null,
      runs: get().runs.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: "completed",
              completedAt: new Date().toISOString(),
              passCount: pass,
              failCount: fail,
              coveragePercent: wf?.coveragePercent ?? 70,
              recommendation: wf?.recommendation ?? "conditional",
              log: [
                ...r.log,
                {
                  t: clock(),
                  msg: `Complete · ${pass.toLocaleString()} pass / ${fail} fail · ${wf?.recommendation ?? "in_review"}`,
                  kind: fail > 0 ? "fail" : "ok",
                },
              ],
            }
          : r,
      ),
    });
  },
}));

function clock() {
  return new Date().toLocaleTimeString("en-HK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export { PACKS };
