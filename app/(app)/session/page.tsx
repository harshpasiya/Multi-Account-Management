import { SessionChecklist } from "@/components/session/session-checklist";
import { getLiveAccounts, getLiveSessions } from "@/lib/supabase/data";

export default async function SessionPage({ searchParams }: { searchParams: Promise<{ kite?: string; message?: string }> }) {
  const params = await searchParams
  const [allAccounts, sessions] = await Promise.all([getLiveAccounts(), getLiveSessions()]);
  const accounts = allAccounts.filter((account) => account.status === "active");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Start of day checklist
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete this before trading. Every client account must have an active
          Kite session for the day.
        </p>
      </div>
      {params.kite ? (
        <div className={params.kite === "success" ? "rounded-md border border-profit/30 bg-profit/10 px-4 py-3 text-sm text-profit" : "rounded-md border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss"}>
          {params.message ?? (params.kite === "success" ? "Kite authentication completed." : "Kite authentication could not be completed.")}
        </div>
      ) : null}
      <div className="mt-2">
        <SessionChecklist accounts={accounts} sessions={sessions} />
      </div>
    </div>
  );
}
