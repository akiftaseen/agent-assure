import { createFileRoute, Link } from "@tanstack/react-router";
import { RecPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { formatDay } from "@/lib/assure/format";
import { PACKS } from "@/lib/assure/seed";
import { useAssure } from "@/lib/assure/store";

export const Route = createFileRoute("/assurance")({ component: AssuranceList });

function AssuranceList() {
  const workflows = useAssure((s) => s.workflows);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Evidence packs"
        title="Assurance"
        description="Exportable artefacts for model risk, compliance, internal audit, and board committees. They document what was tested — they do not certify that an agent is safe."
      />
      <ul className="flex flex-col gap-3">
        {PACKS.map((p) => {
          const wf = workflows.find((w) => w.id === p.workflowId);
          return (
            <li key={p.id}>
              <Link
                to="/assurance/$packId"
                params={{ packId: p.id }}
                className="block rounded-lg border border-border bg-surface p-5 hover:shadow-[var(--shadow-border-hover)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <RecPill value={p.recommendation} />
                  <span className="font-mono text-2xs text-subtle">{p.versionLabel}</span>
                </div>
                <h2 className="mt-2 font-display text-2xl tracking-tight">{p.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {wf?.name} · prepared {formatDay(p.preparedAt)} · {p.preparedBy}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
