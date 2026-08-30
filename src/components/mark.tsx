import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-fg", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill="#0a0b0c" />
      <circle
        cx="16"
        cy="16"
        r="11.2"
        fill="none"
        stroke="#5d8a6a"
        strokeWidth="2.4"
      />
      <path
        fill="currentColor"
        d="M16 7.6 23.2 24.2h-4.05L16 14.2l-3.15 10H8.8Z"
      />
      <rect x="11.6" y="16.2" width="8.8" height="2.6" fill="currentColor" />
    </svg>
  );
}
