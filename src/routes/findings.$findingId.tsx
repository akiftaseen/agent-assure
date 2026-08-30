import { createFileRoute, Link } from "@tanstack/react-router";
import { ConversationReplay } from "@/components/assure/conversation-replay";
import { SevPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL, TAXONOMY_LABEL, formatDate } from "@/lib/assure/format";
import { useAssure } from "@/lib/assure/store";

export const Route = createFileRoute("/findings/$findingId")({
  component: FindingDetail,
});

function FindingDetail() {
  const { findingId } = Route.useParams();
  const finding = useAssure((s) => s.findings.find((f) => f.id === findingId));

  if (!finding) {
    return (
      <div>
        <PageHeader title="Finding not found" />
        <Link to="/findings" className="text-sm text-muted hover:text-fg">
          Back to findings
        </Link>
      </div>
    );
  }

  const failTurn = finding.conversation.find((t) => t.id === finding.failTurnId);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={`${finding.code} · ${finding.workflowName} ${finding.agentVersion}`}
        title={finding.title}
        description={finding.summary}
        actions={
          <Button asChild variant="secondary">
            <Link to="/workflows/$workflowId" params={{ workflowId: finding.workflowId }}>
              Workflow
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <SevPill value={finding.severity} />
        <span className="inline-flex items-center rounded-full bg-elevated px-2 py-0.5 text-2xs text-muted">
          {TAXONOMY_LABEL[finding.taxonomy]}
        </span>
        <span className="inline-flex items-center rounded-full bg-elevated px-2 py-0.5 text-2xs text-muted">
          {STATUS_LABEL[finding.status]}
        </span>
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        <Meta label="Frequency" value={finding.frequency} />
        <Meta label="Reproducibility" value={`${Math.round(finding.reproducibility * 100)}%`} />
        <Meta label="Judge confidence" value={`${Math.round(finding.confidence * 100)}%`} />
        <Meta label="Recorded" value={formatDate(finding.createdAt)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Block title="Expected">
          <p>{finding.expected}</p>
        </Block>
        <Block title="Observed" tone="critical">
          <p>{finding.observed}</p>
          {failTurn ? (
            <p className="mt-2 font-mono text-2xs text-subtle">
              Diverged at turn {finding.failTurnId}
              {failTurn.toolCall ? ` · ${failTurn.toolCall.name}` : ""}
            </p>
          ) : null}
        </Block>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <h2 className="mb-4 font-display text-2xl tracking-tight">Failure replay</h2>
          <ConversationReplay turns={finding.conversation} failTurnId={finding.failTurnId} />
        </div>
        <aside className="flex flex-col gap-4">
          <Block title="Synthetic customer">
            <p className="font-medium text-fg">{finding.customer.name}</p>
            <p className="mt-1">{finding.customer.persona}</p>
            <p className="mt-2 font-mono text-2xs text-subtle">
              {finding.customer.age > 0 ? `${finding.customer.age} · ` : ""}
              {finding.customer.language}
              <br />
              {finding.customer.district}
            </p>
            <p className="mt-2">{finding.customer.riskNotes}</p>
          </Block>
          <Block title="Controls">
            <ul className="flex flex-col gap-1">
              {finding.controls.map((c) => (
                <li key={c} className="font-mono text-xs">
                  {c}
                </li>
              ))}
            </ul>
          </Block>
          {finding.financialImpact ? (
            <Block title="Impact">{finding.financialImpact}</Block>
          ) : null}
          <Block title="Residual">{finding.residual}</Block>
        </aside>
      </section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3">
      <p className="font-mono text-2xs uppercase tracking-wider text-subtle">{label}</p>
      <p className="mt-1 text-sm text-fg">{value}</p>
    </div>
  );
}

function Block({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "critical";
}) {
  return (
    <div
      className={
        tone === "critical"
          ? "rounded-md border border-critical/30 bg-critical/5 p-4 text-sm text-muted"
          : "rounded-md border border-border bg-surface p-4 text-sm text-muted"
      }
    >
      <p className="mb-2 font-mono text-2xs uppercase tracking-wider text-subtle">{title}</p>
      {children}
    </div>
  );
}
