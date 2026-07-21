import { expect, test } from "@playwright/test";

async function loginAsDemo(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Preencher automaticamente" }).click();
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("protected app flows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test("navigates through protected sections", async ({ page }) => {
    await page.goto("/employees");
    await expect(page.getByRole("heading", { name: "Profissionais" })).toBeVisible();

    await page.goto("/dataset");
    await expect(page.getByRole("heading", { name: "Dataset completo" })).toBeVisible();

    await page.goto("/insights");
    await expect(page.getByRole("heading", { name: "Insights executivos" })).toBeVisible();

    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Configurações" })).toBeVisible();
  });

  test("filters employees and opens profile details", async ({ page }) => {
    await page.goto("/employees");

    const deptSelect = page.locator("select[name='dept']");
    const options = deptSelect.locator("option");
    const optionCount = await options.count();
    const targetOption = optionCount > 1 ? 1 : 0;
    const targetDepartment = (await options.nth(targetOption).getAttribute("value")) ?? "";
    await deptSelect.selectOption(targetDepartment);
    await page.getByRole("button", { name: "Filtrar" }).click();

    await expect(page).toHaveURL(/\/employees\?/);
    if (targetDepartment) {
      const currentUrl = new URL(page.url());
      expect(currentUrl.searchParams.get("dept")).toBe(targetDepartment);
    }

    const firstEmployeeLink = page.locator("tbody tr td a").first();
    await firstEmployeeLink.click();
    await expect(page).toHaveURL(/\/employees\/[a-z0-9-]+/i);
  });

  test("changes dataset page size and paginates", async ({ page }) => {
    await page.goto("/dataset");

    await page.locator("select[name='size']").selectOption("50");
    await page.getByRole("button", { name: "Aplicar" }).click();
    await expect(page).toHaveURL(/size=50/);

    const nextLink = page.getByRole("link", { name: "Próxima" });
    if (await nextLink.isVisible()) {
      await nextLink.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test("updates risk thresholds in settings", async ({ page }) => {
    await page.goto("/settings");

    await page.locator("input[type='number']").nth(0).fill("30");
    await page.locator("input[type='number']").nth(1).fill("55");
    await page.locator("input[type='number']").nth(2).fill("75");
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/settings") && response.request().method() === "POST"
    );
    await page.getByRole("button", { name: "Salvar e recalcular" }).click();

    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();

    await expect(page.getByText(/Configurações salvas\./)).toBeVisible({ timeout: 20_000 });
  });
});
