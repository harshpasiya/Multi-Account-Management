"use server"

import { createHash } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { decryptKiteCredential, encryptKiteCredential } from "@/lib/kite-crypto"

type AuthResult = { ok: true; expiresAt: string } | { ok: false; kind: "totp" | "login" | "network" | "unexpected"; message: string }

function cookiesFromResponse(response: Response) {
  return response.headers.getSetCookie().map((value) => value.split(";", 1)[0]).join("; ")
}

function endOfTradingDay() {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return end.toISOString()
}

export async function authenticateKiteAccount(accountId: string, totp: string): Promise<AuthResult> {
  const supabase = createAdminClient() as any
  const expiresAt = endOfTradingDay()
  let account: any = null
  try {
    if (!/^\d{6}$/.test(totp)) return { ok: false, kind: "totp", message: "Enter the 6-digit authenticator code." }
    const result = await supabase.from("client_accounts").select("id,zerodha_client_id").eq("id", accountId).single()
    if (result.error) throw result.error
    account = result.data
    const credentials = await supabase.from("kite_credentials").select("api_key,api_secret,zerodha_password").eq("account_id", accountId).single()
    if (credentials.error) throw credentials.error
    const apiKey = credentials.data.api_key
    const apiSecret = decryptKiteCredential(credentials.data.api_secret)
    const password = decryptKiteCredential(credentials.data.zerodha_password)
    const userId = account.zerodha_client_id
    let cookie = ""
    const login = await fetch("https://kite.zerodha.com/api/login", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" }, body: new URLSearchParams({ user_id: userId, password }), redirect: "manual" })
    cookie = cookiesFromResponse(login)
    const loginJson = await login.json().catch(() => ({}))
    const requestId = loginJson.data?.request_id
    if (!login.ok || !requestId) throw Object.assign(new Error("Zerodha login rejected."), { kind: "login" })
    const twofa = await fetch("https://kite.zerodha.com/api/twofa", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json", cookie }, body: new URLSearchParams({ user_id: userId, request_id: requestId, twofa_value: totp, twofa_type: "totp" }), redirect: "manual" })
    cookie = [cookie, cookiesFromResponse(twofa)].filter(Boolean).join("; ")
    const twofaJson = await twofa.json().catch(() => ({}))
    if (!twofa.ok || !twofaJson.data) throw Object.assign(new Error("Wrong TOTP. Check the code and try again."), { kind: "totp" })
    const redirect = await fetch(`https://kite.trade/connect/login?v=3&api_key=${encodeURIComponent(apiKey)}`, { headers: { cookie }, redirect: "manual" })
    const location = redirect.headers.get("location") ?? ""
    const requestToken = new URL(location, "https://kite.trade").searchParams.get("request_token")
    if (!requestToken) throw Object.assign(new Error("Kite did not return a request token."), { kind: "network" })
    const checksum = createHash("sha256").update(apiKey + requestToken + apiSecret).digest("hex")
    const tokenResponse = await fetch("https://api.kite.trade/session/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ api_key: apiKey, request_token: requestToken, checksum }) })
    const tokenJson = await tokenResponse.json().catch(() => ({}))
    const accessToken = tokenJson.data?.access_token
    if (!tokenResponse.ok || !accessToken) throw Object.assign(new Error("Kite token exchange failed."), { kind: "network" })
    const update = await supabase.from("kite_credentials").update({ access_token: encryptKiteCredential(accessToken), access_token_generated_at: new Date().toISOString() }).eq("account_id", accountId)
    if (update.error) throw update.error
    const session = await supabase.from("client_sessions").upsert({ account_id: accountId, session_date: new Date().toISOString().slice(0, 10), status: "active", last_authenticated_at: new Date().toISOString(), expires_at: expiresAt }, { onConflict: "account_id,session_date" })
    if (session.error) throw session.error
    return { ok: true, expiresAt }
  } catch (error: any) {
    const kind = error?.kind ?? "unexpected"
    const message = error instanceof Error ? error.message : "Authentication failed unexpectedly."
    await supabase.from("client_sessions").upsert({ account_id: accountId, session_date: new Date().toISOString().slice(0, 10), status: "failed", last_authenticated_at: null, expires_at: expiresAt }, { onConflict: "account_id,session_date" }).catch(() => undefined)
    return { ok: false, kind, message }
  }
}
