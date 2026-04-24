import { createFileRoute } from "@tanstack/react-router";
import { Upload, Hash } from "lucide-react";
import { PageHeader } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/issue")({
  component: IssuePage,
});

function IssuePage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-01 · Issue credential"
        title="Issue a new credential"
        description="Fill in the student's details. CredLedger uploads metadata to IPFS and records the resulting CID on Ethereum via the issuer contract."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <Card className="p-8 shadow-soft">
          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Student full name" placeholder="e.g. Ada Lovelace" />
              <Field label="Student wallet address" placeholder="0x…" mono />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Degree type</Label>
                <Select>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select degree" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bsc">B.Sc.</SelectItem>
                    <SelectItem value="ba">B.A.</SelectItem>
                    <SelectItem value="msc">M.Sc.</SelectItem>
                    <SelectItem value="phd">Ph.D.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="Field of study" placeholder="Computer Science" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Graduation date" type="date" />
              <Field label="Honors / GPA" placeholder="First Class" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Additional notes (IPFS metadata)</Label>
              <Textarea className="mt-1.5" rows={4} placeholder="Thesis title, advisor, transcript reference…" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">Gas estimate appears after wallet connect.</p>
              <Button disabled className="bg-navy text-primary-foreground hover:bg-navy/90">
                <Upload className="mr-2 h-4 w-4" /> Upload & Mint
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-gold">Pipeline</p>
            <h3 className="mt-2 font-serif-display text-lg text-navy">What happens on submit</h3>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><span className="text-navy">1.</span> Metadata serialized → IPFS</li>
              <li><span className="text-navy">2.</span> CID returned by IPFS gateway</li>
              <li><span className="text-navy">3.</span> <code className="text-gold">issueCredential(student, cid)</code> on chain</li>
              <li><span className="text-navy">4.</span> Tx confirmed → student wallet receives credential</li>
            </ol>
          </Card>
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-2 text-navy"><Hash className="h-4 w-4 text-gold" />
              <p className="font-serif-display">CID preview</p>
            </div>
            <p className="mt-2 break-all rounded-md bg-secondary/60 p-3 font-mono text-xs text-muted-foreground">
              bafy… (generated after IPFS upload)
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}

function Field({ label, placeholder, type = "text", mono }: { label: string; placeholder?: string; type?: string; mono?: boolean }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input type={type} placeholder={placeholder} className={`mt-1.5 ${mono ? "font-mono" : ""}`} />
    </div>
  );
}