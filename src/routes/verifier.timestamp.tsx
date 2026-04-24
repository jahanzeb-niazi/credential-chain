import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/timestamp")({
  component: TimestampPage,
});

function TimestampPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-12 · Timestamp verification"
        title="When was this credential issued?"
        description="Pulls the Ethereum block timestamp for the issuance transaction. Block timestamps are immutable and cannot be backdated."
      />

      <Card className="p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Credential ID or CID" className="flex-1 font-mono text-sm" />
          <Button className="bg-navy text-primary-foreground hover:bg-navy/90">Resolve timestamp</Button>
        </div>
      </Card>

      <Card className="mt-6 p-10 text-center shadow-soft">
        <Clock className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Block timestamp</p>
        <p className="mt-2 font-serif-display text-4xl text-navy">— : — : — UTC</p>
        <p className="mt-1 text-sm text-muted-foreground">Block #— · Tx 0x…</p>
        <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">
          The Ethereum protocol enforces monotonic block timestamps. Once written, this value is part of
          the global consensus state — universities cannot rewrite it after the fact.
        </p>
      </Card>
    </>
  );
}