/**
 * Auth Guard Utilities
 *
 * 路由守卫使用的工具函数（不依赖 Vue hooks，可以在 router guard 中使用）
 * 与 TanStack Query 保持同步
 */

import { authService, type AuthSession } from '@/services/auth'

/**
 * 获取当前会话（用于路由守卫）
 *
 * 注意：这是路由守卫专用的简化版本
 * 实际应用中应该使用 useAuth hook 的 sessionQuery
 *
 * Supabase 客户端内部已经处理了会话缓存，所以这里直接调用即可
 */
export async function getAuthGuardSession(): Promise<AuthSession | null> {
  try {
    const result = await authService.getSession()
    return result.data || null
  } catch (error) {
    console.error('Failed to get session for auth guard:', error)
    return null
  }
}

/**
 * 检查用户是否已认证（用于路由守卫）
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getAuthGuardSession()
  return !!session
}
