import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const repositories = vi.hoisted(() => ({
  getBusinessSettings: vi.fn(),
  listBookingWorkflowOptions: vi.fn(),
  listBookingWorkflowQueue: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock(
  "@/features/appointments/data/booking-workflow.repository",
  () => repositories,
);
vi.mock(
  "@/features/business-settings/data/business-settings.repository",
  () => ({
    getBusinessSettings: repositories.getBusinessSettings,
  }),
);
vi.mock("@/features/appointments/data/business-date", () => ({
  resolveBusinessDate: vi.fn(() => "2026-08-10"),
}));
vi.mock(
  "@/features/appointments/presentation/appointment-workflow-page",
  () => ({
    AppointmentWorkflowPage: (props: Record<string, unknown>) => (
      <main data-testid="appointment-workflow-page" {...props} />
    ),
  }),
);

import Page from "@/app/account/appointments/page";

describe("appointment workflow queue page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("protects and loads settings once plus one paginated booking query", async () => {
    const result = {
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    };
    const options = { staff: [] };
    repositories.getBusinessSettings.mockResolvedValueOnce({
      timezone: "Africa/Nairobi",
    });
    repositories.listBookingWorkflowQueue.mockResolvedValueOnce(result);
    repositories.listBookingWorkflowOptions.mockResolvedValueOnce(options);

    const element = await Page({
      searchParams: Promise.resolve({ search: "Alex" }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.getBusinessSettings).toHaveBeenCalledOnce();
    expect(repositories.listBookingWorkflowQueue).toHaveBeenCalledOnce();
    expect(repositories.listBookingWorkflowQueue).toHaveBeenCalledWith(
      expect.objectContaining({ search: "Alex" }),
      "2026-08-10",
    );
    expect(element.props.result).toBe(result);
    expect(element.props.options).toBe(options);
  });
});
