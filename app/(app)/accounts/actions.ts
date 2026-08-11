"use server"

import { revalidatePath } from "next/cache"
import { createAccountWithCredentials } from "@/lib/supabase/data"
import { encryptKiteCredential } from "@/lib/kite-crypto"

type AccountActionState = {
  status: "idle" | "success" | "error"
  message?: string
  field?: "name" | "zerodhaClientId" | "capitalContributed" | "profitSharePercent" | "apiKey" | "apiSecret" | "zerodhaPassword" | "form"
}

export async function createAccountAction(
  _previousState: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const name = String(formData.get("name") ?? "").trim()
  const zerodhaClientId = String(formData.get("zerodhaClientId") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const capitalRaw = String(formData.get("capitalContributed") ?? "")
  const shareRaw = String(formData.get("profitSharePercent") ?? "")
  const status = String(formData.get("status") ?? "active")
  const joinedDate = String(formData.get("joinedDate") ?? "")
  const notes = String(formData.get("notes") ?? "").trim()
  const apiKey = String(formData.get("api_key") ?? "").trim()
  const apiSecret = String(formData.get("api_secret") ?? "")
  const zerodhaPassword = String(formData.get("zerodha_password") ?? "")
  const capitalContributed = Number(capitalRaw)
  const profitSharePercent = Number(shareRaw)

  if (!name) return { status: "error", field: "name", message: "Client name is required." }
  if (!zerodhaClientId) {
    return { status: "error", field: "zerodhaClientId", message: "Zerodha client ID is required." }
  }
  if (!apiKey) return { status: "error", field: "apiKey", message: "Kite API key is required." }
  if (!apiSecret) return { status: "error", field: "apiSecret", message: "Kite API secret is required." }
  if (!zerodhaPassword) return { status: "error", field: "zerodhaPassword", message: "Zerodha password is required." }
  if (!Number.isFinite(capitalContributed) || capitalContributed < 0) {
    return { status: "error", field: "capitalContributed", message: "Capital must be zero or greater." }
  }
  if (!Number.isFinite(profitSharePercent) || profitSharePercent < 0 || profitSharePercent > 100) {
    return { status: "error", field: "profitSharePercent", message: "Profit share must be between 0 and 100." }
  }
  if (!["active", "paused", "closed"].includes(status)) {
    return { status: "error", field: "form", message: "Choose a valid account status." }
  }

  try {
    await createAccountWithCredentials({
      name,
      zerodhaClientId,
      email,
      phone,
      capitalContributed,
      profitSharePercent,
      status: status as "active" | "paused" | "closed",
      joinedDate: joinedDate || new Date().toISOString().slice(0, 10),
      notes,
      apiKey,
      apiSecretEncrypted: encryptKiteCredential(apiSecret),
      zerodhaUserId: zerodhaClientId,
      zerodhaPasswordEncrypted: encryptKiteCredential(zerodhaPassword),
    })
    revalidatePath("/accounts")
    return { status: "success", message: "Account created successfully." }
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined
    if (code === "23505") {
      const constraint = error && typeof error === "object" && "constraint" in error ? String(error.constraint ?? "") : ""
      if (constraint.includes("api_key")) {
        return { status: "error", field: "apiKey", message: "That Kite API key is already registered to another account." }
      }
      return {
        status: "error",
        field: "zerodhaClientId",
        message: "That Zerodha client ID is already registered.",
      }
    }
    return { status: "error", field: "form", message: "Unable to create the account. Please try again." }
  }
}
