import { expect, test } from "@playwright/test";

test("renders the Clerk sign-in page shell", async ({ page }) => {
  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The Gentleman BarberShop and Spa",
    }),
  ).toBeVisible();
});

test("protects the account route from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get("/account", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects business settings from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get("/account/settings", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects customer management from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get("/account/customers", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects booking management from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get("/account/bookings", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects appointment workflow from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get("/account/appointments", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects appointment details from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get(
    "/account/appointments/8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
    { maxRedirects: 0 },
  );

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects payment management from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get("/account/payments", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects checkout from anonymous visitors", async ({ request }) => {
  const response = await request.get(
    "/account/payments/checkout/8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
    { maxRedirects: 0 },
  );
  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("protects payment details from anonymous visitors", async ({
  request,
}) => {
  const response = await request.get(
    "/account/payments/c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
    { maxRedirects: 0 },
  );
  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/sign-in");
});
