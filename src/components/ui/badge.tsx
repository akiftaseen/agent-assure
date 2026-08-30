import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        default: "bg-elevated text-muted",
        pass: "bg-pass/15 text-pass",
        critical: "bg-critical/15 text-critical",
        high: "bg-high/15 text-high",
        medium: "bg-medium/15 text-medium",
        low: "bg-low/15 text-low",
        fg: "bg-fg/10 text-fg",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
