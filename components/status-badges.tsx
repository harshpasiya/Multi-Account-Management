import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ClientAccount,
  ClientSession,
  Trade,
  PeriodReport,
} from "@/lib/mock-data";

function Dot({ className }: { className?: string }) {
  return <span className={cn("size-1.5 rounded-full", className)} aria-hidden />;
}

export function AccountStatusBadge({
  status,
}: {
  status: ClientAccount["status"];
}) {
  const map: Record<ClientAccount["status"], { label: string; cls: string; dot: string }> = {
    active: {
      label: "Active",
      cls: "border-profit/30 bg-profit/10 text-profit",
      dot: "bg-profit",
    },
    paused: {
      label: "Paused",
      cls: "border-chart-3/40 bg-chart-3/10 text-chart-3",
      dot: "bg-chart-3",
    },
    closed: {
      label: "Closed",
      cls: "border-border bg-muted text-muted-foreground",
      dot: "bg-muted-foreground",
    },
  };
  const { label, cls, dot } = map[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", cls)}>
      <Dot className={dot} />
      {label}
    </Badge>
  );
}

export function SessionStatusBadge({
  status,
}: {
  status: ClientSession["status"];
}) {
  const map: Record<
    ClientSession["status"],
    { label: string; cls: string; dot: string }
  > = {
    not_started: {
      label: "Not started",
      cls: "border-border bg-muted text-muted-foreground",
      dot: "bg-muted-foreground",
    },
    awaiting_otp: {
      label: "Awaiting OTP",
      cls: "border-chart-3/40 bg-chart-3/10 text-chart-3",
      dot: "bg-chart-3 animate-pulse",
    },
    active: {
      label: "Active",
      cls: "border-profit/30 bg-profit/10 text-profit",
      dot: "bg-profit",
    },
    expired: {
      label: "Expired",
      cls: "border-border bg-muted text-muted-foreground",
      dot: "bg-muted-foreground",
    },
    failed: {
      label: "Failed",
      cls: "border-loss/30 bg-loss/10 text-loss",
      dot: "bg-loss",
    },
  };
  const { label, cls, dot } = map[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", cls)}>
      <Dot className={dot} />
      {label}
    </Badge>
  );
}

export function TradeStatusBadge({ status }: { status: Trade["status"] }) {
  const map: Record<Trade["status"], string> = {
    complete: "border-profit/30 bg-profit/10 text-profit",
    open: "border-primary/30 bg-primary/10 text-primary",
    pending: "border-chart-3/40 bg-chart-3/10 text-chart-3",
    cancelled: "border-border bg-muted text-muted-foreground",
    rejected: "border-loss/30 bg-loss/10 text-loss",
  };
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", map[status])}>
      {status}
    </Badge>
  );
}

export function ReportStatusBadge({
  status,
}: {
  status: PeriodReport["status"];
}) {
  const map: Record<PeriodReport["status"], string> = {
    draft: "border-border bg-muted text-muted-foreground",
    finalized: "border-chart-3/40 bg-chart-3/10 text-chart-3",
    sent: "border-primary/30 bg-primary/10 text-primary",
    paid: "border-profit/30 bg-profit/10 text-profit",
  };
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", map[status])}>
      {status}
    </Badge>
  );
}

export function SideBadge({ side }: { side: "buy" | "sell" | "long" | "short" }) {
  const isPositive = side === "buy" || side === "long";
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium uppercase tracking-wide",
        isPositive
          ? "border-profit/30 bg-profit/10 text-profit"
          : "border-loss/30 bg-loss/10 text-loss",
      )}
    >
      {side}
    </Badge>
  );
}
