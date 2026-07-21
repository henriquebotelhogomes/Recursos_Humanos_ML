import { expect, test } from "@playwright/test";

test.describe("auth flows", () => {
  test("redirects unauthenticated user from protected route", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  });

  test("logs in with demo account and reaches dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Preencher automaticamente" }).click();
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("voce@empresa.com").fill("demo123");
    await page.getByPlaceholder("••••••••").fill("senha-invalida");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Email ou senha inválidos.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("registers a user, auto-signs in, and enforces logout", async ({ page }) => {
    const uniqueEmail = `e2e_${Date.now()}@example.com`;
    const password = "abc12345";

    await page.goto("/register");
    await page.locator("input[type='text']").first().fill("E2E User");
    await page.locator("input[type='email']").first().fill(uniqueEmail);
    await page.locator("input[type='password']").nth(0).fill(password);
    await page.locator("input[type='password']").nth(1).fill(password);
    await page.getByRole("button", { name: "Cadastrar e entrar" }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.getByRole("button", { name: "Sair" }).first().click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
