import { createFileRoute } from "@tanstack/react-router";
import { Hash, Upload, ArrowDown } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/cid")({
  component: CidPage,
});

function CidPage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-05 · On-chain CID generation"
        title="How CIDs are anchored"
        description="A diagram of the data flow each time a credential is issued or updated."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FlowStep n="1" title="Build metadata" body="Form data is serialised to JSON: name, degree, dates, IPFS-friendly schema." />
        <FlowStep n="2" title="Upload to IPFS" body="The gateway returns a content-addressed CID — any change yields a different CID." icon={<Upload className="h-4 w-4" />} />
        <FlowStep n="3" title="Anchor on-chain" body="Smart contract call records the CID alongside issuer and student address." icon={<Hash className="h-4 w-4" />} />
      </div>

      <div className="my-6 flex justify-center text-muted-foreground">
        <ArrowDown className="h-5 w-5" />
      </div>

      <Card className="p-8 shadow-soft">
        <h3 className="font-serif-display text-xl text-navy">Why this matters</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Because the CID is derived from the file content itself, any tampering with the IPFS document
          would produce a different CID — which would no longer match the on-chain record. This makes
          CredLedger credentials cryptographically tamper-evident without storing private data on chain.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-md bg-navy p-5 text-xs text-primary-foreground">
{`// pseudo-flow
const cid = await ipfs.add(JSON.stringify(metadata));
await contract.issueCredential(studentAddr, cid);
// → emits CredentialIssued(student, cid, blockTimestamp)`}
        </pre>
      </Card>
    </>
  );
}

function FlowStep({ n, title, body, icon }: { n: string; title: string; body: string; icon?: React.ReactNode }) {
  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="font-serif-display text-3xl text-gold">{n}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <h3 className="mt-2 font-serif-display text-lg text-navy">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Card>
  );
}