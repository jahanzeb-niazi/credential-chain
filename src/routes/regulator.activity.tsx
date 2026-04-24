import { createFileRoute } from "@tanstack/react-router";
import { Activity, FilePlus2, FileEdit, Ban, Flag } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/regulator/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-15 · Audit institutional activity"
        title="Institution activity log"
        description="Pick an institution and review every credential event ever emitted by their wallet — issuances, updates, revocations, all timestamped."
      />

      <Card className="p-6 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
          <Select>
            <SelectTrigger><SelectValue placeholder="Select institution" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none" disabled>No institutions registered</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Filter by date range or event type" />
          <Button className="bg-navy text-primary-foreground hover:bg-navy/90">Load activity</Button>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat icon={<FilePlus2 className="h-4 w-4" />} label="Issued" value="—" />
        <Stat icon={<FileEdit className="h-4 w-4" />} label="Updated" value="—" />
        <Stat icon={<Ban className="h-4 w-4" />} label="Revoked" value="—" />
        <Stat icon={<Activity className="h-4 w-4" />} label="Compliance score" value="—" />
      </div>

      <Card className="mt-6 p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-lg text-navy">Event stream</h3>
          <Button variant="outline" size="sm" disabled>
            <Flag className="mr-2 h-4 w-4" /> Flag institution
          </Button>
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Event stream will populate once an institution is selected. Flagging or suspending issuance rights is a single
          on-chain transaction signed by the regulator wallet.
        </div>
      </Card>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-gold">{icon}</span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-3 font-serif-display text-2xl text-navy">{value}</p>
    </Card>
  );
}