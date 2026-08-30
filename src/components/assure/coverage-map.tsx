import type { CoverageCell } from "@/lib/assure/types";
import { cn } from "@/lib/utils";

export function CoverageMap({ cells }: { cells: CoverageCell[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {cells.map((c) => (
        <li key={c.capability} className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-fg">{c.capability}</span>
              <span className="tabular font-mono text-xs text-muted sm:hidden">{c.percent}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset">
              <div
                className={cn(
                  "h-full rounded-full",
                  c.percent >= 85 ? "bg-pass" : c.percent >= 60 ? "bg-high" : "bg-critical",
                )}
                style={{ width: `${c.percent}%` }}
              />
            </div>
            {c.gaps.length > 0 ? (
              <p className="mt-1 text-2xs text-subtle">Untested: {c.gaps.join(" · ")}</p>
            ) : (
              <p className="mt-1 text-2xs text-subtle">{c.scenarios} scenarios</p>
            )}
          </div>
          <p className="hidden text-right font-mono text-sm tabular text-fg sm:block">{c.percent}%</p>
        </li>
      ))}
    </ul>
  );
}
