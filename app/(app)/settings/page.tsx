import type { Metadata } from "next"
import { SettingsForm } from "@/components/settings/settings-form"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-balance">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Broker connection, defaults, and workspace preferences.
        </p>
      </header>
      <SettingsForm />
    </div>
  )
}
