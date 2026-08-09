"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { getAggregatePnl, getPendingAuthCount } from "@/lib/mock-data";

const TITLES: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === "/", title: "Dashboard" },
  { match: (p) => p.startsWith("/session"), title: "Daily Client Authentication" },
  { match: (p) => p.startsWith("/accounts"), title: "Client Accounts" },
  { match: (p) => p.startsWith("/trade"), title: "Order Ticket" },
  { match: (p) => p.startsWith("/positions"), title: "Aggregated Positions" },
  { match: (p) => p.startsWith("/trades"), title: "Trade Log" },
  { match: (p) => p.startsWith("/reports"), title: "Payout Reports" },
  { match: (p) => p.startsWith("/settings"), title: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = TITLES.find((t) => t.match(pathname))?.title ?? "Kite Manager";

  // TODO: replace with live Kite Connect data
  const aggregatePnl = getAggregatePnl();
  const pendingAuth = getPendingAuthCount();

  return (
    <SidebarProvider>
      <AppSidebar pendingAuth={pendingAuth} />
      <SidebarInset>
        <Topbar
          title={title}
          aggregatePnl={aggregatePnl}
          pendingAuth={pendingAuth}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
