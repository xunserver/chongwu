/**
 * Auth E2E Test Helpers
 *
 * 提供可复用的测试辅助函数
 */

import { Page } from '@playwright/test'

/**
 * 测试用户数据
 */
export const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'Test123456',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123',
  },
  weak: {
    email: 'weak@example.com',
    password: '123', // 弱密码
  },
}

/**
 * 生成唯一测试邮箱
 * @param prefix 邮箱前缀
 * @returns 唯一邮箱地址
 */
export function generateUniqueEmail(prefix = 'test'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${prefix}${timestamp}${random}@example.com`
}

/**
 * 填写登录表单
 * @param page Playwright Page实例
 * @param email 邮箱
 * @param password 密码
 * @param rememberMe 是否记住我
 */
export async function fillLoginForm(
  page: Page,
  email: string,
  password: string,
  rememberMe = false
): Promise<void> {
  await page.getByTestId('email').fill(email)
  await page.getByLabel('密码').fill(password)

  if (rememberMe) {
    await page.getByLabel('记住我').check()
  }
}

/**
 * 填写注册表单
 * @param page Playwright Page实例
 * @param email 邮箱
 * @param password 密码
 * @param confirmPassword 确认密码
 * @param agreeToTerms 是否同意条款
 */
export async function fillRegisterForm(
  page: Page,
  email: string,
  password: string,
  confirmPassword?: string,
  agreeToTerms = true
): Promise<void> {
  await page.getByTestId('email').fill(email)
  await page.getByLabel('密码').fill(password)
  await page.getByTestId('confirm-password').fill(confirmPassword || password)

  if (agreeToTerms) {
    await page.getByTestId('agree-terms').check()
  }
}

/**
 * 等待 Toast 消息出现
 * @param page Playwright Page实例
 * @param message 消息文本
 * @param timeout 超时时间
 */
export async function waitForToast(
  page: Page,
  message: string,
  timeout = 5000
): Promise<void> {
  // 根据你的 toast 实现调整选择器
  // await page.waitForSelector(`text=${message}`, { timeout })
}

/**
 * 清空表单字段
 * @param page Playwright Page实例
 * @param testIds 字段的test-id数组
 */
export async function clearFormFields(
  page: Page,
  testIds: string[]
): Promise<void> {
  for (const testId of testIds) {
    await page.getByTestId(testId).fill('')
  }
}

/**
 * 截图并保存(用于调试)
 * @param page Playwright Page实例
 * @param name 截图名称
 */
export async function takeScreenshot(
  page: Page,
  name: string
): Promise<void> {
  await page.screenshot({ path: `test-results/screenshots/${name}.png` })
}

/**
 * 模拟用户认证状态(通过设置localStorage等)
 * @param page Playwright Page实例
 * @param isAuthenticated 是否已认证
 */
export async function mockAuthState(
  page: Page,
  isAuthenticated: boolean
): Promise<void> {
  // 根据你的认证状态存储方式调整
  await page.evaluate(
    ({ authenticated }) => {
      if (authenticated) {
        localStorage.setItem('auth-token', 'mock-token')
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          email: 'test@example.com',
        }))
      } else {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
      }
    },
    { authenticated: isAuthenticated }
  )
}

/**
 * 等待路由跳转
 * @param page Playwright Page实例
 * @param url 目标URL
 */
export async function waitForNavigation(
  page: Page,
  url: string
): Promise<void> {
  await page.waitForURL(url)
}

/**
 * 获取表单错误消息
 * @param page Playwright Page实例
 * @param fieldName 字段名称
 */
export async function getFieldError(
  page: Page,
  fieldName: string
): Promise<string | null> {
  const errorElement = page.locator(`[data-testid="${fieldName}"] + div`)
  if (await errorElement.isVisible()) {
    return await errorElement.textContent()
  }
  return null
}
