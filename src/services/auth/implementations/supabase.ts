/**
 * Supabase认证服务实现
 *
 * 实现IAuthService接口，提供Supabase的具体实现
 * 处理数据格式转换（Supabase snake_case → 应用camelCase）
 * 实现错误分类（系统错误 vs 业务错误）
 *
 * 使用扁平化错误处理，避免try-catch嵌套
 */

import type { IAuthService, AuthUser, AuthSession, AuthError, AuthResult } from '../types'
import { supabase } from '@/lib/supabase'
import { to, createSystemError } from '@/utils/async'

/**
 * Supabase错误映射
 * 将Supabase错误转换为标准的AuthError格式，并分类错误类型
 *
 * @param error Supabase错误对象
 * @returns 标准化的AuthError对象
 */
function mapSupabaseError(error: any): AuthError {
  // 判断是否为系统错误
  // 系统错误：网络错误、服务器错误（500+）、未预期的异常
  const isSystemError =
    !error.status ||
    error.status >= 500 ||
    error.code === 'NETWORK_FAILURE' ||
    error.message?.includes('fetch') ||
    error.message?.includes('network')

  return {
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'An unknown error occurred',
    isSystemError,
  }
}

/**
 * Supabase User转换
 * 将Supabase的User对象（snake_case）转换为AuthUser（camelCase）
 *
 * @param user Supabase用户对象
 * @returns 转换后的AuthUser对象
 */
function mapSupabaseUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email,
    emailConfirmed: user.email_confirmed_at !== null,
    createdAt: user.created_at,
    userMetadata: user.user_metadata || {},
  }
}

/**
 * Supabase Session转换
 * 将Supabase的Session对象（snake_case）转换为AuthSession（camelCase）
 *
 * @param session Supabase会话对象
 * @returns 转换后的AuthSession对象
 */
function mapSupabaseSession(session: any): AuthSession {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresIn: session.expires_in,
    tokenType: session.token_type,
    user: mapSupabaseUser(session.user),
  }
}

/**
 * Supabase认证服务实现类
 */
export class SupabaseAuthService implements IAuthService {
  /**
   * 用户注册
   */
  async signUp(email: string, password: string): Promise<AuthResult<AuthUser>> {
    // 使用扁平化错误处理
    const [result, exception] = await to(
      supabase.auth.signUp({ email, password })
    )

    // 处理未捕获的异常（网络错误等）
    if (exception) {
      return {
        data: null,
        error: createSystemError('Network or system error', 'EXCEPTION')
      }
    }

    // 处理Supabase API错误
    if (result.error) {
      return { data: null, error: mapSupabaseError(result.error) }
    }

    // 处理成功响应
    return {
      data: result.data.user ? mapSupabaseUser(result.data.user) : null,
      error: null
    }
  }

  /**
   * 用户登录
   */
  async signIn(email: string, password: string): Promise<AuthResult<AuthSession>> {
    // 使用扁平化错误处理
    const [result, exception] = await to(
      supabase.auth.signInWithPassword({ email, password })
    )

    // 处理未捕获的异常
    if (exception) {
      return {
        data: null,
        error: createSystemError('Network or system error', 'EXCEPTION')
      }
    }

    // 处理Supabase API错误
    if (result.error) {
      return { data: null, error: mapSupabaseError(result.error) }
    }

    // 处理成功响应
    return {
      data: result.data.session ? mapSupabaseSession(result.data.session) : null,
      error: null
    }
  }

  /**
   * 用户登出
   */
  async signOut(): Promise<AuthResult<void>> {
    // 使用扁平化错误处理
    const [result, exception] = await to(supabase.auth.signOut())

    // 处理未捕获的异常
    if (exception) {
      return {
        data: null,
        error: createSystemError('Network or system error', 'EXCEPTION')
      }
    }

    // 处理Supabase API错误
    if (result.error) {
      return { data: null, error: mapSupabaseError(result.error) }
    }

    return { data: null, error: null }
  }

  /**
   * 发送密码重置邮件
   */
  async resetPassword(email: string): Promise<AuthResult<void>> {
    // 使用扁平化错误处理
    const [result, exception] = await to(
      supabase.auth.resetPasswordForEmail(email)
    )

    // 处理未捕获的异常
    if (exception) {
      return {
        data: null,
        error: createSystemError('Network or system error', 'EXCEPTION')
      }
    }

    // 处理Supabase API错误
    if (result.error) {
      return { data: null, error: mapSupabaseError(result.error) }
    }

    return { data: null, error: null }
  }

  /**
   * 更新用户密码
   */
  async updatePassword(newPassword: string): Promise<AuthResult<void>> {
    // 使用扁平化错误处理
    const [result, exception] = await to(
      supabase.auth.updateUser({ password: newPassword })
    )

    // 处理未捕获的异常
    if (exception) {
      return {
        data: null,
        error: createSystemError('Network or system error', 'EXCEPTION')
      }
    }

    // 处理Supabase API错误
    if (result.error) {
      return { data: null, error: mapSupabaseError(result.error) }
    }

    return { data: null, error: null }
  }

  /**
   * 获取当前会话
   */
  async getSession(): Promise<AuthResult<AuthSession>> {
    // 使用扁平化错误处理
    const [result, exception] = await to(supabase.auth.getSession())

    // 处理未捕获的异常
    if (exception) {
      return {
        data: null,
        error: createSystemError('Network or system error', 'EXCEPTION')
      }
    }

    // 处理Supabase API错误
    if (result.error) {
      return { data: null, error: mapSupabaseError(result.error) }
    }

    return {
      data: result.data.session ? mapSupabaseSession(result.data.session) : null,
      error: null
    }
  }

  /**
   * 监听认证状态变化
   */
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session ? mapSupabaseSession(session) : null)
    })

    // 返回清理函数
    return () => {
      data.subscription.unsubscribe()
    }
  }
}
