import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, Link2, Shield, Copy, Download } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share & Verify — CredLedger" },
      { name: "description", content: "Generate verification links, QR codes, and zero-knowledge proofs for your credentials." },
      { property: "og:title", content: "Share & Verify — CredLedger" },
      { property: "og:description", content: "Generate verification links, QR codes, and ZK proofs for your credentials." },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const [revealName, setRevealName] = useState(true);
  const [revealDate, setRevealDate] = useState(true);
  const [revealGrade, setRevealGrade] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">UC-07 · UC-08 · Sharing & proofs</p>
          <h1 className="mt-2 text-4xl font-semibold text-navy">Share with confidence</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Decide exactly what an employer or institution sees. Generate a verification link, a QR
            code, or a cryptographic proof — all backed by the on-chain record.
          </p>
        </div>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="bg-secondary">
            <TabsTrigger value="link"><Link2 className="mr-2 h-4 w-4" />Verification Link</TabsTrigger>
            <TabsTrigger value="qr"><QrCode className="mr-2 h-4 w-4" />QR Code</TabsTrigger>
            <TabsTrigger value="proof"><Shield className="mr-2 h-4 w-4" />Cryptographic Proof</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-8">
            <Card className="p-8 shadow-soft">
              <h2 className="font-serif-display text-2xl text-navy">Generate a verification link</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Anyone with this link can verify the credential against the blockchain — without
                contacting your university.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Input readOnly value="https://credledger.app/v/—" className="bg-secondary/50 font-mono text-sm" />
                <Button disabled className="bg-navy text-primary-foreground"><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Select a credential from <span className="text-navy">My Credentials</span> to enable.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="mt-8">
            <Card className="grid gap-8 p-8 shadow-soft md:grid-cols-[auto,1fr]">
              <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/40">
                <QrCode className="h-20 w-20 text-muted-foreground/60" />
              </div>
              <div>
                <h2 className="font-serif-display text-2xl text-navy">Printable QR code</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Embed on physical diplomas, business cards, or PDF resumes. Verifiers scan and
                  query the blockchain in seconds.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button disabled className="bg-navy text-primary-foreground"><Download className="mr-2 h-4 w-4" />Download PNG</Button>
                  <Button variant="outline" disabled>Download SVG</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="proof" className="mt-8">
            <Card className="p-8 shadow-soft">
              <h2 className="font-serif-display text-2xl text-navy">Selective disclosure proof</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Prove you hold a valid degree without revealing more than necessary.
              </p>
              <div className="mt-6 space-y-4">
                <ProofToggle label="Reveal full name" checked={revealName} onChange={setRevealName} />
                <ProofToggle label="Reveal graduation date" checked={revealDate} onChange={setRevealDate} />
                <ProofToggle label="Reveal grade / GPA" checked={revealGrade} onChange={setRevealGrade} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Recipient (optional)</Label>
                  <Input placeholder="recipient@employer.com" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Expires in</Label>
                  <Input placeholder="7 days" className="mt-1" />
                </div>
              </div>
              <Button disabled className="mt-6 bg-gradient-gold text-navy hover:opacity-90">
                <Shield className="mr-2 h-4 w-4" />Generate Proof
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProofToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/50 px-4 py-3">
      <span className="text-sm text-navy">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}