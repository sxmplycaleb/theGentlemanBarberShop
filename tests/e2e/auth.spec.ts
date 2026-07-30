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
