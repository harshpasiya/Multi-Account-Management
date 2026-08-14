import { createHash } from "node:crypto"
import { encryptKiteCredential } from "@/lib/kite-crypto"
import { createAdminClient } from "@/lib/supabase/admin"

function redirectTo(request: Request, status: string, message?: string) {
  const url = new URL("/session", request.url)
  url.searchParams.set("kite", status)
  if (message) url.searchParams.set("message", message)
  return Response.redirect(url)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const accountId = url.searchParams.get("state")
  const requestToken = url.searchParams.get("request_token")
  const error = url.searchParams.get("error")

  if (error) return redirectTo(request, "cancelled", "Kite login was cancelled.")
  if (!accountId || !requestToken) return redirectTo(request, "error", "Kite did not return a request token.")

  const supabase = createAdminClient() as any
  const { data: credential, error: credentialError } = await supabase
    .from("kite_credentials")
    .select("api_key,api_secret")
    .eq("account_id", accountId)
    .single()

  if (credentialError || !credential) return redirectTo(request, "error", "Kite credentials were not found.")

  try {
    const apiSecret = (await import("@/lib/kite-crypto")).decryptKiteCredential(credential.api_secret)
    const checksum = createHash("sha256").update(credential.api_key + requestToken + apiSecret).digest("hex")
    const response = await fetch("https://api.kite.trade/session/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ api_key: credential.api_key, request_token: requestToken, checksum }),
      cache: "no-store",
    })
    const payload = await response.json().catch(() => ({}))
    const accessToken = payload.data?.access_token
    if (!response.ok || !accessToken) return redirectTo(request, "error", "Kite token exchange failed.")

    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const expiresAt = new Date(now)
    expiresAt.setHours(23, 59, 59, 999)

    const tokenUpdate = await supabase
      .from("kite_credentials")
      .update({ access_token: encryptKiteCredential(accessToken), access_token_generated_at: now.toISOString() })
      .eq("account_id", accountId)
    if (tokenUpdate.error) throw tokenUpdate.error

    const sessionUpdate = await supabase.from("client_sessions").upsert({
      account_id: accountId,
      session_date: today,
      status: "active",
      last_authenticated_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    }, { onConflict: "account_id,session_date" })
    if (sessionUpdate.error) throw sessionUpdate.error

    return redirectTo(request, "success")
  } catch (caught) {
    console.error("[v0] Kite callback failed:", caught)
    return redirectTo(request, "error", "Kite authentication could not be completed.")
  }
}
