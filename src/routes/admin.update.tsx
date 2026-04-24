import { createFileRoute } from "@tanstack/react-router";
import { FileEdit, History } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/update")({
  component: UpdatePage,
});

function UpdatePage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-04 · Update credential"
        title="Correct credential data"
        description="Updates create a new IPFS CID. The original CID is preserved on-chain so the audit trail remains intact."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <Card className="p-8 shadow-soft">
          <form className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Credential ID</Label>
              <Input className="mt-1.5 font-mono" placeholder="bafy… or token id" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Field to update</Label>
                <Input className="mt-1.5" placeholder="student_name" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">New value</Label>
                <Input className="mt-1.5" placeholder="Corrected value" />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Reason / change note</Label>
              <Input className="mt-1.5" placeholder="Spelling correction per registrar review #1234" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">A new CID is generated and linked to the existing credential ID.</p>
              <Button disabled className="bg-navy text-primary-foreground hover:bg-navy/90">
                <FileEdit className="mr-2 h-4 w-4" /> Submit Update
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center gap-2 text-navy"><History className="h-4 w-4 text-gold" />
            <p className="font-serif-display">Revision history</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Every previous CID is queryable from the contract. Verifiers can compare any two revisions side-by-side.
          </p>
          <div className="mt-4 space-y-2 text-xs">
            <div className="rounded-md border border-border bg-secondary/50 p-3 font-mono text-muted-foreground">v1 · bafy…  (current)</div>
            <div className="rounded-md border border-dashed border-border p-3 font-mono text-muted-foreground/60">v2 · pending</div>
          </div>
        </Card>
      </div>
    </>
  );
}