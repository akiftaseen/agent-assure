import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { RecPill } from "@/components/assure/status-pill";
import { RECOMMENDATION_LABEL, TAXONOMY_LABEL, formatDay } from "@/lib/assure/format";
import { ORG, PACKS } from "@/lib/assure/seed";
import { useAssure } from "@/lib/assure/store";

export const Route = createFileRoute("/assurance/$packId")({
  component: PackPage,
});

function PackPage() {
  const { packId } = Route.useParams();
  const pack = PACKS.find((p) => p.id === packId);
  const workflows = useAssure((s) => s.workflows);
  const allFindings = useAssure((s) => s.findings);
  const workflow = workflows.find((w) => w.id === pack?.workflowId);
  const findings = allFindings.filter(
    (f) => f.workflowId === pack?.workflowId && f.runId === workflow?.lastRunId,
  );

  if (!pack || !workflow) {
    return (
      <div>
        <PageHeader title="Pack not found" />
        <Link to="/assurance" className="text-sm text-muted hover:text-fg">
          All packs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Assurance pack"
        title={pack.title}
        description="Print or archive this artefact. It is evidence of an evaluation, not a certificate."
        actions={
          <Button variant="secondary" onClick={() => window.print()}>
            Print
          </Button>
        }
      />

      <article className="paper-doc rounded-lg px-6 py-10 text-paper-ink sm:px-12 sm:py-14">
        <header className="border-b border-paper-ink/15 pb-6">
          <p className="font-mono text-2xs uppercase tracking-[0.18em] text-paper-muted">
            {ORG.legalName} · Model Risk Management · {ORG.classification}
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">{pack.title}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <RecPill value={pack.recommendation} />
            <span className="font-mono text-2xs text-paper-muted">
              {formatDay(pack.preparedAt)} · {pack.preparedBy}
            </span>
          </div>
        </header>

        <section className="mt-8">
          <H>Executive summary</H>
          <p className="text-sm leading-relaxed">
            {workflow.name} {pack.versionLabel} was evaluated against contract {workflow.code}.{" "}
            {workflow.scenarioCount.toLocaleString()} scenarios were executed in a synthetic
            sandbox. Result: {RECOMMENDATION_LABEL[pack.recommendation]}. {workflow.failCount}{" "}
            scenarios failed. {workflow.criticalOpen} critical findings remain open.
          </p>
          <p className="mt-3 text-sm leading-relaxed">{workflow.residualRisk}</p>
        </section>

        <section className="mt-8">
          <H>Scope</H>
          <p className="text-sm leading-relaxed">{pack.scope}</p>
        </section>

        <section className="mt-8">
          <H>Results</H>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Cell k="Scenarios" v={workflow.scenarioCount.toLocaleString()} />
            <Cell k="Pass" v={workflow.passCount.toLocaleString()} />
            <Cell k="Fail" v={String(workflow.failCount)} />
            <Cell k="Coverage" v={`${workflow.coveragePercent}%`} />
          </dl>
        </section>

        <section className="mt-8">
          <H>Critical and high findings</H>
          <ul className="flex flex-col gap-3">
            {findings
              .filter((f) => f.severity === "critical" || f.severity === "high")
              .map((f) => (
                <li key={f.id} className="border-l-2 border-paper-ink/20 pl-3">
                  <p className="font-mono text-2xs text-paper-muted">
                    {f.code} · {f.severity} · {TAXONOMY_LABEL[f.taxonomy]}
                  </p>
                  <p className="text-sm">{f.title}</p>
                  <p className="text-xs text-paper-muted">{f.frequency}</p>
                </li>
              ))}
          </ul>
        </section>

        <section className="mt-8">
          <H>Control mapping</H>
          <ul className="flex flex-col gap-2 text-sm">
            {workflow.controls.map((c) => (
              <li key={c.internalPolicy}>
                <span className="font-mono text-2xs">{c.internalPolicy}</span>
                {" — "}
                {c.control}. {c.pass}/{c.tests} pass.
                <span className="block text-xs text-paper-muted">{c.regulatory}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <H>Residual risks</H>
          <ul className="list-disc pl-5 text-sm leading-relaxed">
            {pack.residualRisks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <H>Human review</H>
          <ul className="flex flex-col gap-2 text-sm">
            {pack.approvals.map((a) => (
              <li key={a.role}>
                <span className="font-medium">{a.role}</span> · {a.name} · {a.decision}
                <span className="block font-mono text-2xs text-paper-muted">{formatDay(a.at)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <H>Limitations</H>
          <ul className="list-disc pl-5 text-sm leading-relaxed">
            {pack.limitations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <footer className="mt-10 border-t border-paper-ink/15 pt-4">
          <p className="text-xs leading-relaxed text-paper-muted">
            AgentAssure does not certify that an agent is safe, compliant, or fit for purpose. This
            pack records the evaluation that was performed, the behaviour that was observed, the
            controls that were tested, and the residual risk accepted by the named reviewers. It is
            intended for internal model risk, compliance, audit, and committee use.
          </p>
        </footer>
      </article>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 font-display text-xl tracking-tight">{children}</h3>;
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-2xs uppercase tracking-wider text-paper-muted">{k}</dt>
      <dd className="mt-1 font-display text-2xl">{v}</dd>
    </div>
  );
}
