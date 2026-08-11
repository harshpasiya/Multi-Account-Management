"use server"

import { revalidatePath } from "next/cache"
import { createAccount } from "@/lib/supabase/data"

type AccountActionState = {
  status: "idle" | "success" | "error"
  message?: string
  field?: "name" | "zerodhaClientId" | "capitalContributed" | "profitSharePercent" | "form"
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
  const capitalContributed = Number(capitalRaw)
  const profitSharePercent = Number(shareRaw)

  if (!name) return { status: "error", field: "name", message: "Client name is required." }
  if (!zerodhaClientId) {
    return { status: "error", field: "zerodhaClientId", message: "Zerodha client ID is required." }
  }
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
    await createAccount({
      name,
      zerodhaClientId,
      email,
      phone,
      capitalContributed,
      profitSharePercent,
      status: status as "active" | "paused" | "closed",
      joinedDate: joinedDate || new Date().toISOString().slice(0, 10),
      notes,
    })
    revalidatePath("/accounts")
    return { status: "success", message: "Account created successfully." }
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined
    if (code === "23505") {
      return {
        status: "error",
        field: "zerodhaClientId",
        message: "That Zerodha client ID is already registered.",
      }
    }
    return { status: "error", field: "form", message: "Unable to create the account. Please try again." }
  }
}
