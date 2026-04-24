import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, FilePlus2, ListChecks, Ban, FileEdit, Hash } from "lucide-react";
import { RoleShell } from "@/components/role-shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "University Admin — CredLedger" },
      { name: "description", content: "Issue, manage, revoke and update academic credentials on-chain." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RoleShell
      role="admin"
      roleLabel="University Admin"
      items={[
        { to: "/admin", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: "/admin/issue", label: "Issue Credential", icon: <FilePlus2 className="h-4 w-4" /> },
        { to: "/admin/manage", label: "Manage Credentials", icon: <ListChecks className="h-4 w-4" /> },
        { to: "/admin/revoke", label: "Revoke", icon: <Ban className="h-4 w-4" /> },
        { to: "/admin/update", label: "Update Data", icon: <FileEdit className="h-4 w-4" /> },
        { to: "/admin/cid", label: "On-chain CID", icon: <Hash className="h-4 w-4" /> },
      ]}
    />
  );
}