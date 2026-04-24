import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, ScanLine, History, Clock, ShieldCheck } from "lucide-react";
import { RoleShell } from "@/components/role-shell";

export const Route = createFileRoute("/verifier")({
  head: () => ({
    meta: [
      { title: "Verifier — CredLedger" },
      { name: "description", content: "Verify credentials directly against the blockchain — trustless, instant, no university call required." },
    ],
  }),
  component: VerifierLayout,
});

function VerifierLayout() {
  return (
    <RoleShell
      role="verifier"
      roleLabel="Verifier"
      items={[
        { to: "/verifier", label: "Quick Verify", icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: "/verifier/lookup", label: "Direct Lookup", icon: <ShieldCheck className="h-4 w-4" /> },
        { to: "/verifier/scan", label: "Scan QR", icon: <ScanLine className="h-4 w-4" /> },
        { to: "/verifier/audit", label: "Audit History", icon: <History className="h-4 w-4" /> },
        { to: "/verifier/timestamp", label: "Timestamp Check", icon: <Clock className="h-4 w-4" /> },
      ]}
    />
  );
}