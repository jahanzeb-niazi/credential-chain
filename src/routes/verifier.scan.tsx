import { createFileRoute } from "@tanstack/react-router";
import { ScanLine, Camera, Upload } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/scan")({
  component: ScanPage,
});

function ScanPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-10 · Scan QR codes"
        title="Scan a credential QR"
        description="Point your camera at a diploma or upload an image. CredLedger decodes the QR, extracts the credential ID, and queries the chain."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <Card className="flex aspect-video items-center justify-center border-dashed border-border bg-navy/95 p-0 text-primary-foreground/70 shadow-elegant">
          <div className="text-center">
            <ScanLine className="mx-auto h-16 w-16 text-gold" />
            <p className="mt-4 font-serif-display text-lg">Camera viewfinder</p>
            <p className="mt-1 text-xs text-primary-foreground/60">
              Camera permission required to start scanning
            </p>
            <Button className="mt-5 bg-gradient-gold text-navy hover:opacity-90">
              <Camera className="mr-2 h-4 w-4" /> Start Camera
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 shadow-soft">
            <h3 className="font-serif-display text-lg text-navy">Or upload an image</h3>
            <p className="mt-1 text-sm text-muted-foreground">PNG, JPG, or PDF containing the QR code.</p>
            <Button variant="outline" className="mt-4 w-full">
              <Upload className="mr-2 h-4 w-4" /> Choose file
            </Button>
          </Card>
          <Card className="p-6 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-gold">Possible outcomes</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Valid — credential active on chain</li>
              <li className="flex items-center gap-2 text-destructive"><span className="h-2 w-2 rounded-full bg-destructive" /> Revoked — with reason & timestamp</li>
              <li className="flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Not found — never issued</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}