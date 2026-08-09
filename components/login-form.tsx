"use client";

// Manager login to the panel itself (NOT Zerodha/Kite auth).
// Form UI only — no real authentication. Isolated here so real app auth
// can be wired in without touching shared layout code.
// TODO: replace with real manager authentication.

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // No real auth — route straight to the daily authentication checklist.
    setTimeout(() => router.push("/session"), 600);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="manager@firm.in"
            defaultValue="manish.gupta@firm.in"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            defaultValue="password"
            required
          />
        </Field>
        <Field>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <LockKeyhole data-icon="inline-start" />
            )}
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
          <FieldDescription className="text-center">
            This signs you into the management panel. Client Zerodha sessions are
            authenticated separately each day.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
