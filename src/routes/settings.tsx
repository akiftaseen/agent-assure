import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { ORG } from "@/lib/assure/seed";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Workspace"
        title="Settings"
        description="This preview workspace is a Harbour Trust Model Risk evaluation. Tenant isolation, encryption, and retention are described here as the product contract — they are not a live bank integration."
      />

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-xl tracking-tight">Organisation</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Row k="Legal name" v={ORG.legalName} />
          <Row k="Licence" v={ORG.licence} />
          <Row k="Programme" v={ORG.programme} />
          <Row k="Jurisdiction" v={ORG.jurisdiction} />
          <Row k="Classification" v={ORG.classification} />
          <Row k="Reviewer" v={`${ORG.reviewer} · ${ORG.reviewerRole}`} />
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-xl tracking-tight">Integration</h2>
        <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
          <li>
            <span className="text-fg">REST adapter.</span> POST a scenario, receive the agent
            response and tool-call trace. Sandbox tools are substituted for CRM, OTP, refunds and
            freeze.
          </li>
          <li>
            <span className="text-fg">Trace upload.</span> Import historical prompts, tool calls and
            outputs for replay.
          </li>
          <li>
            <span className="text-fg">No production accounts.</span> Evaluation never mutates a real
            customer record.
          </li>
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-xl tracking-tight">Privacy and security</h2>
        <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-muted">
          <li>Prefer synthetic customers. Production traces are redacted before retention.</li>
          <li>Customer information is not used to train models.</li>
          <li>Role-limited access; evaluation artefacts are classified Internal.</li>
          <li>Deterministic validators are authoritative; LLM judges are advisory.</li>
        </ul>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-2xs uppercase tracking-wider text-subtle">{k}</dt>
      <dd className="mt-1 text-fg">{v}</dd>
    </div>
  );
}
