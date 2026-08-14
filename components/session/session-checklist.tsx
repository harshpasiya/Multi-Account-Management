"use client";

// Daily client authentication checklist.
// Each morning every client's Kite Connect access token has expired and must be
// re-authenticated through Kite's official browser login before trading.

import * as React from "react";
import { CheckCircle2, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SessionStatusBadge } from "@/components/status-badges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  formatTime,
  type ClientAccount,
  type ClientSession,
} from "@/lib/mock-data";

type SessionState = ClientSession & { pending: boolean };

export function SessionChecklist({
  accounts,
  sessions,
}: {
  accounts: ClientAccount[];
  sessions: ClientSession[];
}) {
  const [state, setState] = React.useState<SessionState[]>(() =>
    accounts.map((a) => {
      const s = sessions.find((x) => x.accountId === a.id);
      return {
        accountId: a.id,
        status: s?.status ?? "not_started",
        lastAuthenticatedAt: s?.lastAuthenticatedAt,
        expiresAt: s?.expiresAt,
        pending: false,
      };
    }),
  );

  const accountsById = React.useMemo(
    () => new Map(accounts.map((a) => [a.id, a])),
    [accounts],
  );

  const total = state.length;
  const activeCount = state.filter((s) => s.status === "active").length;
  const progress = total ? (activeCount / total) * 100 : 0;

  function authenticate(accountId: string) {
    setState((prev) => prev.map((s) => s.accountId === accountId ? { ...s, pending: true } : s));
    window.location.assign(`/api/kite/login/${encodeURIComponent(accountId)}`);
  }

  function authenticateAll() {
    const pending = state.find((s) => s.status !== "active");
    if (!pending) return;
    toast.info("Authenticate each account through Kite", { description: "Complete one Kite login, then return here for the next account." });
    authenticate(pending.accountId);
  }

  const allDone = activeCount === total;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary strip */}
      <Card
        className={cn(
          "border-l-4",
          allDone ? "border-l-profit" : "border-l-loss",
        )}
      >
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-md",
                allDone
                  ? "bg-profit/10 text-profit"
                  : "bg-loss/10 text-loss",
              )}
            >
              {allDone ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertTriangle className="size-5" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-semibold tabular-nums">
                  {activeCount} of {total}
                </span>
                <span className="text-sm text-muted-foreground">
                  accounts active
                </span>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                {allDone
                  ? "All client sessions are authenticated. You're clear to trade today."
                  : "Kite access tokens reset overnight. Authenticate every client before placing any orders today."}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Progress value={progress} className="h-2 w-48" />
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={authenticateAll}
            disabled={allDone}
            className="shrink-0"
          >
            <ShieldCheck data-icon="inline-start" />
            Authenticate all
          </Button>
        </CardContent>
      </Card>

      {/* Per-account rows */}
      <Card className="overflow-hidden py-0">
        <div className="divide-y">
          {state.map((s) => {
            const acc = accountsById.get(s.accountId)!;
            const isActive = s.status === "active";
            return (
              <div
                key={s.accountId}
                className={cn(
                  "flex flex-col gap-3 px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:gap-4",
                  isActive ? "bg-profit/[0.03]" : "hover:bg-muted/40",
                )}
              >
                {/* Identity */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {acc.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {acc.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {acc.zerodhaClientId}
                    </span>
                  </div>
                </div>

                {/* Status + timestamp */}
                <div className="flex items-center gap-3 sm:w-56">
                  <SessionStatusBadge status={s.status} />
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {isActive && s.lastAuthenticatedAt
                      ? `at ${formatTime(s.lastAuthenticatedAt)}`
                      : s.status === "failed"
                        ? "last attempt failed"
                        : "—"}
                  </span>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end gap-3 sm:w-80">
                  {isActive ? (
                    <div className="flex items-center gap-1.5 text-sm text-profit">
                      <CheckCircle2 className="size-4" />
                      <span>Ready to trade</span>
                    </div>
                  ) : (
                    <Button size="sm" variant={s.status === "failed" ? "outline" : "default"} disabled={s.pending} onClick={() => authenticate(s.accountId)}>
                      <ExternalLink data-icon="inline-start" />
                      {s.pending ? "Opening Kite…" : s.status === "failed" ? "Retry login" : "Login with Kite"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Login opens Zerodha&apos;s official Kite Connect page. Complete the login and two-factor verification there; sessions expire at market close and must be re-authenticated tomorrow morning.
      </p>
    </div>
  );
}
