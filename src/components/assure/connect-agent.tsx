import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssure } from "@/lib/assure/store";
import type { Workflow } from "@/lib/assure/types";

const DISCOVERED = [
  "get_customer_profile",
  "search_products",
  "update_contact_phone",
  "create_service_ticket",
  "prepare_refund",
  "escalate_to_human",
];

export function ConnectAgent({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Contact Information Agent");
  const [endpoint, setEndpoint] = useState("https://agent-sandbox.example.hk/v1/invoke");
  const addWorkflow = useAssure((s) => s.addWorkflow);
  const navigate = useNavigate();

  function reset() {
    setStep(0);
    setName("Contact Information Agent");
    setEndpoint("https://agent-sandbox.example.hk/v1/invoke");
  }

  function connect() {
    const id = `wf-new-${Date.now()}`;
    const wf: Workflow = {
      id,
      code: "CS-NEW-05",
      name,
      kind: "Customer-facing servicing",
      owner: "AI Product",
      risk: "high",
      recommendation: "draft",
      currentVersion: "v0",
      scenarioCount: 0,
      passCount: 0,
      failCount: 0,
      criticalOpen: 0,
      highOpen: 0,
      coveragePercent: 0,
      jurisdiction: "Hong Kong",
      endpoint,
      residualRisk: "Not yet evaluated. Draft contract proposed from discovered tools.",
      contract: {
        purpose: "Newly registered servicing agent. Contract is a proposal pending human approval.",
        allowed: [
          "Retrieve authenticated customer profile",
          "Search published products",
          "Create service tickets",
          "Escalate to a human officer",
        ],
        forbidden: [
          "Transfer funds",
          "Change beneficial owner",
          "Disclose other customers",
          "Disable account controls",
        ],
        requiresHuman: ["Contact mutation", "Refunds", "Failed verification"],
        disclosures: ["Identify as an AI agent"],
        escalation: "Escalate when confidence is low or a control is near its boundary.",
        inputs: ["Authenticated session", "Natural-language request"],
        tools: DISCOVERED.map((n) => ({
          name: n,
          purpose: "Discovered from adapter handshake",
          risk: n.includes("refund") || n.includes("phone") ? "high" : "low",
        })),
      },
      versions: [],
      dimensions: [],
      coverage: [],
      controls: [],
    };
    addWorkflow(wf);
    setOpen(false);
    reset();
    void navigate({ to: "/workflows/$workflowId", params: { workflowId: id } });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register an agent</DialogTitle>
          <DialogDescription>
            Point AgentAssure at a sandbox endpoint. Tools are discovered; a workflow contract is
            proposed. Nothing touches production accounts.
          </DialogDescription>
        </DialogHeader>

        {step === 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-name">Workflow name</Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-ep">REST adapter endpoint</Label>
              <Input
                id="agent-ep"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <p className="text-xs text-muted">
              Adapter contract: POST scenario → receive response and tool-call trace. Sandbox tools
              are substituted for CRM, OTP, refunds and freeze.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-subtle">
              Discovered tools
            </p>
            <ul className="rounded-md border border-border bg-inset p-3 font-mono text-xs text-muted">
              {DISCOVERED.map((t) => (
                <li key={t} className="py-0.5">
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              Proposed contract: enquiry, tickets and escalation allowed. Contact mutation and
              refunds require human approval until a suite is green.
            </p>
          </div>
        )}

        <DialogFooter>
          {step === 0 ? (
            <Button onClick={() => setStep(1)} disabled={!name.trim() || !endpoint.trim()}>
              Discover tools
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={connect}>Register draft workflow</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
