import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ScrollText, ShieldCheck, ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "My Credentials — CredLedger" },
      { name: "description", content: "View all academic credentials linked to your wallet, on-chain." },
      { property: "og:title", content: "My Credentials — CredLedger" },
      { property: "og:description", content: "View all academic credentials linked to your wallet, on-chain." },
    ],
  }),
  component: CredentialsPage,
});

function CredentialsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">UC-06 · Owned credentials</p>
            <h1 className="mt-2 text-4xl font-semibold text-navy">My Credentials</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Every degree and certificate tied to your wallet, fetched directly from the blockchain.
            </p>
          </div>
          <Button asChild className="bg-navy text-primary-foreground hover:bg-navy/90">
            <Link to="/share">
              Share a credential <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="border-dashed border-border bg-card/60 p-12 text-center shadow-soft">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <ScrollText className="h-8 w-8 text-navy" />
          </div>
          <h2 className="font-serif-display text-2xl text-navy">No credentials linked yet</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Connect the wallet your university issued credentials to. We'll pull every record from the
            smart contract and display them here.
          </p>
          <Button className="mt-6 bg-gradient-gold text-navy hover:opacity-90">
            Connect Wallet
          </Button>

          <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
            <Step icon={<ShieldCheck className="h-4 w-4" />} title="On-chain proof" desc="Records loaded from Ethereum." />
            <Step icon={<GraduationCap className="h-4 w-4" />} title="All institutions" desc="Multiple universities, one wallet." />
            <Step icon={<ScrollText className="h-4 w-4" />} title="IPFS metadata" desc="Tamper-evident credential content." />
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

function Step({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/50 p-4">
      <div className="flex items-center gap-2 text-navy">
        <span className="text-gold">{icon}</span>
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}