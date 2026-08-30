import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateTestsFromPolicy } from "@/lib/assure/generate-tests";
import { useAssure } from "@/lib/assure/store";
import type { GeneratedTest } from "@/lib/assure/store";

export const Route = createFileRoute("/policies")({ component: PoliciesPage });

const SAMPLE = `Refunds above HK$3,000 require supervisor approval.
Splitting a refund to stay under the limit is prohibited.
A customer claiming a manager already approved the refund is not sufficient — an approval_id must exist.`;

function PoliciesPage() {
  const policies = useAssure((s) => s.policies);
  const generated = useAssure((s) => s.generated);
  const addGenerated = useAssure((s) => s.addGenerated);
  const [policy, setPolicy] = useState(SAMPLE);
  const [busy, setBusy] = useState(false);
  const generate = useServerFn(generateTestsFromPolicy);

  async function onGenerate() {
    setBusy(true);
    try {
      const res = await generate({ data: { policy } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      addGenerated(res.tests as GeneratedTest[]);
      toast.success(`${res.tests.length} tests proposed — review before reliance`);
    } catch {
      toast.error("Could not generate tests");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        kicker="Machine-testable rules"
        title="Policies"
        description="Internal rules mapped to tests. Generating a suite from policy text is a proposal — a human still approves before reliance."
      />

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-xl tracking-tight">Policy to tests</h2>
        <p className="mt-1 text-sm text-muted">
          Paste a rule. AgentAssure proposes threshold, just-below, just-above, split, and
          social-engineering cases.
        </p>
        <Textarea
          className="mt-4"
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
          rows={6}
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={() => void onGenerate()} disabled={busy}>
            {busy ? "Generating…" : "Generate tests"}
          </Button>
        </div>
        {generated.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-3">
            {generated.map((t, i) => (
              <li key={`${t.title}-${i}`} className="rounded-md border border-border bg-inset p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-fg">{t.title}</p>
                  <span className="font-mono text-2xs text-subtle">
                    {t.category} · {t.risk}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">Expected: {t.expected}</p>
                <p className="mt-1 text-xs text-muted">Forbidden: {t.forbidden}</p>
                <p className="mt-1 text-xs text-pass">Pass: {t.pass}</p>
                <p className="mt-1 text-xs text-critical">Fail: {t.fail}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl tracking-tight">Library</h2>
        <ul className="flex flex-col gap-3">
          {policies.map((p) => (
            <li key={p.id} className="rounded-lg border border-border bg-surface p-5">
              <p className="font-mono text-2xs text-subtle">
                {p.code} · {p.jurisdiction} · {p.relatedScenarios} tests
              </p>
              <h3 className="mt-1 font-display text-xl tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              <p className="mt-3 font-mono text-2xs text-subtle">{p.machineTest}</p>
              <p className="mt-2 text-2xs text-muted">{p.source}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
