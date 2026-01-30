/**
 * useAuth Hook
 *
 * 封装认证逻辑，集成 TanStack Query 管理服务器状态
 * 不依赖 Pinia Store（会话数据由 TanStack Query 管理）
 *
 * 状态管理架构（方案3）：
 * - 客户端状态 → Pinia Store (ui.ts: theme, sidebar, language)
 * - 服务器状态 → TanStack Query (session, users, 等)
 * - 表单状态 → TanStack Form
 */

import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { authService, type AuthUser, type AuthSession, type AuthError } from '@/services/auth'
import { toast } from '@/utils/toast'

/**
 * useAuth Hook 返回值
 */
export interface UseAuthReturn {
  // TanStack Query 状态
  sessionQuery: ReturnType<typeof useQuery<AuthSession | null, Error, AuthSession | null>>
  signInMutation: ReturnType<typeof useMutation<AuthSession | null, Error, { email: string; password: string }, unknown>>
  signUpMutation: ReturnType<typeof useMutation<AuthUser | null, Error, { email: string; password: string }, unknown>>
  signOutMutation: ReturnType<typeof useMutation<void, Error, void, unknown>>
  resetPasswordMutation: ReturnType<typeof useMutation<void, Error, string, unknown>>
  updatePasswordMutation: ReturnType<typeof useMutation<void, Error, string, unknown>>
  updateEmailMutation: ReturnType<typeof useMutation<void, Error, { password: string; newEmail: string }, unknown>>

  // 响应式状态（向后兼容）
  loading: ReturnType<typeof ref<boolean>>
  error: ReturnType<typeof ref<AuthError | null>>

  // 便捷方法
  signUp: (email: string, password: string) => Promise<AuthUser | null>
  signIn: (email: string, password: string) => Promise<AuthSession | null>
  signOut: () => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  updatePassword: (newPassword: string) => Promise<boolean>
  updateEmail: (password: string, newEmail: string) => Promise<boolean>

  // 会话管理
  initializeSession: () => Promise<void>
}

/**
 * useAuth Hook
 *
 * 提供认证操作的统一入口，使用 TanStack Query 管理服务器状态
 */
export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient()

  // 响应式状态（向后兼容）
  const loading = ref(false)
  const error = ref<AuthError | null>(null)

  // ============================================================
  // TanStack Query: useQuery - 管理会话查询
  // ============================================================

  /**
   * 查询当前会话
   * - 自动缓存（5分钟内数据视为新鲜）
   * - 窗口焦点时自动重新验证
   * - 重新连接时自动重新验证
   */
  const sessionQuery = useQuery<AuthSession | null>({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      loading.value = true
      try {
        const result = await authService.getSession()
        if (result.error) {
          error.value = result.error
          return null
        }
        error.value = null
        return result.data
      } finally {
        loading.value = false
      }
    },
    staleTime: 1000 * 60 * 5, // 5分钟内数据视为新鲜
    gcTime: 1000 * 60 * 10, // 10分钟后清理缓存
    retry: false, // 认证失败不自动重试
    refetchOnWindowFocus: false, // 窗口焦点时不重新验证（避免频繁请求）
    refetchOnReconnect: true, // 重新连接时重新验证
    refetchOnMount: true, // 组件挂载时重新验证
  })

  // ============================================================
  // TanStack Query: useMutation - 管理认证操作
  // ============================================================

  /**
   * 用户注册
   */
  const signUpMutation = useMutation<AuthUser | null, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      loading.value = true
      try {
        const result = await authService.signUp(email, password)
        if (result.error) {
          error.value = result.error
          // 系统错误 → toast
          if (result.error.isSystemError) {
            toast.error(result.error.message)
          }
          throw result.error
        }
        error.value = null
        return result.data
      } finally {
        loading.value = false
      }
    },
    onSuccess: (data) => {
      if (data) {
        toast.success('注册成功，请登录')
      }
    },
  })

  /**
   * 用户登录
   */
  const signInMutation = useMutation<AuthSession | null, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      loading.value = true
      try {
        const result = await authService.signIn(email, password)
        if (result.error) {
          error.value = result.error
          // 系统错误 → toast
          if (result.error.isSystemError) {
            toast.error(result.error.message)
          }
          throw result.error
        }
        error.value = null
        return result.data
      } finally {
        loading.value = false
      }
    },
    onSuccess: (data) => {
      if (data) {
        // 更新 Query 缓存
        queryClient.setQueryData(['auth', 'session'], data)
        toast.success('登录成功')
      }
    },
  })

  /**
   * 用户登出
   */
  const signOutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      loading.value = true
      try {
        const result = await authService.signOut()
        if (result.error) {
          error.value = result.error
          // 系统错误 → toast
          if (result.error.isSystemError) {
            toast.error(result.error.message)
          }
          throw result.error
        }
        error.value = null
      } finally {
        loading.value = false
      }
    },
    onSuccess: () => {
      // 清除 Query 缓存
      queryClient.clear()
      toast.success('已登出')
    },
  })

  /**
   * 发送密码重置邮件
   */
  const resetPasswordMutation = useMutation<void, Error, string>({
    mutationFn: async (email) => {
      loading.value = true
      try {
        const result = await authService.resetPassword(email)
        if (result.error) {
          error.value = result.error
          // 系统错误 → toast
          if (result.error.isSystemError) {
            toast.error(result.error.message)
          }
          throw result.error
        }
        error.value = null
      } finally {
        loading.value = false
      }
    },
    onSuccess: () => {
      toast.success('密码重置邮件已发送，请检查您的邮箱')
    },
  })

  /**
   * 更新用户密码
   */
  const updatePasswordMutation = useMutation<void, Error, string>({
    mutationFn: async (newPassword) => {
      loading.value = true
      try {
        const result = await authService.updatePassword(newPassword)
        if (result.error) {
          error.value = result.error
          // 系统错误 → toast
          if (result.error.isSystemError) {
            toast.error(result.error.message)
          }
          throw result.error
        }
        error.value = null
      } finally {
        loading.value = false
      }
    },
    onSuccess: () => {
      toast.success('密码更新成功')
    },
  })

  /**
   * 更新用户邮箱
   */
  const updateEmailMutation = useMutation<void, Error, { password: string; newEmail: string }>({
    mutationFn: async ({ password, newEmail }) => {
      loading.value = true
      try {
        const result = await authService.updateEmail(newEmail)
        if (result.error) {
          error.value = result.error
          // 系统错误 → toast
          if (result.error.isSystemError) {
            toast.error(result.error.message)
          }
          throw result.error
        }
        error.value = null
      } finally {
        loading.value = false
      }
    },
    onSuccess: () => {
      toast.success('邮箱更新成功，请查收验证邮件')
    },
  })

  // ============================================================
  // 会话初始化
  // ============================================================

  /**
   * 初始化会话
   *
   * 在应用启动时调用，恢复用户会话
   * 监听认证状态变化
   */
  const initializeSession = async (): Promise<void> => {
    // 尝试从服务器获取会话
    await sessionQuery.refetch()

    // 监听认证状态变化（通过 Supabase）
    authService.onAuthStateChange((session) => {
      if (session) {
        // 更新 Query 缓存
        queryClient.setQueryData(['auth', 'session'], session)
      } else {
        // 清除缓存
        queryClient.setQueryData(['auth', 'session'], null)
      }
    })
  }

  // ============================================================
  // 便捷方法（向后兼容）
  // ============================================================

  const signUp = async (email: string, password: string): Promise<AuthUser | null> => {
    return await signUpMutation.mutateAsync({ email, password })
  }

  const signIn = async (email: string, password: string): Promise<AuthSession | null> => {
    return await signInMutation.mutateAsync({ email, password })
  }

  const signOut = async (): Promise<boolean> => {
    try {
      await signOutMutation.mutateAsync()
      return true
    } catch {
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await resetPasswordMutation.mutateAsync(email)
      return true
    } catch {
      return false
    }
  }

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      await updatePasswordMutation.mutateAsync(newPassword)
      return true
    } catch {
      return false
    }
  }

  const updateEmail = async (password: string, newEmail: string): Promise<boolean> => {
    try {
      await updateEmailMutation.mutateAsync({ password, newEmail })
      return true
    } catch {
      return false
    }
  }

  return {
    // TanStack Query 状态
    sessionQuery,
    signInMutation,
    signUpMutation,
    signOutMutation,
    resetPasswordMutation,
    updatePasswordMutation,
    updateEmailMutation,

    // 响应式状态
    loading,
    error,

    // 便捷方法
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail,

    // 会话管理
    initializeSession,
  }
}
