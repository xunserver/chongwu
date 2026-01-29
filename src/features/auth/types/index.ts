/**
 * Auth Feature 类型定义
 *
 * 定义auth feature的本地类型
 * 重新导出服务层的认证相关类型
 */

/**
 * 登录表单数据
 */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * 注册表单数据
 */
export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

/**
 * 密码重置表单数据
 */
export interface ResetPasswordFormData {
  email: string
}

/**
 * 更新密码表单数据
 */
export interface UpdatePasswordFormData {
  password: string
  confirmPassword: string
}

/**
 * 重新导出服务层的认证类型
 * 提供统一的类型访问点
 */
export type {
  AuthUser,
  AuthSession,
  AuthError,
  AuthResult
} from '@/services/auth'
