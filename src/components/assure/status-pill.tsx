import { recBg, RECOMMENDATION_LABEL, sevBg, SEVERITY_LABEL } from "@/lib/assure/format";
import type { Recommendation, Severity } from "@/lib/assure/types";
import { cn } from "@/lib/utils";

export function RecPill({ value, className }: { value: Recommendation; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium",
        recBg(value),
        className,
      )}
    >
      {RECOMMENDATION_LABEL[value]}
    </span>
  );
}

export function SevPill({ value, className }: { value: Severity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium",
        sevBg(value),
        className,
      )}
    >
      {SEVERITY_LABEL[value]}
    </span>
  );
}
