import "server-only"

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto"

const VERSION = "v1"
const ALGORITHM = "aes-256-gcm"

function getKey() {
  const secret = process.env.KITE_CREDENTIALS_ENCRYPTION_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!secret) throw new Error("KITE_CREDENTIALS_ENCRYPTION_KEY is not configured")
  return scryptSync(secret, "kite-credentials", 32)
}

export function encryptKiteCredential(value: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".")
}

export function decryptKiteCredential(payload: string) {
  const [version, ivValue, tagValue, encryptedValue] = payload.split(".")
  if (version !== VERSION || !ivValue || !tagValue || !encryptedValue) throw new Error("Invalid encrypted credential")
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivValue, "base64url"))
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"))
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8")
}
