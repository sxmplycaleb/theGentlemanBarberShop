import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseServerClient } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient,
}));

import {
  getBusinessSettings,
  saveBusinessSettings,
} from "@/features/business-settings/data/business-settings.repository";

const settings = {
  business_name: "The Gentleman",
  currency_code: "KES",
  timezone: "Africa/Nairobi",
} as const;

function createReadTable(
  result: {
    readonly data: typeof settings | null;
    readonly error: { readonly message: string } | null;
  } = { data: settings, error: null },
) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));

  return {
    eq,
    maybeSingle,
    select,
    table: { select },
  };
}

function createUpsertTable(
  result: {
    readonly data: typeof settings | null;
    readonly error: { readonly message: string } | null;
  } = { data: settings, error: null },
) {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => ({ single }));
  const upsert = vi.fn(() => ({ select }));

  return {
    select,
    single,
    table: { upsert },
    upsert,
  };
}

describe("business settings repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("selects the singleton without exposing system columns", async () => {
    const read = createReadTable();
    const from = vi.fn(() => read.table);
    createSupabaseServerClient.mockReturnValue({ from });

    await expect(getBusinessSettings()).resolves.toEqual(settings);

    expect(createSupabaseServerClient).toHaveBeenCalledWith({
      serviceRole: true,
    });
    expect(from).toHaveBeenCalledWith("business_settings");
    expect(read.select).toHaveBeenCalledWith(
      "business_name,currency_code,timezone",
    );
    expect(read.eq).toHaveBeenCalledWith("id", true);
  });

  it("returns null when the singleton is not initialized", async () => {
    const read = createReadTable({ data: null, error: null });
    createSupabaseServerClient.mockReturnValue({
      from: vi.fn(() => read.table),
    });

    await expect(getBusinessSettings()).resolves.toBeNull();
  });

  it("atomically upserts the singleton with a server-owned id", async () => {
    const upsert = createUpsertTable();
    const from = vi.fn(() => upsert.table);
    createSupabaseServerClient.mockReturnValue({ from });

    await expect(saveBusinessSettings(settings)).resolves.toEqual(settings);

    expect(from).toHaveBeenCalledOnce();
    expect(from).toHaveBeenCalledWith("business_settings");
    expect(upsert.upsert).toHaveBeenCalledWith(
      {
        id: true,
        ...settings,
      },
      { onConflict: "id" },
    );
    expect(upsert.select).toHaveBeenCalledWith(
      "business_name,currency_code,timezone",
    );
  });

  it("replaces database details with a stable read error", async () => {
    const read = createReadTable({
      data: null,
      error: { message: "sensitive database detail" },
    });
    createSupabaseServerClient.mockReturnValue({
      from: vi.fn(() => read.table),
    });

    await expect(getBusinessSettings()).rejects.toThrow(
      "Business settings could not be loaded.",
    );
  });

  it("rejects an unsuccessful write without exposing database details", async () => {
    const upsert = createUpsertTable({
      data: null,
      error: { message: "sensitive database detail" },
    });
    createSupabaseServerClient.mockReturnValue({
      from: vi.fn(() => upsert.table),
    });

    await expect(saveBusinessSettings(settings)).rejects.toThrow(
      "Business settings could not be saved.",
    );
  });
});
