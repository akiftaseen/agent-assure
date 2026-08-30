import type { ConversationTurn } from "@/lib/assure/types";
import { cn } from "@/lib/utils";

const SPEAKER: Record<ConversationTurn["speaker"], string> = {
  customer: "Synthetic customer",
  agent: "Target agent",
  tool: "Sandbox tool",
  policy: "Policy validator",
  system: "Executor",
};

export function ConversationReplay({
  turns,
  failTurnId,
}: {
  turns: ConversationTurn[];
  failTurnId?: string;
}) {
  return (
    <ol className="flex flex-col gap-3">
      {turns.map((t) => {
        const fail = t.id === failTurnId || t.annotation?.kind === "fail";
        return (
          <li
            key={t.id}
            id={`turn-${t.id}`}
            className={cn(
              "rounded-md border p-4",
              fail
                ? "border-critical/40 bg-critical/5"
                : t.annotation?.kind === "warn"
                  ? "border-high/30 bg-high/5"
                  : t.annotation?.kind === "ok"
                    ? "border-pass/25 bg-pass/5"
                    : "border-border bg-surface",
            )}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs uppercase tracking-wider text-subtle">
                  {SPEAKER[t.speaker]}
                </span>
                {t.annotation ? (
                  <span
                    className={cn(
                      "text-2xs",
                      t.annotation.kind === "fail" && "text-critical",
                      t.annotation.kind === "warn" && "text-high",
                      t.annotation.kind === "ok" && "text-pass",
                      t.annotation.kind === "escalate" && "text-medium",
                      t.annotation.kind === "forbidden" && "text-critical",
                    )}
                  >
                    {t.annotation.label}
                  </span>
                ) : null}
              </div>
              <span className="font-mono text-2xs tabular text-subtle">{t.at}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">{t.text}</p>
            {t.toolCall ? (
              <div className="mt-3 rounded-sm bg-inset px-3 py-2 font-mono text-2xs text-muted">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={t.toolCall.forbidden ? "text-critical" : "text-fg"}>
                    {t.toolCall.name}
                  </span>
                  {t.toolCall.forbidden ? <span className="text-critical">forbidden</span> : null}
                  {typeof t.toolCall.durationMs === "number" ? (
                    <span className="text-subtle">{t.toolCall.durationMs} ms</span>
                  ) : null}
                </div>
                <p className="mt-1 text-subtle">
                  {Object.entries(t.toolCall.args)
                    .map(([k, v]) => `${k}=${String(v)}`)
                    .join(" · ")}
                </p>
                {t.toolCall.result ? (
                  <p className="mt-1 text-muted">→ {t.toolCall.result}</p>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
