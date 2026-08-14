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

  const redirectUri = process.env.KITE_REDIRECT_URL
  if (!redirectUri) {
    return Response.json({ error: "KITE_REDIRECT_URL is not configured." }, { status: 500 })
  }

  const url = new URL("https://kite.zerodha.com/connect/login")
  url.searchParams.set("v", "3")
  url.searchParams.set("api_key", data.api_key)
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("state", accountId)

  return Response.redirect(url)
}
