"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AddAccountDialog({ defaultShare }: { defaultShare: number }) {
  const [open, setOpen] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // No real submit logic — just log the typed payload shape.
    const payload = {
      name: data.get("name"),
      zerodhaClientId: data.get("zerodhaClientId"),
      email: data.get("email"),
      phone: data.get("phone"),
      capitalContributed: Number(data.get("capitalContributed")),
      profitSharePercent: Number(data.get("profitSharePercent")),
      status: data.get("status"),
      notes: data.get("notes"),
    };
    // TODO: replace with real create-account API call.
    console.log("[v0] new account payload:", payload);
    toast.success("Account draft captured", {
      description: `${payload.name} (${payload.zerodhaClientId}) — payload logged to console.`,
    });
    setOpen(false);
  }

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add client account</DialogTitle>
          <DialogDescription>
            Register a new managed Zerodha account. Kite API keys are connected
            separately in Settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="add-account-form">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Client name</FieldLabel>
                <Input id="name" name="name" placeholder="Full name" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="zerodhaClientId">
                  Zerodha client ID
                </FieldLabel>
                <Input
                  id="zerodhaClientId"
                  name="zerodhaClientId"
                  placeholder="AB1234"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.in"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" name="phone" placeholder="+91 …" />
              </Field>
              <Field>
                <FieldLabel htmlFor="capitalContributed">
                  Capital contributed (₹)
                </FieldLabel>
                <Input
                  id="capitalContributed"
                  name="capitalContributed"
                  type="number"
                  min={0}
                  placeholder="1000000"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profitSharePercent">
                  Profit share (%)
                </FieldLabel>
                <Input
                  id="profitSharePercent"
                  name="profitSharePercent"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={defaultShare}
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select name="status" defaultValue="active">
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
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
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Input
                id="notes"
                name="notes"
                placeholder="Optional — mandate, preferences, etc."
              />
              <FieldDescription>
                Form only — submitting logs the payload to the console.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="add-account-form">
            Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
