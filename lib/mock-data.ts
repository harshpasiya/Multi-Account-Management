// ---------------------------------------------------------------------------
// Multi-Account Trading Panel — single source of mock data.
//
// Everything the UI renders reads from this module. The exported get* helpers
// are shaped like async-ready data fetchers (they return synchronously today)
// so they can be swapped for real API / Kite Connect calls later.
//
// TODO: replace with live Kite Connect data — every get* function below is a
// swap point. ClientSession data (getSessions) resets daily via a scheduled
// job in the real backend and is intentionally kept separate from account data.
// ---------------------------------------------------------------------------

export interface ClientAccount {
  id: string;
  name: string;
  zerodhaClientId: string; // e.g. "AB1234"
  email?: string;
  phone?: string;
  capitalContributed: number;
  profitSharePercent: number; // e.g. 20 for 20%
  status: "active" | "paused" | "closed";
  joinedDate: string; // ISO date
  notes?: string;
}

export interface Position {
  id: string;
  accountId: string;
  symbol: string;
  exchange: "NSE" | "BSE";
  quantity: number;
  avgPrice: number;
  lastPrice: number;
  pnl: number;
  pnlPercent: number;
  side: "long" | "short";
  product: "CNC" | "MIS" | "NRML"; // Zerodha product codes
  segment: "day" | "overnight";
}

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  exchange: "NSE" | "BSE";
  side: "buy" | "sell";
  quantity: number;
  price: number;
  orderType: "market" | "limit" | "sl" | "sl-m";
  product: "CNC" | "MIS" | "NRML";
  status: "pending" | "open" | "complete" | "cancelled" | "rejected";
  timestamp: string; // ISO datetime
  orderId?: string;
  charges?: {
    brokerage: number;
    stt: number;
    exchangeCharges: number;
    gst: number;
    stampDuty: number;
    total: number;
  };
}

export interface PeriodReport {
  id: string;
  accountId: string;
  periodStart: string;
  periodEnd: string;
  grossPnl: number;
  totalCharges: number;
  netPnl: number;
  profitSharePercent: number; // pulled from account, editable in UI before finalizing
  profitShareAmount: number;
  netPayable: number; // positive = payable to manager, negative = payable to client
  status: "draft" | "finalized" | "sent" | "paid";
  generatedAt: string;
}

// Daily, ephemeral — resets every trading day when Kite access tokens expire.
// Deliberately separate from ClientAccount, which is persistent/long-lived.
export interface ClientSession {
  accountId: string;
  status: "not_started" | "awaiting_otp" | "active" | "expired" | "failed";
  lastAuthenticatedAt?: string; // ISO datetime, set once status becomes "active"
  expiresAt?: string; // ISO datetime, end of trading day
}

// ---------------------------------------------------------------------------
// Reference symbol universe (realistic NSE equities)
// ---------------------------------------------------------------------------

export interface Instrument {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
}

export const INSTRUMENTS: Instrument[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd", exchange: "NSE" },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE" },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd", exchange: "NSE" },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE" },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", exchange: "NSE" },
  { symbol: "ITC", name: "ITC Ltd", exchange: "NSE" },
  { symbol: "LT", name: "Larsen & Toubro Ltd", exchange: "NSE" },
  { symbol: "WIPRO", name: "Wipro Ltd", exchange: "NSE" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", exchange: "NSE" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd", exchange: "NSE" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", exchange: "NSE" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", exchange: "NSE" },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd", exchange: "NSE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", exchange: "NSE" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd", exchange: "NSE" },
];

const LAST_PRICE: Record<string, number> = {
  RELIANCE: 2934.55,
  TCS: 4188.2,
  INFY: 1876.4,
  HDFCBANK: 1712.85,
  ICICIBANK: 1284.3,
  TATASTEEL: 168.75,
  SBIN: 842.1,
  AXISBANK: 1176.6,
  ITC: 486.25,
  LT: 3742.9,
  WIPRO: 564.35,
  MARUTI: 12890.0,
  SUNPHARMA: 1824.55,
  BAJFINANCE: 7218.4,
  HINDUNILVR: 2456.7,
  ADANIENT: 3128.65,
  TATAMOTORS: 1024.85,
  KOTAKBANK: 1810.2,
};

// ---------------------------------------------------------------------------
// Client accounts (persistent / long-lived)
// ---------------------------------------------------------------------------

const accounts: ClientAccount[] = [
  {
    id: "acc-01",
    name: "Rajesh Kumar",
    zerodhaClientId: "RK4821",
    email: "rajesh.kumar@example.in",
    phone: "+91 98200 11223",
    capitalContributed: 2500000,
    profitSharePercent: 20,
    status: "active",
    joinedDate: "2023-04-12",
    notes: "Long-term client. Prefers large-cap only, no F&O.",
  },
  {
    id: "acc-02",
    name: "Priya Sharma",
    zerodhaClientId: "PS9034",
    email: "priya.sharma@example.in",
    phone: "+91 99870 44556",
    capitalContributed: 1800000,
    profitSharePercent: 25,
    status: "active",
    joinedDate: "2023-07-28",
    notes: "Comfortable with intraday MIS positions.",
  },
  {
    id: "acc-03",
    name: "Amit Patel",
    zerodhaClientId: "AP1276",
    email: "amit.patel@example.in",
    phone: "+91 98765 33221",
    capitalContributed: 3200000,
    profitSharePercent: 18,
    status: "active",
    joinedDate: "2022-11-03",
    notes: "Largest book. Quarterly payout cycle.",
  },
  {
    id: "acc-04",
    name: "Sneha Reddy",
    zerodhaClientId: "SR6650",
    email: "sneha.reddy@example.in",
    phone: "+91 90000 88771",
    capitalContributed: 1200000,
    profitSharePercent: 22,
    status: "active",
    joinedDate: "2024-01-19",
  },
  {
    id: "acc-05",
    name: "Vikram Singh",
    zerodhaClientId: "VS3388",
    email: "vikram.singh@example.in",
    phone: "+91 98111 22334",
    capitalContributed: 950000,
    profitSharePercent: 20,
    status: "paused",
    joinedDate: "2023-09-10",
    notes: "Paused trading Jul–Aug, travelling abroad.",
  },
  {
    id: "acc-06",
    name: "Ananya Iyer",
    zerodhaClientId: "AI7712",
    email: "ananya.iyer@example.in",
    phone: "+91 99001 55667",
    capitalContributed: 2100000,
    profitSharePercent: 20,
    status: "active",
    joinedDate: "2023-02-25",
  },
  {
    id: "acc-07",
    name: "Karthik Nair",
    zerodhaClientId: "KN5093",
    email: "karthik.nair@example.in",
    phone: "+91 98330 99887",
    capitalContributed: 1550000,
    profitSharePercent: 24,
    status: "active",
    joinedDate: "2023-12-06",
  },
  {
    id: "acc-08",
    name: "Meera Joshi",
    zerodhaClientId: "MJ2247",
    email: "meera.joshi@example.in",
    phone: "+91 90040 33210",
    capitalContributed: 780000,
    profitSharePercent: 20,
    status: "active",
    joinedDate: "2024-03-14",
  },
  {
    id: "acc-09",
    name: "Rohan Gupta",
    zerodhaClientId: "RG8815",
    email: "rohan.gupta@example.in",
    phone: "+91 98220 66554",
    capitalContributed: 4100000,
    profitSharePercent: 15,
    status: "active",
    joinedDate: "2022-06-30",
    notes: "HNI. Negotiated lower share for higher capital.",
  },
  {
    id: "acc-10",
    name: "Divya Menon",
    zerodhaClientId: "DM3971",
    email: "divya.menon@example.in",
    phone: "+91 99451 77889",
    capitalContributed: 640000,
    profitSharePercent: 25,
    status: "closed",
    joinedDate: "2023-05-21",
    notes: "Account closed Mar 2024, final payout settled.",
  },
];

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helpers (stable across renders / SSR)
// ---------------------------------------------------------------------------

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function isoDaysAgo(days: number, hour = 10, minute = 30) {
  const d = new Date("2026-08-09T00:00:00+05:30");
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Positions
// ---------------------------------------------------------------------------

const PRODUCTS: Position["product"][] = ["CNC", "MIS", "NRML"];

function buildPositions(): Position[] {
  const out: Position[] = [];
  const rnd = seeded(97);
  const tradingAccounts = accounts.filter((a) => a.status !== "closed");

  for (const acc of tradingAccounts) {
    const symbolPool = [...INSTRUMENTS].sort(() => rnd() - 0.5);
    const count = 3 + Math.floor(rnd() * 3); // 3-5 positions
    for (let i = 0; i < count; i++) {
      const inst = symbolPool[i];
      const last = LAST_PRICE[inst.symbol];
      const side: Position["side"] = rnd() > 0.78 ? "short" : "long";
      const drift = (rnd() - 0.42) * 0.08; // -3.4% .. +4.6%
      const avg = round2(last / (1 + drift));
      const lotBase = last > 5000 ? 5 : last > 1500 ? 25 : last > 500 ? 80 : 300;
      const quantity = lotBase * (1 + Math.floor(rnd() * 4));
      const dir = side === "long" ? 1 : -1;
      const pnl = round2((last - avg) * quantity * dir);
      const pnlPercent = round2(((last - avg) / avg) * 100 * dir);
      out.push({
        id: `pos-${acc.id}-${i}`,
        accountId: acc.id,
        symbol: inst.symbol,
        exchange: inst.exchange,
        quantity,
        avgPrice: avg,
        lastPrice: last,
        pnl,
        pnlPercent,
        side,
        product: PRODUCTS[Math.floor(rnd() * PRODUCTS.length)],
        segment: rnd() > 0.5 ? "overnight" : "day",
      });
    }
  }
  return out;
}

const positions: Position[] = buildPositions();

// ---------------------------------------------------------------------------
// Trades (history spanning a few weeks)
// ---------------------------------------------------------------------------

const ORDER_TYPES: Trade["orderType"][] = ["market", "limit", "sl", "sl-m"];
const TRADE_STATUS: Trade["status"][] = [
  "complete",
  "complete",
  "complete",
  "open",
  "cancelled",
  "rejected",
  "pending",
];

function buildCharges(value: number): Trade["charges"] {
  const brokerage = Math.min(20, round2(value * 0.0003));
  const stt = round2(value * 0.00025);
  const exchangeCharges = round2(value * 0.0000345);
  const gst = round2((brokerage + exchangeCharges) * 0.18);
  const stampDuty = round2(value * 0.00003);
  const total = round2(brokerage + stt + exchangeCharges + gst + stampDuty);
  return { brokerage, stt, exchangeCharges, gst, stampDuty, total };
}

function buildTrades(): Trade[] {
  const out: Trade[] = [];
  const rnd = seeded(43);
  const tradingAccounts = accounts.filter((a) => a.status !== "closed");
  let orderSeq = 250800000000;

  for (const acc of tradingAccounts) {
    const n = 10 + Math.floor(rnd() * 8); // 10-17 trades each
    for (let i = 0; i < n; i++) {
      const inst = INSTRUMENTS[Math.floor(rnd() * INSTRUMENTS.length)];
      const base = LAST_PRICE[inst.symbol];
      const price = round2(base * (1 + (rnd() - 0.5) * 0.06));
      const lotBase = base > 5000 ? 5 : base > 1500 ? 25 : base > 500 ? 80 : 300;
      const quantity = lotBase * (1 + Math.floor(rnd() * 4));
      const status = TRADE_STATUS[Math.floor(rnd() * TRADE_STATUS.length)];
      const daysAgo = Math.floor(rnd() * 26);
      const hour = 9 + Math.floor(rnd() * 6);
      const minute = Math.floor(rnd() * 60);
      const value = price * quantity;
      out.push({
        id: `trd-${acc.id}-${i}`,
        accountId: acc.id,
        symbol: inst.symbol,
        exchange: inst.exchange,
        side: rnd() > 0.5 ? "buy" : "sell",
        quantity,
        price,
        orderType: ORDER_TYPES[Math.floor(rnd() * ORDER_TYPES.length)],
        product: PRODUCTS[Math.floor(rnd() * PRODUCTS.length)],
        status,
        timestamp: isoDaysAgo(daysAgo, hour, minute),
        orderId: `${orderSeq++}`,
        charges: status === "complete" ? buildCharges(value) : undefined,
      });
    }
  }
  return out.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

const trades: Trade[] = buildTrades();

// ---------------------------------------------------------------------------
// Period reports (payout receipts)
// ---------------------------------------------------------------------------

function buildReports(): PeriodReport[] {
  const out: PeriodReport[] = [];
  const rnd = seeded(71);
  const statuses: PeriodReport["status"][] = [
    "paid",
    "sent",
    "finalized",
    "draft",
  ];

  const periods = [
    { start: "2026-04-01", end: "2026-04-30", label: 0 },
    { start: "2026-05-01", end: "2026-05-31", label: 1 },
    { start: "2026-06-01", end: "2026-06-30", label: 2 },
    { start: "2026-07-01", end: "2026-07-31", label: 3 },
  ];

  let idx = 0;
  for (const acc of accounts) {
    if (acc.status === "closed") continue;
    // 2-3 reports per account
    const reportCount = 2 + Math.floor(rnd() * 2);
    for (let p = 0; p < reportCount; p++) {
      const period = periods[p];
      const gross = round2((rnd() - 0.25) * (acc.capitalContributed * 0.06));
      const totalCharges = round2(Math.abs(gross) * 0.012 + 400 + rnd() * 1200);
      const netPnl = round2(gross - totalCharges);
      const share = acc.profitSharePercent;
      const profitShareAmount = round2(netPnl > 0 ? (netPnl * share) / 100 : 0);
      const netPayable = profitShareAmount; // manager receives share of profit
      const status =
        p === reportCount - 1
          ? statuses[Math.floor(rnd() * statuses.length)]
          : "paid";
      out.push({
        id: `rep-${acc.id}-${p}`,
        accountId: acc.id,
        periodStart: period.start,
        periodEnd: period.end,
        grossPnl: gross,
        totalCharges,
        netPnl,
        profitSharePercent: share,
        profitShareAmount,
        netPayable,
        status,
        generatedAt: isoDaysAgo(30 - period.label * 7, 18, 0),
      });
      idx++;
    }
  }
  return out.sort(
    (a, b) =>
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
  );
}

const reports: PeriodReport[] = buildReports();

// ---------------------------------------------------------------------------
// Client sessions (daily / ephemeral — resets every trading day)
// ---------------------------------------------------------------------------

function buildSessions(): ClientSession[] {
  const tradingAccounts = accounts.filter((a) => a.status === "active");
  const endOfDay = isoDaysAgo(0, 15, 30);
  // A realistic morning snapshot: some already authenticated, most pending.
  const activeCount = 3;
  return tradingAccounts.map((acc, i) => {
    if (i < activeCount) {
      return {
        accountId: acc.id,
        status: "active",
        lastAuthenticatedAt: isoDaysAgo(0, 8, 12 + i),
        expiresAt: endOfDay,
      };
    }
    if (i === activeCount) {
      return { accountId: acc.id, status: "awaiting_otp" };
    }
    if (i === activeCount + 1) {
      return { accountId: acc.id, status: "failed" };
    }
    return { accountId: acc.id, status: "not_started" };
  });
}

const sessions: ClientSession[] = buildSessions();

// ---------------------------------------------------------------------------
// Aggregate P&L history (last 30 days)
// ---------------------------------------------------------------------------

export interface PnlPoint {
  date: string; // ISO date
  pnl: number; // aggregate P&L for that day
  cumulative: number; // running cumulative P&L
}

function buildPnlHistory(): PnlPoint[] {
  const rnd = seeded(211);
  const out: PnlPoint[] = [];
  let cumulative = 0;
  for (let d = 29; d >= 0; d--) {
    const daily = round2((rnd() - 0.44) * 180000);
    cumulative = round2(cumulative + daily);
    out.push({ date: isoDaysAgo(d, 15, 30).slice(0, 10), pnl: daily, cumulative });
  }
  return out;
}

const pnlHistory: PnlPoint[] = buildPnlHistory();

function buildAccountPnlHistory(accountId: string): PnlPoint[] {
  const seed = accountId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const rnd = seeded(seed * 13 + 7);
  const out: PnlPoint[] = [];
  let cumulative = 0;
  for (let d = 29; d >= 0; d--) {
    const daily = round2((rnd() - 0.43) * 32000);
    cumulative = round2(cumulative + daily);
    out.push({ date: isoDaysAgo(d, 15, 30).slice(0, 10), pnl: daily, cumulative });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Data-fetching-shaped helpers (synchronous today, API-ready tomorrow)
// TODO: replace with live Kite Connect data.
// ---------------------------------------------------------------------------

export function getAccounts(): ClientAccount[] {
  return accounts;
}

export function getAccount(id: string): ClientAccount | undefined {
  return accounts.find((a) => a.id === id);
}

export function getActiveAccounts(): ClientAccount[] {
  return accounts.filter((a) => a.status === "active");
}

export function getPositions(): Position[] {
  return positions;
}

export function getPositionsByAccount(id: string): Position[] {
  return positions.filter((p) => p.accountId === id);
}

export function getTrades(): Trade[] {
  return trades;
}

export function getTradesByAccount(id: string): Trade[] {
  return trades.filter((t) => t.accountId === id);
}

export function getRecentTrades(limit = 5): Trade[] {
  return trades.slice(0, limit);
}

export function getReports(): PeriodReport[] {
  return reports;
}

export function getReportsByAccount(id: string): PeriodReport[] {
  return reports.filter((r) => r.accountId === id);
}

// Kept separate from getAccounts() on purpose — sessions reset daily in the
// real backend via a scheduled job while account data is long-lived.
export function getSessions(): ClientSession[] {
  return sessions;
}

export function getSessionByAccount(id: string): ClientSession | undefined {
  return sessions.find((s) => s.accountId === id);
}

export function getPendingAuthCount(): number {
  return sessions.filter((s) => s.status !== "active").length;
}

export function getPnlHistory(): PnlPoint[] {
  return pnlHistory;
}

export function getAccountPnlHistory(id: string): PnlPoint[] {
  return buildAccountPnlHistory(id);
}

export function getInstruments(): Instrument[] {
  return INSTRUMENTS;
}

// ---------------------------------------------------------------------------
// Derived aggregate helpers
// ---------------------------------------------------------------------------

export function getAccountPnl(accountId: string): number {
  return round2(
    getPositionsByAccount(accountId).reduce((sum, p) => sum + p.pnl, 0),
  );
}

export function getTotalAum(): number {
  return getActiveAccounts().reduce((sum, a) => sum + a.capitalContributed, 0);
}

export function getAggregatePnl(): number {
  return round2(positions.reduce((sum, p) => sum + p.pnl, 0));
}

export function getOpenPositionsCount(): number {
  return positions.length;
}

export function getTopMovers(limit = 6): Position[] {
  return [...positions]
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Formatting helpers (Indian numbering + currency)
// ---------------------------------------------------------------------------

export function formatINR(value: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 10000000) return `${sign}₹${round2(abs / 10000000)}Cr`;
    if (abs >= 100000) return `${sign}₹${round2(abs / 100000)}L`;
    if (abs >= 1000) return `${sign}₹${round2(abs / 1000)}K`;
    return `${sign}₹${round2(abs)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatSignedINR(value: number, opts?: { compact?: boolean }): string {
  const formatted = formatINR(Math.abs(value), opts);
  return value < 0 ? `-${formatted}` : `+${formatted}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
