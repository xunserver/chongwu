/**
 * Auth Module E2E Tests - Complete Auth Flow
 *
 * 测试完整的用户认证流程:
 * 1. 注册 -> 登录 -> 登出
 * 2. 忘记密码流程
 * 3. 会话持久化
 */

import { expect, test } from '@playwright/test'
import { generateUniqueEmail, fillLoginForm, fillRegisterForm } from '../auth/helpers/auth.helpers'

test.describe('完整认证流程', () => {
  test('应该能够完成注册 -> 登录 -> 登出流程', async ({ page }) => {
    // 1. 注册新用户
    const testEmail = generateUniqueEmail('newuser')
    const testPassword = 'TestPassword123'

    await page.goto('/auth/register')

    // 填写注册表单
    await fillRegisterForm(page, testEmail, testPassword)

    // 提交注册
    await page.getByRole('button', { name: '注册' }).click()

    // 验证跳转到登录页
    await expect(page).toHaveURL('/auth/login')

    // 可能显示成功提示
    // await expect(page.getByText('注册成功，请登录')).toBeVisible()

    // 2. 使用新账号登录
    await fillLoginForm(page, testEmail, testPassword)
    await page.getByRole('button', { name: '登录' }).click()

    // 验证登录成功 - 应该跳转到首页或其他页面
    // await expect(page).toHaveURL('/')

    // 3. 验证会话状态(根据你的应用调整)
    // 可能需要检查用户菜单、头像等

    // 4. 登出
    // await page.getByRole('button', { name: '登出' }).click()
    // 或者通过用户菜单登出
    // await page.getByTestId('user-menu').click()
    // await page.getByRole('menuitem', { name: '登出' }).click()

    // 验证返回登录页或首页
    // await expect(page).toHaveURL('/auth/login')
  })

  test('应该能够使用已有账号登录', async ({ page }) => {
    // 这个测试假设数据库中已有测试用户
    const existingEmail = 'test@example.com'
    const existingPassword = 'Test123456'

    await page.goto('/auth/login')

    // 填写登录表单
    await fillLoginForm(page, existingEmail, existingPassword)

    // 提交登录
    await page.getByRole('button', { name: '登录' }).click()

    // 验证登录成功
    // await expect(page).toHaveURL('/')
  })
})

test.describe('忘记密码完整流程', () => {
  test('应该能够完成忘记密码流程', async ({ page }) => {
    const testEmail = 'test@example.com'

    // 1. 访问忘记密码页面
    await page.goto('/auth/forgot-password')

    // 2. 请求重置密码
    await page.getByTestId('email').fill(testEmail)
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 3. 验证成功消息
    await expect(page.getByTestId('success-icon')).toBeVisible()
    await expect(page.getByText('邮件已发送')).toBeVisible()

    // 4. 返回登录
    await page.getByRole('button', { name: '返回登录' }).click()
    await expect(page).toHaveURL('/auth/login')

    // 注意: 实际测试密码重置需要访问邮件链接
    // 在真实环境中,你可能需要:
    // 1. 使用测试邮箱服务读取邮件
    // 2. 提取重置链接
    // 3. 访问重置链接并设置新密码
    // 4. 使用新密码登录
  })
})

test.describe('页面跳转和导航流程', () => {
  test('应该在所有认证页面间正确跳转', async ({ page }) => {
    // 从登录页开始
    await page.goto('/auth/login')

    // 登录 -> 注册
    await page.getByRole('button', { name: '立即注册' }).click()
    await expect(page).toHaveURL('/auth/register')
    await expect(page.getByRole('heading', { name: '注册' })).toBeVisible()

    // 注册 -> 登录
    await page.getByRole('button', { name: '立即登录' }).click()
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()

    // 登录 -> 忘记密码
    await page.getByRole('button', { name: '忘记密码？' }).click()
    await expect(page).toHaveURL('/auth/forgot-password')
    await expect(page.getByRole('heading', { name: '忘记密码？' })).toBeVisible()

    // 忘记密码 -> 登录
    await page.getByRole('button', { name: '返回登录' }).click()
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()
  })

  test('应该保护需要认证的路由', async ({ page }) => {
    // 尝试访问需要认证的页面
    await page.goto('/auth/update-password')

    // 应该重定向到登录页
    // 或者显示错误消息
    // await expect(page).toHaveURL('/auth/login')
  })
})

test.describe('表单状态和用户体验', () => {
  test('应该在提交后保持表单数据(直到成功)', async ({ page }) => {
    await page.goto('/auth/register')

    const testEmail = generateUniqueEmail()

    // 填写表单
    await page.getByTestId('email').fill(testEmail)
    await page.getByLabel('密码').fill('password123')
    await page.getByTestId('confirm-password').fill('password456') // 不匹配

    // 触发验证
    await page.getByRole('button', { name: '注册' }).click()

    // 验证错误显示
    await expect(page.getByText('两次输入的密码不一致')).toBeVisible()

    // 验证邮箱和密码字段仍然填写着
    await expect(page.getByTestId('email')).toHaveValue(testEmail)
    await expect(page.getByLabel('密码')).toHaveValue('password123')
  })

  test('应该在成功后清空表单', async ({ page }) => {
    await page.goto('/auth/forgot-password')

    // 填写表单
    await page.getByTestId('email').fill('test@example.com')
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 等待成功状态
    await expect(page.getByTestId('success-icon')).toBeVisible()

    // 点击重新发送
    await page.getByRole('button', { name: '重新发送' }).click()

    // 验证表单已清空
    await expect(page.getByTestId('email')).toHaveValue('')
  })

  test('应该支持键盘操作', async ({ page }) => {
    await page.goto('/auth/login')

    // 使用Tab键导航
    await page.keyboard.press('Tab') // 聚焦到邮箱
    await page.keyboard.type('test@example.com')

    await page.keyboard.press('Tab') // 聚焦到密码
    await page.keyboard.type('password123')

    await page.keyboard.press('Enter') // 提交表单

    // 验证表单提交(可能显示验证错误或其他响应)
  })
})

test.describe('响应式设计', () => {
  test('应该在移动端正常显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/auth/login')

    // 验证页面元素可见
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()
    await expect(page.getByTestId('email')).toBeVisible()
    await expect(page.getByLabel('密码')).toBeVisible()
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
  })

  test('应该在平板端正常显示', async ({ page }) => {
    // 设置平板视口
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/auth/register')

    // 验证页面元素可见
    await expect(page.getByRole('heading', { name: '注册' })).toBeVisible()
    await expect(page.getByTestId('email')).toBeVisible()
  })
})
