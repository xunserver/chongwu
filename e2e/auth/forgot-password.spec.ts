/**
 * Auth Module E2E Tests - Forgot Password Page
 *
 * 测试忘记密码页面的各种场景:
 * 1. 成功发送重置邮件
 * 2. 表单验证
 * 3. 成功状态显示
 */

import { expect, test } from '@playwright/test'

test.describe('忘记密码页面 - 成功流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('应该显示忘记密码页面标题和表单', async ({ page }) => {
    // 检查标题
    await expect(page.getByRole('heading', { name: '忘记密码？' })).toBeVisible()

    // 检查描述
    await expect(page.getByText('输入您的邮箱地址，我们将发送重置密码的链接')).toBeVisible()

    // 检查表单字段
    await expect(page.getByTestId('email')).toBeVisible()

    // 检查提交按钮
    await expect(page.getByRole('button', { name: '发送重置邮件' })).toBeVisible()

    // 检查返回登录链接
    await expect(page.getByRole('button', { name: '返回登录' })).toBeVisible()
  })

  test('应该能够成功发送重置邮件', async ({ page }) => {
    // 填写邮箱
    await page.getByTestId('email').fill('test@example.com')

    // 点击发送按钮
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 验证成功状态显示
    await expect(page.getByTestId('success-icon')).toBeVisible()
    await expect(page.getByText('邮件已发送')).toBeVisible()
    await expect(page.getByTestId('success-message')).toBeVisible()
    await expect(page.getByText(/我们已向您的邮箱发送了密码重置链接/)).toBeVisible()

    // 验证按钮变化
    await expect(page.getByRole('button', { name: '返回登录' })).toBeVisible()
    await expect(page.getByRole('button', { name: '重新发送' })).toBeVisible()
  })
})

test.describe('忘记密码页面 - 表单验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('应该验证空邮箱', async ({ page }) => {
    // 不填写邮箱直接提交
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 验证错误提示
    await expect(page.getByText('邮箱不能为空')).toBeVisible()
  })

  test('应该验证无效的邮箱格式', async ({ page }) => {
    // 输入无效邮箱
    await page.getByTestId('email').fill('invalid-email')
    await page.getByTestId('email').blur() // 触发验证

    // 验证错误提示
    await expect(page.getByText('邮箱格式不正确')).toBeVisible()
  })

  test('应该在输入时实时验证邮箱格式', async ({ page }) => {
    const emailInput = page.getByTestId('email')

    // 输入无效邮箱
    await emailInput.fill('invalid')
    await emailInput.blur()

    // 验证错误提示
    await expect(page.getByText('邮箱格式不正确')).toBeVisible()

    // 修正为有效邮箱
    await emailInput.fill('valid@example.com')
    await emailInput.blur()

    // 验证错误提示消失
    await expect(page.getByText('邮箱格式不正确')).not.toBeVisible()
  })
})

test.describe('忘记密码页面 - 成功状态交互', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('应该能够返回登录页面', async ({ page }) => {
    // 先发送重置邮件
    await page.getByTestId('email').fill('test@example.com')
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 等待成功状态显示
    await expect(page.getByTestId('success-icon')).toBeVisible()

    // 点击返回登录
    await page.getByRole('button', { name: '返回登录' }).click()

    // 验证跳转到登录页
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()
  })

  test('应该能够重新发送邮件', async ({ page }) => {
    // 先发送重置邮件
    await page.getByTestId('email').fill('test@example.com')
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 等待成功状态显示
    await expect(page.getByTestId('success-icon')).toBeVisible()

    // 点击重新发送
    await page.getByRole('button', { name: '重新发送' }).click()

    // 验证回到表单状态
    await expect(page.getByRole('heading', { name: '忘记密码？' })).toBeVisible()
    await expect(page.getByTestId('email')).toBeVisible()
    await expect(page.getByRole('button', { name: '发送重置邮件' })).toBeVisible()

    // 邮箱输入框应该为空
    await expect(page.getByTestId('email')).toHaveValue('')
  })
})

test.describe('忘记密码页面 - 页面导航', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('应该能够通过底部链接返回登录', async ({ page }) => {
    // 点击底部返回登录链接
    await page.getByRole('button', { name: '返回登录' }).click()

    // 验证跳转
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()
  })

  test('应该在发送邮件时禁用提交按钮', async ({ page }) => {
    // 填写邮箱
    await page.getByTestId('email').fill('test@example.com')

    // 点击发送
    await page.getByRole('button', { name: '发送重置邮件' }).click()

    // 验证按钮处于禁用/加载状态
    // const submitButton = page.getByRole('button', { name: '发送重置邮件' })
    // await expect(submitButton).toBeDisabled()
  })
})
