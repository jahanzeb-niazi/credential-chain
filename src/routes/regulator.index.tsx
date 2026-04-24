import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Landmark, Activity, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/regulator/")({
  component: RegulatorOverview,
});

function RegulatorOverview() {
  return (
    <>
      <PageHeader
        eyebrow="Governance overview"
        title="Trust hierarchy at a glance"
        description="The government registers regulators, regulators authorize universities, universities issue credentials. Every layer is enforced on-chain."
      />

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <Stat label="Regulators" value="—" caption="Registered by government" />
        <Stat label="Accredited institutions" value="—" caption="Active issuers on chain" />
        <Stat label="Suspended issuers" value="—" caption="Issuance rights revoked" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Action to="/regulator/government" icon={<Landmark className="h-5 w-5" />} title="Onboard Regulators" desc="Government adds new regulatory bodies to the ecosystem." />
        <Action to="/regulator/institutions" icon={<Building2 className="h-5 w-5" />} title="Authorize Institutions" desc="Add or suspend universities from the accredited registry." />
        <Action to="/regulator/activity" icon={<Activity className="h-5 w-5" />} title="Audit Activity" desc="Review the full on-chain history of any institution." />
      </div>
    </>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <Card className="p-5 shadow-soft">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-3 font-serif-display text-3xl text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
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
        <Link to={to as "/regulator/institutions"}>Open →</Link>
      </Button>
    </Card>
  );
}