import { Link } from "@tanstack/react-router";
import { GraduationCap, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-accent">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-serif-display text-xl font-semibold tracking-tight text-navy">
            CredLedger
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" activeOptions={{ exact: true }} className="text-sm text-muted-foreground transition-colors hover:text-navy [&.active]:text-navy [&.active]:font-medium">
            Home
          </Link>
          <Link to="/credentials" className="text-sm text-muted-foreground transition-colors hover:text-navy [&.active]:text-navy [&.active]:font-medium">
            My Credentials
          </Link>
          <Link to="/share" className="text-sm text-muted-foreground transition-colors hover:text-navy [&.active]:text-navy [&.active]:font-medium">
            Share
          </Link>
        </nav>
        <Button variant="default" size="sm" className="bg-navy text-primary-foreground hover:bg-navy/90">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <p className="font-serif-display text-base text-navy">CredLedger</p>
        <p>© {new Date().getFullYear()} CredLedger. Verifiable credentials on Ethereum.</p>
      </div>
    </footer>
  );
}