import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-28 w-full rounded-sm border border-border bg-inset px-3 py-2 text-sm text-fg placeholder:text-subtle",
      "transition-[box-shadow,border-color] duration-150",
      "focus-visible:outline-none focus-visible:border-border-strong",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
