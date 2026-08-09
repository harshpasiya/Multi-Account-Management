"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { AccountStatusBadge } from "@/components/status-badges";
import { PnlValue } from "@/components/pnl-value";
import { AddAccountDialog } from "@/components/accounts/add-account-dialog";
import {
  formatINR,
  type ClientAccount,
} from "@/lib/mock-data";

export function AccountsTable({
  accounts,
  pnlByAccount,
  defaultShare,
}: {
  accounts: ClientAccount[];
  pnlByAccount: Record<string, number>;
  defaultShare: number;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");

  const filtered = accounts.filter((a) => {
    const matchesQuery =
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.zerodhaClientId.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || a.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search name or client ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="sm:ml-auto">
          <AddAccountDialog defaultShare={defaultShare} />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Zerodha ID</TableHead>
              <TableHead className="text-right">Capital</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="text-right">Share</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow
                key={a.id}
                className="cursor-pointer"
                onClick={() => router.push(`/accounts/${a.id}`)}
              >
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {a.zerodhaClientId}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatINR(a.capitalContributed, { compact: true })}
                </TableCell>
                <TableCell className="text-right">
                  <PnlValue value={pnlByAccount[a.id] ?? 0} compact />
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {a.profitSharePercent}%
                </TableCell>
                <TableCell>
                  <AccountStatusBadge status={a.status} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No accounts match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {accounts.length} accounts · click a row for
        detail
      </p>
    </div>
  );
}
