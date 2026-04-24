import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/regulator/institutions")({
  component: InstitutionsPage,
});

function InstitutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-14 · Authorize institutions"
        title="Accredited institution registry"
        description="Add a new university to the on-chain registry. Once authorized, the institution can issue and manage credentials."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
        <Card className="p-7 shadow-soft">
          <h3 className="font-serif-display text-lg text-navy">Register a new institution</h3>
          <form className="mt-5 space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">University name</Label>
              <Input className="mt-1.5" placeholder="Stanford University" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Issuer wallet</Label>
              <Input className="mt-1.5 font-mono" placeholder="0x…" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Accreditation reference</Label>
              <Input className="mt-1.5" placeholder="ACR-2024-018" />
            </div>
            <Button disabled className="w-full bg-navy text-primary-foreground hover:bg-navy/90">
              <Plus className="mr-2 h-4 w-4" /> Authorize institution
            </Button>
          </form>
        </Card>

        <Card className="p-7 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif-display text-lg text-navy">Registered institutions</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9" />
            </div>
          </div>

          <div className="mt-6">
            <EmptyState
              icon={<Building2 className="h-7 w-7" />}
              title="No institutions registered"
              description="Once you add universities, they appear in this list with their wallet, accreditation reference, and a button to suspend issuance rights."
            />
          </div>
        </Card>
      </div>
    </>
  );
}