import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { RecPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/assure/format";
import { useAssure } from "@/lib/assure/store";

export const Route = createFileRoute("/runs/$runId")({ component: RunPage });

const LIVE_LINES = [
  "Attaching synthetic CRM, OTP, refund and freeze sandbox",
  "Happy-path pack · product and profile scenarios",
  "Identity-change adversarial pack",
  "Policy-edge refund pack — including split attempts",
  "Prompt-injection pack — pasted overrides",
  "Scam-marker escalation pack",
  "Deterministic validators on tool calls and amounts",
  "LLM judge on EN / ZH-HK disclosure twins",
  "Coverage engine mapping capabilities",
];

function RunPage() {
  const { runId } = Route.useParams();
  const run = useAssure((s) => s.runs.find((r) => r.id === runId));
  const workflow = useAssure((s) => s.workflows.find((w) => w.id === run?.workflowId));
  const tickRun = useAssure((s) => s.tickRun);
  const completeRun = useAssure((s) => s.completeRun);
  const started = useRef(false);

  useEffect(() => {
    const current = useAssure.getState().runs.find((r) => r.id === runId);
    if (!current || current.status !== "running" || started.current) return;
    started.current = true;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      const line = LIVE_LINES[i - 1];
      const progress = Math.min(100, Math.round((i / LIVE_LINES.length) * 100));
      const prev = useAssure.getState().runs.find((r) => r.id === runId);
      if (!prev) return;
      tickRun(runId, {
        coveragePercent: progress,
        log: [
          ...prev.log,
          {
            t: new Date().toLocaleTimeString("en-HK", { hour12: false }),
            msg: line,
            kind: "info",
          },
        ],
      });
      if (i >= LIVE_LINES.length) {
        window.clearInterval(id);
        completeRun(runId);
      }
    }, 420);
    return () => window.clearInterval(id);
  }, [runId, tickRun, completeRun]);

  if (!run) {
    return (
      <div>
        <PageHeader title="Run not found" />
        <Link to="/" className="text-sm text-muted hover:text-fg">
          Portfolio
        </Link>
      </div>
    );
  }

  const running = run.status === "running";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={`${workflow?.code ?? run.workflowId} · ${run.versionLabel}`}
        title={running ? "Evaluation running" : "Evaluation run"}
        description={
          workflow
            ? `${workflow.name} against the sandbox. Synthetic customers only.`
            : "Sandbox evaluation."
        }
        actions={
          workflow ? (
            <Button asChild variant="secondary">
              <Link to="/workflows/$workflowId" params={{ workflowId: workflow.id }}>
                Workflow
              </Link>
            </Button>
          ) : null
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Status" value={run.status} />
        <Kpi label="Scenarios" value={run.scenarioCount.toLocaleString()} />
        <Kpi label="Pass" value={running ? "—" : run.passCount.toLocaleString()} />
        <Kpi
          label="Fail"
          value={running ? "—" : String(run.failCount)}
          warn={!running && run.failCount > 0}
        />
      </section>

      {running ? (
        <div>
          <div className="mb-2 flex justify-between font-mono text-2xs text-subtle">
            <span className="aa-live">Executing</span>
            <span className="tabular">{run.coveragePercent}%</span>
          </div>
          <Progress value={run.coveragePercent} />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <RecPill value={run.recommendation} />
          <span className="font-mono text-2xs text-subtle">
            Started {formatDate(run.startedAt)}
            {run.completedAt ? ` · completed ${formatDate(run.completedAt)}` : ""}
          </span>
        </div>
      )}

      <section className="rounded-lg border border-border bg-inset p-4">
        <p className="mb-3 font-mono text-2xs uppercase tracking-wider text-subtle">Executor log</p>
        <ol className="flex flex-col gap-1.5 font-mono text-xs">
          {run.log.map((l, i) => (
            <li key={`${l.t}-${i}`} className="flex gap-3">
              <span className="w-24 shrink-0 text-subtle">{l.t}</span>
              <span
                className={
                  l.kind === "fail" ? "text-critical" : l.kind === "ok" ? "text-pass" : "text-muted"
                }
              >
                {l.msg}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {!running && workflow ? (
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/findings">Open findings</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/workflows/$workflowId" params={{ workflowId: workflow.id }}>
              Coverage and contract
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Kpi({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3">
      <p className="font-mono text-2xs uppercase tracking-wider text-subtle">{label}</p>
      <p className={`mt-1 font-display text-2xl capitalize tabular ${warn ? "text-critical" : ""}`}>
        {value}
      </p>
    </div>
  );
}
