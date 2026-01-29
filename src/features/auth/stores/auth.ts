/**
 * Auth Feature - Pinia Store
 *
 * ⚠️ DEPRECATED - 此 Store 已弃用
 *
 * 状态管理架构已更新（方案3）：
 * - 客户端状态（UI、主题等）→ 使用 `stores/ui.ts`
 * - 服务器状态（会话、用户等）→ 使用 TanStack Query (通过 `useAuth` hook)
 *
 * 迁移指南：
 *
 * 旧代码（使用此 Store）：
 * ```typescript
 * import { useAuthStore } from '@/features/auth/stores/auth'
 * const authStore = useAuthStore()
 * console.log(authStore.user)
 * await authStore.signIn(email, password)
 * ```
 *
 * 新代码（使用 TanStack Query）：
 * ```typescript
 * import { useAuth } from '@/features/auth/hooks/useAuth'
 * const { sessionQuery, signInMutation } = useAuth()
 * console.log(sessionQuery.data?.user)
 * await signInMutation.mutateAsync({ email, password })
 * ```
 *
 * 保留此文件仅用于向后兼容，未来版本将被移除。
 */

import { defineStore } from 'pinia'
import type { AuthUser, AuthSession } from '../types'

/**
 * Auth State 接口
 */
export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  isAuthenticated: boolean
  loading: boolean
}

/**
 * Auth Actions 接口
 */
export interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setSession: (session: AuthSession | null) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

/**
 * Auth Store
 *
 * 使用defineStore创建认证状态管理
 * 配置持久化到localStorage
 */
export const useAuthStore = defineStore<'auth', AuthState, Record<string, any>, AuthActions>(
  'auth',
  {
    // 状态定义
    state: (): AuthState => ({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,
    }),

    // Getters
    getters: {
      // isAuthenticated已经在state中定义
    },

    // Actions
    actions: {
      /**
       * 设置用户信息
       */
      setUser(user: AuthUser | null) {
        this.user = user
        this.isAuthenticated = !!user
      },

      /**
       * 设置会话信息
       */
      setSession(session: AuthSession | null) {
        this.session = session
        if (session) {
          this.user = session.user
          this.isAuthenticated = true
        } else {
          this.user = null
          this.isAuthenticated = false
        }
      },

      /**
       * 清除认证信息
       */
      clearAuth() {
        this.user = null
        this.session = null
        this.isAuthenticated = false
      },

      /**
       * 设置加载状态
       */
      setLoading(loading: boolean) {
        this.loading = loading
      },
    },

    // 持久化配置
    persist: {
      key: 'auth',
      storage: localStorage,
      // 持久化user和session字段
      pick: ['user', 'session', 'isAuthenticated'],
    },
  },
)
