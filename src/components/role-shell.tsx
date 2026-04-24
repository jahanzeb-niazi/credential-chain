import { Link, Outlet } from "@tanstack/react-router";
import { GraduationCap, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string; icon: ReactNode };

export function RoleShell({
  role,
  roleLabel,
  items,
  accent = "navy",
}: {
  role: string;
  roleLabel: string;
  items: NavItem[];
  accent?: "navy" | "gold";
}) {
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <Link to="/" className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-accent">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-serif-display text-lg font-semibold text-navy">CredLedger</span>
        </Link>
        <div className="px-6 pt-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Console</p>
          <p className={`mt-1 font-serif-display text-xl ${accent === "gold" ? "text-gold" : "text-navy"}`}>
            {roleLabel}
          </p>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.to === `/${role}` }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-navy [&.active]:bg-navy [&.active]:text-primary-foreground"
            >
              <span className="opacity-80">{it.icon}</span>
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-navy">← Back to home</Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="md:hidden">
            <Link to="/" className="font-serif-display text-lg font-semibold text-navy">CredLedger</Link>
          </div>
          <div className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">
            {roleLabel} · CredLedger
          </div>
          <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy/90">
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </header>
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-gold">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-semibold text-navy md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-soft">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-navy">
        {icon}
      </div>
      <h3 className="font-serif-display text-xl text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}