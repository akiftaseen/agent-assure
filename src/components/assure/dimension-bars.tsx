import type { DimensionScore } from "@/lib/assure/types";
import { cn } from "@/lib/utils";

export function DimensionBars({ items }: { items: DimensionScore[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((d) => (
        <li key={d.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="text-xs text-muted">{d.label}</span>
            <span className="tabular font-mono text-xs text-fg">
              {d.score}
              {typeof d.delta === "number" ? (
                <span
                  className={cn(
                    "ml-2 text-subtle",
                    d.delta < 0 && "text-critical",
                    d.delta > 0 && "text-pass",
                  )}
                >
                  {d.delta > 0 ? "+" : ""}
                  {d.delta}
                </span>
              ) : null}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className={cn(
                "h-full rounded-full",
                d.score >= 90 ? "bg-pass" : d.score >= 80 ? "bg-fg" : d.score >= 70 ? "bg-high" : "bg-critical",
              )}
              style={{ width: `${d.score}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
