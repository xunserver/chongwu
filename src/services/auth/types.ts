/**
 * 认证服务类型定义
 *
 * 定义认证相关的所有TypeScript接口和类型
 * 所有字段使用camelCase命名规范
 */

/**
 * 认证用户信息
 */
export interface AuthUser {
  id: string
  email: string
  emailConfirmed: boolean
  createdAt: string
  userMetadata: Record<string, any>
}

/**
 * 认证会话信息
 */
export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  user: AuthUser
}

/**
 * 认证错误信息
 */
export interface AuthError {
  code: string
  message: string
  isSystemError: boolean // 是否为系统错误（用于决定错误处理方式）
}

/**
 * 认证操作结果
 */
export type AuthResult<T> = {
  data: T | null
  error: AuthError | null
}

/**
 * 认证服务接口
 *
 * 定义所有认证操作的抽象接口
 * 实现类必须实现所有方法
 */
export interface IAuthService {
  /**
   * 用户注册
   * @param email 用户邮箱
   * @param password 用户密码
   * @returns 注册结果，包含用户信息或错误
   */
  signUp(email: string, password: string): Promise<AuthResult<AuthUser>>

  /**
   * 用户登录
   * @param email 用户邮箱
   * @param password 用户密码
   * @returns 登录结果，包含会话信息或错误
   */
  signIn(email: string, password: string): Promise<AuthResult<AuthSession>>

  /**
   * 用户登出
   * @returns 登出结果
   */
  signOut(): Promise<AuthResult<void>>

  /**
   * 发送密码重置邮件
   * @param email 用户邮箱
   * @returns 发送结果
   */
  resetPassword(email: string): Promise<AuthResult<void>>

  /**
   * 更新用户密码
   * @param newPassword 新密码
   * @returns 更新结果
   */
  updatePassword(newPassword: string): Promise<AuthResult<void>>

  /**
   * 更新用户邮箱
   * @param newEmail 新邮箱
   * @returns 更新结果
   */
  updateEmail(newEmail: string): Promise<AuthResult<void>>

  /**
   * 获取当前会话
   * @returns 会话信息
   */
  getSession(): Promise<AuthResult<AuthSession>>

  /**
   * 监听认证状态变化
   * @param callback 会话变化回调函数
   * @returns 清理函数，用于取消监听
   */
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void
}
