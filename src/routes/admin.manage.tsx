import { createFileRoute } from "@tanstack/react-router";
import { Search, ListChecks } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/role-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/manage")({
  component: ManagePage,
});

function ManagePage() {
  return (
    <>
      <PageHeader
        eyebrow="UC-02 · Manage credentials"
        title="Credential registry"
        description="Search by student name or ID. Drill into any record for full on-chain history and lifecycle actions."
      />

      <Card className="p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, ID or wallet…" className="pl-9" />
          </div>
          <Tabs defaultValue="all">
            <TabsList className="bg-secondary">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="revoked">Revoked</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-secondary/60">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>CID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <EmptyState
                    icon={<ListChecks className="h-7 w-7" />}
                    title="No credentials loaded"
                    description="Connect your university wallet to fetch all credentials issued by this institution from the smart contract."
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}