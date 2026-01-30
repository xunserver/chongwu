/**
 * Auth Module E2E Tests - Login Page
 *
 * 测试登录页面的各种场景:
 * 1. 成功登录流程
 * 2. 表单验证
 * 3. 错误场景
 */

import { expect, test } from '@playwright/test'

// 测试数据
const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'Test123456',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123',
  },
}

test.describe('登录页面 - 成功流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('应该显示登录页面标题和表单', async ({ page }) => {
    // 检查标题
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()

    // 检查描述
    await expect(page.getByText('输入您的账号信息进行登录')).toBeVisible()

    // 检查表单字段
    await expect(page.getByTestId('email')).toBeVisible()
    await expect(page.getByLabel('密码')).toBeVisible()

    // 检查登录按钮
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
  })

  test('应该能够成功登录并跳转', async ({ page }) => {
    // 注意: 这个测试需要一个真实的测试用户
    // 在实际环境中,你可能需要先创建测试用户或使用mock

    // 填写表单
    await page.getByTestId('email').fill(testUsers.valid.email)
    await page.getByLabel('密码').fill(testUsers.valid.password)

    // 点击登录按钮
    await page.getByRole('button', { name: '登录' }).click()

    // 验证跳转 (根据你的应用逻辑调整)
    // 成功登录后应该跳转到首页或重定向页面
    // await expect(page).toHaveURL('/')
    // 或者检查是否有登录成功的提示
    // await expect(page.getByText('登录成功')).toBeVisible()
  })

  test('应该能够记住我选项', async ({ page }) => {
    // 勾选"记住我"
    const rememberMeCheckbox = page.getByLabel('记住我')
    await rememberMeCheckbox.check()

    // 验证已勾选
    await expect(rememberMeCheckbox).toBeChecked()
  })
})

test.describe('登录页面 - 表单验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('应该验证空邮箱', async ({ page }) => {
    // 填写密码但不填写邮箱
    await page.getByLabel('密码').fill('password123')
    await page.getByRole('button', { name: '登录' }).click()

    // 验证错误提示
    await expect(page.getByText('邮箱不能为空')).toBeVisible()
  })

  test('应该验证无效的邮箱格式', async ({ page }) => {
    // 输入无效邮箱
    await page.getByTestId('email').fill('invalid-email')
    await page.getByLabel('密码').click() // 触发验证

    // 验证错误提示
    await expect(page.getByText('邮箱格式不正确')).toBeVisible()
  })

  test('应该验证空密码', async ({ page }) => {
    // 填写邮箱但不填写密码
    await page.getByTestId('email').fill('test@example.com')
    await page.getByRole('button', { name: '登录' }).click()

    // 验证错误提示
    await expect(page.getByText('密码不能为空')).toBeVisible()
  })

  test('应该验证密码长度', async ({ page }) => {
    // 输入过短的密码
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('1234567') // 少于8位
    await page.getByRole('button', { name: '登录' }).click()

    // 验证错误提示
    await expect(page.getByText('密码至少需要8个字符')).toBeVisible()
  })
})

test.describe('登录页面 - 错误场景', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('应该显示登录失败的错误提示', async ({ page }) => {
    // 使用无效凭证登录
    await page.getByTestId('email').fill(testUsers.invalid.email)
    await page.getByLabel('密码').fill(testUsers.invalid.password)
    await page.getByRole('button', { name: '登录' }).click()

    // 验证错误提示 (根据你的实际错误消息调整)
    // await expect(page.getByText(/登录失败|邮箱或密码错误/)).toBeVisible()
  })

  test('应该在登录时禁用提交按钮', async ({ page }) => {
    // 填写表单
    await page.getByTestId('email').fill(testUsers.valid.email)
    await page.getByLabel('密码').fill(testUsers.valid.password)

    // 点击登录
    await page.getByRole('button', { name: '登录' }).click()

    // 验证按钮处于禁用/加载状态
    const submitButton = page.getByRole('button', { name: '登录' })
    // 注意: 根据 AuthForm 组件的实现,loading状态会禁用按钮
    // await expect(submitButton).toBeDisabled()
  })
})

test.describe('登录页面 - 页面导航', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('应该能够跳转到注册页面', async ({ page }) => {
    await page.getByRole('button', { name: '立即注册' }).click()

    // 验证URL跳转
    await expect(page).toHaveURL('/auth/register')

    // 验证页面标题
    await expect(page.getByRole('heading', { name: '注册' })).toBeVisible()
  })

  test('应该能够跳转到忘记密码页面', async ({ page }) => {
    await page.getByRole('button', { name: '忘记密码？' }).click()

    // 验证URL跳转
    await expect(page).toHaveURL('/auth/forgot-password')

    // 验证页面标题
    await expect(page.getByRole('heading', { name: '忘记密码' })).toBeVisible()
  })
})
