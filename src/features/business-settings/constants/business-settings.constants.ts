import { APP_NAME } from "@/constants/app";

export const BUSINESS_TIMEZONES = [
  "Africa/Nairobi",
  "UTC",
  "Africa/Kampala",
  "Africa/Dar_es_Salaam",
  "Africa/Addis_Ababa",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
] as const;

export const BUSINESS_CURRENCY_CODES = ["KES", "USD", "EUR", "GBP"] as const;

export const DEFAULT_BUSINESS_SETTINGS = {
  business_name: APP_NAME,
  currency_code: "KES",
  timezone: "Africa/Nairobi",
} as const;
