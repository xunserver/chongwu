/**
 * Validators 单元测试
 *
 * 测试所有验证器函数
 * 覆盖成功和失败场景
 */

import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePasswordStrength,
  validatePasswordMatch,
  validators,
} from '@/features/auth/utils/validators'

describe('validateEmail', () => {
  describe('成功场景', () => {
    it('应该接受有效的邮箱地址', () => {
      expect(validateEmail('test@example.com')).toBeNull()
      expect(validateEmail('user.name@example.com')).toBeNull()
      expect(validateEmail('user+tag@example.co.uk')).toBeNull()
      expect(validateEmail('123@test.com')).toBeNull()
    })
  })

  describe('失败场景', () => {
    it('应该拒绝空字符串', () => {
      expect(validateEmail('')).toBe('邮箱不能为空')
    })

    it('应该拒绝只有空格的字符串', () => {
      expect(validateEmail('   ')).toBe('邮箱不能为空')
    })

    it('应该拒绝无效的邮箱格式', () => {
      expect(validateEmail('invalid')).toBe('请输入有效的邮箱地址')
      expect(validateEmail('@example.com')).toBe('请输入有效的邮箱地址')
      expect(validateEmail('test@')).toBe('请输入有效的邮箱地址')
      expect(validateEmail('test@.com')).toBe('请输入有效的邮箱地址')
      expect(validateEmail('test example.com')).toBe('请输入有效的邮箱地址')
    })
  })
})

describe('validatePasswordStrength', () => {
  describe('成功场景', () => {
    it('应该接受8个字符或以上的密码', () => {
      expect(validatePasswordStrength('12345678')).toBeNull()
      expect(validatePasswordStrength('abcdefgh')).toBeNull()
      expect(validatePasswordStrength('Abc123!@')).toBeNull()
      expect(validatePasswordStrength('veryStrongPassword123')).toBeNull()
    })
  })

  describe('失败场景', () => {
    it('应该拒绝空字符串', () => {
      expect(validatePasswordStrength('')).toBe('密码不能为空')
    })

    it('应该拒绝只有空格的字符串', () => {
      expect(validatePasswordStrength('   ')).toBe('密码不能为空')
    })

    it('应该拒绝少于8个字符的密码', () => {
      expect(validatePasswordStrength('1234567')).toBe('密码至少需要8个字符')
      expect(validatePasswordStrength('abc')).toBe('密码至少需要8个字符')
    })
  })
})

describe('validatePasswordMatch', () => {
  describe('成功场景', () => {
    it('应该接受匹配的密码', () => {
      expect(validatePasswordMatch('password123', 'password123')).toBeNull()
      expect(validatePasswordMatch('12345678', '12345678')).toBeNull()
    })
  })

  describe('失败场景', () => {
    it('应该拒绝空的确认密码', () => {
      expect(validatePasswordMatch('password123', '')).toBe('请确认密码')
    })

    it('应该拒绝只有空格的确认密码', () => {
      expect(validatePasswordMatch('password123', '   ')).toBe('请确认密码')
    })

    it('应该拒绝不匹配的密码', () => {
      expect(validatePasswordMatch('password123', 'password124')).toBe('两次输入的密码不一致')
      expect(validatePasswordMatch('12345678', '87654321')).toBe('两次输入的密码不一致')
    })
  })
})

describe('validators 对象', () => {
  describe('validators.email', () => {
    it('应该正确验证邮箱', () => {
      expect(validators.email('test@example.com')).toBeNull()
      expect(validators.email('invalid')).toBe('请输入有效的邮箱地址')
      expect(validators.email('')).toBe('邮箱不能为空')
    })
  })

  describe('validators.password', () => {
    it('应该正确验证密码强度', () => {
      expect(validators.password('12345678')).toBeNull()
      expect(validators.password('123')).toBe('密码至少需要8个字符')
      expect(validators.password('')).toBe('密码不能为空')
    })
  })

  describe('validators.passwordMatch', () => {
    it('应该正确验证密码匹配', () => {
      expect(validators.passwordMatch('password', 'password')).toBeNull()
      expect(validators.passwordMatch('pass1', 'pass2')).toBe('两次输入的密码不一致')
      expect(validators.passwordMatch('password', '')).toBe('请确认密码')
    })
  })
})
