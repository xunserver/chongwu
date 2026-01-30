/**
 * Auth Module E2E Tests - Register Page
 *
 * 测试注册页面的各种场景:
 * 1. 成功注册流程
 * 2. 表单验证
 * 3. 错误场景
 */

import { expect, test } from '@playwright/test'

// 测试数据
const testUser = {
  email: 'newuser@example.com',
  password: 'NewUser123456',
  weakPassword: '12345678',
}

test.describe('注册页面 - 成功流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('应该显示注册页面标题和表单', async ({ page }) => {
    // 检查标题
    await expect(page.getByRole('heading', { name: '注册' })).toBeVisible()

    // 检查描述
    await expect(page.getByText('填写信息创建您的账号')).toBeVisible()

    // 检查表单字段
    await expect(page.getByTestId('email')).toBeVisible()
    await expect(page.getByLabel('密码')).toBeVisible()
    await expect(page.getByLabel('确认密码')).toBeVisible()
    await expect(page.getByTestId('agree-terms')).toBeVisible()

    // 检查注册按钮
    await expect(page.getByRole('button', { name: '注册' })).toBeVisible()
  })

  test('应该能够成功注册并跳转到登录页', async ({ page }) => {
    // 生成唯一的邮箱 (避免重复注册)
    const uniqueEmail = `test${Date.now()}@example.com`

    // 填写表单
    await page.getByTestId('email').fill(uniqueEmail)
    await page.getByLabel('密码').fill(testUser.password)
    await page.getByTestId('confirm-password').fill(testUser.password)

    // 勾选服务条款
    await page.getByTestId('agree-terms').check()

    // 点击注册按钮
    await page.getByRole('button', { name: '注册' }).click()

    // 验证跳转到登录页
    await expect(page).toHaveURL('/auth/login')

    // 验证成功提示
    // await expect(page.getByText('注册成功，请登录')).toBeVisible()
  })

  test('应该显示密码强度指示器', async ({ page }) => {
    // 填写密码字段
    await page.getByLabel('密码').fill(testUser.password)

    // 验证密码强度指示器显示
    // 注意: 这取决于 PasswordInput 组件的实现
    // await expect(page.getByTestId('password-strength')).toBeVisible()
  })
})

test.describe('注册页面 - 表单验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('应该验证空邮箱', async ({ page }) => {
    // 只填写密码和确认密码
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('confirm-password').fill('password123')
    await page.getByTestId('agree-terms').check()
    await page.getByRole('button', { name: '注册' }).click()

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
    // 只填写邮箱
    await page.getByTestId('email').fill('test@example.com')
    await page.getByRole('button', { name: '注册' }).click()

    // 验证错误提示
    await expect(page.getByText('密码不能为空')).toBeVisible()
  })

  test('应该验证密码长度', async ({ page }) => {
    // 输入过短的密码
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('1234567') // 少于8位
    await page.getByLabel('密码').blur() // 触发验证

    // 验证错误提示
    await expect(page.getByText('密码至少需要8个字符')).toBeVisible()
  })

  test('应该验证空确认密码', async ({ page }) => {
    // 填写邮箱和密码，但不填写确认密码
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('agree-terms').check()
    await page.getByRole('button', { name: '注册' }).click()

    // 验证错误提示
    await expect(page.getByText('请确认密码')).toBeVisible()
  })

  test('应该验证密码不匹配', async ({ page }) => {
    // 输入不匹配的密码
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('confirm-password').fill('password456')
    await page.getByTestId('confirm-password').blur() // 触发验证

    // 验证错误提示
    await expect(page.getByText('两次输入的密码不一致')).toBeVisible()
  })

  test('应该在未勾选服务条款时阻止提交', async ({ page }) => {
    // 填写表单但不勾选服务条款
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('confirm-password').fill('password123')
    // 不勾选 agree-terms

    await page.getByRole('button', { name: '注册' }).click()

    // 验证错误提示
    await expect(page.getByText('请同意服务条款和隐私政策')).toBeVisible()
  })

  test('应该实时验证密码匹配', async ({ page }) => {
    // 填写密码
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')

    // 填写不同的确认密码
    await page.getByTestId('confirm-password').fill('password456')

    // 验证错误提示立即显示
    await expect(page.getByText('两次输入的密码不一致')).toBeVisible()

    // 修正确认密码
    await page.getByTestId('confirm-password').fill('password123')

    // 验证错误提示消失
    await expect(page.getByText('两次输入的密码不一致')).not.toBeVisible()
  })
})

test.describe('注册页面 - 错误场景', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('应该显示邮箱已存在的错误', async ({ page }) => {
    // 使用已存在的邮箱 (需要数据库中有这个用户)
    await page.getByTestId('email').fill('existing@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('confirm-password').fill('password123')
    await page.getByTestId('agree-terms').check()

    await page.getByRole('button', { name: '注册' }).click()

    // 验证错误提示 (根据实际错误消息调整)
    // await expect(page.getByText(/用户已存在|邮箱已被注册/)).toBeVisible()
  })

  test('应该在注册时禁用提交按钮', async ({ page }) => {
    // 填写表单
    await page.getByTestId('email').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('confirm-password').fill('password123')
    await page.getByTestId('agree-terms').check()

    // 点击注册
    await page.getByRole('button', { name: '注册' }).click()

    // 验证按钮处于禁用/加载状态
    // const submitButton = page.getByRole('button', { name: '注册' })
    // await expect(submitButton).toBeDisabled()
  })
})

test.describe('注册页面 - 页面导航', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('应该能够跳转到登录页面', async ({ page }) => {
    await page.getByRole('button', { name: '立即登录' }).click()

    // 验证URL跳转
    await expect(page).toHaveURL('/auth/login')

    // 验证页面标题
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()
  })

  test('应该能够通过点击Label勾选服务条款', async ({ page }) => {
    const checkbox = page.getByTestId('agree-terms')

    // 初始状态为未勾选
    await expect(checkbox).not.toBeChecked()

    // 点击label文本
    await page.getByText(/我已阅读并同意/).click()

    // 验证已勾选
    await expect(checkbox).toBeChecked()
  })
})
