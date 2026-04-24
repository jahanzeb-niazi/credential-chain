import { createFileRoute } from "@tanstack/react-router";
import { History, FilePlus2, FileEdit, Ban } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/audit")({
  component: AuditPage,
});

function AuditPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-11 · Audit history review"
        title="Credential lifecycle"
        description="Every event ever recorded against a credential — issuance, updates, revocation — pulled from on-chain logs."
      />

      <Card className="p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Credential ID or CID" className="flex-1 font-mono text-sm" />
          <Button className="bg-navy text-primary-foreground hover:bg-navy/90">Load history</Button>
        </div>
      </Card>

      <Card className="mt-6 p-8 shadow-soft">
        <h3 className="font-serif-display text-lg text-navy">Example timeline</h3>
        <p className="text-sm text-muted-foreground">Real events appear here once a credential is queried.</p>

        <ol className="relative mt-8 space-y-8 border-l border-border pl-6">
          <Event icon={<FilePlus2 className="h-4 w-4" />} title="Issued" meta="Block #19,283,401 · 2024-06-14 10:22 UTC" body="Issued by 0xUNI…1a2b · CID bafy…h3" />
          <Event icon={<FileEdit className="h-4 w-4" />} title="Updated" meta="Block #19,491,002 · 2024-08-02 14:11 UTC" body="Field corrected: graduation_date → 2024-06-15" />
          <Event icon={<Ban className="h-4 w-4" />} title="Revoked" meta="Block #19,612,884 · 2024-09-19 09:00 UTC" body="Reason: superseded by replacement credential" tone="destructive" />
        </ol>

        <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          <History className="h-4 w-4 text-gold" />
          Each event is an Ethereum log entry — independently verifiable on any block explorer.
        </div>
      </Card>
    </>
  );
}

function Event({ icon, title, meta, body, tone }: { icon: React.ReactNode; title: string; meta: string; body: string; tone?: "destructive" }) {
  const color = tone === "destructive" ? "text-destructive" : "text-navy";
  const dot = tone === "destructive" ? "bg-destructive" : "bg-gold";
  return (
    <li className="relative">
      <span className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ${dot} text-navy`}>{icon}</span>
      <p className={`font-serif-display text-base ${color}`}>{title}</p>
      <p className="text-xs text-muted-foreground">{meta}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </li>
  );
}