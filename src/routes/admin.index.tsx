import { createFileRoute, Link } from "@tanstack/react-router";
import { FilePlus2, ListChecks, Ban, FileEdit, ArrowRight, ScrollText, ShieldAlert, Activity } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  return (
    <>
      <PageHeader
        eyebrow="Console overview"
        title="Welcome back, Registrar"
        description="Issue new credentials, manage your institution's records, and keep the registry accurate — every action is sealed on-chain."
      />

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <Stat icon={<ScrollText className="h-4 w-4" />} label="Credentials issued" value="—" hint="Connect wallet to load" />
        <Stat icon={<ShieldAlert className="h-4 w-4" />} label="Active revocations" value="—" hint="On-chain" />
        <Stat icon={<Activity className="h-4 w-4" />} label="Updates this month" value="—" hint="From contract events" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Action to="/admin/issue" icon={<FilePlus2 className="h-5 w-5" />} title="Issue Credential" desc="Create a new credential, upload to IPFS, and anchor on Ethereum." />
        <Action to="/admin/manage" icon={<ListChecks className="h-5 w-5" />} title="Manage Credentials" desc="Search by student, view status, drill into any record." />
        <Action to="/admin/revoke" icon={<Ban className="h-5 w-5" />} title="Revoke" desc="Permanently mark a fraudulent or erroneous credential as revoked." />
        <Action to="/admin/update" icon={<FileEdit className="h-5 w-5" />} title="Update Data" desc="Correct typos or dates — old CIDs are preserved for audit." />
      </div>
    </>
  );
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-gold">{icon}</span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-3 font-serif-display text-3xl text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

function Action({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="group p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-navy group-hover:bg-gradient-gold">
          {icon}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
      <h3 className="mt-4 font-serif-display text-lg text-navy">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <Button asChild variant="link" className="mt-3 h-auto p-0 text-navy">
        <Link to={to as "/admin/issue"}>Open →</Link>
      </Button>
    </Card>
  );
}