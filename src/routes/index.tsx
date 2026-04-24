import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ShieldCheck, Wallet, QrCode, Link2,
  GraduationCap, Lock, Sparkles, FileCheck2,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CredLedger — Your Degrees, On-Chain" },
      { name: "description", content: "Own your academic credentials. Share them instantly. Verified on Ethereum, stored on IPFS." },
      { property: "og:title", content: "CredLedger — Your Degrees, On-Chain" },
      { property: "og:description", content: "Own your academic credentials. Share them instantly. Verified on Ethereum." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.2fr,1fr] md:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3 w-3" /> Built on Ethereum & IPFS
            </span>
            <h1 className="mt-6 font-serif-display text-5xl font-semibold leading-tight md:text-6xl">
              Your degrees,
              <br />
              <span className="text-gold">verifiably yours.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
              CredLedger gives graduates a permanent, portable record of every academic credential —
              issued by your university, sealed on-chain, shareable in one click.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-gold text-navy hover:opacity-90">
                <Link to="/credentials">
                  Open My Wallet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                <Link to="/share">How sharing works</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-gold" /> Tamper-proof</span>
              <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-gold" /> Wallet-owned</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Trustless verification</span>
            </div>
          </div>

          {/* Diploma card mock */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/20 blur-2xl" aria-hidden />
            <Card className="relative rotate-2 border-accent/30 bg-card p-8 shadow-elegant">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-navy">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  <span className="font-serif-display text-lg">Stanford University</span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  Verified
                </span>
              </div>
              <hr className="my-5 border-border" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Awarded to</p>
              <p className="font-serif-display text-2xl text-navy">Ada Lovelace</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Degree</p>
              <p className="text-navy">B.Sc. Computer Science · Honors</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Conferred</p>
              <p className="text-navy">June 14, 2024</p>
              <hr className="my-5 border-border" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground truncate">0xA1b2…f9E0</span>
                <span className="flex items-center gap-1 text-gold"><FileCheck2 className="h-3.5 w-3.5" /> On-chain</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Why CredLedger</p>
          <h2 className="mt-3 text-4xl font-semibold text-navy">Designed for graduates first</h2>
          <p className="mt-4 text-muted-foreground">
            Three things every graduate deserves: ownership, privacy, and proof that holds up
            anywhere in the world.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Wallet className="h-5 w-5" />}
            title="Owned by your wallet"
            desc="Connect MetaMask and instantly see every credential issued to your address — across institutions and years."
          />
          <Feature
            icon={<Link2 className="h-5 w-5" />}
            title="Share with one link"
            desc="Generate a verification link or QR code for any credential. Recipients verify directly against the blockchain."
          />
          <Feature
            icon={<Shield2 />}
            title="Selective disclosure"
            desc="Reveal only what you choose. Cryptographic proofs let you confirm authenticity without exposing private data."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold text-navy">From convocation to verified, in seconds</h2>
          </div>
          <ol className="mt-16 grid gap-8 md:grid-cols-3">
            <Step n="01" title="Connect your wallet" desc="Sign in with MetaMask. CredLedger reads your credentials directly from the smart contract." />
            <Step n="02" title="Pick a credential" desc="Browse degrees, certificates, and transcripts. Each one is anchored to an immutable IPFS record." />
            <Step n="03" title="Share or prove" desc="Send a link, print a QR, or generate a zero-knowledge proof. Verifiers check it on-chain — no university call required." />
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Card className="overflow-hidden border-0 bg-gradient-hero p-12 text-primary-foreground shadow-elegant">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-serif-display text-3xl md:text-4xl">Carry your credentials, everywhere.</h2>
              <p className="mt-3 max-w-xl text-primary-foreground/80">
                A single wallet. Every diploma you've earned. Always one tap away from being verified.
              </p>
            </div>
            <Button asChild size="lg" className="bg-gradient-gold text-navy hover:opacity-90">
              <Link to="/credentials">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="group border-border/70 bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-elegant">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-navy transition-colors group-hover:bg-gradient-gold">
        {icon}
      </div>
      <h3 className="font-serif-display text-xl text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </Card>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <li className="relative rounded-xl border border-border/70 bg-card p-7 shadow-soft">
      <span className="font-serif-display text-4xl text-gold">{n}</span>
      <h3 className="mt-3 font-serif-display text-xl text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </li>
  );
}

function Shield2() {
  return <ShieldCheck className="h-5 w-5" />;
}
