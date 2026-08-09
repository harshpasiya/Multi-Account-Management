import { SessionChecklist } from "@/components/session/session-checklist";
import { getActiveAccounts, getSessions } from "@/lib/mock-data";

export default function SessionPage() {
  // TODO: replace with live Kite Connect data — sessions reset daily.
  const accounts = getActiveAccounts();
  const sessions = getSessions();

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
      <div className="mt-2">
        <SessionChecklist accounts={accounts} sessions={sessions} />
      </div>
    </div>
  );
}
