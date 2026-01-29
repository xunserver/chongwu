/**
 * Auth Feature 验证器工具
 *
 * 提供表单验证函数
 * 所有验证都返回清晰的错误消息
 */

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 错误消息，如果验证通过则返回null
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return '邮箱不能为空'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return '请输入有效的邮箱地址'
  }

  return null
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 错误消息，如果验证通过则返回null
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.trim() === '') {
    return '密码不能为空'
  }

  if (password.length < 8) {
    return '密码至少需要8个字符'
  }

  // 可选：更复杂的密码规则
  // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/
  // if (!passwordPattern.test(password)) {
  //   return '密码必须包含字母和数字'
  // }

  return null
}

/**
 * 验证密码匹配
 * @param password 原密码
 * @param confirmPassword 确认密码
 * @returns 错误消息，如果验证通过则返回null
 */
export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return '请确认密码'
  }

  if (password !== confirmPassword) {
    return '两次输入的密码不一致'
  }

  return null
}

/**
 * 验证器对象导出
 * 提供更简洁的API，方便在组件中使用
 */
export const validators = {
  /**
   * 邮箱验证
   */
  email: (email: string): string | null => validateEmail(email),

  /**
   * 密码强度验证
   */
  password: (password: string): string | null => validatePasswordStrength(password),

  /**
   * 密码匹配验证
   */
  passwordMatch: (password: string, confirmPassword: string): string | null =>
    validatePasswordMatch(password, confirmPassword),
}
