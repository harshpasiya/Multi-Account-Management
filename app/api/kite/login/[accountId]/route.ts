import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const { accountId } = await params
  const supabase = createAdminClient() as any
  const { data, error } = await supabase
    .from("kite_credentials")
    .select("api_key")
    .eq("account_id", accountId)
    .single()

  if (error || !data?.api_key) {
    return Response.json({ error: "Kite credentials were not found for this account." }, { status: 404 })
  }

  // Kite Connect uses the redirect URL registered for this API key. It does
  // not accept a dynamic redirect_uri query parameter.
  const expectedRedirectUri =
    process.env.KITE_REDIRECT_URL || new URL("/api/kite/callback", request.url).toString()
  console.log(
    "[v0] Initiating Kite login. Ensure the app's registered redirect URL on developers.kite.trade matches exactly:",
    expectedRedirectUri,
  )

  const url = new URL("https://kite.zerodha.com/connect/login")
  url.searchParams.set("v", "3")
  url.searchParams.set("api_key", data.api_key)
  url.searchParams.set("state", accountId)

  return Response.redirect(url)
}
