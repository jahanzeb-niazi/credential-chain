import { createFileRoute } from "@tanstack/react-router";
import { Landmark, Plus, ShieldAlert } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/regulator/government")({
  component: GovernmentPage,
});

function GovernmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-13 · Government root"
        title="Onboard a regulator"
        description="Government acts as the root authority. Adding a regulator gives that wallet permission to manage the accredited institution registry."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <Card className="p-8 shadow-soft">
          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Regulatory body name" placeholder="National Higher Education Commission" />
              <Field label="Jurisdiction" placeholder="e.g. Country / State" />
            </div>
            <Field label="Regulator wallet address" placeholder="0x…" mono />
            <Field label="Official contact" placeholder="contact@regulator.gov" />
            <div className="flex items-center justify-between border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">Requires the government root wallet to sign.</p>
              <Button disabled className="bg-navy text-primary-foreground hover:bg-navy/90">
                <Plus className="mr-2 h-4 w-4" /> Register Regulator
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 text-navy">
              <Landmark className="h-4 w-4 text-gold" />
              <p className="font-serif-display">Root authority</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The government can suspend or remove regulators at any time. All changes are emitted as
              on-chain events for public inspection.
            </p>
          </Card>
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-4 w-4" />
              <p className="font-medium">Sensitive action</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Adding a regulator delegates significant power. Verify the wallet address through an
              out-of-band channel before signing.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 font-serif-display text-xl text-navy">Active regulators</h3>
        <EmptyState
          icon={<Landmark className="h-7 w-7" />}
          title="No regulators registered yet"
          description="Once you register a regulator, they appear here with their jurisdiction, wallet, and registration block."
        />
      </div>
    </>
  );
}

function Field({ label, placeholder, mono }: { label: string; placeholder?: string; mono?: boolean }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input placeholder={placeholder} className={`mt-1.5 ${mono ? "font-mono" : ""}`} />
    </div>
  );
}