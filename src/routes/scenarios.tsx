import { createFileRoute, Link } from "@tanstack/react-router";
import { SevPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { CATEGORY_LABEL } from "@/lib/assure/format";
import { PERSONAS } from "@/lib/assure/seed";
import { useAssure } from "@/lib/assure/store";

export const Route = createFileRoute("/scenarios")({ component: ScenariosPage });

function ScenariosPage() {
  const scenarios = useAssure((s) => s.scenarios);
  const workflows = useAssure((s) => s.workflows);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        kicker="Library"
        title="Scenarios"
        description="Each case has a starting state, a synthetic customer, required and forbidden actions, and a mapped control. Multi-turn failures are the point — not single prompts."
      />

      <section>
        <h2 className="mb-4 font-display text-2xl tracking-tight">Synthetic customers</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PERSONAS.map((p) => (
            <li key={p.id} className="rounded-md border border-border bg-surface p-4">
              <p className="text-sm text-fg">{p.name}</p>
              <p className="mt-1 text-xs text-muted">{p.persona}</p>
              <p className="mt-2 font-mono text-2xs text-subtle">
                {p.language} · {p.district}
              </p>
              <p className="mt-2 text-xs text-muted">{p.riskNotes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl tracking-tight">Authored cases</h2>
        <ul className="flex flex-col gap-2">
          {scenarios.map((sc) => {
            const wf = workflows.find((w) => w.id === sc.workflowId);
            return (
              <li key={sc.id} className="rounded-md border border-border bg-surface px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-2xs text-subtle">{sc.id}</span>
                  <SevPill value={sc.risk} />
                  <span className="text-2xs text-muted">{CATEGORY_LABEL[sc.category]}</span>
                  {sc.lastResult ? (
                    <span className={sc.lastResult === "fail" ? "text-2xs text-critical" : "text-2xs text-pass"}>
                      last {sc.lastResult}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-fg">{sc.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {wf?.name} · {sc.persona} · {sc.startingState}
                </p>
                <p className="mt-2 text-2xs text-subtle">
                  Forbidden: {sc.forbiddenActions.join(" · ") || "none"}
                </p>
                {wf ? (
                  <Link
                    to="/workflows/$workflowId"
                    params={{ workflowId: wf.id }}
                    className="mt-2 inline-block text-xs text-muted hover:text-fg"
                  >
                    Open workflow
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
