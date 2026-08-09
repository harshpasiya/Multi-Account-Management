import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCards } from "@/components/dashboard/stat-cards";
import { PnlAreaChart } from "@/components/pnl-area-chart";
import { TopMoversTable } from "@/components/dashboard/top-movers-table";
import { RecentTradesList } from "@/components/dashboard/recent-trades-list";
import { getPnlHistory } from "@/lib/mock-data";

export default function DashboardPage() {
  // TODO: replace with live Kite Connect data
  const pnlHistory = getPnlHistory();

  return (
    <div className="flex flex-col gap-4">
      <StatCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aggregate P&L</CardTitle>
            <CardDescription>
              Cumulative profit &amp; loss across all accounts, last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PnlAreaChart data={pnlHistory} />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest fills across the book</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <RecentTradesList />
          </CardContent>
          <CardContent className="pt-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Link href="/trades">
                View all trades
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Movers</CardTitle>
          <CardDescription>
            Largest P&L contributors across all accounts today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopMoversTable />
        </CardContent>
      </Card>
    </div>
  );
}
