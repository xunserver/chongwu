/**
 * Auth E2E Test Fixtures
 *
 * 提供测试的前置设置和清理
 */

import { test as base } from '@playwright/test'

/**
 * 扩展的基础测试fixture
 */
export const test = base.extend<{
  authPage: {
    navigateToLogin: () => Promise<void>
    navigateToRegister: () => Promise<void>
    navigateToForgotPassword: () => Promise<void>
  }
}>({
  authPage: async ({ page }, use) => {
    const authPage = {
      navigateToLogin: async () => {
        await page.goto('/auth/login')
        await page.waitForLoadState('networkidle')
      },
      navigateToRegister: async () => {
        await page.goto('/auth/register')
        await page.waitForLoadState('networkidle')
      },
      navigateToForgotPassword: async () => {
        await page.goto('/auth/forgot-password')
        await page.waitForLoadState('networkidle')
      },
    }
    await use(authPage)
  },
})

export { expect } from '@playwright/test'
