"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReportStatusBadge } from "@/components/status-badges"
import {
  formatINR,
  formatDate,
  formatSignedINR,
  type PeriodReport,
} from "@/lib/mock-data"

function Line({
  label,
  value,
  strong,
  tone,
}: {
  label: string
  value: string
  strong?: boolean
  tone?: "profit" | "loss" | "muted"
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={
          strong ? "text-sm font-medium" : "text-sm text-muted-foreground"
        }
      >
        {label}
      </span>
      <span
        className={
          "font-mono tabular-nums " +
          (strong ? "text-base font-semibold " : "text-sm ") +
          (tone === "profit"
            ? "text-[var(--profit)]"
            : tone === "loss"
              ? "text-[var(--loss)]"
              : "")
        }
      >
        {value}
      </span>
    </div>
  )
}

export function ReceiptDialog({
  report,
  accountName,
  onOpenChange,
}: {
  report: PeriodReport | null
  accountName?: string
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={!!report} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {report && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-3">
                <DialogTitle className="font-mono">Payout Receipt</DialogTitle>
                <ReportStatusBadge status={report.status} />
              </div>
              <DialogDescription>
                {accountName} &middot; {formatDate(report.periodStart)} –{" "}
                {formatDate(report.periodEnd)}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-md border bg-muted/30 p-4">
              <Line
                label="Gross P&L"
                value={formatSignedINR(report.grossPnl)}
                tone={report.grossPnl >= 0 ? "profit" : "loss"}
              />
              <Line
                label="Total charges & taxes"
                value={`-${formatINR(report.totalCharges)}`}
                tone="loss"
              />
              <Separator className="my-2" />
              <Line
                label="Net P&L"
                value={formatSignedINR(report.netPnl)}
                strong
                tone={report.netPnl >= 0 ? "profit" : "loss"}
              />
              <Separator className="my-2" />
              <Line
                label={`Profit share (${report.profitSharePercent}%)`}
                value={formatINR(report.profitShareAmount)}
              />
              <Separator className="my-2" />
              <Line
                label="Net payable to manager"
                value={formatINR(report.netPayable)}
                strong
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Generated {formatDate(report.generatedAt)}. Profit share is
              charged only on positive net P&L for the period.
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button>Download PDF</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
