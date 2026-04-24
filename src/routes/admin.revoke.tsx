import { createFileRoute } from "@tanstack/react-router";
import { Ban, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/revoke")({
  component: RevokePage,
});

function RevokePage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-03 · Revoke credential"
        title="Revoke a credential"
        description="This action is permanent and recorded on-chain. Revoked credentials remain visible in audit history with a revocation timestamp."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <Card className="p-8 shadow-soft">
          <form className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Credential ID or CID</Label>
              <Input className="mt-1.5 font-mono" placeholder="bafy… or token id" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Reason for revocation</Label>
              <Textarea className="mt-1.5" rows={5} placeholder="e.g. Issued in error / fraudulent submission / replaced by corrected record" />
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4" /> This cannot be undone
              </div>
              <p className="mt-1 text-destructive/80">
                Revocation writes to the blockchain. The reason is hashed and stored alongside the revocation event.
              </p>
            </div>
            <div className="flex justify-end border-t border-border pt-5">
              <Button disabled variant="destructive">
                <Ban className="mr-2 h-4 w-4" /> Submit Revocation
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-soft">
          <p className="text-xs uppercase tracking-wider text-gold">On-chain effect</p>
          <h3 className="mt-2 font-serif-display text-lg text-navy">After confirmation</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>• Credential status flips to <span className="text-destructive">REVOKED</span></li>
            <li>• Block timestamp recorded</li>
            <li>• Future verifications return revoked + reason</li>
            <li>• Cannot be re-issued under same ID</li>
          </ul>
        </Card>
      </div>
    </>
  );
}