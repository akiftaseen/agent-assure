import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SevPill } from "@/components/assure/status-pill";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { STATUS_LABEL, TAXONOMY_LABEL } from "@/lib/assure/format";
import { useAssure } from "@/lib/assure/store";
import type { Severity } from "@/lib/assure/types";

export const Route = createFileRoute("/findings")({ component: FindingsPage });

const SEV: Severity[] = ["critical", "high", "medium", "low"];

function FindingsPage() {
  const findings = useAssure((s) => s.findings);
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<Severity | "all">("all");

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      if (sev !== "all" && f.severity !== sev) return false;
      if (!q.trim()) return true;
      const hay = `${f.code} ${f.title} ${f.workflowName} ${TAXONOMY_LABEL[f.taxonomy]}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [findings, q, sev]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Evidence"
        title="Findings"
        description="Failures are structured: taxonomy, severity, reproducibility, the exact turn, and the control that should have held."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search code, title, workflow"
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-1">
          <FilterChip active={sev === "all"} onClick={() => setSev("all")}>
            All
          </FilterChip>
          {SEV.map((s) => (
            <FilterChip key={s} active={sev === s} onClick={() => setSev(s)}>
              {s}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="font-mono text-2xs text-subtle">{filtered.length} findings</p>

      <ul className="flex flex-col gap-2">
        {filtered.map((f) => (
          <li key={f.id}>
            <Link
              to="/findings/$findingId"
              params={{ findingId: f.id }}
              className="block rounded-md border border-border bg-surface px-4 py-4 transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-2xs text-subtle">{f.code}</span>
                <SevPill value={f.severity} />
                <span className="text-2xs text-muted">{TAXONOMY_LABEL[f.taxonomy]}</span>
                <span className="text-2xs text-subtle">{STATUS_LABEL[f.status]}</span>
              </div>
              <p className="mt-2 text-sm text-fg">{f.title}</p>
              <p className="mt-1 text-xs text-muted">
                {f.workflowName} {f.agentVersion} · {f.frequency} · reproducibility{" "}
                {Math.round(f.reproducibility * 100)}%
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-8 rounded-full bg-fg px-3 text-xs text-accent-fg"
          : "h-8 rounded-full bg-elevated px-3 text-xs text-muted hover:text-fg"
      }
    >
      {children}
    </button>
  );
}
