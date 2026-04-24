import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/lookup")({
  component: LookupPage,
});

function LookupPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-09 · Direct blockchain validation"
        title="Direct lookup"
        description="Query the smart contract by credential ID, CID, or holder wallet. Result comes straight from the immutable ledger."
      />

      <Card className="p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Credential ID, CID, or 0x wallet address" className="flex-1 font-mono text-sm" />
          <Button className="bg-navy text-primary-foreground hover:bg-navy/90">
            <Search className="mr-2 h-4 w-4" /> Lookup
          </Button>
        </div>
      </Card>

      <div className="mt-6">
        <EmptyState
          icon={<ShieldCheck className="h-7 w-7" />}
          title="Awaiting query"
          description="Enter a reference above. The result will appear here with issuer, holder, status, IPFS metadata, and the issuing block."
        />
      </div>
    </>
  );
}