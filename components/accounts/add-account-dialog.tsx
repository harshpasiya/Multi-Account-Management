"use client"

import * as React from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createAccountAction } from "@/app/(app)/accounts/actions"

type ActionState = Awaited<ReturnType<typeof createAccountAction>>
const initialState: ActionState = { status: "idle" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" form="add-account-form" disabled={pending}>
      {pending ? "Creating…" : "Create account"}
    </Button>
  )
}

export function AddAccountDialog({ defaultShare }: { defaultShare: number }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [state, formAction] = useActionState(createAccountAction, initialState)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
      setOpen(false)
      router.refresh()
    }
  }, [router, state.status])

  const errorFor = (field: ActionState["field"]) =>
    state.status === "error" && state.field === field ? state.message : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus data-icon="inline-start" />
            Add account
          </Button>
        }
      />
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add client account</DialogTitle>
          <DialogDescription>
            Register a new managed Zerodha account with its Kite Connect credentials.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} id="add-account-form" className="min-h-0 overflow-y-auto pr-1">
          <FieldGroup>
            {state.status === "error" && state.field === "form" ? (
              <FieldError>{state.message}</FieldError>
            ) : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errorFor("name"))}>
                <FieldLabel htmlFor="name">Client name</FieldLabel>
                <Input id="name" name="name" placeholder="Full name" aria-invalid={Boolean(errorFor("name"))} required />
                {errorFor("name") ? <FieldError>{errorFor("name")}</FieldError> : null}
              </Field>
              <Field data-invalid={Boolean(errorFor("zerodhaClientId"))}>
                <FieldLabel htmlFor="zerodhaClientId">Zerodha client ID</FieldLabel>
                <Input id="zerodhaClientId" name="zerodhaClientId" placeholder="AB1234" aria-invalid={Boolean(errorFor("zerodhaClientId"))} required />
                {errorFor("zerodhaClientId") ? <FieldError>{errorFor("zerodhaClientId")}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="name@example.in" />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" name="phone" placeholder="+91 …" />
              </Field>
              <Field data-invalid={Boolean(errorFor("capitalContributed"))}>
                <FieldLabel htmlFor="capitalContributed">Capital contributed (₹)</FieldLabel>
                <Input id="capitalContributed" name="capitalContributed" type="number" min={0} step="0.01" placeholder="1000000" aria-invalid={Boolean(errorFor("capitalContributed"))} required />
                {errorFor("capitalContributed") ? <FieldError>{errorFor("capitalContributed")}</FieldError> : null}
              </Field>
              <Field data-invalid={Boolean(errorFor("profitSharePercent"))}>
                <FieldLabel htmlFor="profitSharePercent">Profit share (%)</FieldLabel>
                <Input id="profitSharePercent" name="profitSharePercent" type="number" min={0} max={100} step="0.01" defaultValue={defaultShare} aria-invalid={Boolean(errorFor("profitSharePercent"))} required />
                {errorFor("profitSharePercent") ? <FieldError>{errorFor("profitSharePercent")}</FieldError> : null}
              </Field>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-semibold">Zerodha / Kite Connect credentials</p>
              <p className="mt-1 text-sm text-muted-foreground">Required to authenticate and trade this client account. Access tokens are created during daily login.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errorFor("apiKey"))}>
                <FieldLabel htmlFor="api_key">API key</FieldLabel>
                <Input id="api_key" name="api_key" aria-invalid={Boolean(errorFor("apiKey"))} required />
                {errorFor("apiKey") ? <FieldError>{errorFor("apiKey")}</FieldError> : null}
              </Field>
              <Field data-invalid={Boolean(errorFor("apiSecret"))}>
                <FieldLabel htmlFor="api_secret">API secret</FieldLabel>
                <Input id="api_secret" name="api_secret" type="password" aria-invalid={Boolean(errorFor("apiSecret"))} required />
                {errorFor("apiSecret") ? <FieldError>{errorFor("apiSecret")}</FieldError> : null}
              </Field>
              <Field data-invalid={Boolean(errorFor("zerodhaUserId"))}>
                <FieldLabel htmlFor="zerodha_user_id">Zerodha user ID</FieldLabel>
                <Input id="zerodha_user_id" name="zerodha_user_id" aria-invalid={Boolean(errorFor("zerodhaUserId"))} required />
                {errorFor("zerodhaUserId") ? <FieldError>{errorFor("zerodhaUserId")}</FieldError> : null}
              </Field>
              <Field data-invalid={Boolean(errorFor("zerodhaPassword"))}>
                <FieldLabel htmlFor="zerodha_password">Zerodha password</FieldLabel>
                <Input id="zerodha_password" name="zerodha_password" type="password" aria-invalid={Boolean(errorFor("zerodhaPassword"))} required />
                {errorFor("zerodhaPassword") ? <FieldError>{errorFor("zerodhaPassword")}</FieldError> : null}
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select name="status" defaultValue="active">
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="joinedDate">Joined date</FieldLabel>
              <Input id="joinedDate" name="joinedDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Input id="notes" name="notes" placeholder="Optional — mandate, preferences, etc." />
              <FieldDescription>Account details are stored securely in Supabase.</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <SubmitButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
