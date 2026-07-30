import type { SupabaseClient } from "@supabase/supabase-js";

import type { PaginationMeta } from "@/components/management/pagination";
import type {
  BookingDatabase,
  BookingStatus,
  BookingWithRelations,
} from "@/features/bookings/types/booking-management.types";

export type PaymentMethod = "bank_transfer" | "card" | "cash" | "mpesa";
export type PaymentEntryType = "payment" | "refund";
export type PaymentSortField =
  | "amount_cents"
  | "created_at"
  | "entry_type"
  | "payment_date"
  | "payment_method";

export type PaymentRow = {
  readonly amount_cents: number;
  readonly booking_id: string;
  readonly created_at: string;
  readonly currency_code: string;
  readonly entry_type: PaymentEntryType;
  readonly id: string;
  readonly original_payment_id: string | null;
  readonly payment_date: string;
  readonly payment_method: PaymentMethod;
  readonly receipt_booking_date: string;
  readonly receipt_business_name: string;
  readonly receipt_customer_name: string;
  readonly receipt_service_name: string;
  readonly receipt_staff_name: string;
  readonly receipt_start_time: string;
  readonly reference_number: string | null;
  readonly refund_reason: string | null;
};

type PaymentInsert = Pick<
  PaymentRow,
  | "amount_cents"
  | "booking_id"
  | "currency_code"
  | "entry_type"
  | "payment_date"
  | "payment_method"
> &
  Partial<
    Pick<
      PaymentRow,
      | "created_at"
      | "id"
      | "original_payment_id"
      | "receipt_booking_date"
      | "receipt_business_name"
      | "receipt_customer_name"
      | "receipt_service_name"
      | "receipt_staff_name"
      | "receipt_start_time"
      | "reference_number"
      | "refund_reason"
    >
  >;

export type BookingPaymentTotals = {
  readonly booking_id: string;
  readonly charge_amount_cents: number;
  readonly currency_code: string;
  readonly gross_paid_cents: number;
  readonly net_paid_cents: number;
  readonly outstanding_balance_cents: number;
  readonly total_refunded_cents: number;
};

export type PaymentDatabase = {
  readonly public: Omit<BookingDatabase["public"], "Tables" | "Views"> & {
    readonly Tables: BookingDatabase["public"]["Tables"] & {
      readonly payments: {
        readonly Insert: PaymentInsert;
        readonly Relationships: [
          {
            readonly columns: ["booking_id"];
            readonly foreignKeyName: "payments_booking_id_fkey";
            readonly isOneToOne: false;
            readonly referencedColumns: ["id"];
            readonly referencedRelation: "bookings";
          },
          {
            readonly columns: ["original_payment_id"];
            readonly foreignKeyName: "payments_original_payment_id_fkey";
            readonly isOneToOne: false;
            readonly referencedColumns: ["id"];
            readonly referencedRelation: "payments";
          },
        ];
        readonly Row: PaymentRow;
        readonly Update: never;
      };
    };
    readonly Views: {
      readonly booking_payment_totals: {
        readonly Relationships: [];
        readonly Row: BookingPaymentTotals;
      };
    };
  };
};

export type PaymentSupabaseClient = SupabaseClient<PaymentDatabase>;

export type CheckoutBooking = BookingWithRelations & {
  readonly status: BookingStatus;
};

export type PaymentListFilters = {
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly direction: "asc" | "desc";
  readonly entryType: PaymentEntryType | "all";
  readonly method: PaymentMethod | "all";
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
  readonly sort: PaymentSortField;
};

export type PaymentSearchParams = {
  readonly date_from?: string | readonly string[];
  readonly date_to?: string | readonly string[];
  readonly direction?: string | readonly string[];
  readonly entry_type?: string | readonly string[];
  readonly method?: string | readonly string[];
  readonly page?: string | readonly string[];
  readonly search?: string | readonly string[];
  readonly sort?: string | readonly string[];
};

export type PaymentHistorySearchParams = {
  readonly history_page?: string | readonly string[];
};

export type PaginatedPayments = {
  readonly data: readonly PaymentRow[];
  readonly pagination: PaginationMeta;
};

export type CheckoutDetail = {
  readonly booking: CheckoutBooking;
  readonly totals: BookingPaymentTotals;
};

export type PaymentDetail = {
  readonly payment: PaymentRow;
  readonly refundableAmountCents: number;
  readonly refunds: readonly PaymentRow[];
  readonly totals: BookingPaymentTotals;
};

export type PaymentActionState = {
  readonly errors?: Record<string, readonly string[]>;
  readonly message?: string;
  readonly paymentId?: string;
  readonly success: boolean;
};

export type PaymentAction = (
  previousState: PaymentActionState,
  formData: FormData,
) => Promise<PaymentActionState>;
