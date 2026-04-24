import { Link } from "@tanstack/react-router";
import { GraduationCap, Wallet, ChevronDown, Building2, ShieldCheck, Landmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground outline-none transition-colors hover:text-navy">
              Consoles <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">Switch role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/credentials"><Users className="mr-2 h-4 w-4 text-gold" /> Student / Graduate</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin"><Building2 className="mr-2 h-4 w-4 text-gold" /> University Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/verifier"><ShieldCheck className="mr-2 h-4 w-4 text-gold" /> Verifier</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/regulator"><Landmark className="mr-2 h-4 w-4 text-gold" /> Regulator / Government</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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