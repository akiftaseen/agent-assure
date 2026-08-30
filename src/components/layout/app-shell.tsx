import { Link, useRouterState } from "@tanstack/react-router";
import {
  ClipboardList,
  FileText,
  FolderOpen,
  Menu,
  Settings,
  Shield,
  Waypoints,
} from "lucide-react";
import { useState } from "react";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ORG } from "@/lib/assure/seed";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Portfolio", icon: FolderOpen, exact: true },
  { to: "/findings", label: "Findings", icon: Shield },
  { to: "/scenarios", label: "Scenarios", icon: Waypoints },
  { to: "/policies", label: "Policies", icon: ClipboardList },
  { to: "/assurance", label: "Assurance", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-3 rounded-sm px-3 text-sm transition-colors duration-150",
              active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
            )}
          >
            <Icon className="size-4" strokeWidth={1.6} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandBlock() {
  return (
    <Link to="/" className="flex items-center gap-3 px-1">
      <Mark className="size-8 shrink-0" />
      <div className="min-w-0">
        <p className="font-display text-lg leading-none tracking-tight">AgentAssure</p>
        <p className="mt-1 truncate font-mono text-2xs uppercase tracking-wider text-subtle">
          {ORG.name}
        </p>
      </div>
    </Link>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-6 pt-5">
        <BrandBlock />
      </div>
      <div className="flex-1 px-3">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <div className="border-t border-border px-4 py-4">
        <p className="font-mono text-2xs uppercase tracking-wider text-subtle">
          {ORG.classification}
        </p>
        <p className="mt-1 text-2xs text-muted">
          {ORG.reviewerRole}
          <br />
          {ORG.reviewer}
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-surface lg:block">
        <SidebarBody />
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur-sm lg:hidden">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        <BrandBlock />
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-60">
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
