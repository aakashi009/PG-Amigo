import { test, expect } from "@playwright/test";
test("search, save, enquire, and persist a shortlist", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A place to stay. People to belong." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "BTM Layout", exact: true }).click();
  await expect(page.getByText("2 places", { exact: true })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Save The Nest — Student Living",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", {
      name: "View The Nest — Student Living",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Enquire about this PG" }).click();
  await page.getByLabel("Your name").fill("Test Student");
  await page.getByLabel("Preferred visit date").fill("2027-01-15");
  await page.getByRole("button", { name: "Save demo enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("No message was sent");
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Unsave The Nest — Student Living",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("builds a preference profile and likes a compatible roommate", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Find my roommate", exact: false })
    .first()
    .click();
  await page.getByRole("button", { name: "Create my profile" }).click();
  await page.getByLabel("What should we call you?").fill("Sam");
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Find my people" }).click();
  await expect(
    page.getByRole("heading", { name: "Your people are out there, Sam." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Like profile", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("Like saved");
  await page.getByRole("button", { name: "Liked (1)", exact: true }).click();
  await expect(page.locator(".roommate-card")).toHaveCount(1);
  await page.screenshot({
    path: `test-results/roommates-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("creates an owner draft and prevents mobile overflow", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Filters", exact: true }).click();
    await page.getByRole("checkbox", { name: "Meals included" }).check();
    await page.getByRole("button", { name: /Show \d+ places/ }).click();
  }
  if (info.project.name === "desktop") {
    await page.getByRole("button", { name: "List your property" }).click();
    await page.getByRole("button", { name: "Start free" }).click();
    await page.getByLabel("Property name").fill("Student Haven");
    await page.getByLabel("Rent per person").fill("9000");
    await page
      .getByLabel("About your property")
      .fill("A tidy student home with Wi-Fi, meals, and quiet hours.");
    await page
      .getByRole("checkbox", { name: "I understand this is a local draft" })
      .check();
    await page.getByRole("button", { name: "Save property draft" }).click();
    await expect(page.getByText("Your local drafts (1)")).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
