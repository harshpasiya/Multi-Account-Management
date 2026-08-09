import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PnlValue, PnlPercent } from "@/components/pnl-value";
import { SideBadge } from "@/components/status-badges";
import {
  getAccounts,
  getTopMovers,
  formatINR,
} from "@/lib/mock-data";

export function TopMoversTable() {
  // TODO: replace with live Kite Connect data
  const movers = getTopMovers(6);
  const accounts = new Map(getAccounts().map((a) => [a.id, a.name]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Account</TableHead>
          <TableHead className="w-16">Side</TableHead>
          <TableHead className="text-right">LTP</TableHead>
          <TableHead className="text-right">P&L</TableHead>
          <TableHead className="text-right">Chg%</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movers.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono font-medium">{p.symbol}</TableCell>
            <TableCell className="max-w-32 truncate text-muted-foreground">
              {accounts.get(p.accountId)}
            </TableCell>
            <TableCell>
              <SideBadge side={p.side} />
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatINR(p.lastPrice)}
            </TableCell>
            <TableCell className="text-right">
              <PnlValue value={p.pnl} compact />
            </TableCell>
            <TableCell className="text-right">
              <PnlPercent value={p.pnlPercent} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
