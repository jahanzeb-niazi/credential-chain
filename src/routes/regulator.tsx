import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Landmark, Activity } from "lucide-react";
import { RoleShell } from "@/components/role-shell";

export const Route = createFileRoute("/regulator")({
  head: () => ({
    meta: [
      { title: "Regulator & Government — CredLedger" },
      { name: "description", content: "Onboard regulators, authorize universities, and audit institutional activity on-chain." },
    ],
  }),
  component: RegulatorLayout,
});

function RegulatorLayout() {
  return (
    <RoleShell
      role="regulator"
      roleLabel="Regulator Console"
      accent="gold"
      items={[
        { to: "/regulator", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: "/regulator/government", label: "Onboard Regulators", icon: <Landmark className="h-4 w-4" /> },
        { to: "/regulator/institutions", label: "Authorize Institutions", icon: <Building2 className="h-4 w-4" /> },
        { to: "/regulator/activity", label: "Audit Activity", icon: <Activity className="h-4 w-4" /> },
      ]}
    />
  );
}