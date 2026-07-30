"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUSES,
  type ActionState,
  type BookingRow,
  type BookingSelectionOptions,
} from "@/features/bookings/types/booking-management.types";

interface BookingFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly booking?: Pick<
    BookingRow,
    | "booking_date"
    | "customer_id"
    | "service_id"
    | "staff_id"
    | "start_time"
    | "status"
  >;
  readonly options: BookingSelectionOptions;
  readonly submitLabel: string;
}

const initialState: ActionState = { success: false };

function optionLabel(
  label: string,
  option: { readonly deleted_at: string | null; readonly is_active: boolean },
) {
  if (option.deleted_at) {
    return `${label} (deleted)`;
  }

  return option.is_active ? label : `${label} (inactive)`;
}

function FieldError({
  errors,
  id,
}: {
  readonly errors: readonly string[] | undefined;
  readonly id: string;
}) {
  return errors?.length ? (
    <p className="text-primary text-sm" id={id}>
      {errors[0]}
    </p>
  ) : null;
}

export function BookingForm({
  action,
  booking,
  options,
  submitLabel,
}: BookingFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const hasOptions =
    options.customers.length > 0 &&
    options.services.length > 0 &&
    options.staff.length > 0;
  const describedBy = (name: string) =>
    state.errors?.[name] ? `${name}-error` : undefined;

  return (
    <form action={formAction} className="grid gap-5">
      {state.message ? (
        <p
          className="border-border bg-card rounded-sm border px-4 py-3 text-sm"
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
      {!hasOptions ? (
        <p
          className="border-border bg-card rounded-sm border px-4 py-3 text-sm"
          role="alert"
        >
          Add at least one active customer, staff member, and service before
          saving a booking.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          defaultValue={booking?.customer_id ?? ""}
          describedBy={describedBy("customer_id")}
          error={state.errors?.customer_id}
          label="Customer"
          name="customer_id"
          options={options.customers.map((option) => ({
            label: optionLabel(option.full_name, option),
            value: option.id,
          }))}
          placeholder="Choose a customer"
        />
        <SelectField
          defaultValue={booking?.staff_id ?? ""}
          describedBy={describedBy("staff_id")}
          error={state.errors?.staff_id}
          label="Staff"
          name="staff_id"
          options={options.staff.map((option) => ({
            label: optionLabel(option.display_name, option),
            value: option.id,
          }))}
          placeholder="Choose a staff member"
        />
        <SelectField
          defaultValue={booking?.service_id ?? ""}
          describedBy={describedBy("service_id")}
          error={state.errors?.service_id}
          label="Service"
          name="service_id"
          options={options.services.map((option) => ({
            label: optionLabel(option.name, option),
            value: option.id,
          }))}
          placeholder="Choose a service"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Booking date</span>
          <input
            aria-describedby={describedBy("booking_date")}
            aria-invalid={Boolean(state.errors?.booking_date)}
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={booking?.booking_date}
            name="booking_date"
            required
            type="date"
          />
          <FieldError
            errors={state.errors?.booking_date}
            id="booking_date-error"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Start time</span>
          <input
            aria-describedby={describedBy("start_time")}
            aria-invalid={Boolean(state.errors?.start_time)}
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={booking?.start_time.slice(0, 5)}
            name="start_time"
            required
            step={60}
            type="time"
          />
          <FieldError errors={state.errors?.start_time} id="start_time-error" />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Status</span>
          <select
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={booking?.status ?? "pending"}
            name="status"
          >
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "no_show"
                  ? "No show"
                  : `${status.charAt(0).toUpperCase()}${status.slice(1)}`}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.status} id="status-error" />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButtonDisabled disabled={!hasOptions}>
          {submitLabel}
        </SubmitButtonDisabled>
        <Button asChild variant="outline">
          <Link href="/account/bookings">Back to bookings</Link>
        </Button>
      </div>
    </form>
  );
}

function SubmitButtonDisabled({
  children,
  disabled,
}: {
  readonly children: React.ReactNode;
  readonly disabled: boolean;
}) {
  return disabled ? (
    <Button disabled type="submit">
      {children}
    </Button>
  ) : (
    <SubmitButton>{children}</SubmitButton>
  );
}

function SelectField({
  defaultValue,
  describedBy,
  error,
  label,
  name,
  options,
  placeholder,
}: {
  readonly defaultValue: string;
  readonly describedBy: string | undefined;
  readonly error: readonly string[] | undefined;
  readonly label: string;
  readonly name: string;
  readonly options: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  readonly placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <select
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className="border-border bg-background min-h-11 rounded-sm border px-3"
        defaultValue={defaultValue}
        name={name}
        required
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError errors={error} id={`${name}-error`} />
    </label>
  );
}
