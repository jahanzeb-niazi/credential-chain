import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Search } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/")({
  component: VerifierHome,
});

function VerifierHome() {
  return (
    <>
      <PageHeader
        eyebrow="Trustless verification"
        title="Verify any credential, in seconds"
        description="Paste a credential link, CID, or token ID. CredLedger queries the Ethereum smart contract directly — you don't need to contact the issuing institution."
      />

      <Card className="bg-gradient-hero p-10 text-primary-foreground shadow-elegant">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Quick verify</p>
        <h2 className="mt-2 font-serif-display text-3xl">Paste a credential reference</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="https://credledger.app/v/… or bafy… or 0x…"
            className="flex-1 border-white/20 bg-white/10 font-mono text-sm text-primary-foreground placeholder:text-primary-foreground/50"
          />
          <Button className="bg-gradient-gold text-navy hover:opacity-90">
            <Search className="mr-2 h-4 w-4" /> Verify
          </Button>
        </div>
        <p className="mt-3 text-xs text-primary-foreground/70">
          Verification is read-only. No wallet connection required.
        </p>
      </Card>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Pillar icon={<ShieldCheck className="h-5 w-5" />} title="Direct chain query" body="Reads straight from the issuer contract — no third party in the loop." />
        <Pillar icon={<ShieldCheck className="h-5 w-5" />} title="Status & history" body="See whether the credential is active, revoked, or has been updated." />
        <Pillar icon={<ShieldCheck className="h-5 w-5" />} title="Block-stamped" body="Issuance time is the Ethereum block timestamp — cannot be backdated." />
      </div>
    </>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="p-6 shadow-soft">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-navy">{icon}</span>
      <h3 className="mt-3 font-serif-display text-lg text-navy">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Card>
  );
}