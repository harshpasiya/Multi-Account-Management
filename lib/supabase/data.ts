import { createAdminClient } from "@/lib/supabase/admin"
import type {
  ClientAccount,
  ClientSession,
  Instrument,
  PeriodReport,
  Position,
  PnlPoint,
  Trade,
} from "@/lib/mock-data"

const required = <T>(value: T | null, message: string): T => {
  if (value === null) throw new Error(message)
  return value
}

function mapAccount(row: any): ClientAccount {
  return {
    id: row.id,
    name: row.name,
    zerodhaClientId: row.zerodha_client_id,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    capitalContributed: Number(row.capital_contributed ?? 0),
    profitSharePercent: Number(row.profit_share_percent ?? 0),
    status: row.status,
    joinedDate: row.joined_date,
    notes: row.notes ?? undefined,
  }
}

function mapPosition(row: any): Position {
  return {
    id: row.id,
    accountId: row.account_id,
    symbol: row.symbol,
    exchange: row.exchange,
    quantity: row.quantity,
    avgPrice: Number(row.avg_price),
    lastPrice: Number(row.last_price),
    pnl: Number(row.pnl ?? 0),
    pnlPercent: Number(row.pnl_percent ?? 0),
    side: row.side,
    product: row.product,
    segment: row.segment,
  }
}

function mapTrade(row: any): Trade {
  return {
    id: row.id,
    accountId: row.account_id,
    symbol: row.symbol,
    exchange: row.exchange,
    side: row.side,
    quantity: row.quantity,
    price: Number(row.price),
    orderType: row.order_type,
    product: row.product,
    status: row.status,
    timestamp: row.placed_at,
    orderId: row.kite_order_id ?? undefined,
    charges: {
      brokerage: Number(row.brokerage ?? 0),
      stt: Number(row.stt ?? 0),
      exchangeCharges: Number(row.exchange_charges ?? 0),
      gst: Number(row.gst ?? 0),
      stampDuty: Number(row.stamp_duty ?? 0),
      total: Number(row.total_charges ?? 0),
    },
  }
}

function mapReport(row: any): PeriodReport {
  return {
    id: row.id,
    accountId: row.account_id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    grossPnl: Number(row.gross_pnl),
    totalCharges: Number(row.total_charges),
    netPnl: Number(row.net_pnl),
    profitSharePercent: Number(row.profit_share_percent),
    profitShareAmount: Number(row.profit_share_amount),
    netPayable: Number(row.net_payable),
    status: row.status,
    generatedAt: row.generated_at,
  }
}

export async function getLiveAccounts() {
  const { data, error } = await createAdminClient()
    .from("client_accounts")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("[v0] client_accounts read failed:", error.message)
    return []
  }
  return (data ?? []).map(mapAccount)
}

export async function getLivePositions(accountId?: string) {
  let query = createAdminClient().from("positions").select("*").order("pnl", { ascending: false })
  if (accountId) query = query.eq("account_id", accountId)
  const { data, error } = await query
  if (error) {
    console.error("[v0] Supabase read failed:", error.message)
    return []
  }
  return (data ?? []).map(mapPosition)
}

export async function getLiveTrades(accountId?: string, limit?: number) {
  let query = createAdminClient().from("trades").select("*").order("placed_at", { ascending: false })
  if (accountId) query = query.eq("account_id", accountId)
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) {
    console.error("[v0] Supabase read failed:", error.message)
    return []
  }
  return (data ?? []).map(mapTrade)
}

export async function getLiveReports(accountId?: string) {
  let query = createAdminClient().from("period_reports").select("*").order("period_start", { ascending: false })
  if (accountId) query = query.eq("account_id", accountId)
  const { data, error } = await query
  if (error) {
    console.error("[v0] Supabase read failed:", error.message)
    return []
  }
  return (data ?? []).map(mapReport)
}

export async function getLiveSessions() {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await createAdminClient()
    .from("client_sessions")
    .select("account_id,status,last_authenticated_at,expires_at")
    .eq("session_date", today)
  if (error) {
    console.error("[v0] Supabase read failed:", error.message)
    return []
  }
  return ((data ?? []) as any[]).map((row): ClientSession => ({
    accountId: row.account_id,
    status: row.status,
    lastAuthenticatedAt: row.last_authenticated_at ?? undefined,
    expiresAt: row.expires_at ?? undefined,
  }))
}

export async function getLiveInstruments() {
  const { data, error } = await createAdminClient()
    .from("instruments")
    .select("trading_symbol,name,exchange")
    .order("trading_symbol")
    .limit(1000)
  if (error) {
    console.error("[v0] Supabase read failed:", error.message)
    return []
  }
  return ((data ?? []) as any[]).map((row): Instrument => ({
    symbol: row.trading_symbol,
    name: row.name ?? row.trading_symbol,
    exchange: row.exchange,
  }))
}

export async function getLivePnlHistory(): Promise<PnlPoint[]> {
  const { data, error } = await createAdminClient()
    .from("trades")
    .select("placed_at,total_charges")
    .order("placed_at", { ascending: true })
    .limit(5000)
  if (error) {
    console.error("[v0] Supabase read failed:", error.message)
    return []
  }
  let cumulative = 0
  return ((data ?? []) as any[]).map((row) => {
    const pnl = -Number(row.total_charges ?? 0)
    cumulative += pnl
    return { date: row.placed_at, pnl, cumulative }
  })
}

export async function getLiveDashboardData() {
  const [accounts, positions, trades, reports, sessions, pnlHistory] = await Promise.all([
    getLiveAccounts(), getLivePositions(), getLiveTrades(undefined, 10), getLiveReports(), getLiveSessions(), getLivePnlHistory(),
  ])
  return { accounts, positions, trades, reports, sessions, pnlHistory }
}

export async function getLiveAccount(id: string) {
  const accounts = await getLiveAccounts()
  return required(accounts.find((account) => account.id === id) ?? null, "Account not found")
}

export async function getLiveAccountPnlHistory(accountId: string): Promise<PnlPoint[]> {
  const positions = await getLivePositions(accountId)
  const pnl = positions.reduce((sum, position) => sum + position.pnl, 0)
  return [{ date: new Date().toISOString(), pnl, cumulative: pnl }]
}
