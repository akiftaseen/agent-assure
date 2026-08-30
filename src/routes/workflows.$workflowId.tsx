import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CoverageMap } from "@/components/assure/coverage-map";
import { DimensionBars } from "@/components/assure/dimension-bars";
import { RecPill, SevPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDay, RECOMMENDATION_LABEL, TAXONOMY_LABEL } from "@/lib/assure/format";
import { useAssure } from "@/lib/assure/store";
import { PACKS } from "@/lib/assure/seed";

export const Route = createFileRoute("/workflows/$workflowId")({
  component: WorkflowPage,
});

function WorkflowPage() {
  const { workflowId } = Route.useParams();
  const workflows = useAssure((s) => s.workflows);
  const allFindings = useAssure((s) => s.findings);
  const allScenarios = useAssure((s) => s.scenarios);
  const startRun = useAssure((s) => s.startRun);
  const navigate = useNavigate();

  const workflow = workflows.find((w) => w.id === workflowId);
  const findings = allFindings.filter((f) => f.workflowId === workflowId);
  const scenarios = allScenarios.filter((sc) => sc.workflowId === workflowId);
  const pack = PACKS.find((p) => p.workflowId === workflowId);

  if (!workflow) {
    return (
      <div>
        <PageHeader title="Workflow not found" />
        <Link to="/" className="text-sm text-muted hover:text-fg">
          Back to portfolio
        </Link>
      </div>
    );
  }

  function runNow() {
    const id = startRun(workflowId);
    void navigate({ to: "/runs/$runId", params: { runId: id } });
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={`${workflow.code} · ${workflow.jurisdiction}`}
        title={workflow.name}
        description={workflow.contract.purpose}
        actions={
          <>
            {pack ? (
              <Button asChild variant="secondary">
                <Link to="/assurance/$packId" params={{ packId: pack.id }}>
                  Assurance pack
                </Link>
              </Button>
            ) : null}
            <Button onClick={runNow}>Run evaluation</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <SevPill value={workflow.risk} />
        <RecPill value={workflow.recommendation} />
        <span className="font-mono text-2xs text-subtle">
          {workflow.productionVersion
            ? `Production ${workflow.productionVersion}`
            : "Not in production"}
          {workflow.lastRunAt ? ` · ${formatDay(workflow.lastRunAt)}` : ""}
        </span>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Scenarios" value={workflow.scenarioCount.toLocaleString()} />
        <Kpi label="Pass" value={workflow.passCount.toLocaleString()} />
        <Kpi label="Fail" value={String(workflow.failCount)} warn />
        <Kpi label="Coverage" value={`${workflow.coveragePercent}%`} />
      </section>

      <aside className="rounded-lg border border-border bg-surface p-5">
        <p className="font-mono text-2xs uppercase tracking-wider text-subtle">Residual risk</p>
        <p className="mt-2 text-sm leading-relaxed text-fg">{workflow.residualRisk}</p>
        <p className="mt-3 text-xs text-muted">
          Recommendation: {RECOMMENDATION_LABEL[workflow.recommendation]}. This is evidence for a
          deployment decision, not a guarantee.
        </p>
      </aside>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="suites">Suites</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-display text-xl tracking-tight">Behaviour dimensions</h3>
              {workflow.dimensions.length > 0 ? (
                <DimensionBars items={workflow.dimensions} />
              ) : (
                <p className="text-sm text-muted">No evaluation yet.</p>
              )}
            </div>
            <div>
              <h3 className="mb-4 font-display text-xl tracking-tight">Control mapping</h3>
              {workflow.controls.length === 0 ? (
                <p className="text-sm text-muted">Controls attach after the first suite.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {workflow.controls.map((c) => (
                    <li key={c.internalPolicy} className="rounded-md border border-border p-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-mono text-2xs text-subtle">{c.internalPolicy}</p>
                        <p className="font-mono text-2xs tabular text-muted">
                          {c.pass}/{c.tests} pass
                          {c.fail ? <span className="text-critical"> · {c.fail} fail</span> : null}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-fg">{c.control}</p>
                      <p className="mt-1 text-2xs text-muted">{c.regulatory}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contract">
          <div className="grid gap-6 lg:grid-cols-2">
            <ListCard title="Allowed" items={workflow.contract.allowed} />
            <ListCard title="Forbidden" items={workflow.contract.forbidden} tone="critical" />
            <ListCard title="Requires human" items={workflow.contract.requiresHuman} tone="high" />
            <ListCard title="Disclosures" items={workflow.contract.disclosures} />
          </div>
          <div className="mt-6 rounded-md border border-border bg-surface p-5">
            <p className="font-mono text-2xs uppercase tracking-wider text-subtle">Escalation</p>
            <p className="mt-2 text-sm text-fg">{workflow.contract.escalation}</p>
          </div>
          <div className="mt-6">
            <p className="mb-3 font-mono text-2xs uppercase tracking-wider text-subtle">Tools</p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {workflow.contract.tools.map((t) => (
                <li
                  key={t.name}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-mono text-xs text-fg">{t.name}</p>
                    <p className="text-xs text-muted">{t.purpose}</p>
                  </div>
                  <SevPill value={t.risk} />
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 font-mono text-2xs text-subtle">Endpoint · {workflow.endpoint}</p>
        </TabsContent>

        <TabsContent value="coverage">
          {workflow.coverage.length > 0 ? (
            <CoverageMap cells={workflow.coverage} />
          ) : (
            <p className="text-sm text-muted">Coverage appears after the first evaluation.</p>
          )}
        </TabsContent>

        <TabsContent value="versions">
          <ol className="flex flex-col gap-3">
            {workflow.versions.map((v) => (
              <li key={v.id} className="rounded-md border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-xl">{v.label}</span>
                  <RecPill value={v.recommendation} />
                  {v.production ? (
                    <span className="text-2xs text-pass">In production</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted">{v.changeNotes}</p>
                <p className="mt-2 font-mono text-2xs text-subtle">
                  {v.model} · prompt {v.promptHash} · temp {v.temperature} · {v.codeVersion}
                  <br />
                  {v.scenarioCount.toLocaleString()} scenarios · {v.passCount.toLocaleString()} pass ·{" "}
                  {v.failCount} fail · {formatDay(v.evaluatedAt)}
                </p>
              </li>
            ))}
            {workflow.versions.length === 0 ? (
              <p className="text-sm text-muted">No versions recorded.</p>
            ) : null}
          </ol>
        </TabsContent>

        <TabsContent value="findings">
          {findings.length === 0 ? (
            <p className="text-sm text-muted">No findings on this workflow.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {findings.map((f) => (
                <li key={f.id}>
                  <Link
                    to="/findings/$findingId"
                    params={{ findingId: f.id }}
                    className="block rounded-md border border-border px-4 py-3 hover:bg-elevated/40"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-2xs text-subtle">{f.code}</span>
                      <SevPill value={f.severity} />
                      <span className="text-2xs text-muted">{TAXONOMY_LABEL[f.taxonomy]}</span>
                    </div>
                    <p className="mt-1 text-sm">{f.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="suites">
          {scenarios.length === 0 ? (
            <p className="text-sm text-muted">
              No authored scenarios in this workspace slice. Register the agent and generate from
              policy to seed a suite.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {scenarios.map((sc) => (
                <li key={sc.id} className="rounded-md border border-border px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-2xs text-subtle">{sc.id}</span>
                    <SevPill value={sc.risk} />
                    {sc.lastResult ? (
                      <span
                        className={
                          sc.lastResult === "fail" ? "text-2xs text-critical" : "text-2xs text-pass"
                        }
                      >
                        {sc.lastResult}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-fg">{sc.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {sc.persona} · escalate {sc.requiredEscalation ? "required" : "not required"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3">
      <p className="font-mono text-2xs uppercase tracking-wider text-subtle">{label}</p>
      <p className={`mt-1 font-display text-2xl tabular ${warn ? "text-critical" : "text-fg"}`}>
        {value}
      </p>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "critical" | "high";
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <p className="font-mono text-2xs uppercase tracking-wider text-subtle">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={
              tone === "critical"
                ? "border-l-2 border-critical/60 pl-3 text-sm text-fg"
                : tone === "high"
                  ? "border-l-2 border-high/60 pl-3 text-sm text-fg"
                  : "border-l-2 border-border-strong pl-3 text-sm text-fg"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
