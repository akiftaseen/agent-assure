import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { ConnectAgent } from "@/components/assure/connect-agent";
import { RecPill, SevPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ORG } from "@/lib/assure/seed";
import { formatDay } from "@/lib/assure/format";
import { useAssure } from "@/lib/assure/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Portfolio });

function Portfolio() {
  const workflows = useAssure((s) => s.workflows);
  const findings = useAssure((s) => s.findings);
  const navigate = useNavigate();
  const startRun = useAssure((s) => s.startRun);

  const openCritical = findings.filter((f) => f.severity === "critical" && f.status === "open").length;
  const reval = workflows.filter((w) => w.recommendation === "revalidation");
  const cs = workflows.find((w) => w.id === "wf-cs-svc");

  function runNow(workflowId: string) {
    const id = startRun(workflowId);
    void navigate({ to: "/runs/$runId", params: { runId: id } });
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        kicker={`${ORG.legalName} · ${ORG.programme}`}
        title="Assurance portfolio"
        description="Independent evidence of how financial agents behave — where they fail, what changed, and what residual risk remains. Not a certification."
        actions={
          <ConnectAgent
            trigger={
              <Button>
                <Plus className="size-4" />
                Register agent
              </Button>
            }
          />
        }
      />

      <section className="aa-enter grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Workflows" value={String(workflows.length)} />
        <Stat label="Open critical" value={String(openCritical)} tone="critical" />
        <Stat
          label="Last CS run"
          value={cs ? `${cs.passCount.toLocaleString()} pass` : "—"}
          hint={cs ? `${cs.failCount} fail` : undefined}
        />
        <Stat label="Jurisdiction" value="Hong Kong" hint="HKMA · SFC · PDPO" />
      </section>

      {reval.length > 0 ? (
        <aside className="aa-enter-2 rounded-lg border border-critical/30 bg-critical/5 px-5 py-4">
          <p className="font-mono text-2xs uppercase tracking-wider text-critical">
            Revalidation required
          </p>
          <p className="mt-1 text-sm text-fg">
            {reval[0].name} picked up a silent model-provider change. Production use is suspended
            until the suite is re-run and Model Risk signs the pack.
          </p>
          <Link
            to="/workflows/$workflowId"
            params={{ workflowId: reval[0].id }}
            className="mt-3 inline-flex items-center gap-1 text-sm text-fg hover:underline"
          >
            Open workflow
            <ArrowRight className="size-3.5" />
          </Link>
        </aside>
      ) : null}

      <section className="aa-enter-3">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight">Workflows</h2>
          <p className="text-xs text-subtle">{workflows.length} in this workspace</p>
        </div>
        <ul className="flex flex-col gap-3">
          {workflows.map((w) => (
            <li key={w.id}>
              <Link
                to="/workflows/$workflowId"
                params={{ workflowId: w.id }}
                className="block rounded-lg border border-border bg-surface p-5 transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-2xs text-subtle">{w.code}</span>
                      <SevPill value={w.risk} />
                      <RecPill value={w.recommendation} />
                    </div>
                    <h3 className="mt-2 font-display text-2xl tracking-tight">{w.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {w.kind} · {w.owner}
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-4 text-right sm:min-w-56">
                    <Metric label="Scenarios" value={w.scenarioCount.toLocaleString()} />
                    <Metric label="Fail" value={String(w.failCount)} warn={w.failCount > 0} />
                    <Metric label="Coverage" value={`${w.coveragePercent}%`} />
                  </dl>
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-muted">{w.residualRisk}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-2xs text-subtle">
                    {w.productionVersion
                      ? `Production ${w.productionVersion}`
                      : "Not in production"}
                    {w.lastRunAt ? ` · last run ${formatDay(w.lastRunAt)}` : ""}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-fg">
                    Open
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight">Open critical findings</h2>
          <Link to="/findings" className="text-xs text-muted hover:text-fg">
            All findings
          </Link>
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {findings
            .filter((f) => f.severity === "critical" && f.status === "open")
            .map((f) => (
              <li key={f.id}>
                <Link
                  to="/findings/$findingId"
                  params={{ findingId: f.id }}
                  className="flex flex-col gap-1 px-5 py-4 hover:bg-elevated/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-mono text-2xs text-subtle">
                      {f.code} · {f.workflowName} {f.agentVersion}
                    </p>
                    <p className="mt-1 text-sm text-fg">{f.title}</p>
                  </div>
                  <p className="font-mono text-2xs text-critical">{f.frequency}</p>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      {cs ? (
        <section className="flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl tracking-tight">Re-run Customer Servicing v17</p>
            <p className="mt-1 text-sm text-muted">
              Replay the 1,284-scenario suite against the sandbox. Failing cases stay in the
              regression pack.
            </p>
          </div>
          <Button variant="secondary" onClick={() => runNow(cs.id)}>
            Run evaluation
          </Button>
        </section>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "critical";
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-4">
      <p className="font-mono text-2xs uppercase tracking-wider text-subtle">{label}</p>
      <p className={cn("mt-2 font-display text-2xl tracking-tight", tone === "critical" && "text-critical")}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-2xs text-muted">{hint}</p> : null}
    </div>
  );
}

function Metric({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-2xs text-subtle">{label}</dt>
      <dd className={cn("mt-1 font-mono text-sm tabular", warn && "text-critical")}>{value}</dd>
    </div>
  );
}
