"use client"

import { FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ReportStatusBadge } from "@/components/status-badges"
import { PnlValue } from "@/components/pnl-value"
import { ReceiptDialog } from "@/components/reports/receipt-dialog"
import {
  formatINR,
  formatDate,
  type PeriodReport,
} from "@/lib/mock-data"
import * as React from "react"

export function ReportsTable({
  reports,
  accountNames,
}: {
  reports: PeriodReport[]
  accountNames: Record<string, string>
}) {
  const [active, setActive] = React.useState<PeriodReport | null>(null)

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Net P&L</TableHead>
              <TableHead className="text-right">Share</TableHead>
              <TableHead className="text-right">Payable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap">
                  <span className="text-sm">
                    {formatDate(r.periodStart)}
                  </span>
                  <span className="text-muted-foreground"> – </span>
                  <span className="text-sm">{formatDate(r.periodEnd)}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {accountNames[r.accountId] ?? r.accountId}
                </TableCell>
                <TableCell className="text-right">
                  <PnlValue value={r.netPnl} compact />
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                  {r.profitSharePercent}%
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatINR(r.netPayable, { compact: true })}
                </TableCell>
                <TableCell>
                  <ReportStatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActive(r)}
                  >
                    <FileText data-icon="inline-start" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No payout receipts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ReceiptDialog
        report={active}
        accountName={active ? accountNames[active.accountId] : ""}
        onOpenChange={(open) => !open && setActive(null)}
      />
    </>
  )
}
